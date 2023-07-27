import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  agendarOs,
  finalizarService,
} from "../../../data/services/OrdemServicosServices";
import { colors } from "../../../styles";

import {
  Container,
  InputsContainer,
  SigantureImageContainer,
  SigantureModalContetn,
  SigantureModalOverlay,
  SignatureButton,
  SignatureButtonsContainer,
  SignatureButtonText,
  TextAreaContainer,
  TextAreaErrorMessage,
  TextAreaSubTitle,
  Title,
} from "./styles";
import ControlledInput from "../../../components/ControlledInput";
import ControlledDateTimePicker from "../../../components/ControlledDateTimePicker";
import ControlledCheckBox from "../../../components/ControlledCheckBox";
import { FloatingAction } from "react-native-floating-action";
import { Icon } from "react-native-elements";
import {
  ActivityIndicator,
  Alert,
  Modal,
  View,
  Text,
  Image,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import RadioButton from "../../../components/RadioButton";
import ButtonDefault from "../../../components/ButtonDefault";
import { AuthContext } from "../../../context/AuthContext";
import { AppContext } from "../../../context/AppContext";
import Orientation from "react-native-orientation";
import SignatureCapture from "react-native-signature-capture";
import { ScreenOrientation } from "expo";

const actions = [
  {
    text: "Finalizar",
    icon: <Icon color="#fff" name="assignment-turned-in" />,
    color: colors.primary,
    name: "op_finalizar",
    position: 1,
    buttonSize: 45,
    textStyle: { fontSize: 16 },
  },
  {
    text: "Aguardar Peça",
    icon: <Icon color="#fff" name="pending-actions" />,
    color: colors.primary,
    name: "op_agendar",
    position: 2,
    buttonSize: 45,
    textStyle: { fontSize: 16 },
  },
];

function AcoesPage({ osId, CodAtendimento }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [sigantureModal, setSignatureModal] = useState(false);
  const [substituiuPeca, setSubstituiuPeca] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [signatureSource, setSignatureSource] = useState(null);

  const { userName } = useContext(AuthContext);
  const { updateOrdem } = useContext(AppContext);

  const assinaturaRef = useRef();

  const navigation = useNavigation();

  const { control, handleSubmit, watch } = useForm();

  const observacoesWatcher = watch("observacoes", "");

  useEffect(() => {
    const lockPortrait = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    };

    lockPortrait();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  function createFormData(imagePath, body = {}) {
    const formData = new FormData();

    if (imagePath) {
      const fileName = imagePath.split("/").pop();
      const fileExt = fileName.split(".").pop();
      const fileUri = `file://${imagePath}`;

      formData.append("signature", {
        name: fileName,
        uri: fileUri,
        type: `image/${fileExt}`,
      });

      console.log({ fileName, fileExt, fileUri });
    }

    Object.keys(body).forEach((key) => {
      formData.append(key, JSON.stringify(body[key]));
    });

    return formData;
  }

  async function finalizar(formData, acao = "fechar") {
    console.log("finalizar");

    if (substituiuPeca === null) {
      Alert.alert(
        'Por favor preencha o campo "Foi necessário substituir peça?" e tente novamente.'
      );
      return;
    }

    if (substituiuPeca) {
      if (
        !formData.pecasubstituida?.trim() ||
        !formData.pecadoequipamento?.trim()
      ) {
        Alert.alert(
          "Por favor preencha os campos sobre a substituição de peça e tente novamente."
        );
        return;
      }
    }

    if (!formData.data_visita) {
      Alert.alert(
        'Por favor preencha o campo "Data da visita" e tente novamente.'
      );
      return;
    }

    if (!formData.pessoaquerecebeutecnico?.trim()) {
      Alert.alert(
        'Por favor preencha o campo "Recebido por" e tente novamente.'
      );
      return;
    }

    if (formData.observacoes?.length > 150) {
      Alert.alert(
        'Por favor respeite o limite de 150 caracteres no campo "Observações".'
      );
      return;
    }

    const osData = {
      substituiuPeca,
      tecnicoresponsavel: userName,
      ...formData,
    };

    console.log({ osData });

    const form = createFormData(signatureSource, osData);

    try {
      setModalVisible(true);

      const result = await finalizarService(osId, form, acao);

      console.log("result:fecharOs: ", result);

      updateOrdem(osId, result);
      setModalVisible(false);
      console.log("foi");
      Alert.alert("Serviço finalizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.log("finalizar:error ", error);
      setModalVisible(false);
      Alert.alert("Aconteceu algo de errado!");
    }
  }

  async function agendar(formData) {
    console.log("agendar", formData);

    setModalVisible(true);

    const osData = { ...formData, osId, tecnicoresponsavel: userName };

    console.log({ osData });

    try {
      const result = await agendarOs(osId);
      console.log("foi");
      updateOrdem(osId, result);
      Alert.alert("Agendamento realizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.log("agendar: ", error);
      setModalVisible(false);
      Alert.alert("Aconteceu algo de errado!");
    }
  }

  function handleFloatingIcon(formData, actionName) {
    switch (actionName) {
      case "op_agendar":
        finalizar(formData, "agendar");
        break;

      case "op_finalizar":
        finalizar(formData);
        break;

      default:
        return;
    }
  }

  function handleSubstituiPeca(value) {
    setSubstituiuPeca(value);
  }

  function handleSignatureOk(signature) {
    setSignatureModal(false);
    setSignatureSource(signature.pathName);
    setSignaturePreview(`data:image/png;base64,${signature.encoded}`);
    Orientation.lockToPortrait();
    console.log(signature);
  }

  function handleSignatureConfirm() {
    assinaturaRef.current.saveImage();
  }

  function handleSignatureClear() {
    assinaturaRef.current.resetImage();
  }

  function closeSignatureModal() {
    setSignatureModal(false);
    Orientation.lockToPortrait();
  }

  function showSignatureModal() {
    setSignatureModal(true);
  }

  function getCodAtendimento() {
    if (CodAtendimento == 1 || CodAtendimento == 6) {
      return (
        <>
          <ControlledCheckBox
            control={control}
            name="chkmanutencao1"
            label="Abertura e fechamento do portão totalmente normal"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao2"
            label="Efetuada a regulagem no sistema de fim de curso"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao3"
            label="Regulada e deixada bem fixada a cremalheira"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao4"
            label="Regulado e apertado o parabólico da base"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao5"
            label="Regulado o sistema de eletrofreio"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao6"
            label="Regulado receptor e transmissor"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao7"
            label="Regulado tempo de funcionamento"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao8"
            label="Regulada a embreagem da máquina"
          />
        </>
      );
    } else if (CodAtendimento == 2) {
      return (
        <>
          <ControlledCheckBox
            control={control}
            name="chkmanutencao1"
            label="Efetuada através da CENTRAL chamada em todos os interfones"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao2"
            label="Todos os interfones com chamada normal"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao3"
            label="Testado funcionamento da CENTRAL na hora da operação com todos os leds normais"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao4"
            label="Consertados os interfones dos seguintes apartamentos"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao5"
            label="Reclamações em relação ao funcionamento do sistema"
          />
        </>
      );
    } else if (CodAtendimento == 9) {
      return (
        <>
          <ControlledCheckBox
            control={control}
            name="chkmanutencao1"
            label="Sistema funcionando totalmente normal"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao2"
            label="Atualizado receptor"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao3"
            label="Regulado tempo do bloqueador da boteira"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao4"
            label="Regulado tempo do refletor"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao5"
            label="Regulados receptor e transmissor"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao6"
            label="Feito teste na botoeira"
          />
          <ControlledCheckBox
            control={control}
            name="chkmanutencao7"
            label="Regulado liberador da botoeira sem fio"
          />
          <ControlledCheckBox
            control={control}
            name="chkmanutencao8"
            label="Regulado relé fotoelétrico"
          />
        </>
      );
    } else if (CodAtendimento == 11) {
      return (
        <>
          <ControlledCheckBox
            control={control}
            name="chkmanutencao1"
            label="Porta funcionando totalmente normal"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao2"
            label="Efetuada a regulagem no sistema de fim de curso"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao3"
            label="Regulado o sistema de embreagem"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao4"
            label="Feito ajuste nas laminas"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao5"
            label="Feito lubrificação das calhas guias"
          />
        </>
      );
    } else if (CodAtendimento == 12) {
      return (
        <>
          <ControlledCheckBox
            control={control}
            name="chkmanutencao1"
            label="Sistema funcionando totalmente normal"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao2"
            label="Feito teste no DVR"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao3"
            label="Feito teste na voltagem das fontes"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao4"
            label="Feito teste no HD"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao5"
            label="Verificado conector no DVR"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao6"
            label="Verificado mouse"
          />
        </>
      );
    } else if (CodAtendimento == 15) {
      return (
        <>
          <ControlledCheckBox
            control={control}
            name="chkmanutencao1"
            label="Sistema funcionando totalmente normal"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao2"
            label="Verificado perímetro da cerca"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao3"
            label="Feito teste de sirene"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao4"
            label="Feito teste de choque"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao5"
            label="Verificado cabos de alta"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao6"
            label="Feito teste de disparo"
          />
        </>
      );
    } else if (CodAtendimento == 16) {
      return (
        <>
          <ControlledCheckBox
            control={control}
            name="chkmanutencao1"
            label="Sistema funcionando totalmente normal"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao2"
            label="Feito alimenhamento de sensores"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao3"
            label="Feito teste na bateria selada de 12V"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao4"
            label="Feito teste na sirene"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao5"
            label="Feito teste no arme e desarme"
          />

          <ControlledCheckBox
            control={control}
            name="chkmanutencao6"
            label="Feito ajuste de sensibilidade"
          />
        </>
      );
    }
  }

  const renderChecks = useMemo(() => getCodAtendimento(), []);

  return (
    <>
      <Container>
        <Title>Manutenção Realizada</Title>

        {renderChecks}

        <InputsContainer>
          <RadioButton
            label="Foi necessário substituir peça?"
            options={[
              { name: "Sim", value: true },
              { name: "Não", value: false },
            ]}
            onChange={handleSubstituiPeca}
          />

          {substituiuPeca && (
            <>
              <ControlledInput
                control={control}
                name="pecasubstituida"
                label="Peça substituída:"
              />

              <ControlledInput
                control={control}
                name="pecadoequipamento"
                label="Do equipamento:"
              />
            </>
          )}

          <ControlledDateTimePicker
            control={control}
            name="data_visita"
            label="Data da visita:"
          />

          <ControlledInput
            control={control}
            name="pessoaquerecebeutecnico"
            label="Recebido por:"
          />

          <TextAreaContainer>
            <TextAreaSubTitle errorStyle={observacoesWatcher?.length > 150}>
              {observacoesWatcher?.length || 0}/150
            </TextAreaSubTitle>
            <ControlledInput
              control={control}
              name="observacoes"
              label="Observações"
              errorMessage={
                observacoesWatcher?.length > 150 && "Limite de 150 caracteres"
              }
              textarea
            />
          </TextAreaContainer>

          {signaturePreview && (
            <SigantureImageContainer>
              <Image
                source={{ uri: signaturePreview }}
                resizeMode="contain"
                style={{ width: "100%", height: 200 }}
              />
            </SigantureImageContainer>
          )}

          <ButtonDefault fullWidth onPress={showSignatureModal}>
            Pegar assinatura
          </ButtonDefault>

          <View style={{ height: 20 }}></View>
        </InputsContainer>
      </Container>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 10,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color={colors.primary} size={60} />
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={sigantureModal}
        onRequestClose={closeSignatureModal}
      >
        <SigantureModalOverlay>
          <SigantureModalContetn>
            <SignatureCapture
              showNativeButtons={false}
              ref={assinaturaRef}
              viewMode="landscape"
              saveImageFileInExtStorage={true}
              onSaveEvent={handleSignatureOk}
              minStrokeWidth={5}
              maxStrokeWidth={15}
              style={{ flex: 1 }}
            />

            <SignatureButtonsContainer>
              <SignatureButton onPress={handleSignatureClear}>
                <SignatureButtonText>Limpar</SignatureButtonText>
              </SignatureButton>

              <View style={{ flexDirection: "row" }}>
                <SignatureButton onPress={handleSignatureConfirm}>
                  <SignatureButtonText>Confirmar</SignatureButtonText>
                </SignatureButton>
                <SignatureButton close onPress={closeSignatureModal}>
                  <Icon color="#e95656" name="close" size={20} />
                </SignatureButton>
              </View>
            </SignatureButtonsContainer>
          </SigantureModalContetn>
        </SigantureModalOverlay>
      </Modal>

      <FloatingAction
        color={colors.dark}
        buttonSize={60}
        actions={actions}
        onPressItem={handleSubmit(handleFloatingIcon)}
      />
    </>
  );
}

export default AcoesPage;

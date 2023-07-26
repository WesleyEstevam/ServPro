import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { format } from "date-fns";
import differenceInDays from "date-fns/differenceInDays";
import { getClientData } from "../../data/services/OrdemServicosServices";

import { colors } from "../../styles";

import AcoesPage from "./AcoesPage";
import InfoPage from "./InfoPage";
import Mensuracao from "./Mensuracao";

const TabNavigator = createMaterialTopTabNavigator();

export default function Detalhes({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [showMensuracao, setShowMensuracao] = useState(false);

  const osData = route.params || {};

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: osData.NOME,
      headerTitleAlign: "left",
    });
  }, [navigation]);

  useEffect(() => {
    const data = {
      cep: osData.CEP,
      codigo: osData.CODIGO,
    };

    getClientData(data)
      .then(handleMensuracaoDisplay)
      .catch((error) => {
        console.log("YYYYYYYY");
        console.log(error);
      });
  }, []);

  function handleMensuracaoDisplay(lastMensuracaoDate) {
    console.log("XXXXXXXXXXXX");
    console.log({ lastMensuracaoDate });

    let dataMensuracao = lastMensuracaoDate.mensuracao_datavisita;

    if (!dataMensuracao) {
      setTimeout(() => {
        setShowMensuracao(true);
        return;
      }, 1000);
    }
    now = new Date();
    dataMensuracao = new Date(dataMensuracao);

    console.log(dataMensuracao, now);
    console.log(differenceInDays(now, dataMensuracao));

    const tempoMensuracao = differenceInDays(now, dataMensuracao);

    if (tempoMensuracao >= 90) {
      setTimeout(() => {
        setShowMensuracao(true);
        return;
      }, 1000);
    }
  }

  function formatDate(date) {
    if (date == null) {
      return "";
    }
    const formatedDate = format(new Date(date), "dd/MM/yyyy");
    return formatedDate;
  }

  function generateAdress(os) {
    const address = `${os.LOGRADOURO}, ${os.BAIRRO} - ${os.CIDADE}`;

    return address;
  }

  function generateObservacoes(os) {
    const { DEF1, DEF2, DEF3, DEF4, DEF5, DEF6, DEF7 } = os;

    const observacoesContent = [DEF1, DEF2, DEF3, DEF4, DEF5, DEF6, DEF7].join(
      " "
    );

    return observacoesContent;
  }

  function generateOsData(os) {
    const data = {
      numeroOs: os.ORDEM,
      cliente: os.NOME,
      endereco: generateAdress(os),
      telefone: os.FONE,
      mes: null,
      tecnico: os.tecnicoresponsavel,
      contato: null,
      equipamento: null,
      contrato: os.codigocontrato,
      credito: os.codigocredito,
      valor: os.VALOR,
      vencimento: formatDate(os.VENCIMENTO),
      tipoContrato: os.id_tipo_os,
      observacoes: generateObservacoes(os),
      codigo: os.CODIGO,
      competencia: os.competencia,
      dataVisita: os.mensuracao_datavisita,
    };

    return data;
  }

  const renderInfoPage = useCallback(
    (props) => <InfoPage {...props} osData={generateOsData(osData)} />,
    [osData]
  );
  const renderAcoesPage = useCallback(
    (props) => (
      <AcoesPage
        {...props}
        osId={osData.ORDEM}
        CodAtendimento={osData.CodAtendimento}
      />
    ),
    [osData]
  );
  const renderMensuracaoPage = useCallback(
    (props) => (
      <Mensuracao
        {...props}
        osId={osData.ORDEM}
        osData={generateOsData(osData)}
      />
    ),
    [osData]
  );

  return (
    <View style={{ flex: 1 }}>
      <TabNavigator.Navigator
        backBehavior="none"
        initialRouteName="Info"
        screenOptions={{
          indicatorStyle: { backgroundColor: colors.primary },
          activeTintColor: colors.primary,
        }}
      >
        <TabNavigator.Screen options={{ title: "Detalhes" }} name="Info">
          {renderInfoPage}
        </TabNavigator.Screen>

        <TabNavigator.Screen options={{ title: "Ações" }} name="Acoes">
          {renderAcoesPage}
        </TabNavigator.Screen>

        {showMensuracao && (
          <TabNavigator.Screen
            options={{ title: "Mensuração" }}
            name="Mensuracao"
          >
            {renderMensuracaoPage}
          </TabNavigator.Screen>
        )}
      </TabNavigator.Navigator>
    </View>
  );
}

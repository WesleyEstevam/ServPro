import React, { useState } from  'react';
import { useForm, Controller } from 'react-hook-form';
import {format} from 'date-fns'
import { ScrollView, Text, StyleSheet, Modal, View, Alert } from 'react-native';
import ButtonDefault from '../../../components/ButtonDefault';
import { SubTitle, Title } from './styles';
import ModalPicker from '../../../components/ModalPicker';
import ControlledInput from '../../../components/ControlledInput';
import ControlledRadioButton from '../../../components/ControlledRadioButton';
import { mensurarCliente } from '../../../data/services/OrdemServicosServices';
import { useNavigation } from '@react-navigation/native';
import RadioButton from '../../../components/RadioButton';

const PFOPTION = ['Residência', 'Multifamiliar', 'Sítio ou Fazenda']
const PJOPTIONS = ['Condomínio', 'Sala Comercial', 'Clínica Médica', 'Shopping', 'Loja de Shopping', 'Loja de rua', 'Farmácia']

function Mensuracao({osData, osId}){

    const [tipoPessoa, setTipoPessoa] = useState(null)

    const handleTipoPessoa = (value) => {
        setTipoPessoa(value)
    }

    const {
        control,
        handleSubmit,
        watch,
        register
      } = useForm();

    const navigation = useNavigation();

    function mensurar(dataForm){
        console.log(dataForm);

        const mensuracaoDatavisita = format(new Date(), 'yyyy-MM-dd')

        const dataToSend = {...dataForm, mensuracao_datavisita: mensuracaoDatavisita}
        
        mensurarCliente(osId, dataToSend);

        Alert.alert("Mensuração concluída com sucesso!")

        navigation.goBack();
    }

    return (
        <ScrollView>
            <Title>Mensuração de Cliente</Title>
            <RadioButton
                label="Preencha com os dados do cliente:"
                options={[
                    {name: 'Física', value: 'F'},
                    {name: 'Jurídica', value: 'J'},
                ]}
                onChange={handleTipoPessoa}
            />           
           {
               tipoPessoa &&
               (
                   <ModalPicker
                       control={control}
                       name="tipoestabelecimento"
                       label="Selecione o tipo de estabelecimento"
                       options={
                            tipoPessoa == 'F'?
                            PFOPTION :
                            PJOPTIONS
                       }
                   />
               )
           }
            <ControlledRadioButton
                control={control}
                name="cliente_possui_planoservico"
                label="Cliente possui plano de manutenção preventiva:"
                options={[
                    {name: 'Sim', value: 'S'},
                    {name: 'Não', value: 'N'},
                ]}
            />

            <ControlledRadioButton
                control={control}
                label="Automático:"
                name="mensuracao_automatico"
                options={[
                  {name: 'Residencial', value: 'Residencial'},
                  {name: 'Industrial', value: 'Industrial'},
                ]}
            />
            
            <SubTitle>Tipo do Automático:</SubTitle>

            <ModalPicker
                control={control}
                name="mensuracao_tp_automatico"
                label="Selecione o tipo de Automático"
                options={['Deslizante', 'Pivotagem', 'Basculante']}
                />

            <ControlledRadioButton
                control={control}
                label="Modelo do Automático:"
                name="mensuracao_md_automatico"
                options={[
                  {name: 'Analógico', value: 'Analógico'},
                  {name: 'Jetflex', value: 'Jetflex'},
                ]}
            />

            <ControlledRadioButton
                control={control}
                label="Porta Social Automática:"
                name="mensuracao_portasocial"
                options={[
                  {name: 'Vidro', value: 'Vidro'},
                  {name: 'Caxilhada', value: 'Caxilhada'},
                ]}
            />

            <ControlledRadioButton
                control={control}
                label="Quantidade de Folhas:"
                name="mensuracao_portasocial_fol"
                options={[
                  {name: '1', value: '1'},
                  {name: '2', value: '2'},
                ]}
            />

            <SubTitle>Cor da Porta:</SubTitle>
             <ModalPicker
                control={control}
                name="mensuracao_portasocial_cor"
                label="Selecione a cor da porta"
                options={['Alumínio', 'Preto', 'Branco']}
                />

            <ControlledInput
                control={control}
                name="mensuracao_portasocial_dimen"
                label="Dimensão do Trilho:"
            />

            <ControlledRadioButton
                control={control}
                label="Controle de Acesso:"
                name="mensuracao_controleacesso"
                options={[
                  {name: 'Sim', value: 'Controle de Acesso'},
                  {name: 'Não', value: false},
                ]}
            />

            <ControlledRadioButton
                control={control}
                label="Interfonia:"
                name="mensuracao_interfonia"
                options={[
                  {name: 'Placa Portaria', value: 'Placa Portaria'},
                  {name: 'Placa Coletiva', value: 'Placa Coletiva'},
                ]}
            />

            <ControlledInput
                control={control}
                name="mensuracao_interfonia_ramais"
                label="Quantidade de Ramais:"
            />

            <ControlledRadioButton
                control={control}
                label="Cancela:"
                name="mensuracao_cancela"
                options={[
                  {name: 'Linear', value: 'Linear'},
                  {name: 'Articulada', value: 'Articulada'},
                ]}
            />

            <ControlledRadioButton
                control={control}
                name="mensuracao_antenacoletiva"
                label="Possui Antena Coletiva:"
                options={[
                    {name: 'Sim', value: 'Antena Coletiva'},
                    {name: 'Não', value: false},
                ]}
            />

            <ControlledInput
                control={control}
                name="mensuracao_antenacoletiva_qtd"
                label="Quantidade de Pontos:"
            />

            <SubTitle>Celbra Arm:</SubTitle>
            <ModalPicker
                control={control}
                name="mensuracao_celbraarm"
                label="Selecione o Celbra Arm"
                options={['Óptico', 'Infra', 'Magnético']}
            />

            <Title>Futuro cliente de:</Title>

            <ControlledRadioButton
                control={control}
                label="Possui Portão de Alumínio:"
                name="futurode_portaoaluminio"
                options={[
                  {name: 'Sim', value: 'S'},
                  {name: 'Não', value: 'N'},
                ]}
            />
            <ControlledInput
                control={control}
                name="futurode_portaoaluminio_larg"
                label="Largura de Portão Alumínio"
            />
            <ControlledInput
                control={control}
                name="futurode_portaoaluminio_altura"
                label="Altura de Portão Alumínio"
            />
            <ControlledRadioButton
                control={control}
                label="Possui Portão Social:"
                name="futurode_portaosocial"
                options={[
                  {name: 'Sim', value: 'S'},
                  {name: 'Não', value: 'N'},
                ]}
            />
            <ControlledInput
                control={control}
                name="futurode_portaosocial_largura"
                label="Largura de Portão Social"
            />
            <ControlledInput
                control={control}
                name="futurode_portaosocial_altura"
                label="Altura de Portão Social"
            />
            <ControlledRadioButton
                control={control}
                label="Possui Porteiro Eletrônico:"
                name="futurode_porteiroeletronico"
                options={[
                  {name: 'Sim', value: 'S'},
                  {name: 'Não', value: 'N'},
                ]}
            />
            <ControlledRadioButton
                control={control}
                label="Possui Vídeo Porteiro:"
                name="futurode_videoporteiro"
                options={[
                  {name: 'Sim', value: 'S'},
                  {name: 'Não', value: 'N'},
                ]}
            />
            <ControlledRadioButton
                control={control}
                label="Possui Cerca Elétrica:"
                name="futurode_cercaeletrica"
                options={[
                  {name: 'Sim', value: 'S'},
                  {name: 'Não', value: 'N'},
                ]}
            />
            <ControlledRadioButton
                control={control}
                label="Possui Concertina:"
                name="futurode_concertina"
                options={[
                  {name: 'Sim', value: 'S'},
                  {name: 'Não', value: 'N'},
                ]}
            />
            <ControlledRadioButton
                control={control}
                label="Possui Porta Enrolar Automática:"
                name="futurode_portaoenrolar"
                options={[
                  {name: 'Sim', value: 'S'},
                  {name: 'Não', value: 'N'},
                ]}
            />
            <ControlledRadioButton
                control={control}
                label="Possui Celbra Arm:"
                name="futurode_celbraarm"
                options={[
                  {name: 'Sim', value: 'S'},
                  {name: 'Não', value: 'N'},
                ]}
            />
            <ControlledRadioButton
                control={control}
                label="Possui Interfonia:"
                name="futurode_interfonia"
                options={[
                  {name: 'Sim', value: 'S'},
                  {name: 'Não', value: 'N'},
                ]}
            />
            <ControlledRadioButton
                control={control}
                label="Possui Antena Coletiva:"
                name="futurode_antenacoletiva"
                options={[
                  {name: 'Sim', value: 'S'},
                  {name: 'Não', value: 'N'},
                ]}
            />
            <ControlledRadioButton
                control={control}
                label="Possui Vidros:"
                name="futurode_vidros"
                options={[
                  {name: 'Sim', value: 'S'},
                  {name: 'Não', value: 'N'},
                ]}
            />
            <ControlledRadioButton
                control={control}
                label="Possui CFTV:"
                name="futurode_cftv"
                options={[
                  {name: 'Sim', value: 'S'},
                  {name: 'Não', value: 'N'},
                ]}
            />
            <ControlledInput
                control={control}
                name="futurode_cftv_qtdcameras"
                label="Quantidade de Câmeras:"
            />
           

            <View>
               <ButtonDefault
                style={{marginBottom: 20, marginTop: 5}}
                fullWidth
                onPress={handleSubmit(mensurar)}
                >
                    Mensurar
                </ButtonDefault> 
            </View>

        </ScrollView>
       
    );
}
export default Mensuracao;
import React from 'react';
import { ScrollView } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import TextViewDetail from '../../../components/TextViewDetail';

function InfoPage({osData}) {


  return (
    <ScrollView style={{backgroundColor: '#fff'}}>

      <TextViewDetail
        title="Cliente"
        text={osData.cliente}
      />

      <TextViewDetail
        title="Número da OS"
        text={osData.numeroOs}
      />

      <TextViewDetail
        title="Endereço"
        text={osData.endereco}
      />

      <TextViewDetail
        title="Número"
        text={osData.codigo}
      />

      <TextViewDetail
        title="Telefone"
        text={osData.telefone}
        rightButton={
            <Icon name='phone' />
        }
      />

      <TextViewDetail
        title="Mês"
        text={osData.mes}
      />

      <TextViewDetail
        title="Técnico"
        text={osData.tecnico}
      />

      <TextViewDetail
        title="Contato"
        text={osData.contato}
      />

      <TextViewDetail
        title="Equipamento"
        text={osData.equipamento}
      />

      <TextViewDetail
        title="Contrato"
        text={osData.contrato}
      />

      <TextViewDetail
        title="Crédito"
        text={osData.credito}
      />

      <TextViewDetail
        title="Valor"
        text={osData.valor}
      />

      <TextViewDetail
        title="Vencimento"
        text={osData.vencimento}
      />

      <TextViewDetail
        title="Tipo de Contrato"
        text={osData.tipoContrato}
      />

      <TextViewDetail
        title="Observações"
        text={osData.observacoes}
      />

    </ScrollView>
  );
}

export default InfoPage;

import format from 'date-fns/format';
import api from '../api';

export async function getOSDoMes({
  tecnicoId,
  periodo,
  numOs,
  cliente
}) {
  let mes = new Date().getMonth();
  const periodoAtual = format(new Date(), 'yyyy-MM');

  console.log('getOs:mesAtual ', periodoAtual);
  // console.log('getOs:periodo ', format(new Date(periodo), 'yyyy-MM'));

  if(periodo) {
    periodo = format(new Date(periodo), 'yyyy-MM');
  }
  
  try {
    const result = await api.get('/cados', {
      params: {
        tecnicoId,
        periodo: periodo || periodoAtual,
        numOs,
        cliente,
      },
    });

    // console.log(res);
    return result.data;
  } catch (error) {
    console.log('error:service', error.response?.data);
    throw new Error(error.message);
  }
}

export async function finalizarService(osId, dadosOS, acao) {
  try {
    console.log('fecharOS:service');
    const result = await api.put(`/cados/${osId}/finalizar`, dadosOS, {
      params: {
        acao 
      }
    });

    return result.data;
  } catch (error) {
    console.log('fecharOS:service:erro: ',error.response?.data);
    throw new Error(error.message)
  }
}

export async function mensurarCliente(osId, dataForm){
  try {

    const result = await api.put(`/mensuracao`, dataForm, {
      params: {
        osId
      }
    });

    return result.data;
  }catch(error) {
    console.log('mensurarOS:service:erro: ',error.response?.data);
    throw new Error(error.message)
  }
}

export async function getClientData(data) {
  try {
    console.log('sending request', {data})
    
    const response = await api.get('/cliente', {
      params: {
        cep: data.cep,
        codigo: data.codigo
      }
    })

    return response.data;
    
  } catch (error) {
    console.error(error);
  }
}
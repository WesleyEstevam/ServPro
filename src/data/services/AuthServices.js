import api from '../api';

export async function login(userCode) {
  try {
    const result = await api.get(`tecnicos/${userCode}`);

    return result.data;
  } catch (error) {
    console.log('login:service:erro: ', error.response?.data);
    
    if(error.response?.data) {
      throw new Error(JSON.stringify(error.response.data));
    }
    
    const errorResponse = {
      status: 'error',
      message: 'Aconteceu algo de errado.'
    };

    throw new Error(JSON.stringify(errorResponse));
  }
}

import api from "../api";

export async function login(userCode) {
  try {
    const result = await api
      .get(`tecnicos/${userCode}`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        // Lançar uma exceção quando a API não está disponível
        throw new Error(
          "A API está offline no momento. Tente novamente mais tarde." + err
        );
      });

    return result; // Retornar o resultado obtido da API
  } catch (error) {
    console.log("login:service:erro: ", error.response?.data);

    if (error.response?.data) {
      throw new Error(JSON.stringify(error.response.data));
    }

    const errorResponse = {
      status: "error",
      message: "Aconteceu algo de errado.",
    };

    throw new Error(JSON.stringify(errorResponse));
  }
}

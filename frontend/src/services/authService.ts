import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post("http://localhost:3000/auth/login", {
    email,
    password,
  });
  const { access_token } = response.data;

  // Decodifica o token JWT para obter o userId
  const decoded = JSON.parse(atob(access_token.split(".")[1]));
  const userId = decoded.sub;

  // Retorna token e userId
  return { token: access_token, userId };
};

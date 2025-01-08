import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post("http://localhost:3000/auth/login", {
    email,
    password,
  });
  const { access_token } = response.data;

  // decode the token to get the user id
  const decoded = JSON.parse(atob(access_token.split(".")[1]));
  const userId = decoded.sub;

  return { token: access_token, userId };
};

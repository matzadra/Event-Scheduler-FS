import axios from "axios";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  return await axios.post("http://localhost:3000/users", {
    name,
    email,
    password,
  });
};

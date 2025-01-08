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

export const fetchUsers = async (token: string, userId: string) => {
  const response = await axios.get("http://localhost:3000/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data
    .filter((user: any) => user.id !== userId)
    .sort((a: any, b: any) => a.name.localeCompare(b.name));
};

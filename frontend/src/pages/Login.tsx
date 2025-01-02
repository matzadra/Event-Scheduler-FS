import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  // Estados para email e senha
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita o recarregamento da página

    try {
      // Faz a requisição ao backend
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      // Salva o token no localStorage
      localStorage.setItem("token", response.data.access_token);

      // Redireciona para a página de eventos
      navigate("/events");
    } catch (err) {
      setError("Invalid email or password"); // Mostra mensagem de erro
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Mostra erros, se houver */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado do email
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Atualiza o estado da senha
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

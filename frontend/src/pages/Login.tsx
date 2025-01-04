import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/main.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const { access_token } = response.data;

      // Decode the JWT payload to get the user ID
      const decoded = JSON.parse(atob(access_token.split(".")[1])); // Decode the JWT payload
      const userId = decoded.sub; // Gets the user ID from the JWT payload

      // Store the token and user ID in local storage
      localStorage.setItem("token", access_token);
      localStorage.setItem("userId", userId);

      setError("");
      navigate("/events");
    } catch (err: any) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="matrix-card">
        <h3 className="text-center matrix-heading">Welcome Back, Neo</h3>
        {error && <p className="matrix-error text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="matrix-label">
              Email Address
            </label>
            <input
              type="email"
              className="matrix-input"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="neo@matrix.com"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="matrix-label">
              Password
            </label>
            <input
              type="password"
              className="matrix-input"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••"
            />
          </div>
          <button type="submit" className="matrix-btn w-100">
            Enter the Matrix
          </button>
        </form>
        <p className="text-center mt-3">
          Not a user?{" "}
          <span className="matrix-link" onClick={() => navigate("/register")}>
            Register now
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      <div
        className="card p-4"
        style={{ width: "25rem", backgroundColor: "#121212", color: "#00FF8A" }}
      >
        <h3 className="text-center mb-4">Welcome Back, Neo</h3>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="neo@matrix.com"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••"
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Enter the Matrix
          </button>
        </form>
        <p className="text-center mt-3">
          Not a user?{" "}
          <span
            className="text-info"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register now
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

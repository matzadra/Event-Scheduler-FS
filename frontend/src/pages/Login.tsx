import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../components/login/LoginForm";
import ErrorMessage from "../components/common/ErrorMessage";
import "../styles/main.scss";

const Login = () => {
  const [error, setError] = useState("");
  const { login } = useAuth(); // Gets the login function from the context
  const navigate = useNavigate();

  const handleSuccess = (token: string, userId: string) => {
    login(token, userId); // Stores the token and userId in the context
    setError("");
    navigate("/events");
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="matrix-card">
        <h3 className="text-center matrix-heading">Welcome Back, Neo</h3>
        {error && <ErrorMessage message={error} />}
        <LoginForm onSuccess={handleSuccess} onError={handleError} />
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

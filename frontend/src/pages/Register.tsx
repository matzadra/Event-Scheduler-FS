import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/register/RegisterForm";
import FeedbackMessage from "../components/common/FeedbackMessage";
import "../styles/main.scss";

const Register = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = () => {
    setSuccess(true);
    setError("");
    setTimeout(() => navigate("/login"), 3000);
  };

  const handleError = (message: string) => {
    setError(message);
    setSuccess(false);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="matrix-card">
        <h3 className="text-center matrix-heading">Join the Resistance</h3>
        {error && <FeedbackMessage message={error} type="error" />}
        {success && (
          <FeedbackMessage
            message="Registration successful! Redirecting to login..."
            type="success"
          />
        )}
        <RegisterForm onSuccess={handleSuccess} onError={handleError} />
        <p className="text-center mt-3">
          Already have an account?{" "}
          <span className="matrix-link" onClick={() => navigate("/login")}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;

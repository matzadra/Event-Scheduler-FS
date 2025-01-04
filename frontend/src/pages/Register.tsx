import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/main.scss";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/users", {
        name,
        email,
        password,
      });
      setSuccess(true);
      setError("");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError("Failed to register. Please check your input.");
    }
  };
  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="matrix-card">
        <h3 className="text-center matrix-heading">Join the Resistance</h3>
        {error && <p className="matrix-error text-center">{error}</p>}
        {success && (
          <p className="matrix-success text-center">
            Registration successful! Redirecting to login...
          </p>
        )}
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="name" className="matrix-label">
              Full Name
            </label>
            <input
              type="text"
              className="matrix-input"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
          </div>
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
              placeholder="youremail@matrix.com"
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
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="•••••••"
            />
          </div>
          <button type="submit" className="matrix-btn w-100">
            Register Now
          </button>
        </form>
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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      <div
        className="card p-4"
        style={{ width: "25rem", backgroundColor: "#121212", color: "#00FF8A" }}
      >
        <h3 className="text-center mb-4">Join the Resistance</h3>
        {error && <p className="text-danger text-center">{error}</p>}
        {success && (
          <p className="text-success text-center">
            Registration successful! Redirecting to login...
          </p>
        )}
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
          </div>
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
              placeholder="youremail@matrix.com"
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
            Register Now
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account?{" "}
          <span
            className="text-info"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;

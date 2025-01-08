import React, { useState } from "react";
import { loginUser } from "../../services/authService";

interface LoginFormProps {
  onSuccess: (token: string, userId: string) => void;
  onError: (errorMessage: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token, userId } = await loginUser(email, password);
      onSuccess(token, userId);
    } catch (err) {
      onError("Invalid credentials. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
  );
};

export default LoginForm;

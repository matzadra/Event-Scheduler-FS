import React, { useState } from "react";
import { registerUser } from "../../services/userService";

interface RegisterFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onError }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(name, email, password);
      onSuccess();
    } catch (err) {
      onError("Failed to register. Please check your input.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="•••••••"
        />
      </div>
      <button type="submit" className="matrix-btn w-100">
        Register Now
      </button>
    </form>
  );
};

export default RegisterForm;

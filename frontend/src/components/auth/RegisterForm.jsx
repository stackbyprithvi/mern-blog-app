import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await register(username, email, password);
    setLoading(false);

    if (res.success) {
      navigate("/");
    }
  };
  return (
    <div className="">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="name"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button disabled={loading} type="submit">
          {loading ? "Registering in..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;

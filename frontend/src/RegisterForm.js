import React, { useState } from "react";
import { BASE_URL } from "./api";

function RegisterForm({ onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Registration successful!");
        setUsername("");
        setEmail("");
        setPassword("");
        if (onRegister) onRegister();
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="w3-container w3-padding-32" id="register">
      <h2 className="w3-center">Register</h2>
      <form className="w3-container w3-card w3-padding" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          className="w3-input w3-margin-bottom"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Email</label>
        <input
          className="w3-input w3-margin-bottom"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          className="w3-input w3-margin-bottom"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="w3-text-red">{error}</p>}
        {success && <p className="w3-text-green">{success}</p>}
        <button className="w3-button w3-black w3-block" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;

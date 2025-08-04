import React, { useState } from "react";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("${BASE_URL}/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_id", data.user_id);
        onLogin(data.access_token);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };


  return (
    <div className="w3-container w3-padding-32" id="login">
      <h2 className="w3-center">Login</h2>
      <form className="w3-container w3-card w3-padding" onSubmit={handleSubmit}>
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
        <button className="w3-button w3-black w3-block" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;

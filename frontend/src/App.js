import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import TitleList from "./TitleList";
import AddTitleForm from "./AddTitleForm";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="w3-content" style={{ maxWidth: "800px" }}>
      <header className="w3-container w3-center w3-padding-32">
        <h1 className="w3-xxxlarge"><b>IMDb Light</b></h1>
        <p>Welcome to <span className="w3-tag">Movie Explorer</span></p>
      </header>

      {token ? (
        <div className="w3-container w3-center">
          <p>You are logged in!</p>
          <button className="w3-button w3-red w3-margin-bottom" onClick={handleLogout}>
            Logout
          </button>

          {/* Yeni film ekleme formu */}
          <AddTitleForm onTitleAdded={() => window.location.reload()} />

          {/* Film listesi */}
          <TitleList token={token} />
        </div>
      ) : (
        <>
          <LoginForm onLogin={handleLogin} />
          <hr className="w3-margin" />
          <RegisterForm onRegister={() => alert("You can now log in!")} />
        </>
      )}
    </div>
  );
}

export default App;

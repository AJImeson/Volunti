import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginForm.css";
import { loginUser, getToken } from "../../services/authService";


export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionMessage = location.state?.message;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMsg("Vänligen fyll i både mejl och lösenord.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const user = await loginUser(email, password);
      const token = getToken(); // Get JWT token from authService
      const payload = JSON.parse(atob(token.split(".")[1])); // split the token and take the middle part and then parse from B64 to string
      console.log(payload);
      const role = payload.role; // put the role, Volunteer, OrgAdmin, Orguser
      console.log("Inloggad som:", user);
      if (role === "OrgAdmin") {
        navigate("/org-dashboard");
      } 
      else if (role === "OrgUser") {
        navigate("/org-user-dashboard");
      } else {
        navigate("/missions");
    }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const renderEyeIcon = (open) =>
    open ? (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    ) : (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    );

  return (
    <div className="login-wrapper">
      <div className="login-top-nav">
        <h1 className="login-logo" onClick={handleLogoClick}>
          VOLUNTI
        </h1>
        <button
          className="btn-nav-register"
          onClick={() => navigate("/register")}
        >
          Registrera dig
        </button>
      </div>

      <div className="login-header">
        <h2 className="login-title">
          Hitta uppdrag
          <br />
          nära dig
        </h2>
        <p className="login-subtitle">Små insatser. Stor skillnad.</p>
      </div>

      <div className="login-card">
        <h2 className="login-card-title">Logga in</h2>

        {errorMsg && <div className="error-msg-box">{errorMsg}</div>}

        {sessionMessage && (
          <div className="error-msg-box">{sessionMessage}</div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            className="text-input"
            placeholder="E-postadress *"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMsg) setErrorMsg("");
            }}
            disabled={isLoading}
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="text-input"
              placeholder="Lösenord*"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {renderEyeIcon(showPassword)}
            </button>
          </div>

          <button type="button" className="forgot-password-btn">
            Glömt lösenordet?
          </button>

          <button
            type="submit"
            className="btn-primary login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Loggar in..." : "Logga in"}
          </button>
        </form>
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import { useOrgRegister } from "../context/OrgRegisterContext";
import { registerOrganization } from "../../services/authService";

const OrgRegister4 = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useOrgRegister();
  const handleRegister = async () => {
    try {
      await registerOrganization (formData);
      navigate("/profile");
    } catch (error) {
      alert(error.message);
    }
  };
  
  const renderIcon = (name) => {
    switch (name) {
      case "bag":
        return (
          <svg className="feature-icon" viewBox="0 0 24 24">
            <rect x="4" y="7" width="16" height="14" rx="2" />
            <path d="M8 7v-2a4 4 0 0 1 8 0v2" />
          </svg>
        );
      case "bell":
        return (
          <svg className="feature-icon" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        );
      case "info":
        return (
          <svg className="feature-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
      case "message":
        return (
          <svg className="feature-icon" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="9" y1="10" x2="15" y2="10" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        );
      case "heart":
        return (
          <svg className="feature-icon" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-wrapper">
      {/* --- TOPPMENY --- */}
      <div className="auth-top-nav">
        <h1
          className="auth-logo"
          onClick={() => navigate("/landing")}
          style={{ cursor: "pointer" }}
        >
          VOLUNTI
        </h1>
        <button className="btn-nav-login" onClick={() => navigate("/login")}>
          Logga in
        </button>
      </div>

      {/* --- VOLONTÄR / ORGANISATION --- */}
      <div className="user-type-toggle">
        <button
          type="button"
          className="user-type-btn"
          onClick={() => navigate("/register")}
        >
          Volontär
        </button>
        <button type="button" className="user-type-btn active">
          Organisation
        </button>
      </div>

      {/* --- HEADER --- */}
      <div className="auth-header">
        <div className="stepper">
          <div className="step-dot active"></div>
          <div className="step-line"></div>
          <div className="step-dot active"></div>
          <div className="step-line"></div>
          <div className="step-dot active"></div>
          <div className="step-line"></div>
          <div className="step-dot active"></div>
        </div>

        <p className="auth-step-text">Steg 4 av 4</p>
        <h2 className="auth-title">Hur vill ni bli notifierade?</h2>
        <p className="auth-subtitle">
          Vi anpassar uppdrag efter er
          <br />– helt på era villkor.
        </p>
      </div>

      {/* --- FORMULÄR --- */}
      <div className="bottom-sheet-card auth-form-container">
        {/* Rekommenderat */}
        <div className="notification-section">
          <span className="notification-label">Rekommenderat</span>
          <div
            className={`notification-card ${
              formData.notificationLevel === "Rekommenderat" ? "active" : ""
            }`}
            onClick={() =>
              setFormData({ ...formData, notificationLevel: "Rekommenderat" })
            }
          >
            <div className="card-header">
              <label
                className="radio-label"
                style={{ gap: 0, margin: 0, cursor: "pointer" }}
              >
                <input
                  type="radio"
                  checked={formData.notificationLevel === "Rekommenderat"}
                  readOnly
                />
              </label>
              <p className="card-title">Lagom med notiser som passar er</p>
            </div>
            <div className="card-features">
              <div className="feature-item">{renderIcon("bag")} Uppdrag</div>
              <div className="feature-item">
                {renderIcon("bell")} Påminnelser
              </div>
              <div className="feature-item">
                {renderIcon("info")} Viktiga uppdateringar
              </div>
              <div className="feature-item">
                {renderIcon("message")} Utvalda inlägg i community
              </div>
            </div>
          </div>
        </div>

        {/* Minimalt */}
        <div className="notification-section">
          <span className="notification-label">Minimalt</span>
          <div
            className={`notification-card ${
              formData.notificationLevel === "Minimalt" ? "active" : ""
            }`}
            onClick={() =>
              setFormData({ ...formData, notificationLevel: "Minimalt" })
            }
          >
            <div className="card-header">
              <label
                className="radio-label"
                style={{ gap: 0, margin: 0, cursor: "pointer" }}
              >
                <input
                  type="radio"
                  checked={formData.notificationLevel === "Minimalt"}
                  readOnly
                />
              </label>
              <p className="card-title">Endast det viktigaste</p>
            </div>
            <div className="card-features">
              <div className="feature-item">{renderIcon("bag")} Uppdrag</div>
              <div className="feature-item">
                {renderIcon("bell")} Påminnelser
              </div>
              <div className="feature-item">
                {renderIcon("info")} Viktiga uppdateringar
              </div>
            </div>
          </div>
        </div>

        {/* Allt */}
        <div className="notification-section">
          <span className="notification-label">Allt</span>
          <div
            className={`notification-card ${
              formData.notificationLevel === "Allt" ? "active" : ""
            }`}
            onClick={() =>
              setFormData({ ...formData, notificationLevel: "Allt" })
            }
          >
            <div className="card-header">
              <label
                className="radio-label"
                style={{ gap: 0, margin: 0, cursor: "pointer" }}
              >
                <input
                  type="radio"
                  checked={formData.notificationLevel === "Allt"}
                  readOnly
                />
              </label>
              <p className="card-title">Alla notiser och aktiviteter</p>
            </div>
            <div className="card-features">
              <div className="feature-item">{renderIcon("bag")} Uppdrag</div>
              <div className="feature-item">
                {renderIcon("bell")} Påminnelser
              </div>
              <div className="feature-item">
                {renderIcon("info")} Alla uppdateringar
              </div>
              <div className="feature-item">
                {renderIcon("message")} Nya inlägg i communityn
              </div>
              <div className="feature-item">
                {renderIcon("heart")} Likes & Kommentarer
              </div>
            </div>
          </div>
        </div>

        <h3 className="form-section-title">
          Vill ni bli notifierade via mejl?*
        </h3>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="emailNotification"
              value="Ja"
              checked={formData.emailNotification === "Ja"}
              onChange={(e) =>
                setFormData({ ...formData, emailNotification: e.target.value })
              }
            />
            Ja
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="emailNotification"
              value="Nej"
              checked={formData.emailNotification === "Nej"}
              onChange={(e) =>
                setFormData({ ...formData, emailNotification: e.target.value })
              }
            />
            Nej, enbart via appen.
          </label>
        </div>

        {/* --- NAVIGERINGSKNAPPAR --- */}
        <div className="input-row" style={{ marginTop: "2rem" }}>
          <button
            className="btn-outline-blue"
            onClick={() => navigate("/org-register/3")}
          >
            Föregående
          </button>
          <button className="btn-primary" onClick={handleRegister}>
            Kom igång
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrgRegister4;

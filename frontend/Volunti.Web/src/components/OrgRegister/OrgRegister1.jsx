import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrgRegister } from "../context/OrgRegisterContext";

const OrgRegister1 = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useOrgRegister();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          <div className="step-dot"></div>
          <div className="step-line"></div>
          <div className="step-dot"></div>
          <div className="step-line"></div>
          <div className="step-dot"></div>
        </div>

        <p className="auth-step-text">Steg 1 av 4</p>
        <h2 className="auth-title">Skapa ditt konto</h2>
        <p className="auth-subtitle">
          Fyll i dina uppgifter för att komma igång.
        </p>
      </div>

      {/* --- FORMULÄR --- */}
      <div className="bottom-sheet-card auth-form-container">
        <input
          type="text"
          name="foretagsnamn"
          value={formData.foretagsnamn}
          onChange={handleChange}
          className="text-input"
          placeholder="Organisationsnamn *"
        />
        <input
          type="text"
          name="organisationsnummer"
          value={formData.organisationsnummer}
          onChange={handleChange}
          className="text-input"
          placeholder="Organisationsnummer *"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="text-input"
          placeholder="E-postadress *"
          autoComplete="email"
        />
        <input
          type="email"
          name="confirmEmail"
          value={formData.confirmEmail}
          onChange={handleChange}
          className="text-input"
          placeholder="Bekräfta e-postadress *"
          autoComplete="off"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="text-input"
          placeholder="Lösenord *"
          autoComplete="new-password"
        />

        {/* --- NAVIGERINGSKNAPPAR --- */}
        <div className="input-row" style={{ marginTop: "2rem" }}>
          <button
            className="btn-outline-blue"
            onClick={() => navigate("/landing")}
          >
            Föregående
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate("/org-register/2")}
          >
            Nästa
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrgRegister1;

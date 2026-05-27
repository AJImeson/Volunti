import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrgRegister } from "../context/OrgRegisterContext";

const OrgRegister3 = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useOrgRegister();
  const [errorMsg, setErrorMsg] = useState("");

  const handleNext = () => {
    if (formData.branscher.length === 0) {
      setErrorMsg("Välj minst en bransch för att fortsätta.");
      return;
    }
    navigate("/org-register/4");
  };

  const toggleBransch = (value) => {
    setFormData((prev) => ({
      ...prev,
      branscher: prev.branscher.includes(value)
        ? prev.branscher.filter((b) => b !== value)
        : [...prev.branscher, value],
    }));
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
          <div className="step-dot"></div>
        </div>

        <p className="auth-step-text">Steg 3 av 4</p>
        <h2 className="auth-title">Vad behöver ni hjälp med?</h2>
        <p className="auth-subtitle">
          Fyll i era uppgifter för att komma igång.
        </p>
      </div>

      {/* --- FORMULÄR --- */}
      <div className="bottom-sheet-card auth-form-container">
        <h3 className="form-section-title" style={{ marginTop: 0 }}>
          Vad är det för bransch?*
        </h3>
        <div className="chip-group">
          {[
            "Skola",
            "Äldreomsorg",
            "Miljö",
            "Barn och ungdom",
            "Matutdelning",
            "Djur",
            "Administration",
            "Digital hjälp",
          ].map((cat) => (
            <button
              key={cat}
              className={`chip-btn ${
                formData.branscher.includes(cat) ? "active" : ""
              }`}
              onClick={() => toggleBransch(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <h3 className="form-section-title">
          Behövs det dokumentation för att utföra arbetet?
        </h3>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="dokumentation"
              value="Ja"
              checked={formData.dokumentation === "Ja"}
              onChange={(e) =>
                setFormData({ ...formData, dokumentation: e.target.value })
              }
            />
            Ja
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="dokumentation"
              value="Nej"
              checked={formData.dokumentation === "Nej"}
              onChange={(e) =>
                setFormData({ ...formData, dokumentation: e.target.value })
              }
            />
            Nej
          </label>
        </div>

        {/* --- NAVIGERINGSKNAPPAR --- */}
        {errorMsg && (
          <p style={{ color: "red", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            {errorMsg}
          </p>
        )}

        <div className="input-row" style={{ marginTop: "2rem" }}>
          <button
            className="btn-outline-blue"
            onClick={() => navigate("/org-register/2")}
          >
            Föregående
          </button>
          <button className="btn-primary" onClick={handleNext}>
            Nästa
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrgRegister3;

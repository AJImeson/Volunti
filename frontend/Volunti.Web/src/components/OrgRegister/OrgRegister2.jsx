import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrgRegister2 = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    kommun: "",
    beskrivning: "",
  });

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
          <div className="step-dot"></div>
          <div className="step-line"></div>
          <div className="step-dot"></div>
        </div>

        <p className="auth-step-text">Steg 2 av 4</p>
        <h2 className="auth-title">Berätta lite om er</h2>
      </div>

      {/* --- FORMULÄR --- */}
      <div className="bottom-sheet-card auth-form-container">
        <div className="custom-dropdown-container">
          <div
            className={`select-input ${isDropdownOpen ? "open" : ""}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {formData.kommun ? (
              <span style={{ color: "var(--text-dark)" }}>
                {formData.kommun}
              </span>
            ) : (
              <span style={{ color: "var(--gray-text)" }}>Välj kommun</span>
            )}
          </div>

          {isDropdownOpen && (
            <div className="custom-dropdown-menu">
              {["Stockholm", "Göteborg", "Malmö", "Uppsala", "Västerås"].map(
                (city) => (
                  <div
                    key={city}
                    className="custom-dropdown-item"
                    onClick={() => {
                      setFormData({ ...formData, kommun: city });
                      setIsDropdownOpen(false);
                    }}
                  >
                    {city}
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        <textarea
          name="beskrivning"
          value={formData.beskrivning}
          onChange={(e) =>
            setFormData({ ...formData, beskrivning: e.target.value })
          }
          className="text-input"
          placeholder="Berätta kort om er organisation..."
          rows={5}
          style={{ resize: "vertical", fontFamily: "inherit" }}
        />

        {/* --- NAVIGERINGSKNAPPAR --- */}
        <div className="input-row" style={{ marginTop: "2rem" }}>
          <button
            className="btn-outline-blue"
            onClick={() => navigate("/org-register/1")}
          >
            Föregående
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate("/org-register/3")}
          >
            Nästa
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrgRegister2;

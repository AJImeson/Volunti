import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      <div className="landing-content">
        <div className="shape-top">
          <div className="shape-inner"></div>
        </div>
        <div className="shape-bottom">
          <div className="shape-inner"></div>
        </div>

        <div className="landing-logo-container">
          <h1 className="landing-logo-black">VOLUNTI</h1>
        </div>

        <div className="landing-bottom-content">
          <div className="text-wrapper">
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                lineHeight: 1.2,
              }}
            >
              Hitta uppdrag nära dig
            </h2>
            <p style={{ fontSize: "1.2rem", opacity: 0.9, margin: 0 }}>
              Små insatser. Stor skillnad.
            </p>
          </div>

          <div className="btn-wrapper">
            <button className="btn-outline-white" onClick={() => navigate("/login")}>
              Logga in
            </button>
            <button className="btn-solid-white" onClick={() => navigate("/register")}>
              Registrera dig
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

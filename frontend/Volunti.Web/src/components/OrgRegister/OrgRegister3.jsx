import React from 'react';
import './OrgRegister3.css';

const OrgRegister3 = ({ setView }) => { 
  return (
    <div className="app-container">
      <div className="setup-wrapper">
        <header className="setup-header">
          <h1 className="volunti-logo">VOLUNTI</h1>
          <button className="login-btn">Logga in</button>
        </header>

        {/* Stepper */}
        <div className="stepper-container">
          <div className="dot"></div>
          <div className="step-line"></div>
          <div className="dot"></div>
          <div className="step-line"></div>
          <div className="dot active"></div>
          <div className="step-line"></div>
          <div className="dot"></div>
        </div>

        <div className="setup-intro">
          <p className="step-count">Steg 3 av 4</p>
          <h2 className="setup-title">Vad behöver ni hjälp med?</h2>
          <p className="setup-subtitle">Fyll i dina uppgifter för att komma igång.</p>
        </div>

        <main className="setup-content-card">
          
          {/* Bransch-sektionen */}
          <div className="form-group">
            <h3 className="section-label">Vad är det för bransch?*</h3>
            <div className="pill-grid">
              <button className="pill-btn">Skola</button>
              <button className="pill-btn">Äldreomsorg</button>
              <button className="pill-btn">Miljö</button>
              <button className="pill-btn">Barn och ungdom</button>
              <button className="pill-btn">Matutdelning</button>
              <button className="pill-btn">Djur</button>
              <button className="pill-btn">Adminstration</button>
              <button className="pill-btn">Digital hjälp</button>
            </div>
          </div>

          {/* Dokumentation-sektionen (Radioknappar) */}
          <div className="form-group">
            <h3 className="section-label">Behövs det dokumentation för att utföra arbetet?</h3>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="dokumentation" value="ja" className="radio-input" />
                <span className="radio-custom"></span>
                Ja
              </label>
              <label className="radio-label">
                <input type="radio" name="dokumentation" value="nej" className="radio-input" />
                <span className="radio-custom"></span>
                Nej
              </label>
            </div>
          </div>

          <footer className="setup-footer">
            <button className="btn-back" onClick={() => setView("orgRegister2")}>Föregående</button>
            <button className="btn-next" onClick={() => setView("orgRegister4")}>Kom igång</button>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default OrgRegister3;
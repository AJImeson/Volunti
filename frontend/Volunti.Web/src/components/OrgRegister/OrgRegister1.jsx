import React from 'react';
import './OrgRegister1.css';

const OrgRegister1 = ({ setView }) => { 
  return (
    <div className="app-container">
      <div className="setup-wrapper">
        <header className="setup-header">
          <h1 className="volunti-logo">VOLUNTI</h1>
          <button className="login-btn">Logga in</button>
        </header>

        {}
        <div className="stepper-container">
          <div className="dot active"></div>
          <div className="step-line"></div>
          <div className="dot"></div>
          <div className="step-line"></div>
          <div className="dot"></div>
          <div className="step-line"></div>
          <div className="dot"></div>
        </div>

        <div className="setup-intro">
          <p className="step-count">Steg 1 av 4</p>
          <h2 className="setup-title">Skapa ditt konto</h2>
          <p className="setup-subtitle">Fyll i dina uppgifter för att komma igång.</p>
        </div>

        <main className="setup-content-card">
          {}
          <div className="form-group">
            <div className="input-wrapper">
              <input type="text" placeholder="Företagsnamn*" className="setup-input" />
            </div>
            <div className="input-wrapper">
              <input type="text" placeholder="Organisationsnamn*" className="setup-input" />
            </div>
            <div className="input-wrapper">
              <input type="email" placeholder="Mejl*" className="setup-input" />
            </div>
            <div className="input-wrapper">
              <input type="email" placeholder="Bekräfta mejladress*" className="setup-input" />
            </div>
            <div className="input-wrapper">
              <input type="password" placeholder="Lösenord*" className="setup-input" />
            </div>
            <div className="input-wrapper">
              <input type="text" placeholder="Namn*" className="setup-input" />
            </div>
          </div>

          {}
          <footer className="setup-footer">
            <button className="btn-back">Föregående</button>
            <button className="btn-next" onClick={() => setView("orgRegister2")}>Nästa</button>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default OrgRegister1;
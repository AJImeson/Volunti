import React from 'react';

export default function RegisterPage({ setView }) {
  return (
    <div className="auth-wrapper">
      
      {/* 1. Toppmeny */}
      <div className="auth-top-nav">
        <h1 className="auth-logo">VOLUNTI</h1>
        <button className="btn-nav-login" onClick={() => setView('login')}>
          Logga in
        </button>
      </div>

      {/* 2. Header */}
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
        <p className="auth-step-text">
          Steg 1 av 4
        </p>
        <h2 className="auth-title">
          Skapa ditt konto
        </h2>
        <p className="auth-subtitle">
          Fyll i dina uppgifter för att komma igång.
        </p>
      </div>

      {/* 3. Vita Form rutan */}
      <div className="bottom-sheet-card auth-form-container">
        
        <input type="text" className="text-input" placeholder="Förnamn *" />
        <input type="text" className="text-input" placeholder="Efternamn *" />
        <input type="email" className="text-input" placeholder="Mejl *" />
        <input type="email" className="text-input" placeholder="Bekräfta mejladress *" />

        {/* Telefonnummer sektionen */}
        <div className="phone-section">
          <label className="phone-label">Telefonnummer *</label>
          <div className="phone-input-group">
            <div className="phone-prefix">
              🇸🇪 +46
            </div>
            <input type="tel" className="text-input" style={{ flex: 1 }} />
          </div>
        </div>

        <input type="password" className="text-input" placeholder="Lösenord *" />

        {/* Knapp raden i RegisterPage */}
        <div className="input-row" style={{ marginTop: '0.5rem' }}>
          <button className="btn-outline-blue" onClick={() => setView('landing')}>
            Föregående
          </button>
          <button className="btn-primary" onClick={() => console.log('Gå till steg 2!')}>
            Nästa
          </button>
        </div>

      </div>
    </div>
  );
}
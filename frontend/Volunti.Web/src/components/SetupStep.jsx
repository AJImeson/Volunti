import React from 'react';
import './SetupStep.css';

const SetupStep = () => {
  return (
    <div className="setup-wrapper">
      <header className="setup-header">
        <h1 className="volunti-logo">VOLUNTI</h1>
        <button className="login-btn">Logga in</button>
      </header>

      {}
      <div className="stepper">
        <div className="dot filled"></div>
        <div className="dot filled"></div>
        <div className="dot current"></div>
        <div className="dot"></div>
      </div>

      <div className="setup-intro">
        <p className="step-count">Steg 3 av 4</p>
        <h2 className="setup-title">Vad vill du hjälpa till med?</h2>
        <p className="setup-subtitle">Fyll i dina uppgifter för att komma igång.</p>
      </div>

      <main className="setup-content-card">
        {}
        <div className="tag-group">
          <button className="setup-tag">Skola</button>
          <button className="setup-tag">Äldreomsorg</button>
          <button className="setup-tag">Miljö</button>
          <button className="setup-tag">Barn och ungdom</button>
          <button className="setup-tag">Matutdelning</button>
          <button className="setup-tag">Djur</button>
          <button className="setup-tag">Adminstration</button>
          <button className="setup-tag">Digital hjälp</button>
        </div>

        {}
        <section className="availability-section">
          <h3>När är du tillgänglig?</h3>
          <div className="tag-group">
            <button className="setup-tag">Vardag</button>
            <button className="setup-tag">Kvällar</button>
            <button className="setup-tag">Helger</button>
            <button className="setup-tag">Engångsuppdrag</button>
            <button className="setup-tag">Återkommande</button>
          </div>
        </section>

        {}
        <section className="distance-section">
          <div className="distance-header">
            <h3>Avstånd</h3>
            <span className="distance-val">5km</span>
          </div>
          <div className="slider-container">
            <input type="range" className="distance-slider" min="0" max="50" defaultValue="5" />
          </div>
          <label className="no-matter-container">
            <input type="radio" name="distance-pref" />
            <span className="checkmark"></span>
            Det spelar ingen roll
          </label>
        </section>

        {}
        <footer className="setup-footer">
          <button className="btn-secondary">Föregående</button>
          <button className="btn-primary">Kom igång</button>
        </footer>
      </main>
    </div>
  );
};

export default SetupStep;
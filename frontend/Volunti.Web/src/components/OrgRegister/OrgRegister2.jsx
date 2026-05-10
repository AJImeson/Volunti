import React from 'react';
import './OrgRegister2.css';

const OrgRegister2 = ({ setView }) => {  
  return (
    <div className="app-container">
      <div className="setup-wrapper">
        <header className="setup-header">
          <h1 className="volunti-logo">VOLUNTI</h1>
          <button className="login-btn">Logga in</button>
        </header>

        {/* Stepper */}
        <div className="stepper-container">
          <div className="dot completed"></div>
          <div className="step-line active-line"></div>
          <div className="dot active"></div>
          <div className="step-line"></div>
          <div className="dot"></div>
          <div className="step-line"></div>
          <div className="dot"></div>
        </div>

        <div className="setup-intro">
          <p className="step-count">Steg 2 av 4</p>
          <h2 className="setup-title">Berätta lite om er</h2>
        </div>

        <main className="setup-content-card">
          <div className="form-group">
            {/* Dropdown för kommun */}
            <div className="input-wrapper">
              <select className="setup-input select-input">
                <option value="" disabled selected>Välj kommun</option>
                <option value="stockholm">Stockholm</option>
                <option value="goteborg">Göteborg</option>
                <option value="malmo">Malmö</option>
                <option value="uppsala">Uppsala</option>
              </select>
              <div className="select-arrow">▼</div>
            </div>

            {/* Textarea för beskrivning */}
            <div className="input-wrapper">
              <textarea 
                className="setup-input textarea-input" 
                placeholder="Berätta kort om er organisation..."
              ></textarea>
            </div>
          </div>

            <footer className="setup-footer">
                <button className="btn-back" onClick={() => setView("orgRegister1")}>Föregående</button>
                <button className="btn-next" onClick={() => setView("orgRegister3")}>Nästa</button>
            </footer>
        </main>
      </div>
    </div>
  );
};

export default OrgRegister2;
import React from 'react';
import './OrgRegister4.css';

const OrgRegister4 = ({ setView }) => { 
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
          <div className="dot"></div>
          <div className="step-line"></div>
          <div className="dot active"></div>
        </div>

        <div className="setup-intro">
          <p className="step-count">Steg 4 av 4</p>
          <h2 className="setup-title">Hur vill ni bli notifierade?</h2>
          <p className="setup-subtitle">Vi anpassar uppdrag efter er – helt på era villkor.</p>
        </div>

        <main className="setup-content-card scrollable-card">
          
          {/* Kort 1 */}
          <div className="notif-section">
            <h3 className="notif-title">Rekommenderat</h3>
            <label className="notif-card">
              <div className="notif-header">
                <input type="radio" name="notis-level" value="rekommenderat" className="hidden-radio" defaultChecked />
                <div className="radio-circle"></div>
                <span className="notif-desc">Lagom med notiser som passar dig</span>
              </div>
              <div className="notif-features">
                <div className="feature-item">
                  <IconBag /> Uppdrag
                </div>
                <div className="feature-item">
                  <IconBell /> Påminnelser
                </div>
                <div className="feature-item">
                  <IconInfo /> <span>Viktiga<br/>uppdateringar</span>
                </div>
                <div className="feature-item">
                  <IconMessage /> <span>Utvalda inlägg<br/>i community</span>
                </div>
              </div>
            </label>
          </div>

          {/* Kort 2 */}
          <div className="notif-section">
            <h3 className="notif-title">Minimalt</h3>
            <label className="notif-card">
              <div className="notif-header">
                <input type="radio" name="notis-level" value="minimalt" className="hidden-radio" />
                <div className="radio-circle"></div>
                <span className="notif-desc">Endast det viktigaste</span>
              </div>
              <div className="notif-features">
                <div className="feature-item">
                  <IconBag /> Uppdrag
                </div>
                <div className="feature-item">
                  <IconBell /> Påminnelser
                </div>
                <div className="feature-item">
                  <IconInfo /> <span>Viktiga<br/>uppdateringar</span>
                </div>
              </div>
            </label>
          </div>

          {/* Kort 3 */}
          <div className="notif-section">
            <h3 className="notif-title">Allt</h3>
            <label className="notif-card">
              <div className="notif-header">
                <input type="radio" name="notis-level" value="allt" className="hidden-radio" />
                <div className="radio-circle"></div>
                <span className="notif-desc">Alla notiser och aktiviteter</span>
              </div>
              <div className="notif-features">
                <div className="feature-item">
                  <IconBag /> Uppdrag
                </div>
                <div className="feature-item">
                  <IconBell /> Påminnelser
                </div>
                <div className="feature-item">
                  <IconInfo /> <span>Alla<br/>uppdateringar</span>
                </div>
                <div className="feature-item">
                  <IconMessage /> <span>Nya inlägg i<br/>communityn</span>
                </div>
                <div className="feature-item">
                  <IconHeart /> <span>Likes &<br/>Kommentarer</span>
                </div>
              </div>
            </label>
          </div>

          {/* Fråga om mejl */}
          <div className="form-group email-notif-group">
            <h3 className="section-label">Vill ni bli notifierad via mejl?*</h3>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="mejl-notis" value="ja" className="radio-input" />
                <span className="radio-custom"></span>
                Ja
              </label>
              <label className="radio-label">
                <input type="radio" name="mejl-notis" value="nej" className="radio-input" />
                <span className="radio-custom"></span>
                Nej, enbart via appen.
              </label>
            </div>
          </div>

          <footer className="setup-footer">
            <button className="btn-back" onClick={() => setView("orgRegister3")}>Föregående</button>
            <button className="btn-next" onClick={() => setView("orgRegister4")}>Kom igång</button>
          </footer>
        </main>
      </div>
    </div>
  );
};

const IconBag = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#2F44A5" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
);
const IconBell = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#2F44A5" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
const IconInfo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#2F44A5" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);
const IconMessage = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#2F44A5" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><line x1="9" y1="10" x2="15" y2="10"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
);
const IconHeart = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="#2F44A5" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
);

export default OrgRegister4;
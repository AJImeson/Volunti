import React from 'react';

export default function LandingPage({ setView }) {
  return (
    <div className="landing-wrapper">
      
      {/* BAKGRUNDEN*/}
      <div className="shape-top"></div>
      <div className="shape-bottom"></div>

      <div className="landing-content">
        
        {/* ÖVRE HALVAN: Loggan */}
        <div className="landing-logo-container">
          <h1 className="landing-logo-black">VOLUNTI</h1>
        </div>

        {/* UNDRE HALVAN: Text och knappar */}
        <div className="landing-bottom-content">
          
          <div className="text-wrapper">
            <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '0.5rem', lineHeight: 1.2 }}>
              Hitta uppdrag nära dig
            </h2>
            <p style={{ fontSize: '1.3rem', opacity: 0.9 }}>
              Små insatser. Stor skillnad.
            </p>
          </div>

          <div className="btn-wrapper">
            <button className="btn-outline-white" onClick={() => setView('login')}>
              Logga in
            </button>
            <button className="btn-solid-white" onClick={() => setView('register')}>
              Registrera dig
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
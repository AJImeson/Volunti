import React from 'react';

export default function LandingPage({ setView }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
      
      <div className="hero-text">
        <h1 className="hero-line-large">Volontärarbete</h1>
        <h1 className="hero-line-large">på dina villkor.</h1>
      </div>
      
      <p className="description-text">
        Volunti sammanför engagerade individer med meningsfulla uppdrag. 
        Oavsett om du vill bidra med tid eller hitta förstärkning till din organisation, 
        så börjar resan här.
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
        <button className="btn-primary" onClick={() => setView('register')}>
          Börja som volontär
        </button>
        <button className="btn-secondary" onClick={() => setView('register')}>
          För organisationer
        </button>
      </div>
      
    </div>
  );
}
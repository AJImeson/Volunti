import React, { useState } from 'react';

export default function RegisterPage({ setView }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // 1. Minne för Hela formuläret
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', confirmEmail: '', phone: '', password: '',
    kommun: '', korkort: '',
    categories: [], availability: [], distance: 5, distanceAny: false,
    // --- NYTT FÖR STEG 4 ---
    notificationLevel: 'Rekommenderat', // Standardvalet
    emailNotification: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const toggleSelection = (field, value) => {
    setFormData((prev) => {
      const currentList = prev[field];
      if (currentList.includes(value)) {
        return { ...prev, [field]: currentList.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentList, value] };
      }
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Formuläret är KLART! Datan skickas till backend:', formData);
      // setView('success') eller fetch() här!
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setView('landing');
    }
  };

  // En liten hjälpfunktion för att rita ut snygga SVG-ikoner i Steg 4
  const renderIcon = (name) => {
    switch(name) {
      case 'bag': return <svg className="feature-icon" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M8 7v-2a4 4 0 0 1 8 0v2"/></svg>;
      case 'bell': return <svg className="feature-icon" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
      case 'info': return <svg className="feature-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
      case 'message': return <svg className="feature-icon" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/></svg>;
      case 'heart': return <svg className="feature-icon" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
      default: return null;
    }
  };

  return (
    <div className="auth-wrapper">
      
      <div className="auth-top-nav">
        <h1 className="auth-logo">VOLUNTI</h1>
        <button className="btn-nav-login" onClick={() => setView('login')}>Logga in</button>
      </div>

      <div className="auth-header">
        <div className="stepper">
          <div className={`step-dot ${currentStep >= 1 ? 'active' : ''}`}></div>
          <div className="step-line"></div>
          <div className={`step-dot ${currentStep >= 2 ? 'active' : ''}`}></div>
          <div className="step-line"></div>
          <div className={`step-dot ${currentStep >= 3 ? 'active' : ''}`}></div>
          <div className="step-line"></div>
          <div className={`step-dot ${currentStep >= 4 ? 'active' : ''}`}></div>
        </div>
        
        <p className="auth-step-text">Steg {currentStep} av 4</p>
        
        <h2 className="auth-title">
          {currentStep === 1 && "Skapa ditt konto"}
          {currentStep === 2 && "Berätta lite om dig"}
          {currentStep === 3 && "Vad vill du hjälpa till med?"}
          {currentStep === 4 && "Hur vill du bli notifierad?"}
        </h2>
        
        {(currentStep === 1 || currentStep === 3) && (
          <p className="auth-subtitle">Fyll i dina uppgifter för att komma igång.</p>
        )}
        {currentStep === 4 && (
          <p className="auth-subtitle">Vi anpassar uppdrag efter dig<br/>– helt på dina villkor.</p>
        )}
      </div>

      <div className="bottom-sheet-card auth-form-container">
        
        {/* === STEG 1 === */}
        {currentStep === 1 && (
          <>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="text-input" placeholder="Förnamn *" />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="text-input" placeholder="Efternamn *" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="text-input" placeholder="Mejl *" />
            <input type="email" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} className="text-input" placeholder="Bekräfta mejladress *" />
            <div className="phone-section">
              <label className="phone-label">Telefonnummer *</label>
              <div className="phone-input-group">
                <div className="phone-prefix">🇸🇪 +46</div>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="text-input" style={{ flex: 1 }} />
              </div>
            </div>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="text-input" placeholder="Lösenord *" />
          </>
        )}

        {/* === STEG 2 === */}
        {currentStep === 2 && (
          <>
            {/* NYA SNYGGA DROPDOWNEN */}
            <div className="custom-dropdown-container">
              <div 
                className={`select-input ${isDropdownOpen ? 'open' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {formData.kommun ? (
                  <span style={{ color: 'var(--text-dark)' }}>{formData.kommun}</span>
                ) : (
                  <span style={{ color: 'var(--gray-text)' }}>Välj kommun</span>
                )}
              </div>

              {isDropdownOpen && (
                <div className="custom-dropdown-menu">
                  {['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Västerås'].map(city => (
                    <div 
                      key={city}
                      className="custom-dropdown-item"
                      onClick={() => {
                        // Spara valet och stäng menyn
                        setFormData({ ...formData, kommun: city });
                        setIsDropdownOpen(false);
                      }}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <h3 className="form-section-title">Har du körkort?*</h3>
            <div className="radio-group">
              {['B', 'AM', 'A', 'C', 'Nej'].map((typ) => (
                <label key={typ} className="radio-label">
                  <input type="radio" name="korkort" value={typ} onChange={handleChange} checked={formData.korkort === typ} /> 
                  {typ === 'B' ? 'B (Personbil)' : typ === 'AM' ? 'AM (Moped)' : typ === 'A' ? 'A (Motorcykel)' : typ === 'C' ? 'C (Lastbil)' : 'Nej'}
                </label>
              ))}
            </div>
            <h3 className="form-section-title" style={{ marginTop: '1.5rem' }}>Har du något intyg?*</h3>
            <button className="action-link-btn">+ Ladda upp</button>
            <h3 className="form-section-title" style={{ marginTop: '1.5rem' }}>Har du några rekommendationer?</h3>
            <button className="action-link-btn">+ Lägg till</button>
          </>
        )}

        {/* === STEG 3 === */}
        {currentStep === 3 && (
          <>
            <div className="chip-group">
              {["Skola", "Äldreomsorg", "Miljö", "Barn och ungdom", "Matutdelning", "Djur", "Administration", "Digital hjälp"].map(cat => (
                <button key={cat} className={`chip-btn ${formData.categories.includes(cat) ? 'active' : ''}`} onClick={() => toggleSelection('categories', cat)}>
                  {cat}
                </button>
              ))}
            </div>
            <h3 className="form-section-title">När är du tillgänglig?</h3>
            <div className="chip-group">
              {["Vardag", "Kvällar", "Helger", "Engångsuppdrag", "Återkommande"].map(time => (
                <button key={time} className={`chip-btn ${formData.availability.includes(time) ? 'active' : ''}`} onClick={() => toggleSelection('availability', time)}>
                  {time}
                </button>
              ))}
            </div>
            <div className="range-container">
              <div className="range-header">
                <h3 className="range-title">Avstånd</h3>
                <span className="range-value">{formData.distance}km</span>
              </div>
              <input type="range" name="distance" min="1" max="50" value={formData.distance} onChange={handleChange} className="range-input" disabled={formData.distanceAny} />
            </div>
            <label className="checkbox-row">
              <input type="checkbox" name="distanceAny" checked={formData.distanceAny} onChange={handleChange} />
              <span>Det spelar ingen roll</span>
            </label>
          </>
        )}

        {/* === STEG 4: NOTIFIKATIONER === */}
        {currentStep === 4 && (
          <>
            {/* Rekommenderat Kort */}
            <div className="notification-section">
              <span className="notification-label">Rekommenderat</span>
              <div className={`notification-card ${formData.notificationLevel === 'Rekommenderat' ? 'active' : ''}`} onClick={() => setFormData({...formData, notificationLevel: 'Rekommenderat'})}>
                <div className="card-header">
                  <label className="radio-label" style={{gap: 0, margin: 0, cursor: 'pointer'}}>
                    <input type="radio" checked={formData.notificationLevel === 'Rekommenderat'} readOnly />
                  </label>
                  <p className="card-title">Lagom med notiser som passar dig</p>
                </div>
                <div className="card-features">
                  <div className="feature-item">{renderIcon('bag')} Uppdrag</div>
                  <div className="feature-item">{renderIcon('bell')} Påminnelser</div>
                  <div className="feature-item">{renderIcon('info')} Viktiga uppdateringar</div>
                  <div className="feature-item">{renderIcon('message')} Utvalda inlägg i community</div>
                </div>
              </div>
            </div>

            {/* Minimalt Kort */}
            <div className="notification-section">
              <span className="notification-label">Minimalt</span>
              <div className={`notification-card ${formData.notificationLevel === 'Minimalt' ? 'active' : ''}`} onClick={() => setFormData({...formData, notificationLevel: 'Minimalt'})}>
                <div className="card-header">
                  <label className="radio-label" style={{gap: 0, margin: 0, cursor: 'pointer'}}>
                    <input type="radio" checked={formData.notificationLevel === 'Minimalt'} readOnly />
                  </label>
                  <p className="card-title">Endast det viktigaste</p>
                </div>
                <div className="card-features">
                  <div className="feature-item">{renderIcon('bag')} Uppdrag</div>
                  <div className="feature-item">{renderIcon('bell')} Påminnelser</div>
                  <div className="feature-item">{renderIcon('info')} Viktiga uppdateringar</div>
                </div>
              </div>
            </div>

            {/* Allt Kort */}
            <div className="notification-section">
              <span className="notification-label">Allt</span>
              <div className={`notification-card ${formData.notificationLevel === 'Allt' ? 'active' : ''}`} onClick={() => setFormData({...formData, notificationLevel: 'Allt'})}>
                <div className="card-header">
                  <label className="radio-label" style={{gap: 0, margin: 0, cursor: 'pointer'}}>
                    <input type="radio" checked={formData.notificationLevel === 'Allt'} readOnly />
                  </label>
                  <p className="card-title">Alla notiser och aktiviteter</p>
                </div>
                <div className="card-features">
                  <div className="feature-item">{renderIcon('bag')} Uppdrag</div>
                  <div className="feature-item">{renderIcon('bell')} Påminnelser</div>
                  <div className="feature-item">{renderIcon('info')} Alla uppdateringar</div>
                  <div className="feature-item">{renderIcon('message')} Nya inlägg i communityn</div>
                  <div className="feature-item">{renderIcon('heart')} Likes & Kommentarer</div>
                </div>
              </div>
            </div>

            <h3 className="form-section-title">Vill du bli notifierad via mejl?*</h3>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="emailNotification" value="Ja" onChange={handleChange} checked={formData.emailNotification === 'Ja'} /> 
                Ja
              </label>
              <label className="radio-label">
                <input type="radio" name="emailNotification" value="Nej" onChange={handleChange} checked={formData.emailNotification === 'Nej'} /> 
                Nej, enbart via appen.
              </label>
            </div>
          </>
        )}

        {/* --- KNAPPAR --- */}
        <div className="input-row" style={{ marginTop: '2rem' }}>
          <button className="btn-outline-blue" onClick={handlePrev}>
            Föregående
          </button>
          
          <button className="btn-primary" onClick={handleNext}>
            {currentStep === 4 ? "Kom igång" : "Nästa"}
          </button>
        </div>

      </div>
    </div>
  );
}
import React, { useState } from 'react';
import './Profile.css';
import ProfilBild from "./assets/cv.jpg"; 

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Bio');

  return (
    <div className="profile-wrapper">
      <header className="header-blue">
        <div className="top-nav">
          <h1 className="volunti-logo">VOLUNTI</h1>
          <div className="home-icon-container">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
        </div>

        <div className="profile-card">
          <div className="avatar-section">
            <div className="avatar-container">
              <img src={ProfilBild} alt="Profile" className="profile-img" />
            </div>
            <button className="cv-tag-button">CV</button>
          </div>

          <div className="profile-info">
            <h2>Alex Andersson</h2>
            <div className="profile-stats">
              <span>28 år</span>
              <span className="separator">|</span>
              <span>UX Designer</span>
            </div>
            <p className="profile-bio">Bio text här - kort beskrivning av erfarenhet och kompetens</p>
          </div>
        </div>

        <nav className="tab-menu">
          <button 
            className={`tab-btn ${activeTab === 'Bio' ? 'active' : ''}`}
            onClick={() => setActiveTab('Bio')}
          >
            Bio
          </button>
          <button 
            className={`tab-btn ${activeTab === 'Licenser' ? 'active' : ''}`}
            onClick={() => setActiveTab('Licenser')}
          >
            Licenser
          </button>
          <button 
            className={`tab-btn ${activeTab === 'Impact' ? 'active' : ''}`}
            onClick={() => setActiveTab('Impact')}
          >
            Impact
          </button>
        </nav>
      </header>

      <main className="content-white">
        
        {/* --- BIO FLIK --- */}
        {activeTab === 'Bio' && (
          <>
            <section className="info-section">
              <div className="section-header">
                <h3>Skills & Kompetens</h3>
                <span className="add-link">+ Lägg till</span>
              </div>
              <div className="tags-container">
                <span className="skill-tag">Social</span>
                <span className="skill-tag">Lärare</span>
                <span className="skill-tag">Barn</span>
                <span className="skill-tag">Spanska</span>
                <span className="skill-tag">Engelska</span>
                <span className="skill-tag">Dator</span>
              </div>
            </section>

            <section className="info-section">
              <div className="section-header">
                <h3>Intressen</h3>
                <span className="add-link">+ Lägg till</span>
              </div>
              <div className="tags-container">
                <span className="skill-tag">Social</span>
                <span className="skill-tag">Social</span>
                <span className="skill-tag">Musik</span>
              </div>
            </section>

            <section className="info-section">
              <div className="section-header">
                <h3>Erfarenhet</h3>
                <span className="add-link">+ Lägg till</span>
              </div>
              <div className="experience-list">
                <div className="exp-card">
                  <h4>Lärare på Gislaveds Gymnasium</h4>
                  <p>Jan 2024 - Mars 2025 •</p>
                </div>
                <div className="exp-card">
                  <h4>Brottsoffer assistance på Polisen</h4>
                  <p>Jan 2024 - Feb 2024 • 20 tim</p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* --- LICENSER FLIK --- */}
        {activeTab === 'Licenser' && (
          <>
            <section className="info-section">
              <div className="section-header">
                <h3>Intyg & Rekomendationer</h3>
                <span className="add-link">+ Lägg till</span>
              </div>
              <div className="experience-list">
                <div className="exp-card">
                  <div className="card-header-row">
                    <h4>Röda Korset</h4>
                    <span className="card-date">24 Februari</span>
                  </div>
                  <p>Organisation</p>
                </div>
                <div className="exp-card">
                  <div className="card-header-row">
                    <h4>Johan Johansson</h4>
                    <span className="card-date">13 Januari</span>
                  </div>
                  <p>Volontär på Svenska Kyrkan</p>
                </div>
              </div>
            </section>

            <section className="info-section">
              <div className="section-header">
                <h3>Licenser</h3>
                <span className="add-link">+ Lägg till</span>
              </div>
              <div className="experience-list">
                <div className="exp-card">
                  <div className="card-header-row">
                    <h4>Lärare</h4>
                    <span className="card-date">24 Februari 2027</span>
                  </div>
                  <p>Polisen</p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* --- IMPACT FLIK --- */}
        {activeTab === 'Impact' && (
          <>
            <section className="info-section">
              <div className="section-header">
                <h3>Impact Tracking</h3>
                <span className="add-link">Se uppdrag</span>
              </div>
              <div className="impact-cards-grid">
                <div className="impact-square-card">
                  <span className="impact-val">324</span>
                  <span className="impact-lab">Timmar</span>
                </div>
                <div className="impact-square-card">
                  <span className="impact-val">12</span>
                  <span className="impact-lab">Uppdrag</span>
                </div>
                <div className="impact-square-card">
                  <span className="impact-val">8</span>
                  <span className="impact-lab">Organisationer</span>
                </div>
              </div>
            </section>

            <section className="info-section">
              <div className="section-header">
                <h3>Level</h3>
                <div className="help-circle">?</div>
              </div>
              <div className="level-box">
                <h4>Dedikerad volontär</h4>
                <div className="level-status-text">
                  <span>Nivå 3 / 5</span>
                  <span>12 / 15 uppdrag</span>
                </div>
                <div className="progress-container">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
                <p className="level-footer">3 uppdrag till nästa nivå</p>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
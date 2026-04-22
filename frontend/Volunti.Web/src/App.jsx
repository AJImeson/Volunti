import React, { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

export default function App() {
  
  const [currentView, setCurrentView] = useState('landing'); 

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo" onClick={() => setCurrentView('landing')}>
          Volunti
        </div>
        
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <button className="btn-ghost" onClick={() => setCurrentView('login')}>
            Logga in
          </button>
          <button className="btn-primary" onClick={() => setCurrentView('register')}>
            Bli medlem
          </button>
        </nav>
      </header>

      <main className="main-container">
        {/* Dynamisk rendering baserat på användarens val */}
        {currentView === 'landing' && <LandingPage setView={setCurrentView} />}
        {currentView === 'login' && <LoginForm />}
        {currentView === 'register' && <RegisterForm />}
      </main>
    </div>
  );
}
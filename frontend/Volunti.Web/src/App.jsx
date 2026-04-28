import React, { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import RegisterForm from './components/RegisterForm';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); 

  return (
    <div className="app-container">
      
      {currentView === 'landing' && <LandingPage setView={setCurrentView} />}
      
      {currentView === 'login' && <div style={{color: 'white', padding: '2rem'}}>Login kommer här... <button onClick={() => setCurrentView('landing')}>Tillbaka</button></div>}
      
      {currentView === 'register' && <RegisterForm />}
    </div>
  );
}
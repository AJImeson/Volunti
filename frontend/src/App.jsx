import React, { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import RegisterForm from './components/RegisterForm';
import Profile from './components/Profile';
import SetupStep from './components/SetupStep'; 

export default function App() {
  const [currentView, setCurrentView] = useState('setup'); 

  return (
    <div className="app-container">
      
      {currentView === 'landing' && <LandingPage setView={setCurrentView} />}
      
      {currentView === 'login' && (
        <div style={{color: 'white', padding: '2rem'}}>
          Login kommer här... 
          <button onClick={() => setCurrentView('landing')}>Tillbaka</button>
        </div>
      )}
      
      {currentView === 'register' && <RegisterForm />}

      {currentView === 'profile' && <Profile />}

      {currentView === 'setup' && <SetupStep />}
      
    </div>
  );
}
import React, { useState } from "react";
import "./App.css";
import MarketingPage from "./components/marketing/MarketingPage";
import LandingPage from "./components/LandingPage";
import RegisterForm from "./components/RegisterForm";
import Profile from "./components/Profile";
import LoginForm from "./components/login/LoginForm";
import MissionsPage from "./components/missions/MissionsPage";

export default function App() {
  const [currentView, setCurrentView] = useState("marketing");

  return (
    <div className="app-container">
      {currentView === "marketing" && <MarketingPage setView={setCurrentView} />}

      {currentView === "landing" && <LandingPage setView={setCurrentView} />}

      {currentView === "login" && <LoginForm setView={setCurrentView} />}

      {currentView === "register" && <RegisterForm setView={setCurrentView} />}

      {currentView === "profile" && <Profile setView={setCurrentView} />}

      {currentView === "missions" && <MissionsPage setView={setCurrentView} />}
    </div>
  );
}

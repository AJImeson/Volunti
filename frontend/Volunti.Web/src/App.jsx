import React, { useState } from "react";
import "./App.css";
import LandingPage from "./components/LandingPage";
import RegisterForm from "./components/RegisterForm";
import Profile from "./components/Profile";
import LoginForm from "./components/login/LoginForm";
import MissionsPage from "./components/missions/MissionsPage";

export default function App() {
  const [currentView, setCurrentView] = useState("landing");

  return (
    <div className="app-container">
      {currentView === "landing" && <LandingPage setView={setCurrentView} />}

      {currentView === "login" && <LoginForm setView={setCurrentView} />}

      {currentView === "register" && <RegisterForm setView={setCurrentView} />}

      {currentView === "profile" && <Profile setView={setCurrentView} />}

      {currentView === "missions" && <MissionsPage setView={setCurrentView} />}
    </div>
  );
}

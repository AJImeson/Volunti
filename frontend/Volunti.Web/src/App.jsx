import React, { useState } from "react";
import "./App.css";
import LandingPage from "./components/LandingPage";
import RegisterForm from "./components/RegisterForm";
import Profile from "./components/profile/Profile";
import LoginForm from "./components/login/LoginForm";
import MissionsPage from "./components/missions/MissionsPage";
import OrgRegister1 from "./components/OrgRegister/OrgRegister1";
import OrgRegister2 from "./components/OrgRegister/OrgRegister2";
import OrgRegister3 from "./components/OrgRegister/OrgRegister3";
import OrgRegister4 from "./components/OrgRegister/OrgRegister4";
import SettingsPage from "./components/settingspage/SettingsPage";

export default function App() {
  const [currentView, setCurrentView] = useState("landing");

  console.log("App renderar view:", currentView);

  return (
    <div className="app-container">
      {currentView === "landing" && <LandingPage setView={setCurrentView} />}

      {currentView === "login" && <LoginForm setView={setCurrentView} />}

      {currentView === "register" && <RegisterForm setView={setCurrentView} />}

      {currentView === "profile" && <Profile setView={setCurrentView} />}

      {currentView === "missions" && <MissionsPage setView={setCurrentView} />}

      {currentView === "settings" && <SettingsPage setView={setCurrentView} />}

      {currentView === "orgRegister1" && (
        <OrgRegister1 setView={setCurrentView} />
      )}

      {currentView === "orgRegister2" && (
        <OrgRegister2 setView={setCurrentView} />
      )}

      {currentView === "orgRegister3" && (
        <OrgRegister3 setView={setCurrentView} />
      )}

      {currentView === "orgRegister4" && (
        <OrgRegister4 setView={setCurrentView} />
      )}
    </div>
  );
}

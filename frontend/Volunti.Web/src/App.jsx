import React, { useState } from "react";
import "./App.css";
import MarketingPage from "./components/marketing/MarketingPage";
import OrganizationsPage from "./components/marketing/OrganizationsPage";
import FindMissionsPage from "./components/marketing/FindMissionsPage";
import AboutPage from "./components/marketing/AboutPage";
import ImpactPage from "./components/marketing/ImpactPage";
import FaqPage from "./components/marketing/FaqPage";
import PrivacyPage from "./components/marketing/PrivacyPage";
import LandingPage from "./components/LandingPage";
import RegisterForm from "./components/RegisterForm";
import Profile from "./components/Profile";
import LoginForm from "./components/login/LoginForm";
import MissionsPage from "./components/missions/MissionsPage";
import CreateJobForm from "./components/organization/CreateJobForm";

export default function App() {
  const [currentView, setCurrentView] = useState("create-job");

  return (
    <div className="app-container">
      {currentView === "marketing" && <MarketingPage setView={setCurrentView} />}

      {currentView === "organizations" && <OrganizationsPage setView={setCurrentView} />}

      {currentView === "find-missions" && <FindMissionsPage setView={setCurrentView} />}

      {currentView === "about" && <AboutPage setView={setCurrentView} />}

      {currentView === "impact" && <ImpactPage setView={setCurrentView} />}

      {currentView === "faq" && <FaqPage setView={setCurrentView} />}

      {currentView === "privacy" && <PrivacyPage setView={setCurrentView} />}

      {currentView === "landing" && <LandingPage setView={setCurrentView} />}

      {currentView === "login" && <LoginForm setView={setCurrentView} />}

      {currentView === "register" && <RegisterForm setView={setCurrentView} />}

      {currentView === "profile" && <Profile setView={setCurrentView} />}

      {currentView === "missions" && <MissionsPage setView={setCurrentView} />}

      {currentView === "create-job" && <CreateJobForm setView={setCurrentView} />}
    </div>
  );
}

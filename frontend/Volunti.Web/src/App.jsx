import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import ScrollToTop from "./components/ScrollToTop";
import MarketingPage from "./components/marketing/MarketingPage";
import OrganizationsPage from "./components/marketing/OrganizationsPage";
import FindMissionsPage from "./components/marketing/FindMissionsPage";
import AboutPage from "./components/marketing/AboutPage";
import ImpactPage from "./components/marketing/ImpactPage";
import FaqPage from "./components/marketing/FaqPage";
import PrivacyPage from "./components/marketing/PrivacyPage";
import LandingPage from "./components/LandingPage";
import RegisterForm from "./components/RegisterForm";
import Profile from "./components/profile/Profile";
import LoginForm from "./components/login/LoginForm";
import MissionsPage from "./components/missions/MissionsPage";
import CreateJobForm from "./components/organization/CreateJobForm";
import OrgRegister1 from "./components/OrgRegister/OrgRegister1";
import OrgRegister2 from "./components/OrgRegister/OrgRegister2";
import OrgRegister3 from "./components/OrgRegister/OrgRegister3";
import OrgRegister4 from "./components/OrgRegister/OrgRegister4";
import SettingsPage from "./components/settingspage/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MarketingPage />} />
          <Route path="/organizations" element={<OrganizationsPage />} />
          <Route path="/find-missions" element={<FindMissionsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/create-job" element={<CreateJobForm />} />
          <Route path="/org-register/1" element={<OrgRegister1 />} />
          <Route path="/org-register/2" element={<OrgRegister2 />} />
          <Route path="/org-register/3" element={<OrgRegister3 />} />
          <Route path="/org-register/4" element={<OrgRegister4 />} />
          <Route path="/org-dashboard" element={<div>OrgAdmin Dashboard - Coming Soon</div>} />
          <Route path="/org-user-dashboard" element={<div>OrgUser Dashboard - Coming Soon</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

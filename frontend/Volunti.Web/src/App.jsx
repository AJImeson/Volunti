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
import Profile from "./components/Profile";
import LoginForm from "./components/login/LoginForm";
import MissionsPage from "./components/missions/MissionsPage";
import CreateJobForm from "./components/organization/CreateJobForm";

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
          <Route path="/create-job" element={<CreateJobForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

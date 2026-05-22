//RoleProtectedRoute skyddar så att rätt roll har tillgång till rätt sida

import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import { OrgRegisterProvider } from "./components/context/OrgRegisterContext";
import OrgDashboard from "./components/organization/OrgDashboard";
import OrgUserDashboard from "./components/organization/OrgUserDashboard";
import VolunteerDashboard from "./components/volunteer/VolunteerDashboard";

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
          <Route path="/missions" element={<ProtectedRoute><MissionsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/create-job" element={<ProtectedRoute><CreateJobForm /></ProtectedRoute>} />
          {/* En provider runt alla 4 steg så formData överlever navigering (separata providers nollställer state) */}
          <Route element={<OrgRegisterProvider><Outlet /></OrgRegisterProvider>}>
            <Route path="/org-register/1" element={<OrgRegister1 />} />
            <Route path="/org-register/2" element={<OrgRegister2 />} />
            <Route path="/org-register/3" element={<OrgRegister3 />} />
            <Route path="/org-register/4" element={<OrgRegister4 />} />
          </Route>
          <Route path="/org-dashboard" element={<RoleProtectedRoute allowedRoles={["OrgAdmin"]}><OrgDashboard /></RoleProtectedRoute>} />
          <Route path="/org-user-dashboard" element={<RoleProtectedRoute allowedRoles={["OrgUser"]}><OrgUserDashboard /></RoleProtectedRoute>} />
          <Route path="/volunteer-dashboard" element={<RoleProtectedRoute allowedRoles={["Volunteer"]}><VolunteerDashboard /></RoleProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
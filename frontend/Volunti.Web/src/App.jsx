import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
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
import DeskLanding from "./components/DeskLanding/DeskLanding";
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
import ComingSoonPage from "./components/placeholder/ComingSoonPage";
import SchedulePage from "./components/schedule/SchedulePage";
import AppLayout from "./components/AppLayout";
import { useState } from "react";

function AnimatedRoutes({setFontSize}) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<MarketingPage />} />
        <Route path="/organizations" element={<OrganizationsPage />} />
        <Route path="/find-missions" element={<FindMissionsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/impact" element={<ImpactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/landing" element={<LandingPage />} />
        
        <Route path="/desk-landing" element={<DeskLanding />} />
        
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route
          path="/missions"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MissionsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SettingsPage setAppFontSize={setFontSize} />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-job"
          element={
            <ProtectedRoute>
              <CreateJobForm />
            </ProtectedRoute>
          }
        />

        <Route
          element={
            <OrgRegisterProvider>
              <Outlet />
            </OrgRegisterProvider>
          }
        >
          <Route path="/org-register/1" element={<OrgRegister1 />} />
          <Route path="/org-register/2" element={<OrgRegister2 />} />
          <Route path="/org-register/3" element={<OrgRegister3 />} />
          <Route path="/org-register/4" element={<OrgRegister4 />} />
        </Route>
        <Route
          path="/org-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["OrgAdmin"]}>
              <OrgDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/org-user-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["OrgUser"]}>
              <OrgUserDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/volunteer-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["Volunteer"]}>
              <VolunteerDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ComingSoonPage
                  title="Meddelanden"
                  description="Här kommer du snart kunna chatta direkt med organisationer du arbetar med."
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SchedulePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ComingSoonPage
                  title="Skapa inlägg"
                  description="Här kommer du snart kunna lägga ut inlägg i nätverkstaben."
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  const [fontSize, setFontSize] = useState(
    localStorage.getItem("fontSize") || "medium"
  );
  document.documentElement.className = `font-${fontSize}`;
  return (
    <BrowserRouter>
      <div className="app-container">
        <ScrollToTop />
        <AnimatedRoutes setFontSize={setFontSize}/>
      </div>
    </BrowserRouter>
  );
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyJobs,
  getMyApplications,
  updateApplicationStatus,
} from "../../services/jobService";
import "./OrgDashboard.css";
import { clearSession, inviteOrgMember } from "../../services/authService";
import "../missions/MissionModal.css";


// OrgAdmin Dashboard - full kontroll: publicera uppdrag, godkänn/avvisa ansökningar
export default function OrgDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePassword, setInvitePassword] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [jobsData, applicationsData] = await Promise.all([
        getMyJobs(),
        getMyApplications("Pending"),
      ]);
      setJobs(jobsData);
      setApplications(applicationsData);
      setError(null);
    } catch (err) {
      console.error("Fel vid hämtning av dashboard-data:", err);
      setError("Kunde inte ladda dashboarden. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationDecision = async (applicationId, decision) => {
    try {
      await updateApplicationStatus(applicationId, decision);
      await loadDashboardData();
    } catch (err) {
      console.error("Fel vid uppdatering av ansökan:", err);
      alert("Kunde inte uppdatera ansökan. Försök igen.");
    }
  };

  const handleInvite = async () => {
    try {
      await inviteOrgMember(inviteEmail, invitePassword);
      setShowInviteModal(false);
      setInviteEmail("");
      setInvitePassword("");
      alert("Medarbetare tillagd!");
    } catch (err) {
      alert("Kunde inte bjuda in medarbetare. Försök igen.");
    }
  };

  if (loading) {
    return (
      <div className="org-dashboard-wrapper">
        <p className="org-dashboard-message">Laddar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="org-dashboard-wrapper">
        <p className="org-dashboard-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="org-dashboard-wrapper">
      {/* NAV HÄR */}
      <div className="org-dashboard-nav">
        <h1
          className="org-dashboard-logo"
          onClick={() => navigate("/org-dashboard")}
          style={{ cursor: "pointer" }}
        >
          VOLUNTI
        </h1>

        <div className="org-dashboard-nav-icons">
          <button
            className="icon-btn"
            aria-label="Logga ut"
            onClick={() => {
              clearSession();
              navigate("/landing");
            }}
          >
            Logga ut
          </button>
        </div>
      </div>
      <div className="org-dashboard-card">
        <h1 className="org-dashboard-title">Adminpanel</h1>
        <p className="org-dashboard-subtitle">
          Hantera era uppdrag och ansökningar.
        </p>

        {/* Sektion 0: Medarbetare */}
        <section className="org-dashboard-section">
          <div className="org-dashboard-section-header">
            <h2 className="org-dashboard-section-title">Medarbetare</h2>
            <button
              className="btn-primary"
              onClick={() => setShowInviteModal(true)}
            >
              + Bjud in medarbetare
            </button>
          </div>
        </section>

        {/* Sektion 1: Publicerade uppdrag */}
        <section className="org-dashboard-section">
          <div className="org-dashboard-section-header">
            <h2 className="org-dashboard-section-title">
              Publicerade uppdrag ({jobs.length})
            </h2>
            <button
              className="btn-primary"
              onClick={() => navigate("/create-job")}
            >
              + Publicera nytt uppdrag
            </button>
          </div>

          {jobs.length === 0 ? (
            <p className="org-dashboard-empty">Inga uppdrag publicerade än.</p>
          ) : (
            <ul className="org-dashboard-list">
              {jobs.map((job) => (
                <li key={job.jobId} className="org-dashboard-job-item">
                  <div>
                    <h3 className="org-dashboard-item-title">{job.title}</h3>
                    <p className="org-dashboard-item-meta">
                      {job.city} · {job.category} · {job.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Sektion 2: Ansökningar att hantera */}
        <section className="org-dashboard-section">
          <h2 className="org-dashboard-section-title">
            Ansökningar att hantera ({applications.length})
          </h2>

          {applications.length === 0 ? (
            <p className="org-dashboard-empty">Inga väntande ansökningar.</p>
          ) : (
            <ul className="org-dashboard-list">
              {applications.map((app) => (
                <li key={app.applicationId} className="org-dashboard-app-item">
                  <div className="org-dashboard-app-info">
                    <h3 className="org-dashboard-item-title">
                      {app.volunteerName}
                    </h3>
                    <p className="org-dashboard-item-meta">
                      Sökt: {app.jobTitle}
                    </p>
                  </div>
                  <div className="org-dashboard-app-actions">
                    <button
                      className="btn-outline-blue"
                      onClick={() =>
                        handleApplicationDecision(app.applicationId, "Rejected")
                      }
                    >
                      Avvisa
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() =>
                        handleApplicationDecision(app.applicationId, "Approved")
                      }
                    >
                      Godkänn
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {showInviteModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowInviteModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <h2>Bjud in medarbetare</h2>

              <input
                type="email"
                className="text-input"
                placeholder="E-postadress"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />

              <input
                type="password"
                className="text-input"
                placeholder="Lösenord"
                value={invitePassword}
                onChange={(e) => setInvitePassword(e.target.value)}
              />

              <div className="modal-actions">
                <button className="btn-primary" onClick={handleInvite}>
                  Bjud in
                </button>
                <button
                  className="btn-outline-blue"
                  onClick={() => setShowInviteModal(false)}
                >
                  Avbryt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyJobs,
  getMyApplications,
  updateApplicationStatus,
} from "../../services/jobService";
import "./OrgDashboard.css";

// OrgAdmin Dashboard - full kontroll: publicera uppdrag, godkänn/avvisa ansökningar
export default function OrgDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="org-dashboard-card">
        <h1 className="org-dashboard-title">Adminpanel</h1>
        <p className="org-dashboard-subtitle">
          Hantera era uppdrag och ansökningar.
        </p>

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
            <p className="org-dashboard-empty">
              Inga uppdrag publicerade än.
            </p>
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
    </div>
  );
}
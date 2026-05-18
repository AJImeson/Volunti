import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyJobs, getMyApplications } from "../../services/jobService";
import "./OrgDashboard.css";
import { clearSession } from "../../services/authService";

// OrgUser Dashboard - kan publicera uppdrag men INTE godkänna/avvisa ansökningar
export default function OrgUserDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
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
      setError("Kunde inte ladda dashboarden. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="org-dashboard-wrapper"><p className="org-dashboard-message">Laddar...</p></div>;
  if (error) return <div className="org-dashboard-wrapper"><p className="org-dashboard-error">{error}</p></div>;

  return (
    <div className="org-dashboard-wrapper">
       {/* NAV HÄR */}
            <div className="org-dashboard-nav">
              <h1
                className="org-dashboard-logo"
                onClick={() => navigate("/org-user-dashboard")}
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
        <h1 className="org-dashboard-title">Medarbetarpanel</h1>
        <p className="org-dashboard-subtitle">Översikt över organisationens uppdrag och pågående ansökningar.</p>

        <section className="org-dashboard-section">
          <div className="org-dashboard-section-header">
            <h2 className="org-dashboard-section-title">Organisationens uppdrag ({jobs.length})</h2>
            <button className="btn-primary" onClick={() => navigate("/create-job")}>+ Publicera nytt uppdrag</button>
          </div>
          {jobs.length === 0 ? (
            <p className="org-dashboard-empty">Inga uppdrag publicerade än.</p>
          ) : (
            <ul className="org-dashboard-list">
              {jobs.map((job) => (
                <li key={job.jobId} className="org-dashboard-job-item">
                  <h3 className="org-dashboard-item-title">{job.title}</h3>
                  <p className="org-dashboard-item-meta">{job.city} · {job.category} · {job.status}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="org-dashboard-section">
          <h2 className="org-dashboard-section-title">Väntande ansökningar ({applications.length})</h2>
          <p className="org-dashboard-info-note">Endast administratörer kan godkänna eller avvisa ansökningar.</p>
          {applications.length === 0 ? (
            <p className="org-dashboard-empty">Inga väntande ansökningar.</p>
          ) : (
            <ul className="org-dashboard-list">
              {applications.map((app) => (
                <li key={app.applicationId} className="org-dashboard-app-item">
                  <div className="org-dashboard-app-info">
                    <h3 className="org-dashboard-item-title">{app.volunteerName}</h3>
                    <p className="org-dashboard-item-meta">Sökt: {app.jobTitle} · Väntar på beslut</p>
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
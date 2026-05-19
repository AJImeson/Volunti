import "./VolunteerDashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMyApplications } from "../../services/authService";

export default function VolunteerDashboard() {

  const navigate = useNavigate();
  

  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const loadApplications = async () => {
    try {
      const data = await fetchMyApplications();
      setApplications(data);
      setIsLoading(false);
    } catch (error) {
      setError("Could not load applications.");
      setIsLoading(false);
    }
  };

  loadApplications();
}, []);

  return (
    <div className="volunteer-dashboard-wrapper">

      <div className="volunteer-dashboard-nav">

        <h1
          className="volunteer-dashboard-logo"
          onClick={() => navigate("/volunteer-dashboard")}
        >
          Volunti
        </h1>

        <div className="volunteer-dashboard-nav-buttons">

          <button onClick={() => navigate("/missions")}>
            Missions
          </button>

          <button onClick={() => navigate("/profile")}>
            Profile
          </button>

          <button onClick={() => navigate("/settings")}>
            Settings
          </button>

        </div>

      </div>

      <div className="volunteer-dashboard-card">

        <h1 className="volunteer-dashboard-title">
          My Applications
        </h1>

        <div className="volunteer-dashboard-list">

          {isLoading && <p>Loading applications...</p>}
          {error && <p>{error}</p>}
          {!isLoading && applications.length === 0 && (
            <p>No applications yet.</p>
          )}

          {!isLoading && applications.map((app) => (
            <div key={app.applicationId} className="volunteer-dashboard-item">

              <h3>{app.jobTitle}</h3>

              <span className={`status-badge ${app.status.toLowerCase()}`}>
                {app.status}
              </span>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
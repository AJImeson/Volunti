import "./VolunteerDashboard.css";
import { useNavigate } from "react-router-dom";

export default function VolunteerDashboard() {

  const navigate = useNavigate();

  const applications = [
    {
      id: 1,
      title: "Läxhjälp för ungdomar",
      organization: "Röda korset",
      status: "Pending"
    },

    {
      id: 2,
      title: "Hjälp till vid lokal strandstädning",
      organization: "Svenska kyrkan",
      status: "Approved"
    },

    {
      id: 3,
      title: "Matutdelning till behövande",
      organization: "Stadsmissionen",
      status: "Rejected"
    },
  ];

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

          {applications.map((app) => (
            <div key={app.id} className="volunteer-dashboard-item">

              <h3>{app.title}</h3>

              <p>{app.organization}</p>

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
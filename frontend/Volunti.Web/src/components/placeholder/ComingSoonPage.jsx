import { useNavigate } from "react-router-dom";
import BottomNav from "../bottomnav/BottomNav";
import "./ComingSoonPage.css";

export default function ComingSoonPage({ title, description }) {
  const navigate = useNavigate();

  return (
    <div className="coming-soon-wrapper">
      <div className="coming-soon-nav">
        <h1
          className="coming-soon-logo"
          onClick={() => navigate("/missions")}
          style={{ cursor: "pointer" }}
        >
          VOLUNTI
        </h1>
      </div>

      <div className="coming-soon-content">
        <div className="coming-soon-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h2 className="coming-soon-title">{title}</h2>
        <p className="coming-soon-desc">{description}</p>
        <p className="coming-soon-meta">Kommer snart!</p>
      </div>

      <BottomNav />
    </div>
  );
}

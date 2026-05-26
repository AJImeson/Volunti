import { useNavigate, useLocation } from "react-router-dom";
import "./BottomNav.css";
import { useUnreadCount } from "../../hooks/useUnreadCount";
import { isOrgUser } from "../../services/authService";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = useUnreadCount();
  const isOrg = isOrgUser();

  const isActive = (path) => location.pathname === path;

  const homePath = isOrg ? "/org-dashboard" : "/missions";
  const profilePath = isOrg ? "/org-profile" : "/profile";

  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav-btn ${isActive(homePath) ? "active" : ""}`}
        onClick={() => navigate(homePath)}
        aria-label="Hem"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Hem</span>
      </button>

      <button
        className={`bottom-nav-btn ${isActive("/messages") ? "active" : ""}`}
        onClick={() => navigate("/messages")}
        aria-label="Meddelanden"
      >
        <div className="bottom-nav-icon-wrap">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {unreadCount > 0 && (
            <span className="bottom-nav-badge">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
        <span>Meddelanden</span>
      </button>

      <button
        className="bottom-nav-plus"
        onClick={() => navigate("/create-post")}
        aria-label="Skapa inlägg"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {
        <button
          className={`bottom-nav-btn ${isActive("/schedule") ? "active" : ""}`}
          onClick={() => navigate("/schedule")}
          aria-label="Schema"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Schema</span>
        </button>
      }

      <button
        className={`bottom-nav-btn ${isActive(profilePath) ? "active" : ""}`}
        onClick={() => navigate(profilePath)}
        aria-label="Profil"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Profil</span>
      </button>
    </nav>
  );
}

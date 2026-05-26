import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { useUnreadCount } from "../../hooks/useUnreadCount";
import {
  clearSession,
  getCurrentUser,
  getProfileImageUrl,
  isOrgUser,
} from "../../services/authService";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const unreadCount = useUnreadCount();

  const isOrg = isOrgUser();
  const profilePath = isOrg ? "/org-profile" : "/profile";
  const homePath = isOrg ? "/org-dashboard" : "/missions";
  const roleLabel = isOrg ? "Organisation" : "Volontär";

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("volunti_sidebar_collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("volunti_sidebar_collapsed", collapsed);
    document.body.classList.toggle("sidebar-collapsed", collapsed);
    return () => document.body.classList.remove("sidebar-collapsed");
  }, [collapsed]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    clearSession();
    navigate("/landing");
  };

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName
    : "";

  const navItems = [
    {
      path: homePath,
      label: "Hem",
      icon: (
        <>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </>
      ),
    },
    {
      path: "/messages",
      label: "Meddelanden",
      badge: unreadCount,
      icon: (
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      ),
    },
    {
      path: "/schedule",
      label: "Schema",
      icon: (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </>
      ),
    },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Öppna meny" : "Stäng meny"}
        title={collapsed ? "Öppna meny" : "Stäng meny"}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {collapsed ? (
            <polyline points="9 18 15 12 9 6" />
          ) : (
            <polyline points="15 18 9 12 15 6" />
          )}
        </svg>
      </button>

      <div className="sidebar-top">
        <h1 className="sidebar-logo" onClick={() => navigate(homePath)}>
          {collapsed ? "V" : "VOLUNTI"}
        </h1>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`sidebar-link ${isActive(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : ""}
            >
              <div className="sidebar-link-icon-wrap">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {item.icon}
                </svg>
                {item.badge > 0 && (
                  <span className="sidebar-link-badge">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </button>
          ))}

          <button
            className="sidebar-link sidebar-link-accent"
            onClick={() => navigate("/create-post")}
            title={collapsed ? "Skapa inlägg" : ""}
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
            <span>Skapa inlägg</span>
          </button>
        </nav>
      </div>

      <div className="sidebar-bottom">
        {user && (
          <div
            className="sidebar-user"
            onClick={() => navigate(profilePath)}
            title={collapsed ? fullName : ""}
          >
            <div className="sidebar-avatar">
              {user.profileImageUrl ? (
                <img src={getProfileImageUrl(user.profileImageUrl)} alt="" />
              ) : (
                <span>{fullName.charAt(0)?.toUpperCase() || "?"}</span>
              )}
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{fullName}</p>
              <p className="sidebar-user-role">{roleLabel}</p>
            </div>
          </div>
        )}

        <button
          className="sidebar-link sidebar-link-muted"
          onClick={() => navigate("/settings")}
          title={collapsed ? "Inställningar" : ""}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Inställningar</span>
        </button>

        <button
          className="sidebar-link sidebar-logout"
          onClick={handleLogout}
          title={collapsed ? "Logga ut" : ""}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logga ut</span>
        </button>
      </div>
    </aside>
  );
}

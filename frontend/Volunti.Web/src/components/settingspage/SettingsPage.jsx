import React, { useState } from "react";
import "./SettingsPage.css";
import { useNavigate } from "react-router-dom";

/* ==========================================================================
   IKONKOMPONENT
   ========================================================================== */
function Icon({ name, size = 20, className = "" }) {
  const paths = {
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    home: (
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
    lock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    type: (
      <>
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </>
    ),
    trash: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      </>
    ),
    folder: (
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    ),
    chat: (
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    ),
    heart: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
    edit: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
    chevronRight: <polyline points="9 18 15 12 9 6" />,
    chevronLeft: <polyline points="15 18 9 12 15 6" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

/* ==========================================================================
   TOPP NAV 
   ========================================================================== */
function SettingsTopNav() {
  const navigate = useNavigate();
  return (
    <div className="settings-top-nav">
      <h1 className="settings-logo">VOLUNTI</h1>
      <div className="settings-nav-icons">
        <button
          className="icon-btn"
          aria-label="Profil"
          onClick={() => navigate("/profile")}
        >
          <Icon name="user" size={24} />
        </button>
        <button
          className="icon-btn"
          aria-label="Tillbaka till uppdrag"
          onClick={() => navigate("/missions")}
        >
          <Icon name="home" size={24} />
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   HUVUDMENY
   ========================================================================== */
const MENU_ITEMS = [
  { id: "profile", icon: "user", label: "Alex Axelsson", group: 1 },
  { id: "notifications", icon: "bell", label: "Notifikationer", group: 2 },
  { id: "password", icon: "lock", label: "Lösenord", group: 2 },
  { id: "screen", icon: "type", label: "Skärm och Textstorlek", group: 2 },
  { id: "support", icon: "help", label: "Support", group: 3 },
  { id: "faq", icon: "info", label: "FAQ", group: 3 },
  {
    id: "delete",
    icon: "trash",
    label: "Radera konto",
    group: 4,
    danger: true,
  },
];

function SettingsMenu({ onNavigate }) {
  const groups = MENU_ITEMS.reduce((acc, item) => {
    const last = acc[acc.length - 1];
    if (last && last[0].group === item.group) {
      last.push(item);
    } else {
      acc.push([item]);
    }
    return acc;
  }, []);

  return (
    <div className="settings-menu">
      {groups.map((group, gi) => (
        <div key={gi} className="settings-menu-group">
          {group.map((item) => (
            <button
              key={item.id}
              className={`settings-menu-item ${item.danger ? "danger" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon name={item.icon} />
              <span className="settings-menu-label">{item.label}</span>
              <Icon name="chevronRight" />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ==========================================================================
   NOTIFIKATIONER
   ========================================================================== */
const FEATURE_MAP = {
  uppdrag: { icon: "folder", text: "Uppdrag" },
  paminnelser: { icon: "bell", text: "Påminnelser" },
  viktiga: { icon: "info", text: "Viktiga uppdateringar" },
  utvalda: { icon: "chat", text: "Utvalda inlägg i community" },
  alla: { icon: "info", text: "Alla uppdateringar" },
  nya: { icon: "edit", text: "Nya inlägg i communityn" },
  likes: { icon: "heart", text: "Likes & Kommentarer" },
};

const NOTIFICATION_OPTIONS = [
  {
    id: "recommended",
    section: "Rekommenderat",
    title: "Lagom med notiser som passar dig",
    features: ["uppdrag", "paminnelser", "viktiga", "utvalda"],
  },
  {
    id: "minimal",
    section: "Minimalt",
    title: "Endast det viktigaste",
    features: ["uppdrag", "paminnelser", "viktiga"],
  },
  {
    id: "all",
    section: "Allt",
    title: "Alla notiser och aktiviteter",
    features: ["uppdrag", "paminnelser", "alla", "nya", "likes"],
  },
];

function NotificationSettings() {
  const [selected, setSelected] = useState("recommended");
  const [emailNotify, setEmailNotify] = useState("no");

  return (
    <>
      {NOTIFICATION_OPTIONS.map((opt) => (
        <div key={opt.id} className="notification-section">
          <span className="notification-label">{opt.section}</span>
          <div
            className={`notification-card ${selected === opt.id ? "active" : ""}`}
            onClick={() => setSelected(opt.id)}
          >
            <div className="card-header">
              <input
                type="radio"
                checked={selected === opt.id}
                onChange={() => setSelected(opt.id)}
                style={{ accentColor: "var(--primary-blue)" }}
              />
              <p className="card-title">{opt.title}</p>
            </div>
            <div className="card-features">
              {opt.features.map((fkey) => {
                const f = FEATURE_MAP[fkey];
                return (
                  <div key={fkey} className="feature-item">
                    <Icon name={f.icon} size={16} className="feature-icon" />
                    {f.text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      <div className="email-notify-section">
        <p className="form-section-title">Vill du bli notifierad via mejl?*</p>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="email-notify"
              checked={emailNotify === "yes"}
              onChange={() => setEmailNotify("yes")}
            />
            Ja
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="email-notify"
              checked={emailNotify === "no"}
              onChange={() => setEmailNotify("no")}
            />
            Nej, enbart via appen.
          </label>
        </div>
      </div>
    </>
  );
}

/* ==========================================================================
   LÖSENORD
   ========================================================================== */
function PasswordSettings() {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    setError("");
    if (!oldPwd || !newPwd || !confirmPwd) {
      setError("Fyll i alla fält.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setError("Lösenorden matchar inte.");
      return;
    }
    if (newPwd.length < 8) {
      setError("Lösenordet måste vara minst 8 tecken.");
      return;
    }
    console.log("Spara lösenord:", { oldPwd, newPwd });
    alert("Lösenord uppdaterat (mockad)");
  };

  return (
    <form className="password-form" onSubmit={handleSave}>
      {error && <div className="error-msg-box">{error}</div>}
      <input
        type="password"
        className="text-input"
        placeholder="Gamla lösenordet"
        value={oldPwd}
        onChange={(e) => setOldPwd(e.target.value)}
      />
      <input
        type="password"
        className="text-input"
        placeholder="Nya lösenordet"
        value={newPwd}
        onChange={(e) => setNewPwd(e.target.value)}
      />
      <input
        type="password"
        className="text-input"
        placeholder="Bekräfta lösenordet"
        value={confirmPwd}
        onChange={(e) => setConfirmPwd(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        Spara
      </button>
    </form>
  );
}

/* ==========================================================================
   STUB VY 
   ========================================================================== */
function StubView({ title }) {
  return (
    <div className="stub-view">
      <p>
        <strong>{title}</strong> är inte byggd än.
      </p>
      <p style={{ color: "var(--gray-text)", fontSize: "0.9rem" }}>
        Den här vyn är en placeholder — kom tillbaka när den är klar.
      </p>
    </div>
  );
}

/* ==========================================================================
   HUVUDKOMPONENT
   ========================================================================== */
const SUB_VIEW_TITLES = {
  profile: "Profil",
  notifications: "Notifikationer",
  password: "Lösenord",
  screen: "Skärm och Textstorlek",
  support: "Support",
  faq: "FAQ",
  delete: "Radera konto",
};

export default function SettingsPage() {
  const [subView, setSubView] = useState("menu");

  const isMenu = subView === "menu";
  const headerTitle = isMenu ? "Inställningar" : SUB_VIEW_TITLES[subView];

  const renderSubView = () => {
    switch (subView) {
      case "menu":
        return <SettingsMenu onNavigate={setSubView} />;
      case "notifications":
        return <NotificationSettings />;
      case "password":
        return <PasswordSettings />;
      default:
        return <StubView title={SUB_VIEW_TITLES[subView]} />;
    }
  };

  return (
    <div className="settings-wrapper">
      <SettingsTopNav />

      <div className="settings-blue-header">
        {!isMenu && (
          <button
            className="settings-back-btn"
            onClick={() => setSubView("menu")}
          >
            <Icon name="chevronLeft" size={18} />
            <span>Tillbaka</span>
          </button>
        )}
        <h2 className="settings-title">{headerTitle}</h2>
      </div>

      <div className="settings-content">{renderSubView()}</div>
    </div>
  );
}

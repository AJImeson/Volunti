import React, { useEffect } from "react";
import "./MissionModal.css";

/* ==========================================================================
   BAS MODAL
   ========================================================================== */
function ModalShell({ onClose, children }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/* ==========================================================================
   MISSION KORT
   ========================================================================== */
function MissionCard({ mission, compact = false }) {
  return (
    <div className={`mission-card ${compact ? "compact" : ""}`}>
      <div className="mission-card-header">
        <div className="mission-org-avatar"></div>
        <div className="mission-org-info">
          <p className="mission-org-name">{mission.organization}</p>
          <p className="mission-org-time">{mission.timeAgo}</p>
        </div>
      </div>

      <div className="mission-meta-list">
        <div className="mission-meta-item">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>{mission.arrangor}</span>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginLeft: "auto" }}
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{mission.plats}</span>
        </div>
        <div className="mission-meta-item">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
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
          <span>{mission.datum?.split(" kl.")[0] || "19 Maj"}</span>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginLeft: "auto" }}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{mission.datum?.split("kl. ")[1] || "12:00-15:00"}</span>
        </div>
      </div>

      <div className="mission-tags">
        <span className="mission-tag">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V15a1 1 0 0 0 1 1h2" />
            <circle cx="6.5" cy="16.5" r="2.5" />
            <circle cx="16.5" cy="16.5" r="2.5" />
          </svg>
          Bil
        </span>
      </div>

      {!compact && <p className="mission-description">{mission.description}</p>}

      {!compact && (
        <div className="mission-likes-row">
          <span className="mission-likes-text">
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="currentColor"
              style={{ marginRight: "0.3rem", verticalAlign: "middle" }}
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            {mission.likedBy}
          </span>
          <span className="mission-comments-text">
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "0.3rem", verticalAlign: "middle" }}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {mission.comments}
          </span>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   "VISA" MODAL med Acceptera/Avbryt knappar
   ========================================================================== */
export function MissionDetailsModal({ mission, onClose, onAccept }) {
  if (!mission) return null;

  return (
    <ModalShell onClose={onClose}>
      <div className="modal-blue-header">
        <button className="modal-back-btn" onClick={onClose}>
          ‹ Tillbaka
        </button>
        <h2 className="modal-title">Inlägg</h2>
      </div>

      <div className="modal-body">
        <MissionCard mission={mission} />

        <div className="modal-actions">
          <button
            className="btn-primary"
            onClick={() => {
              onAccept(mission);
              onClose();
            }}
          >
            Acceptera
          </button>
          <button className="btn-outline-blue" onClick={onClose}>
            Avbryt
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ==========================================================================
   "ACCEPTERA" MODAL  bekräftelse 
   ========================================================================== */
export function MissionAcceptedModal({ mission, onClose, onContact }) {
  if (!mission) return null;

  return (
    <ModalShell onClose={onClose}>
      <div className="modal-thanks-section">
        <h2 className="modal-thanks-title">Tack för din hjälp!</h2>
      </div>

      <div className="modal-body">
        <MissionCard mission={mission} compact />

        <div className="modal-actions">
          <button
            className="btn-primary"
            onClick={() => {
              onContact?.(mission);
              onClose();
            }}
          >
            Kontakt
          </button>
          <button className="btn-outline-blue" onClick={onClose}>
            Tillbaka till flödet
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

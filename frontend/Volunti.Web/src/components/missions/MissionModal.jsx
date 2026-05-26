import React, { useEffect } from "react";
import "./MissionModal.css";
import { getProfileImageUrl } from "../../services/authService";

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
   FORMATERING
   ========================================================================== */
function formatDateShort(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
  });
}

function formatTimeOnly(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ==========================================================================
   MISSION KORT
   ========================================================================== */
function MissionCard({ mission, interaction, compact = false }) {
  const cityOnly = mission.plats?.split(",")[0]?.trim() || "—";
  const startDate = mission._startTime;
  const endDate = mission._endTime;

  return (
    <div className={`mission-card ${compact ? "compact" : ""}`}>
      <div className="mission-card-header">
        <div className="mission-org-avatar">
          {mission.organizationImageUrl && (
            <img
              src={getProfileImageUrl(mission.organizationImageUrl)}
              alt={mission.organization}
            />
          )}
        </div>
        <div className="mission-org-info">
          <p className="mission-org-name">{mission.organization}</p>
          <p className="mission-org-time">{mission.timeAgo}</p>
        </div>
      </div>

      <h3 className="mission-card-title">{mission.title}</h3>

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
          <span>{cityOnly}</span>
        </div>

        {startDate && (
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
            <span>{formatDateShort(startDate)}</span>
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
            <span>
              {formatTimeOnly(startDate)}-{formatTimeOnly(endDate)}
            </span>
          </div>
        )}
      </div>

      {mission.category && (
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
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            {mission.category}
          </span>
        </div>
      )}

      {!compact && <p className="mission-description">{mission.description}</p>}

      {!compact && (
        <div className="mission-likes-row">
          <span
            className={`mission-likes-text ${interaction?.likedByMe ? "liked" : ""}`}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill={interaction?.likedByMe ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {interaction?.likes || 0}
          </span>
          <span className="mission-comments-text">
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {interaction?.comments || 0} Kommentarer
          </span>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   "VISA" MODAL med Acceptera/Avbryt knappar
   ========================================================================== */
export function MissionDetailsModal({
  mission,
  onClose,
  onAccept,
  interaction,
  hasApplied,
}) {
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
        <MissionCard mission={mission} interaction={interaction} />

        <div className="modal-actions">
          {hasApplied ? (
            <button className="btn-applied" disabled>
              ✓ Ansökt
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={() => {
                onAccept(mission);
                onClose();
              }}
            >
              Acceptera
            </button>
          )}
          <button className="btn-outline-blue" onClick={onClose}>
            Avbryt
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ==========================================================================
   "ACCEPTERA" MODAL bekräftelse
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

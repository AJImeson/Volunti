import React, { useState, useEffect } from "react";
import "./GranskaModal.css";
import {
  getJobApplications,
  bulkApproveApplications,
} from "../../services/jobService";
import { getProfileImageUrl } from "../../services/authService";

export default function GranskaModal({
  jobId,
  onClose,
  onApproved,
  onOpenProfile,
}) {
  const [applications, setApplications] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getJobApplications(jobId)
      .then((data) => {
        if (cancelled) return;
        setApplications(data.filter((a) => a.status === "Pending"));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError("Kunde inte ladda ansökningar.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSend = async () => {
    if (selectedIds.size === 0) return;
    setIsSending(true);
    setError("");
    try {
      await bulkApproveApplications(Array.from(selectedIds));
      onApproved?.();
    } catch (err) {
      console.error(err);
      setError("Kunde inte godkänna. Försök igen.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="granska-overlay" onClick={onClose}>
      <div className="granska-modal" onClick={(e) => e.stopPropagation()}>
        <div className="granska-header">
          <button
            className="granska-close"
            onClick={onClose}
            aria-label="Stäng"
          >
            ×
          </button>
          <h3>Välj volontärer</h3>
          <span className="granska-counter">
            {selectedIds.size} / {applications.length} valda
          </span>
        </div>

        <div className="granska-body">
          {isLoading && <p className="granska-status">Laddar...</p>}
          {error && <p className="granska-status granska-error">{error}</p>}
          {!isLoading && applications.length === 0 && (
            <p className="granska-status">
              Inga väntande ansökningar för detta uppdrag.
            </p>
          )}

          <ul className="granska-list">
            {applications.map((app) => (
              <li key={app.applicationId} className="granska-item">
                <label className="granska-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(app.applicationId)}
                    onChange={() => toggleSelect(app.applicationId)}
                  />
                  <span className="granska-checkmark"></span>
                </label>

                <div className="granska-avatar">
                  {app.volunteerImageUrl ? (
                    <img
                      src={getProfileImageUrl(app.volunteerImageUrl)}
                      alt=""
                    />
                  ) : (
                    <span>
                      {(app.volunteerName?.charAt(0) || "?").toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="granska-info">
                  <p className="granska-name">{app.volunteerName}</p>
                  {app.isPreviousVolunteer && (
                    <span className="granska-badge">Tidigare volontär</span>
                  )}
                </div>

                <button
                  className="granska-open-profile"
                  onClick={() => onOpenProfile(app.volunteerId)}
                  aria-label="Visa profil"
                >
                  ›
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="granska-footer">
          <button
            className="granska-btn-send"
            onClick={handleSend}
            disabled={selectedIds.size === 0 || isSending}
          >
            {isSending ? "Skickar..." : "Skicka"}
          </button>
          <button
            className="granska-btn-cancel"
            onClick={onClose}
            disabled={isSending}
          >
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
}

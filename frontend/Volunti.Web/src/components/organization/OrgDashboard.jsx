import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../missions/MissionsPage.css";
import "./OrgDashboard.css";
import { getMyJobs, deleteJob } from "../../services/jobService";
import {
  fetchCurrentOrganization,
  getProfileImageUrl,
} from "../../services/authService";
import GranskaModal from "./GranskaModal";
import VolunteerProfileModal from "./VolunteerProfileModal";
import BottomNav from "../bottomnav/BottomNav";

export default function OrgDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [granskaJobId, setGranskaJobId] = useState(null);
  const [profileVolunteerId, setProfileVolunteerId] = useState(null);

  const loadData = async () => {
    try {
      const [jobsData, orgData] = await Promise.all([
        getMyJobs(),
        fetchCurrentOrganization().catch(() => null),
      ]);
      setJobs(jobsData);
      setOrganization(orgData);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Kunde inte ladda dashboarden. Försök igen.");
    }
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([getMyJobs(), fetchCurrentOrganization().catch(() => null)])
      .then(([jobsData, orgData]) => {
        if (cancelled) return;
        setJobs(jobsData);
        setOrganization(orgData);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError("Kunde inte ladda dashboarden. Försök igen.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Är du säker på att du vill ta bort uppdraget?")) {
      return;
    }
    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.jobId !== jobId));
    } catch (err) {
      console.error(err);
      alert("Kunde inte ta bort uppdraget.");
    }
  };

  const filteredJobs = jobs.filter((j) =>
    j.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="missions-wrapper">
      {/* TOPPMENY */}
      <div className="missions-top-nav">
        <h1 className="missions-logo">VOLUNTI</h1>
      </div>

      {/* SÖKFÄLT */}
      <div className="missions-search-section">
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Sök bland uppdrag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* RUBRIK + SKAPA */}
      <div className="orgdash-header-bar">
        <h2 className="orgdash-title">Dina uppdrag</h2>
        <button
          className="orgdash-create-btn"
          onClick={() => navigate("/create-job")}
        >
          + Skapa uppdrag
        </button>
      </div>

      {/* HUVUDINNEHÅLL */}
      <div className="missions-content">
        {isLoading && (
          <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
            Laddar uppdrag...
          </p>
        )}
        {error && (
          <p style={{ textAlign: "center", color: "#d33", padding: "2rem" }}>
            {error}
          </p>
        )}
        {!isLoading && !error && jobs.length === 0 && (
          <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
            Du har inte publicerat några uppdrag än.
          </p>
        )}

        <div className="missions-feed">
          {filteredJobs.map((job) => (
            <OrgJobCard
              key={job.jobId}
              job={job}
              organization={organization}
              onGranska={() => setGranskaJobId(job.jobId)}
              onRedigera={() => navigate(`/edit-job/${job.jobId}`)}
              onDelete={() => handleDeleteJob(job.jobId)}
            />
          ))}
        </div>
      </div>

      {granskaJobId && (
        <GranskaModal
          jobId={granskaJobId}
          onClose={() => setGranskaJobId(null)}
          onApproved={() => {
            setGranskaJobId(null);
            loadData();
          }}
          onOpenProfile={(volunteerId) => setProfileVolunteerId(volunteerId)}
        />
      )}

      {profileVolunteerId && (
        <VolunteerProfileModal
          volunteerId={profileVolunteerId}
          onClose={() => setProfileVolunteerId(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}

/* ==========================================================================
   JOB CARD - samma stil som FeedCard på MissionsPage
   ========================================================================== */
function OrgJobCard({ job, organization, onGranska, onRedigera, onDelete }) {
  const fmtDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "short",
    });
  };

  const fmtTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="feed-card">
      {/* Header */}
      <div className="feed-card-header">
        <div className="org-avatar">
          {organization?.profileImageUrl ? (
            <img
              src={getProfileImageUrl(organization.profileImageUrl)}
              alt={organization?.orgName || ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "var(--primary-blue)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              {(organization?.orgName?.charAt(0) || "?").toUpperCase()}
            </div>
          )}
        </div>
        <div className="org-info">
          <p className="org-name">{organization?.orgName || "Organisation"}</p>
          <p className="org-time">{formatTimeAgo(job.createdOn)}</p>
        </div>
        <button
          className="orgdash-delete-btn"
          onClick={onDelete}
          title="Ta bort uppdrag"
          aria-label="Ta bort uppdrag"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>

      {/* Titel + beskrivning */}
      <div className="feed-card-body">
        <h3 className="feed-title">{job.title}</h3>
        {job.description && (
          <p className="feed-description">{job.description}</p>
        )}

        {/* Meta */}
        <div className="feed-meta">
          <div className="meta-row">
            <div className="meta-item">
              <LocationIcon />
              <span>{job.city || "—"}</span>
            </div>
          </div>
          {job.startTime && (
            <div className="meta-row">
              <div className="meta-item">
                <CalendarIcon />
                <span>{fmtDate(job.startTime)}</span>
              </div>
              <div className="meta-item">
                <ClockIcon />
                <span>
                  {fmtTime(job.startTime)}-{fmtTime(job.endTime)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Kategori-pill */}
        {job.category && (
          <div className="feed-pills">
            <span className="feed-pill">
              <CategoryIcon />
              {job.category}
            </span>
          </div>
        )}

        {/* Knappar */}
        <div className="feed-actions">
          <button className="btn-primary" onClick={onGranska}>
            Granska
          </button>
          <button className="btn-outline-blue" onClick={onRedigera}>
            Redigera
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   IKONER + HJÄLPARE
   ========================================================================== */
function LocationIcon() {
  return (
    <svg
      className="meta-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="meta-icon"
      width="16"
      height="16"
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
  );
}

function ClockIcon() {
  return (
    <svg
      className="meta-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return "";
  const diffMin = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 60000,
  );
  if (diffMin < 1) return "nyss";
  if (diffMin < 60) return `${diffMin} min sen`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} tim sen`;
  return `${Math.floor(diffH / 24)} dagar sen`;
}

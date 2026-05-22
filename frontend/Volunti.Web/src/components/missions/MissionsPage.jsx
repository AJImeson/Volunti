import React, { useState, useEffect } from "react";
import "./MissionsPage.css";
import { MissionDetailsModal, MissionAcceptedModal } from "./MissionModal";
import { getProfileImageUrl } from "../../services/authService";
import BottomNav from "../bottomnav/BottomNav";
import CommentModal from "./CommentModal";
import {
  fetchAllJobs,
  applyToJob,
  getMyApplicationsAsVolunteer,
  toggleJobLike,
  getJobLikes,
} from "../../services/jobService";

// Konvertera Job från backend till mission format
function jobToMission(job) {
  const fmtTime = (date) =>
    new Date(date).toLocaleString("sv-SE", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return {
    id: job.jobId,
    organization: "Organisation",
    organizationImageUrl: job.organization?.profileImageUrl || null,
    timeAgo: formatRelativeTime(job.createdOn),
    title: job.title,
    description: job.description || "Ingen beskrivning angiven.",
    arrangor: "Arrangör",
    plats: [job.city, job.address].filter(Boolean).join(", ") || "Ej angivet",
    datum: `${fmtTime(job.startTime)} – ${fmtTime(job.endTime)}`,
    _startTime: job.startTime,
    _endTime: job.endTime,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
    likes: 0,
    likedBy: "",
    comments: 0,
    isUrgent: job.isUrgent,
    category: job.category,
  };
}

function formatRelativeTime(dateStr) {
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

export default function MissionsPage() {
  const [viewMode, setViewMode] = useState("feed");
  const [searchQuery, setSearchQuery] = useState("");

  const [activeModal, setActiveModal] = useState(null);
  const [activeMission, setActiveMission] = useState(null);

  const [missions, setMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [applyError, setApplyError] = useState("");

  const [activeTab, setActiveTab] = useState("uppdrag");
  const [applications, setApplications] = useState([]);
  const [isLoadingApps, setIsLoadingApps] = useState(true);
  const [appsError, setAppsError] = useState("");

  const [commentMission, setCommentMission] = useState(null);
  const [interactions, setInteractions] = useState({});

  useEffect(() => {
    let cancelled = false;
    fetchAllJobs()
      .then((jobs) => {
        if (cancelled) return;
        setMissions(jobs.map(jobToMission));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Kunde inte hämta jobb:", err);
        setLoadError("Kunde inte ladda uppdrag. Försök igen senare.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    getMyApplicationsAsVolunteer()
      .then((data) => {
        if (cancelled) return;
        setApplications(data);
        setAppsError("");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Kunde inte hämta ansökningar:", err);
        // Bara visa fel om vi är på ansökningstabben
        setAppsError("Kunde inte ladda dina ansökningar.");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingApps(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (missions.length === 0) return;

    let cancelled = false;
    Promise.all(
      missions.map((m) =>
        getJobLikes(m.id)
          .then((data) => ({ id: m.id, ...data }))
          .catch(() => ({ id: m.id, count: 0, likedByMe: false })),
      ),
    ).then((results) => {
      if (cancelled) return;
      const map = {};
      results.forEach((r) => {
        map[r.id] = { likes: r.count, likedByMe: r.likedByMe, comments: 0 };
      });
      setInteractions(map);
    });

    return () => {
      cancelled = true;
    };
  }, [missions]);

  const openDetails = (mission) => {
    setActiveMission(mission);
    setActiveModal("details");
  };

  const openAccepted = async (mission) => {
    setApplyError("");
    try {
      await applyToJob(mission.id);
      setApplications((prev) => [
        ...prev,
        { jobId: mission.id, status: "Pending", applicationId: Date.now() },
      ]);
      setActiveMission(mission);
      setActiveModal("accepted");
    } catch (err) {
      console.error("Ansökan misslyckades:", err);
      if (err.response?.status === 401) {
        setApplyError("Du måste vara inloggad för att ansöka.");
      } else if (err.response?.status === 403) {
        setApplyError("Endast volontärer kan ansöka till uppdrag.");
      } else if (err.response?.status === 404) {
        setApplyError("Uppdraget finns inte längre.");
      } else if (err.response?.status === 409) {
        setApplyError("Du har redan ansökt till detta uppdrag.");
      } else {
        setApplyError(
          err.response?.data?.detail || "Kunde inte skicka ansökan.",
        );
      }
      setTimeout(() => setApplyError(""), 5000);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setTimeout(() => setActiveMission(null), 300);
  };

  const handleToggleLike = async (jobId) => {
    setInteractions((prev) => {
      const current = prev[jobId] || {
        likes: 0,
        likedByMe: false,
        comments: 0,
      };
      const newLiked = !current.likedByMe;
      return {
        ...prev,
        [jobId]: {
          ...current,
          likedByMe: newLiked,
          likes: current.likes + (newLiked ? 1 : -1),
        },
      };
    });
    try {
      const result = await toggleJobLike(jobId);
      setInteractions((prev) => ({
        ...prev,
        [jobId]: {
          ...(prev[jobId] || { comments: 0 }),
          likedByMe: result.liked,
          likes: result.count,
        },
      }));
    } catch (err) {
      console.error(err);
      setInteractions((prev) => {
        const current = prev[jobId];
        if (!current) return prev;
        return {
          ...prev,
          [jobId]: {
            ...current,
            likedByMe: !current.likedByMe,
            likes: current.likes + (current.likedByMe ? 1 : -1),
          },
        };
      });
    }
  };

  const handleCommentCountChange = (jobId, newCount) => {
    setInteractions((prev) => ({
      ...prev,
      [jobId]: {
        ...(prev[jobId] || { likes: 0, likedByMe: false }),
        comments: newCount,
      },
    }));
  };

  const appliedJobIds = new Set(applications.map((a) => a.jobId));

  const filteredMissions = missions.filter(
    (mission) =>
      mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.organization.toLowerCase().includes(searchQuery.toLowerCase()),
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
            placeholder="Vad har du på hjärtat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="missions-tabs">
        <button
          className={`tab-pill ${activeTab === "uppdrag" ? "active" : ""}`}
          onClick={() => setActiveTab("uppdrag")}
        >
          Uppdrag
        </button>
        <button
          className={`tab-pill ${activeTab === "ansokningar" ? "active" : ""}`}
          onClick={() => setActiveTab("ansokningar")}
        >
          Mina ansökningar
        </button>
      </div>
      {/* HUVUDINNEHÅLL */}
      <div className="missions-content">
        <div className="tab-content-anim" key={activeTab}>
          {/* UPPDRAG TAB */}
          {activeTab === "uppdrag" && (
            <>
              {isLoading && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    padding: "2rem",
                  }}
                >
                  Laddar uppdrag...
                </p>
              )}
              {loadError && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#d33",
                    padding: "2rem",
                  }}
                >
                  {loadError}
                </p>
              )}
              {applyError && (
                <div
                  style={{
                    textAlign: "center",
                    color: "#d33",
                    padding: "0.75rem",
                    background: "#fee",
                    borderRadius: 8,
                    margin: "0 1rem 1rem 1rem",
                  }}
                >
                  {applyError}
                </div>
              )}
              {!isLoading && !loadError && missions.length === 0 && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    padding: "2rem",
                  }}
                >
                  Inga uppdrag tillgängliga just nu.
                </p>
              )}

              {viewMode === "feed" && (
                <PreviousHelpedCarousel onShowAll={() => setViewMode("list")} />
              )}

              {/* HEADER FÖR LIST VYN*/}
              {viewMode === "list" && (
                <div
                  className="section-header"
                  style={{ marginBottom: "1.5rem" }}
                >
                  <h2 className="section-title">Alla uppdrag</h2>
                  <button
                    className="section-link"
                    onClick={() => setViewMode("feed")}
                  >
                    ‹ Tillbaka
                  </button>
                </div>
              )}

              {/* MISSIONS LIST/FEED */}
              <div
                className={
                  viewMode === "feed" ? "missions-feed" : "missions-list"
                }
              >
                {filteredMissions.length === 0 ? (
                  <p className="no-missions-text">Finns inga uppdrag.</p>
                ) : (
                  filteredMissions.map((mission) =>
                    viewMode === "feed" ? (
                      <FeedCard
                        key={mission.id}
                        mission={mission}
                        onView={openDetails}
                        onAccept={openAccepted}
                        hasApplied={appliedJobIds.has(mission.id)}
                        interaction={interactions[mission.id]}
                        onToggleLike={() => handleToggleLike(mission.id)}
                        onOpenComments={() => setCommentMission(mission)}
                      />
                    ) : (
                      <ListCard
                        key={mission.id}
                        mission={mission}
                        onView={openDetails}
                        onAccept={openAccepted}
                        hasApplied={appliedJobIds.has(mission.id)}
                      />
                    ),
                  )
                )}
              </div>
            </>
          )}

          {/* MINA ANSÖKNINGAR TAB */}
          {activeTab === "ansokningar" && (
            <ApplicationsList
              applications={applications}
              isLoading={isLoadingApps}
              error={appsError}
            />
          )}
        </div>

        {activeModal === "details" && (
          <MissionDetailsModal
            mission={activeMission}
            onClose={closeModal}
            onAccept={(m) => {
              closeModal();
              setTimeout(() => openAccepted(m), 200);
            }}
          />
        )}

        {activeModal === "accepted" && (
          <MissionAcceptedModal
            mission={activeMission}
            onClose={closeModal}
            onContact={(m) => console.log("Kontakta arrangör för:", m.title)}
          />
        )}
        {commentMission && (
          <CommentModal
            mission={commentMission}
            onClose={() => setCommentMission(null)}
            onCountChange={(count) =>
              handleCommentCountChange(commentMission.id, count)
            }
          />
        )}
        <BottomNav />
      </div>
    </div>
  );
}

/* ==========================================================================
   PREVIOUS HELPED CAROUSEL
   ========================================================================== */
function PreviousHelpedCarousel({ onShowAll }) {
  const allImages = [
    "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400",
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400",
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400",
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400",
    "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=400",
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400",
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400",
    "https://images.unsplash.com/photo-1593113616828-6f22bca04804?w=400",
    "https://images.unsplash.com/photo-1497375638960-ca368c7231e4?w=400",
  ];

  const PAGES = 4;
  const PER_PAGE = 3;
  const AUTO_INTERVAL = 5000;
  const PAUSE_AFTER_INTERACTION = 8000;
  const SWIPE_THRESHOLD = 50;

  const [currentPage, setCurrentPage] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  const dragStartX = React.useRef(0);
  const viewportRef = React.useRef(null);

  // Auto scroll
  React.useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setCurrentPage((p) => (p + 1) % PAGES);
    }, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, [isPaused]);

  const pauseAutoScroll = () => {
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), PAUSE_AFTER_INTERACTION);
  };

  const handleDotClick = (index) => {
    setCurrentPage(index);
    pauseAutoScroll();
  };

  // Drag/swipe hantering
  const handleDragStart = (clientX) => {
    dragStartX.current = clientX;
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    const delta = clientX - dragStartX.current;
    setDragOffset(delta);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    if (dragOffset < -SWIPE_THRESHOLD && currentPage < PAGES - 1) {
      setCurrentPage((p) => p + 1);
    } else if (dragOffset > SWIPE_THRESHOLD && currentPage > 0) {
      setCurrentPage((p) => p - 1);
    }

    setDragOffset(0);
    setIsDragging(false);
    pauseAutoScroll();
  };

  // Touch events
  const onTouchStart = (e) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e) => handleDragMove(e.touches[0].clientX);
  const onTouchEnd = () => handleDragEnd();

  // Mouse events
  const onMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };
  const onMouseMove = (e) => handleDragMove(e.clientX);
  const onMouseUp = () => handleDragEnd();
  const onMouseLeave = () => {
    if (isDragging) handleDragEnd();
  };

  return (
    <div className="previous-section">
      <div className="section-header">
        <h2 className="section-title">Du har tidigare hjälpt</h2>
        <button className="section-link" onClick={onShowAll}>
          Visa alla
        </button>
      </div>

      <div
        className="carousel-viewport"
        ref={viewportRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div
          className="carousel-track"
          style={{
            transform: `translateX(calc(${-currentPage * 100}% + ${dragOffset}px))`,
            transition: isDragging ? "none" : "transform 0.5s ease-in-out",
          }}
        >
          {Array.from({ length: PAGES }).map((_, pageIndex) => (
            <div className="carousel-page" key={pageIndex}>
              {allImages
                .slice(pageIndex * PER_PAGE, pageIndex * PER_PAGE + PER_PAGE)
                .map((img, i) => (
                  <div
                    className="previous-card"
                    key={i}
                    style={{ backgroundImage: `url(${img})` }}
                  ></div>
                ))}
            </div>
          ))}
        </div>
      </div>

      <div className="dots-indicator">
        {Array.from({ length: PAGES }).map((_, i) => (
          <button
            key={i}
            className={`dot ${i === currentPage ? "active" : ""}`}
            onClick={() => handleDotClick(i)}
            aria-label={`Gå till sida ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   FEED CARD: stor vy
   ========================================================================== */
function FeedCard({
  mission,
  onView,
  onAccept,
  hasApplied,
  interaction,
  onToggleLike,
  onOpenComments,
}) {
  const formatDateShort = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "short",
    });
  };

  const formatTimeOnly = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Plats utan address-prefix
  const cityOnly = mission.plats?.split(",")[0]?.trim() || "—";

  // Hämta raw start/end från mission via specialfält (vi behöver tillägg)
  const startDate = mission._startTime;
  const endDate = mission._endTime;

  return (
    <div className="feed-card">
      {/* Header */}
      <div className="feed-card-header">
        <div className="org-avatar">
          {mission.organizationImageUrl && (
            <img
              src={getProfileImageUrl(mission.organizationImageUrl)}
              alt={mission.organization}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          )}
        </div>
        <div className="org-info">
          <p className="org-name">{mission.organization}</p>
          <p className="org-time">{mission.timeAgo}</p>
        </div>
      </div>

      {/* Titel + beskrivning */}
      <div className="feed-card-body">
        <h3 className="feed-title">{mission.title}</h3>
        <p className="feed-description">{mission.description}</p>

        {/* Meta: arrangör, plats, datum, tid med ikoner */}
        <div className="feed-meta">
          <div className="meta-row">
            <div className="meta-item">
              <PersonIcon />
              <span>{mission.arrangor}</span>
            </div>
            <div className="meta-item">
              <LocationIcon />
              <span>{cityOnly}</span>
            </div>
          </div>
          {startDate && (
            <div className="meta-row">
              <div className="meta-item">
                <CalendarIcon />
                <span>{formatDateShort(startDate)}</span>
              </div>
              <div className="meta-item">
                <ClockIcon />
                <span>
                  {formatTimeOnly(startDate)}-{formatTimeOnly(endDate)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Kategori-pill */}
        {mission.category && (
          <div className="feed-pills">
            <span className="feed-pill">
              <CategoryIcon />
              {mission.category}
            </span>
          </div>
        )}

        {/* Knappar */}
        <div className="feed-actions">
          <button className="btn-outline-blue" onClick={() => onView(mission)}>
            Visa
          </button>
          {hasApplied ? (
            <button className="btn-applied" disabled>
              ✓ Ansökt
            </button>
          ) : (
            <button className="btn-primary" onClick={() => onAccept(mission)}>
              Acceptera
            </button>
          )}
        </div>
      </div>

      {/* Footer med likes + kommentarer */}
      <div className="feed-card-footer">
        <button
          type="button"
          className={`feed-action-btn ${interaction?.likedByMe ? "liked" : ""}`}
          onClick={onToggleLike}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={interaction?.likedByMe ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{interaction?.likes || 0}</span>
        </button>

        <button
          type="button"
          className="feed-action-btn"
          onClick={onOpenComments}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>{interaction?.comments || 0} Kommentarer</span>
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   IKONER
   ========================================================================== */
function PersonIcon() {
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

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

/* ==========================================================================
   LIST CARD: kompakt vy
   ========================================================================== */
function ListCard({ mission, onView, onAccept, hasApplied }) {
  return (
    <div className="list-card">
      <div
        className="list-card-image"
        style={{ backgroundImage: `url(${mission.image})` }}
      ></div>
      <div className="list-card-body">
        <h3 className="list-title-text">{mission.title}</h3>
        <p className="list-description">{mission.description}</p>
        <div className="list-meta">
          <p>
            <strong>Arrangör:</strong> {mission.arrangor}
          </p>
          <p>
            <strong>Plats:</strong> {mission.plats}
          </p>
          <p>
            <strong>Datum & tid:</strong> {mission.datum}
          </p>
        </div>
        <div className="list-actions">
          <button className="btn-outline-blue" onClick={() => onView(mission)}>
            Visa
          </button>
          {hasApplied ? (
            <button className="btn-applied" disabled>
              ✓ Ansökt
            </button>
          ) : (
            <button className="btn-primary" onClick={() => onAccept(mission)}>
              Acceptera
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
/* ==========================================================================
   APPLICATIONS LIST - Mina ansökningar
   ========================================================================== */
function ApplicationsList({ applications, isLoading, error }) {
  if (isLoading) {
    return (
      <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
        Laddar dina ansökningar...
      </p>
    );
  }

  if (error) {
    return (
      <p style={{ textAlign: "center", color: "#d33", padding: "2rem" }}>
        {error}
      </p>
    );
  }

  if (applications.length === 0) {
    return (
      <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
        Du har inte ansökt till några uppdrag än.
      </p>
    );
  }

  return (
    <div className="applications-list">
      <h2 className="section-title" style={{ marginBottom: "1rem" }}>
        Mina ansökningar ({applications.length})
      </h2>
      {applications.map((app) => (
        <ApplicationCard key={app.applicationId} application={app} />
      ))}
    </div>
  );
}

function ApplicationCard({ application }) {
  const fmtDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("sv-SE", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusConfig = {
    Pending: {
      label: "Väntar svar",
      className: "status-pending",
    },
    Approved: {
      label: "Godkänd!",
      className: "status-approved",
    },
    Rejected: {
      label: "Tyvärr inte vald",
      className: "status-rejected",
    },
  };

  const status = statusConfig[application.status] || statusConfig.Pending;

  return (
    <div className="application-card">
      <div className="application-card-header">
        <div>
          <h3 className="application-card-title">{application.jobTitle}</h3>
          <p className="application-card-org">{application.organizationName}</p>
        </div>
        <span className={`status-badge ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="application-card-meta">
        {application.jobCity && (
          <p>
            <strong>Plats:</strong> {application.jobCity}
            {application.jobAddress ? `, ${application.jobAddress}` : ""}
          </p>
        )}
        {application.jobStartTime && (
          <p>
            <strong>Tid:</strong> {fmtDate(application.jobStartTime)} –{" "}
            {fmtDate(application.jobEndTime)}
          </p>
        )}
        <p style={{ color: "#888", fontSize: 13 }}>
          Du ansökte: {fmtDate(application.createdAt)}
        </p>
      </div>

      {application.jobDescription && (
        <p className="application-card-desc">{application.jobDescription}</p>
      )}
    </div>
  );
}

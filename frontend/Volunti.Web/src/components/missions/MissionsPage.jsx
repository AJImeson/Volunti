import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MissionsPage.css";

const mockMissions = [
  {
    id: 1,
    organization: "Svenska kyrkan",
    timeAgo: "20 minuter sen",
    title: "Hjälp till vid lokal strandstädning",
    description:
      "Vi söker volontärer som vill hjälpa till att städa stranden från skräp och plast. Uppdraget innebär att samla in avfall, sortera det och bidra till en renare miljö.",
    arrangor: "Karl Svensson",
    plats: "Långholmen, Stockholm",
    datum: "15 maj kl. 10:00–14:00",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800",
    likes: 22,
    likedBy: "Alex Svensson och 20 andra",
    comments: 20,
  },
  {
    id: 2,
    organization: "Röda Korset",
    timeAgo: "1 timme sen",
    title: "Läxhjälp för ungdomar",
    description:
      "Hjälp ungdomar med skolarbete och läxor. Vi behöver volontärer som är duktiga på matte, svenska och engelska.",
    arrangor: "Maria Andersson",
    plats: "Södermalm, Stockholm",
    datum: "20 maj kl. 16:00–18:00",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    likes: 15,
    likedBy: "Emma Lundberg och 14 andra",
    comments: 8,
  },
  {
    id: 3,
    organization: "Stadsmissionen",
    timeAgo: "3 timmar sen",
    title: "Matutdelning till behövande",
    description:
      "Vi delar ut mat till hemlösa och behövande. Du hjälper till med att packa och dela ut matkassar.",
    arrangor: "Johan Karlsson",
    plats: "Centrum, Stockholm",
    datum: "18 maj kl. 12:00–15:00",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
    likes: 35,
    likedBy: "Lisa Berg och 34 andra",
    comments: 12,
  },
  {
    id: 4,
    organization: "Naturskyddsföreningen",
    timeAgo: "5 timmar sen",
    title: "Trädplantering i Hagaparken",
    description:
      "Var med och plantera nya träd i Hagaparken. Vi behöver hjälp med grävning, plantering och vattning.",
    arrangor: "Erik Holm",
    plats: "Hagaparken, Solna",
    datum: "22 maj kl. 09:00–13:00",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",
    likes: 42,
    likedBy: "Sofia Eriksson och 41 andra",
    comments: 18,
  },
];

export default function MissionsPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("feed");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMissions = mockMissions.filter(
    (mission) =>
      mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.organization.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="missions-wrapper">
      {/* TOPPMENY */}
      <div className="missions-top-nav">
        <h1 className="missions-logo">VOLUNTI</h1>
        <div className="missions-nav-icons">
          <button
            className="icon-btn"
            aria-label="Profil"
            onClick={() => navigate("/profile")}
          >
            <svg
              width="24"
              height="24"
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
          </button>
          <button
            className="icon-btn"
            aria-label="Inställningar"
            onClick={() => navigate("/settings")}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
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

      {/* HUVUDINNEHÅLL */}
      <div className="missions-content">
        {viewMode === "feed" && (
          <PreviousHelpedCarousel onShowAll={() => setViewMode("list")} />
        )}

        {/* HEADER FÖR LIST-VYN*/}
        {viewMode === "list" && (
          <div className="section-header" style={{ marginBottom: "1.5rem" }}>
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
          className={viewMode === "feed" ? "missions-feed" : "missions-list"}
        >
          {filteredMissions.map((mission) =>
            viewMode === "feed" ? (
              <FeedCard key={mission.id} mission={mission} />
            ) : (
              <ListCard key={mission.id} mission={mission} />
            ),
          )}
        </div>
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

  // Auto-scroll
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

  // Drag/swipe-hantering
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

  // Touch-events
  const onTouchStart = (e) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e) => handleDragMove(e.touches[0].clientX);
  const onTouchEnd = () => handleDragEnd();

  // Mouse-events
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
   FEED CARD - stor avancerad vy
   ========================================================================== */
function FeedCard({ mission }) {
  return (
    <div className="feed-card">
      <div className="feed-card-header">
        <div className="org-avatar"></div>
        <div className="org-info">
          <p className="org-name">{mission.organization}</p>
          <p className="org-time">{mission.timeAgo}</p>
        </div>
      </div>

      <div className="feed-card-body">
        <h3 className="feed-title">{mission.title}</h3>
        <p className="feed-description">{mission.description}</p>

        <div className="feed-meta">
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

        <div className="feed-actions">
          <button className="btn-outline-blue">Visa</button>
          <button className="btn-primary">Acceptera</button>
        </div>
      </div>

      <div className="feed-card-footer">
        <div className="feed-likes">
          <span className="like-icon">👍</span>
          <span className="like-text">{mission.likedBy}</span>
          <span className="comment-count">{mission.comments} Kommentarer</span>
        </div>
        <div className="feed-social-actions">
          <button className="social-btn">
            <span>👍</span> Like
          </button>
          <button className="social-btn">
            <span>💬</span> Kommentera
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   LIST CARD - kompakt enkel vy
   ========================================================================== */
function ListCard({ mission }) {
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
          <button className="btn-outline-blue">Visa</button>
          <button className="btn-primary">Acceptera</button>
        </div>
      </div>
    </div>
  );
}

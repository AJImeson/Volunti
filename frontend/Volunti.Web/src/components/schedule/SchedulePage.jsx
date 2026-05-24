import React, { useState, useEffect } from "react";
import "./SchedulePage.css";
import BottomNav from "../bottomnav/BottomNav";
import {
  getMyApplicationsAsVolunteer,
  getMyAvailability,
  updateMyAvailability,
} from "../../services/jobService";

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Mars",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "Augusti",
  "September",
  "Oktober",
  "November",
  "December",
];
const WEEKDAY_NAMES = ["M", "T", "O", "T", "F", "L", "S"];

function toIsoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const grid = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(year, month, 1 + (i - firstWeekday));
    grid.push({
      date,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      iso: toIsoDate(date),
    });
  }
  return grid;
}

function isPast(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isToday(date) {
  const t = new Date();
  return (
    date.getFullYear() === t.getFullYear() &&
    date.getMonth() === t.getMonth() &&
    date.getDate() === t.getDate()
  );
}

/* ==========================================================================
   MAIN
   ========================================================================== */
export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState("schema");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [applications, setApplications] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState(new Set());
  const [editingUnavailable, setEditingUnavailable] = useState(new Set());

  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([getMyApplicationsAsVolunteer(), getMyAvailability()])
      .then(([apps, avail]) => {
        if (cancelled) return;
        const active = apps.filter(
          (a) => a.status === "Pending" || a.status === "Approved",
        );
        setApplications(active);
        const set = new Set(avail.map((d) => toIsoDate(new Date(d))));
        setUnavailableDates(set);
        setEditingUnavailable(new Set(set));
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError("Kunde inte ladda schema.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const passDates = new Set();
  applications.forEach((a) => {
    if (a.jobStartTime) passDates.add(toIsoDate(new Date(a.jobStartTime)));
  });

  const goPrev = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  const goNext = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );

  const handleDayClick = (cell) => {
    if (activeTab !== "tillganglighet") return;
    if (!cell.isCurrentMonth) return;
    if (isPast(cell.date)) return;
    if (passDates.has(cell.iso)) return;

    const next = new Set(editingUnavailable);
    if (next.has(cell.iso)) next.delete(cell.iso);
    else next.add(cell.iso);
    setEditingUnavailable(next);
  };

  const handleSave = async () => {
    try {
      const dates = Array.from(editingUnavailable).sort();
      await updateMyAvailability(dates);
      setUnavailableDates(new Set(editingUnavailable));
      setSaveMessage("Ditt schema har uppdaterats!");
      setTimeout(() => setSaveMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setError("Kunde inte spara. Försök igen.");
      setTimeout(() => setError(""), 4000);
    }
  };

  const handleCancel = () => setEditingUnavailable(new Set(unavailableDates));

  const grid = buildMonthGrid(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
  );

  return (
    <div className="schedule-wrapper">
      <div className="schedule-top">
        <h1 className="schedule-logo">VOLUNTI</h1>

        <div className="schedule-header-content">
          <h2 className="schedule-title">
            {activeTab === "schema" && "Schema"}
            {activeTab === "uppdrag" && "Dina pass"}
            {activeTab === "tillganglighet" && "Tillgänglighet"}
          </h2>
          <p className="schedule-subtitle">
            {activeTab === "schema" &&
              "Se dina uppdrag och uppdatera din tillgänglighet"}
            {activeTab === "uppdrag" && "Här ser du alla dina uppdrag"}
            {activeTab === "tillganglighet" &&
              "Tryck på dagar du inte kan jobba"}
          </p>

          <div className="schedule-tabs">
            <button
              className={`schedule-tab ${activeTab === "schema" ? "active" : ""}`}
              onClick={() => setActiveTab("schema")}
            >
              Schema
            </button>
            <button
              className={`schedule-tab ${activeTab === "uppdrag" ? "active" : ""}`}
              onClick={() => setActiveTab("uppdrag")}
            >
              Uppdrag
            </button>
            <button
              className={`schedule-tab ${activeTab === "tillganglighet" ? "active" : ""}`}
              onClick={() => setActiveTab("tillganglighet")}
            >
              Tillgänglighet
            </button>
          </div>
        </div>
      </div>

      <div className="schedule-content">
        {isLoading ? (
          <p className="schedule-loading">Laddar...</p>
        ) : (
          <div className="tab-content-anim" key={activeTab}>
            {activeTab === "schema" && (
              <CalendarView
                month={currentMonth}
                grid={grid}
                onPrev={goPrev}
                onNext={goNext}
                passDates={passDates}
                unavailableDates={unavailableDates}
                mode="view"
              />
            )}
            {activeTab === "uppdrag" && (
              <UppragList applications={applications} />
            )}
            {activeTab === "tillganglighet" && (
              <>
                <CalendarView
                  month={currentMonth}
                  grid={grid}
                  onPrev={goPrev}
                  onNext={goNext}
                  passDates={passDates}
                  unavailableDates={editingUnavailable}
                  mode="edit"
                  onDayClick={handleDayClick}
                />
                {saveMessage && (
                  <p className="schedule-save-msg">{saveMessage}</p>
                )}
                {error && <p className="schedule-error-msg">{error}</p>}
                <button className="schedule-save-btn" onClick={handleSave}>
                  Spara
                </button>
                <button className="schedule-cancel-btn" onClick={handleCancel}>
                  Avbryt
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

/* ==========================================================================
   CALENDAR
   ========================================================================== */
function CalendarView({
  month,
  grid,
  onPrev,
  onNext,
  passDates,
  unavailableDates,
  mode,
  onDayClick,
}) {
  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <button
          className="calendar-nav"
          onClick={onPrev}
          aria-label="Föregående månad"
        >
          ‹
        </button>
        <h3 className="calendar-month">{MONTH_NAMES[month.getMonth()]}</h3>
        <button
          className="calendar-nav"
          onClick={onNext}
          aria-label="Nästa månad"
        >
          ›
        </button>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAY_NAMES.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>

      <div
        className="calendar-grid"
        key={`${month.getFullYear()}-${month.getMonth()}`}
      >
        {grid.map((cell, i) => {
          const hasPass = passDates.has(cell.iso);
          const isUnavail = unavailableDates.has(cell.iso);
          const past = isPast(cell.date);
          const today = isToday(cell.date);

          let classes = "calendar-day";
          if (!cell.isCurrentMonth) classes += " other-month";

          if (hasPass) classes += " has-pass";
          else if (past) classes += " past";
          else if (isUnavail) classes += " unavailable";
          if (today && !past) classes += " today";

          const clickable =
            mode === "edit" && cell.isCurrentMonth && !past && !hasPass;
          if (mode === "edit" && !clickable && cell.isCurrentMonth)
            classes += " locked";

          return (
            <button
              key={i}
              type="button"
              className={classes}
              onClick={clickable ? () => onDayClick(cell) : undefined}
              disabled={mode === "edit" && !clickable}
            >
              {cell.isCurrentMonth ? cell.day : ""}
            </button>
          );
        })}
      </div>

      <div className="calendar-legend">
        <span className="legend-item">
          <span className="legend-dot blue"></span>Tagna pass
        </span>
        <span className="legend-item">
          <span className="legend-dot grey"></span>Otillgänglig
        </span>
        <span className="legend-item">
          <span className="legend-dot white"></span>Tillgänglig
        </span>
      </div>
    </div>
  );
}

/* ==========================================================================
   UPPRAG LIST
   ========================================================================== */
function UppragList({ applications }) {
  const sorted = [...applications]
    .filter((a) => a.jobStartTime)
    .sort((a, b) => new Date(a.jobStartTime) - new Date(b.jobStartTime));

  if (sorted.length === 0) {
    return <p className="schedule-loading">Inga aktuella uppdrag.</p>;
  }

  return (
    <div className="upprag-list">
      {sorted.map((app) => (
        <UppragCard key={app.applicationId} app={app} />
      ))}
    </div>
  );
}

function UppragCard({ app }) {
  const [showDetails, setShowDetails] = useState(false);
  const start = new Date(app.jobStartTime);
  const end = new Date(app.jobEndTime);

  const fmtDate = (d) =>
    d.toLocaleDateString("sv-SE", { day: "numeric", month: "long" });
  const fmtTime = (d) =>
    d.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="upprag-card">
      <h4 className="upprag-title">{app.jobTitle}</h4>
      <p className="upprag-org">{app.organizationName || "—"}</p>

      <div className="upprag-meta">
        <span className="upprag-meta-item">
          <CalendarIcon />
          {fmtDate(start)}
        </span>
        <span className="upprag-meta-item">
          <ClockIcon />
          {fmtTime(start)}-{fmtTime(end)}
        </span>
      </div>

      {(app.jobCity || app.jobAddress) && (
        <div className="upprag-meta">
          <span className="upprag-meta-item">
            <LocationIcon />
            {[app.jobCity, app.jobAddress].filter(Boolean).join(", ")}
          </span>
        </div>
      )}

      <div className="upprag-status">
        Status:{" "}
        <strong>{app.status === "Approved" ? "Godkänd" : "Väntar svar"}</strong>
      </div>

      {showDetails && app.jobDescription && (
        <p className="upprag-desc">{app.jobDescription}</p>
      )}

      <button
        className="upprag-show-more"
        onClick={() => setShowDetails((s) => !s)}
      >
        {showDetails ? "Visa mindre" : "Visa mer"}
      </button>
    </div>
  );
}

/* ==========================================================================
   IKONER
   ========================================================================== */
function CalendarIcon() {
  return (
    <svg
      className="upprag-icon"
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
      className="upprag-icon"
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

function LocationIcon() {
  return (
    <svg
      className="upprag-icon"
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

import React from "react";

export default function MissionCard({ mission, onApply }) {
  return (
    <div className="find-mission-card">
      <div className="community-card-header">
        <div className="community-org-avatar" style={{ background: mission.bgColor }}>
          {mission.initial}
        </div>
        <span className="community-org-name">{mission.org}</span>
      </div>
      <h3 className="community-card-title">{mission.title}</h3>
      <p className="community-card-desc">{mission.desc}</p>
      <div className="community-card-tags">
        <span className="community-tag">{mission.category}</span>
      </div>
      <div className="community-card-meta">
        <span>📅 {mission.date}</span>
        <span>📍 {mission.plats}</span>
      </div>
      <button className="find-mission-btn" onClick={onApply}>
        Anmäl dig
      </button>
    </div>
  );
}

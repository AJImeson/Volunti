import React from "react";

const feedItems = [
  {
    type: "mission",
    author: "Röda Korset",
    initial: "RK",
    bgColor: "#c0392b",
    timeAgo: "15 min",
    content: "Nytt uppdrag: Vi söker volontärer för matutdelning nästa lördag 10:00 till 13:00. Varmt välkommen!",
    tag: "Matutdelning",
    plats: "Mariatorget, Stockholm",
  },
  {
    type: "story",
    author: "Johan W.",
    initial: "JW",
    bgColor: "#7c3aed",
    timeAgo: "2 tim",
    content: "Genomförde mitt femte uppdrag idag. Plantering i Hagaparken med Naturskyddsföreningen. Trötta ben men fullt hjärta.",
    likes: 23,
  },
  {
    type: "mission",
    author: "Stadsmissionen",
    initial: "SM",
    bgColor: "#b45309",
    timeAgo: "igår",
    content: "Söndagscafé söker volontärer för servering och sällskap till äldre besökare. Fika och gemenskap i fokus.",
    tag: "Äldreomsorg",
    plats: "Kungsholmen, Stockholm",
  },
];

function HeartIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default function FeedPreviewSection() {
  return (
    <section className="marketing-feed-preview">
      <div className="feed-preview-inner">
        <div className="feed-preview-text">
          <h2 className="marketing-section-title" style={{ textAlign: "left" }}>
            Ditt flöde, dina val
          </h2>
          <p className="feed-preview-desc">
            Följ organisationer och volontärer du gillar. Få en personlig feed med uppdrag och berättelser som faktiskt berör dig.
          </p>
          <ul className="feed-preview-bullets">
            <li>Följ organisationer nära dig</li>
            <li>Se när andra volontärer anmäler sig</li>
            <li>Dela dina egna erfarenheter</li>
            <li>Få notiser för uppdrag som matchar dig</li>
          </ul>
        </div>

        <div className="feed-preview-feed">
          {feedItems.map((item, i) => (
            <div key={i} className="feed-card">
              <div className="feed-card-header">
                <div className="feed-avatar" style={{ background: item.bgColor }}>
                  {item.initial}
                </div>
                <div className="feed-author-meta">
                  <span className="feed-author-name">{item.author}</span>
                  <span className="feed-time">{item.timeAgo}</span>
                </div>
                {item.type === "mission" && (
                  <span className="feed-type-badge">Uppdrag</span>
                )}
              </div>
              <p className="feed-card-text">{item.content}</p>
              {item.tag && (
                <div className="feed-card-footer">
                  <span className="community-tag">{item.tag}</span>
                  {item.plats && <span className="feed-plats">📍 {item.plats}</span>}
                </div>
              )}
              {item.type === "story" && (
                <div className="feed-card-footer">
                  <span className="feed-likes"><HeartIcon /> {item.likes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

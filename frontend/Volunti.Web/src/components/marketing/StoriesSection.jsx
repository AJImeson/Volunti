import React from "react";

const stories = [
  {
    name: "Sara L.",
    initial: "SL",
    bgColor: "#7c3aed",
    timeAgo: "2 dagar sedan",
    mission: "Strandstädning Långholmen",
    missionColor: "#2a43a6",
    text: "Jag var lite nervös innan men det var helt fantastiskt. Vi var ett 20-tal volontärer och på tre timmar hade vi fyllt 40 sopsäckar. Känslan efteråt är svår att beskriva. Man ser direkt skillnaden man gör. Absolut inte sista gången!",
    likes: 34,
    comments: 7,
  },
  {
    name: "Marcus T.",
    initial: "MT",
    bgColor: "#059669",
    timeAgo: "5 dagar sedan",
    mission: "Soppa till hemlösa i city",
    missionColor: "#c0392b",
    text: "Hade aldrig gjort något liknande förut. Det tog bara två timmar av min lördag men gav så mycket tillbaka. Mötte otroliga människor, både volontärer och de vi hjälpte. Volunti gjorde det enkelt att hitta och anmäla mig. Tog bokstavligen 2 minuter.",
    likes: 51,
    comments: 12,
  },
  {
    name: "Amina K.",
    initial: "AK",
    bgColor: "#d97706",
    timeAgo: "1 vecka sedan",
    mission: "Läxhjälp för ungdomar",
    missionColor: "#2a43a6",
    text: "Jag är lärare till vardags så det här föll sig naturligt. Men det som förvånade mig var hur mycket jag fick tillbaka. Ungdomarnas energi och motivation är verkligen smittsam. Jag har nu ett återkommande uppdrag varje tisdag. Rekommenderar varmt!",
    likes: 88,
    comments: 19,
  },
];

function HeartIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function StoriesSection() {
  return (
    <section className="marketing-stories">
      <div className="marketing-section-inner">
        <h2 className="marketing-section-title">Berättelser från communityt</h2>
        <p className="marketing-section-subtitle">
          Volontärer delar sina upplevelser, med egna ord.
        </p>
        <div className="stories-grid">
          {stories.map((s) => (
            <div key={s.name} className="story-card">
              <div className="story-card-header">
                <div className="story-avatar" style={{ background: s.bgColor }}>
                  {s.initial}
                </div>
                <div className="story-meta">
                  <span className="story-name">{s.name}</span>
                  <span className="story-time">{s.timeAgo}</span>
                </div>
              </div>
              <span
                className="story-mission-tag"
                style={{ background: s.missionColor + "18", color: s.missionColor }}
              >
                {s.mission}
              </span>
              <p className="story-text">"{s.text}"</p>
              <div className="story-actions">
                <span className="story-action">
                  <HeartIcon /> {s.likes}
                </span>
                <span className="story-action">
                  <CommentIcon /> {s.comments}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

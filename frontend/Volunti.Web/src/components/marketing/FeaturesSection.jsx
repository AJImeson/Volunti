import React from "react";

const features = [
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#2a43a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: "På dina villkor",
    description:
      "Du bestämmer när du är tillgänglig. Ange ditt schema och få uppdrag som passar din vardag, oavsett om det är vardagar, kvällar eller helger.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#2a43a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Dina intressen",
    description:
      "Volunti matchar dig med uppdrag som speglar det du brinner för, till exempel miljö, barn, djur, matutdelning eller något helt annat.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#2a43a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Byggt av communityt",
    description:
      "Volunti är skapat tillsammans med volontärer och organisationer. Uppdrag läggs upp av riktiga människor och varje röst formar plattformen.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="marketing-features" id="features">
      <div className="marketing-section-inner">
        <h2 className="marketing-section-title">Volontärarbete på riktigt</h2>
        <p className="marketing-section-subtitle">
          Inga konstigheter. Du bestämmer hur, när och vad du vill bidra med.
        </p>
        <div className="marketing-features-grid">
          {features.map((f) => (
            <div key={f.title} className="marketing-feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

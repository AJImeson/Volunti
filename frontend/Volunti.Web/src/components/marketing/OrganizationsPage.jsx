import React from "react";
import MarketingNavbar from "./MarketingNavbar";
import MarketingFooter from "./MarketingFooter";

const steps = [
  {
    number: "01",
    title: "Skapa ett gratis konto",
    desc: "Registrera din organisation på några minuter. Inga avgifter och inga dolda kostnader.",
  },
  {
    number: "02",
    title: "Lägg upp uppdrag",
    desc: "Beskriv vad ni behöver hjälp med, när och var. Vi guidar dig genom hela processen.",
  },
  {
    number: "03",
    title: "Matchas med volontärer",
    desc: "Volunti matchar ert uppdrag med volontärer vars intressen och schema passar er.",
  },
  {
    number: "04",
    title: "Följ upp och bygg relationer",
    desc: "Se vem som deltar, kommunicera direkt och bygg ett nätverk av engagerade volontärer.",
  },
];

const features = [
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#2a43a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Helt kostnadsfritt",
    desc: "Volunti är gratis för organisationer. Vår mission är att göra volontärarbete tillgängligt för alla.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#2a43a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    title: "Enkel administration",
    desc: "Hantera alla uppdrag och volontärer på ett ställe. Tydlig översikt och enkel kommunikation.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#2a43a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: "Rätt matchning",
    desc: "Systemet matchar era uppdrag med volontärer utifrån intressen, kompetens och tillgänglighet.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#2a43a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: "Statistik och uppföljning",
    desc: "Se nedlagda timmar, vilka uppdrag som engagerar mest och hur ert volontärnätverk växer.",
  },
];

const orgs = [
  { name: "Röda Korset", initial: "RK", bgColor: "#c0392b" },
  { name: "Svenska kyrkan", initial: "SK", bgColor: "#2a43a6" },
  { name: "Stadsmissionen", initial: "SM", bgColor: "#b45309" },
  { name: "Naturskyddsföreningen", initial: "NF", bgColor: "#27ae60" },
  { name: "Rädda Barnen", initial: "RB", bgColor: "#dc2626" },
  { name: "Djurskyddet", initial: "DS", bgColor: "#7c3aed" },
];

export default function OrganizationsPage({ setView }) {
  return (
    <div className="marketing-page">
      <MarketingNavbar setView={setView} />

      <section className="org-hero">
        <div className="org-hero-content">
          <span className="org-hero-label">För organisationer</span>
          <h1 className="marketing-hero-title">
            Nå rätt volontärer<br />vid rätt tillfälle
          </h1>
          <p className="marketing-hero-subtitle">
            Volunti kopplar ihop er organisation med engagerade människor som vill göra skillnad. Gratis, enkelt och effektivt.
          </p>
          <div className="marketing-hero-cta">
            <button className="marketing-btn-primary" onClick={() => setView("register")}>
              Registrera din organisation
            </button>
            <button className="marketing-btn-outline" onClick={() => setView("login")}>
              Logga in
            </button>
          </div>
        </div>
      </section>

      <section className="marketing-how">
        <div className="marketing-section-inner">
          <h2 className="marketing-section-title">Så här fungerar det</h2>
          <p className="marketing-section-subtitle">
            Från registrering till genomfört uppdrag på fyra enkla steg.
          </p>
          <div className="marketing-steps" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            {steps.map((s) => (
              <div key={s.number} className="marketing-step">
                <span className="step-number">{s.number}</span>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-features">
        <div className="marketing-section-inner">
          <h2 className="marketing-section-title">Varför Volunti?</h2>
          <p className="marketing-section-subtitle">
            Allt ni behöver för att hitta och engagera rätt volontärer.
          </p>
          <div className="marketing-features-grid">
            {features.map((f) => (
              <div key={f.title} className="marketing-feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="org-trusted">
        <div className="marketing-section-inner">
          <h2 className="marketing-section-title">Organisationer som redan använder Volunti</h2>
          <div className="org-trusted-grid">
            {orgs.map((o) => (
              <div key={o.name} className="org-trusted-item">
                <div className="org-trusted-avatar" style={{ background: o.bgColor }}>
                  {o.initial}
                </div>
                <span className="org-trusted-name">{o.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-cta">
        <div className="marketing-cta-inner">
          <h2 className="marketing-cta-title">Redo att hitta era volontärer?</h2>
          <p className="marketing-cta-subtitle">
            Registrera er organisation gratis och nå tusentals engagerade volontärer.
          </p>
          <button className="marketing-btn-primary" onClick={() => setView("register")}>
            Kom igång gratis
          </button>
        </div>
      </section>

      <MarketingFooter setView={setView} />
    </div>
  );
}

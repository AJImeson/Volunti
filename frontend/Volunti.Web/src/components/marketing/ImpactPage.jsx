import React from "react";
import MarketingNavbar from "./MarketingNavbar";
import MarketingFooter from "./MarketingFooter";

const stats = [
  { value: "12 400+", label: "Uppdrag genomförda" },
  { value: "87 000+", label: "Volontärtimmar" },
  { value: "340+", label: "Aktiva organisationer" },
  { value: "28 000+", label: "Registrerade volontärer" },
];

const categories = [
  { label: "Miljö", hours: 18400, color: "#27ae60" },
  { label: "Äldreomsorg", hours: 15200, color: "#2a43a6" },
  { label: "Barn och ungdom", hours: 14800, color: "#dc2626" },
  { label: "Matutdelning", hours: 12600, color: "#c0392b" },
  { label: "Djur", hours: 9100, color: "#7c3aed" },
  { label: "Digital hjälp", hours: 7400, color: "#0891b2" },
];

const maxHours = Math.max(...categories.map((c) => c.hours));

function StatCard({ value, label }) {
  return (
    <div className="impact-stat-card">
      <span className="impact-stat-value">{value}</span>
      <span className="impact-stat-label">{label}</span>
    </div>
  );
}

function CategoryBar({ label, hours, color }) {
  const pct = Math.round((hours / maxHours) * 100);
  return (
    <div className="impact-bar-row">
      <span className="impact-bar-label">{label}</span>
      <div className="impact-bar-track">
        <div className="impact-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="impact-bar-hours">{hours.toLocaleString("sv-SE")} tim</span>
    </div>
  );
}

export default function ImpactPage({ setView }) {
  return (
    <div className="marketing-page">
      <MarketingNavbar setView={setView} />

      <section className="org-hero">
        <div className="org-hero-content">
          <span className="org-hero-label">Vår påverkan</span>
          <h1 className="marketing-hero-title">Siffror som betyder något</h1>
          <p className="marketing-hero-subtitle">
            Varje uppdrag på Volunti är en riktig insats av en riktig människa. Här är vad vi åstadkommit tillsammans.
          </p>
        </div>
      </section>

      <section className="impact-stats-section">
        <div className="marketing-section-inner">
          <div className="impact-stats-grid">
            {stats.map((s) => (
              <StatCard key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-features">
        <div className="marketing-section-inner">
          <h2 className="marketing-section-title">Timmar per kategori</h2>
          <p className="marketing-section-subtitle">Så fördelar sig volontärtimmarna mellan olika områden.</p>
          <div className="impact-bars">
            {categories.map((c) => (
              <CategoryBar key={c.label} label={c.label} hours={c.hours} color={c.color} />
            ))}
          </div>
        </div>
      </section>

      <section className="impact-quote-section">
        <div className="marketing-section-inner">
          <blockquote className="impact-quote">
            "Varje gång jag ser siffrorna växa förstår jag att vi tillsammans bygger något som verkligen spelar roll. Det är inte en app. Det är ett community."
          </blockquote>
          <p className="impact-quote-author">Grundarna av Volunti</p>
        </div>
      </section>

      <section className="marketing-cta">
        <div className="marketing-cta-inner">
          <h2 className="marketing-cta-title">Bidra till nästa siffra</h2>
          <p className="marketing-cta-subtitle">Gå med och gör din insats till en del av statistiken.</p>
          <button className="marketing-btn-primary" onClick={() => setView("landing")}>
            Kom igång gratis
          </button>
        </div>
      </section>

      <MarketingFooter setView={setView} />
    </div>
  );
}

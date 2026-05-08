import React from "react";
import MarketingNavbar from "./MarketingNavbar";
import MarketingFooter from "./MarketingFooter";

const values = [
  { title: "Gemenskap", desc: "Vi tror att människor mår bättre när de känner att de bidrar. Volunti bygger broar mellan dem som vill hjälpa och dem som behöver hjälp." },
  { title: "Tillgänglighet", desc: "Volontärarbete ska vara enkelt för alla. Inga långa ansökningar, inga krångliga system. Hitta ett uppdrag och bidra på dina villkor." },
  { title: "Äkthet", desc: "Uppdragen på Volunti kommer från riktiga organisationer med riktiga behov. Varje timme du lägger ned gör en konkret skillnad." },
  { title: "Transparens", desc: "Volunti är öppet och ärligt. Vi berättar hur plattformen fungerar, vad vi gör med dina uppgifter och hur vi växer." },
];

function ValueCard({ title, desc }) {
  return (
    <div className="marketing-feature-card">
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
    </div>
  );
}

export default function AboutPage({ setView }) {
  return (
    <div className="marketing-page">
      <MarketingNavbar setView={setView} />

      <section className="org-hero">
        <div className="org-hero-content">
          <span className="org-hero-label">Om oss</span>
          <h1 className="marketing-hero-title">Vi tror att alla kan göra skillnad</h1>
          <p className="marketing-hero-subtitle">
            Volunti startades av en grupp volontärer som ville göra det enklare för alla att bidra i sitt lokalsamhälle.
          </p>
        </div>
      </section>

      <section className="marketing-how">
        <div className="marketing-section-inner">
          <h2 className="marketing-section-title">Historien bakom Volunti</h2>
          <div className="about-story">
            <p>
              Det började med en enkel frustration. Trots att tusentals människor ville engagera sig som volontärer var det svårt att hitta var man kunde bidra och hur man kom igång. Organisationer hade svårt att nå volontärer och volontärer hade svårt att hitta organisationer.
            </p>
            <p>
              Volunti skapades för att lösa det. En plattform byggd av volontärer, för volontärer. Där du som person bestämmer när, var och hur du vill bidra.
            </p>
            <p>
              Idag används Volunti av tusentals volontärer och hundratals organisationer runt om i Sverige. Varje dag genomförs nya uppdrag och varje dag görs en liten insats som gör stor skillnad.
            </p>
          </div>
        </div>
      </section>

      <section className="marketing-features">
        <div className="marketing-section-inner">
          <h2 className="marketing-section-title">Våra värderingar</h2>
          <p className="marketing-section-subtitle">Det här är vad som driver oss varje dag.</p>
          <div className="marketing-features-grid">
            {values.map((v) => (
              <ValueCard key={v.title} title={v.title} desc={v.desc} />
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-cta">
        <div className="marketing-cta-inner">
          <h2 className="marketing-cta-title">Bli en del av communityt</h2>
          <p className="marketing-cta-subtitle">Gå med tusentals volontärer som redan gör skillnad varje dag.</p>
          <button className="marketing-btn-primary" onClick={() => setView("register")}>
            Kom igång gratis
          </button>
        </div>
      </section>

      <MarketingFooter setView={setView} />
    </div>
  );
}

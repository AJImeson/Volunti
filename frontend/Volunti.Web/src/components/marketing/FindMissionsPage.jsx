import React, { useState } from "react";
import MarketingNavbar from "./MarketingNavbar";
import MarketingFooter from "./MarketingFooter";
import MissionCard from "./MissionCard";

const categories = ["Alla", "Miljö", "Barn och ungdom", "Äldreomsorg", "Matutdelning", "Djur", "Digital hjälp"];

const missions = [
  { id: 1, org: "Röda Korset", initial: "RK", bgColor: "#c0392b", title: "Soppa till hemlösa i city", desc: "Hjälp till med att dela ut varm soppa till hemlösa i city. Lugnt och meningsfullt arbete som gör stor skillnad.", category: "Matutdelning", date: "18 maj, 14:00", plats: "Sergels torg, Stockholm" },
  { id: 2, org: "Svenska kyrkan", initial: "SK", bgColor: "#2a43a6", title: "Strandstädning Långholmen", desc: "Rensa stranden från skräp tillsammans med engagerade grannar och frivilliga från hela staden.", category: "Miljö", date: "25 maj, 10:00", plats: "Långholmen, Stockholm" },
  { id: 3, org: "Naturskyddsföreningen", initial: "NF", bgColor: "#27ae60", title: "Plantera träd i Hagaparken", desc: "En dag med spade och gummistövlar för en grönare och friskare stad. Fika ingår!", category: "Miljö", date: "1 juni, 09:00", plats: "Hagaparken, Stockholm" },
  { id: 4, org: "Stadsmissionen", initial: "SM", bgColor: "#b45309", title: "Söndagscafé för äldre", desc: "Servera fika och ge sällskap till ensamma äldre besökare. Varmt och välkomnande miljö.", category: "Äldreomsorg", date: "22 maj, 13:00", plats: "Kungsholmen, Stockholm" },
  { id: 5, org: "Rädda Barnen", initial: "RB", bgColor: "#dc2626", title: "Läxhjälp för nyanlända barn", desc: "Hjälp barn med läxor och svenska efter skoltid. Stort behov av volontärer med tålamod och värme.", category: "Barn och ungdom", date: "Varje tisdag 16:00", plats: "Södermalm, Stockholm" },
  { id: 6, org: "Djurskyddet", initial: "DS", bgColor: "#7c3aed", title: "Rast och kärlek till kennelhundar", desc: "Ta ut hundar på rast och ge dem uppmärksamhet och kärlek. Perfekt för hundälskare.", category: "Djur", date: "Helger, flexibelt", plats: "Skärholmen, Stockholm" },
  { id: 7, org: "Digidel", initial: "DG", bgColor: "#0891b2", title: "Digital hjälp till pensionärer", desc: "Hjälp äldre att använda mobil, dator och bankID. Tålamod och pedagogik är allt som krävs.", category: "Digital hjälp", date: "Varannan onsdag, 10:00", plats: "Östermalm, Stockholm" },
  { id: 8, org: "Bris", initial: "BR", bgColor: "#be185d", title: "Sommarläger volontär", desc: "Var med och ge barn en oförglömlig sommar som ledare och stöd under veckans läger.", category: "Barn och ungdom", date: "Vecka 27 och 28", plats: "Nacka, Stockholm" },
];

function FilterPill({ label, active, onClick }) {
  return (
    <button
      className={`filter-pill${active ? " filter-pill-active" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default function FindMissionsPage({ setView }) {
  const [activeCategory, setActiveCategory] = useState("Alla");

  const filtered = activeCategory === "Alla"
    ? missions
    : missions.filter((m) => m.category === activeCategory);

  return (
    <div className="marketing-page">
      <MarketingNavbar setView={setView} />

      <section className="find-missions-header">
        <div className="marketing-section-inner">
          <h1 className="marketing-section-title">Hitta ditt nästa uppdrag</h1>
          <p className="marketing-section-subtitle">
            Bläddra bland uppdrag nära dig. Skapa ett konto för att anmäla dig.
          </p>
          <div className="find-filters">
            {categories.map((cat) => (
              <FilterPill
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="find-missions-grid-section">
        <div className="marketing-section-inner" style={{ textAlign: "left" }}>
          <div className="find-missions-grid">
            {filtered.map((m) => (
              <MissionCard key={m.id} mission={m} onApply={() => setView("landing")} />
            ))}
          </div>

          <div className="find-missions-cta-banner">
            <p className="find-missions-cta-text">
              Skapa ett gratis konto för att se alla uppdrag och anmäla dig med ett klick.
            </p>
            <button className="marketing-btn-primary" onClick={() => setView("landing")}>
              Skapa konto gratis
            </button>
          </div>
        </div>
      </section>

      <MarketingFooter setView={setView} />
    </div>
  );
}

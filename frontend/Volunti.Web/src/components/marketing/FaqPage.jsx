import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MarketingNavbar from "./MarketingNavbar";
import MarketingFooter from "./MarketingFooter";

const faqs = [
  {
    q: "Kostar det något att använda Volunti?",
    a: "Nej, Volunti är helt gratis för volontärer. Det är också gratis för organisationer att registrera sig och lägga upp uppdrag.",
  },
  {
    q: "Hur hittar jag uppdrag nära mig?",
    a: "När du skapar ett konto anger du din kommun och dina intressen. Volunti visar sedan uppdrag som matchar dig. Du kan också bläddra fritt och filtrera på kategori.",
  },
  {
    q: "Kan jag avboka ett uppdrag?",
    a: "Ja, du kan avboka ett uppdrag via din profil. Vi ber dig göra det så tidigt som möjligt så att organisationen hinner hitta en ersättare.",
  },
  {
    q: "Hur fungerar matchningen?",
    a: "Volunti matchar uppdrag med volontärer baserat på intressen, tillgänglighet och geografisk plats. Ju mer du fyller i din profil, desto bättre matchning.",
  },
  {
    q: "Är Volunti för alla åldrar?",
    a: "Ja, Volunti välkomnar volontärer i alla åldrar. Vissa uppdrag kan ha åldersgränser satta av organisationen, men det framgår alltid tydligt i uppdragsbeskrivningen.",
  },
  {
    q: "Hur lägger en organisation upp ett uppdrag?",
    a: "Organisationer registrerar ett gratis konto, fyller i sin profil och kan sedan lägga upp uppdrag direkt. Uppdragen syns för matchande volontärer inom minuter.",
  },
  {
    q: "Vad händer om ingen anmäler sig till mitt uppdrag?",
    a: "Volunti skickar notiser till matchande volontärer när ett uppdrag läggs upp. Du kan också dela uppdraget via sociala medier direkt från plattformen.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " faq-item-open" : ""}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <svg
          className="faq-chevron"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <p className="faq-answer">{a}</p>}
    </div>
  );
}

export default function FaqPage() {
  const navigate = useNavigate();
  return (
    <div className="marketing-page">
      <MarketingNavbar />

      <section className="org-hero">
        <div className="org-hero-content">
          <span className="org-hero-label">Vanliga frågor</span>
          <h1 className="marketing-hero-title">Vi svarar på dina frågor</h1>
          <p className="marketing-hero-subtitle">
            Hittar du inte svaret du söker? Hör av dig till oss direkt.
          </p>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-inner">
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      <section className="marketing-cta">
        <div className="marketing-cta-inner">
          <h2 className="marketing-cta-title">Redo att komma igång?</h2>
          <p className="marketing-cta-subtitle">Skapa ett konto gratis och hitta ditt första uppdrag idag.</p>
          <button className="marketing-btn-primary" onClick={() => navigate("/landing")}>
            Skapa konto
          </button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

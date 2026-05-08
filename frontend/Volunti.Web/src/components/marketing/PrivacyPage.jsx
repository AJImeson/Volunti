import React from "react";
import MarketingNavbar from "./MarketingNavbar";
import MarketingFooter from "./MarketingFooter";

const sections = [
  {
    title: "Vilka uppgifter samlar vi in?",
    text: "Vi samlar in de uppgifter du väljer att ge oss när du skapar ett konto, till exempel namn, e-postadress, telefonnummer och profilinformation. Vi samlar också in information om hur du använder plattformen, som vilka uppdrag du anmäler dig till.",
  },
  {
    title: "Hur använder vi dina uppgifter?",
    text: "Dina uppgifter används för att matcha dig med relevanta uppdrag, skicka notiser, kommunicera med organisationer och förbättra tjänsten. Vi säljer aldrig dina uppgifter till tredje part.",
  },
  {
    title: "Dina rättigheter",
    text: "Du har rätt att när som helst begära ut, korrigera eller radera dina personuppgifter. Du kan också begränsa hur vi behandlar dina uppgifter. Kontakta oss på privacy@volunti.se för att utöva dina rättigheter.",
  },
  {
    title: "Cookies",
    text: "Volunti använder cookies för att hålla dig inloggad och för att förstå hur tjänsten används. Du kan när som helst välja att blockera cookies i din webbläsare, men vissa delar av tjänsten kan då sluta fungera.",
  },
  {
    title: "Lagring och säkerhet",
    text: "Dina uppgifter lagras säkert inom EU i enlighet med GDPR. Vi använder kryptering och regelbundna säkerhetsgranskningar för att skydda din information.",
  },
  {
    title: "Kontakt",
    text: "Har du frågor om hur vi hanterar dina personuppgifter? Kontakta oss på privacy@volunti.se. Vi svarar inom 72 timmar.",
  },
];

function PrivacySection({ title, text }) {
  return (
    <div className="privacy-section-block">
      <h3 className="privacy-section-title">{title}</h3>
      <p className="privacy-section-text">{text}</p>
    </div>
  );
}

export default function PrivacyPage({ setView }) {
  return (
    <div className="marketing-page">
      <MarketingNavbar setView={setView} />

      <section className="org-hero" style={{ minHeight: "40vh" }}>
        <div className="org-hero-content">
          <span className="org-hero-label">Integritetspolicy</span>
          <h1 className="marketing-hero-title">Din integritet är viktig för oss</h1>
          <p className="marketing-hero-subtitle">
            Senast uppdaterad: januari 2026
          </p>
        </div>
      </section>

      <section className="privacy-content-section">
        <div className="privacy-inner">
          <p className="privacy-intro">
            Volunti värnar om din integritet. Den här policyn förklarar vilka uppgifter vi samlar in, varför vi gör det och vilka rättigheter du har. Vi följer dataskyddsförordningen (GDPR).
          </p>
          {sections.map((s) => (
            <PrivacySection key={s.title} title={s.title} text={s.text} />
          ))}
        </div>
      </section>

      <MarketingFooter setView={setView} />
    </div>
  );
}

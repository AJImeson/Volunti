import React from "react";

const links = [
  { label: "Om oss", view: "about" },
  { label: "Hitta uppdrag", view: "find-missions" },
  { label: "För organisationer", view: "organizations" },
  { label: "Vår påverkan", view: "impact" },
  { label: "FAQ", view: "faq" },
  { label: "Integritetspolicy", view: "privacy" },
];

export default function MarketingFooter({ setView }) {
  return (
    <footer className="marketing-footer">
      <div className="marketing-footer-inner">
        <span className="marketing-footer-logo">VOLUNTI</span>
        <p className="marketing-footer-tagline">Små insatser. Stor skillnad.</p>
        <nav className="marketing-footer-links">
          {links.map((l) => (
            <button key={l.view} className="marketing-footer-link" onClick={() => setView(l.view)}>
              {l.label}
            </button>
          ))}
        </nav>
        <p className="marketing-footer-copy">© 2026 Volunti. Alla rättigheter förbehållna.</p>
      </div>
    </footer>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";

const links = [
  { label: "Om oss", path: "/about" },
  { label: "Hitta uppdrag", path: "/find-missions" },
  { label: "För organisationer", path: "/organizations" },
  { label: "Vår påverkan", path: "/impact" },
  { label: "FAQ", path: "/faq" },
  { label: "Integritetspolicy", path: "/privacy" },
];

export default function MarketingFooter() {
  const navigate = useNavigate();

  return (
    <footer className="marketing-footer">
      <div className="marketing-footer-inner">
        <span className="marketing-footer-logo">VOLUNTI</span>
        <p className="marketing-footer-tagline">Små insatser. Stor skillnad.</p>
        <nav className="marketing-footer-links">
          {links.map((l) => (
            <button key={l.path} className="marketing-footer-link" onClick={() => navigate(l.path)}>
              {l.label}
            </button>
          ))}
        </nav>
        <p className="marketing-footer-copy">© 2026 Volunti. Alla rättigheter förbehållna.</p>
      </div>
    </footer>
  );
}

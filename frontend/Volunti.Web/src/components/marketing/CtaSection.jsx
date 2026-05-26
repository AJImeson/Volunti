import React from "react";
import { useNavigate } from "react-router-dom";

export default function CtaSection() {
  const navigate = useNavigate();
  return (
    <section className="marketing-cta">
      <div className="marketing-cta-inner">
        <h2 className="marketing-cta-title">Redo att börja bidra?</h2>
        <p className="marketing-cta-subtitle">
          Gå med tusentals volontärer som redan gör skillnad varje dag.
        </p>
        <button
          className="marketing-btn-primary"
          onClick={() => navigate("/landing")}
        >
          Skapa konto gratis
        </button>
      </div>
    </section>
  );
}

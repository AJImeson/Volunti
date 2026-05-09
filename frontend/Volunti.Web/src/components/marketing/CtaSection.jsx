import React from "react";

export default function CtaSection({ setView }) {
  return (
    <section className="marketing-cta">
      <div className="marketing-cta-inner">
        <h2 className="marketing-cta-title">Redo att börja bidra?</h2>
        <p className="marketing-cta-subtitle">
          Gå med tusentals volontärer som redan gör skillnad varje dag.
        </p>
        <button
          className="marketing-btn-primary"
          onClick={() => setView("landing")}
        >
          Skapa konto gratis
        </button>
      </div>
    </section>
  );
}

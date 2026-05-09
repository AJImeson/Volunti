import React from "react";

export default function HeroSection({ setView }) {
  return (
    <section className="marketing-hero">
      <div className="hero-shape hero-shape-1" />
      <div className="hero-shape hero-shape-2" />
      <div className="hero-shape hero-shape-3" />
      <div className="marketing-hero-content">
        <h1 className="marketing-hero-title">
          Gör skillnad<br />nära dig
        </h1>
        <p className="marketing-hero-subtitle">
          Volunti kopplar samman volontärer med organisationer som behöver hjälp.
          Hitta uppdrag, engagera dig och gör avtryck i ditt lokalsamhälle.
        </p>
        <div className="marketing-hero-cta">
          <button className="marketing-btn-primary" onClick={() => setView("landing")}>
            Kom igång gratis
          </button>
          <button className="marketing-btn-outline" onClick={() => setView("landing")}>
            Logga in
          </button>
        </div>
      </div>
    </section>
  );
}

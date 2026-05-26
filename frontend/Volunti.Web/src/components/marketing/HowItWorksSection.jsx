import React from "react";

const steps = [
  {
    number: "01",
    title: "Skapa konto",
    desc: "Registrera dig på 2 minuter och berätta vad du vill bidra med.",
  },
  {
    number: "02",
    title: "Hitta uppdrag",
    desc: "Bläddra bland uppdrag eller låt oss rekommendera baserat på dina intressen.",
  },
  {
    number: "03",
    title: "Bidra",
    desc: "Anmäl dig, genomför uppdraget och gör skillnad i ditt lokalsamhälle.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="marketing-how" id="how-it-works">
      <div className="marketing-section-inner">
        <h2 className="marketing-section-title">Hur det fungerar</h2>
        <p className="marketing-section-subtitle">Tre enkla steg för att komma igång.</p>
        <div className="marketing-steps">
          {steps.map((s) => (
            <div key={s.number} className="marketing-step">
              <span className="step-number">{s.number}</span>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

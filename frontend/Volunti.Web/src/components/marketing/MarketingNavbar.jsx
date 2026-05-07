import React from "react";

export default function MarketingNavbar({ setView }) {
  return (
    <nav className="marketing-nav">
      <span className="marketing-nav-logo">VOLUNTI</span>
      <div className="marketing-nav-links">
        <a href="#how-it-works">Hur det fungerar</a>
        <a href="#features">Om oss</a>
      </div>
      <button className="marketing-nav-login" onClick={() => setView("login")}>
        Logga in
      </button>
    </nav>
  );
}

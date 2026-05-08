import React from "react";

export default function MarketingNavbar({ setView }) {
  return (
    <nav className="marketing-nav">
      <span className="marketing-nav-logo" onClick={() => setView("marketing")}>
        VOLUNTI
      </span>
      <div className="marketing-nav-links">
        <button className="marketing-nav-link" onClick={() => setView("marketing")}>
          Hem
        </button>
        <button className="marketing-nav-link" onClick={() => setView("find-missions")}>
          Hitta uppdrag
        </button>
        <button className="marketing-nav-link" onClick={() => setView("organizations")}>
          För organisationer
        </button>
        <button className="marketing-nav-link" onClick={() => setView("about")}>
          Om oss
        </button>
      </div>
      <button className="marketing-nav-login" onClick={() => setView("login")}>
        Logga in
      </button>
    </nav>
  );
}

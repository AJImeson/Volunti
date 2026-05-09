import React from "react";

export default function MarketingNavbar({ setView }) {
  const navigate = (view) => {
    setView(view);
    window.scrollTo(0, 0);
  };

  return (
    <nav className="marketing-nav">
      <span className="marketing-nav-logo" onClick={() => navigate("marketing")}>
        VOLUNTI
      </span>
      <div className="marketing-nav-links">
        <button className="marketing-nav-link" onClick={() => navigate("marketing")}>
          Hem
        </button>
        <button className="marketing-nav-link" onClick={() => navigate("find-missions")}>
          Hitta uppdrag
        </button>
        <button className="marketing-nav-link" onClick={() => navigate("organizations")}>
          För organisationer
        </button>
        <button className="marketing-nav-link" onClick={() => navigate("about")}>
          Om oss
        </button>
      </div>
      <button className="marketing-nav-login" onClick={() => navigate("landing")}>
        Logga in
      </button>
    </nav>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";

export default function MarketingNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="marketing-nav">
      <span className="marketing-nav-logo" onClick={() => navigate("/")}>
        VOLUNTI
      </span>
      <div className="marketing-nav-links">
        <button className="marketing-nav-link" onClick={() => navigate("/")}>
          Hem
        </button>
        <button className="marketing-nav-link" onClick={() => navigate("/find-missions")}>
          Hitta uppdrag
        </button>
        <button className="marketing-nav-link" onClick={() => navigate("/organizations")}>
          För organisationer
        </button>
        <button className="marketing-nav-link" onClick={() => navigate("/about")}>
          Om oss
        </button>
      </div>
      <button className="marketing-nav-login" onClick={() => navigate("/landing")}>
        Logga in
      </button>
    </nav>
  );
}

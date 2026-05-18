import React from "react";

const posts = [
  {
    org: "Röda Korset",
    initial: "RK",
    bgColor: "#c0392b",
    title: "Soppa till hemlösa i city",
    desc: "Vi behöver hjälp med att dela ut varm soppa. Lugnt och meningsfullt arbete som gör stor skillnad.",
    tags: ["Matutdelning", "Engångsuppdrag"],
    date: "18 maj, 14:00",
    plats: "Sergels torg, Stockholm",
  },
  {
    org: "Svenska kyrkan",
    initial: "SK",
    bgColor: "#2a43a6",
    title: "Strandstädning Långholmen",
    desc: "Rensa stranden från skräp tillsammans med engagerade grannar och frivilliga från hela staden.",
    tags: ["Miljö", "Helger"],
    date: "25 maj, 10:00",
    plats: "Långholmen, Stockholm",
  },
  {
    org: "Naturskyddsföreningen",
    initial: "NF",
    bgColor: "#27ae60",
    title: "Plantera träd i Hagaparken",
    desc: "En dag med spade och gummistövlar för en grönare och friskare stad. Fika ingår!",
    tags: ["Miljö", "Återkommande"],
    date: "1 juni, 09:00",
    plats: "Hagaparken, Stockholm",
  },
];

export default function CommunitySection() {
  return (
    <section className="marketing-community" id="community">
      <div className="marketing-section-inner">
        <h2 className="marketing-section-title">Vad händer just nu</h2>
        <p className="marketing-section-subtitle">
          Uppdrag läggs upp av organisationer varje dag. Hitta något som passar dig.
        </p>
        <div className="community-posts-grid">
          {posts.map((p) => (
            <div key={p.title} className="community-card">
              <div className="community-card-header">
                <div className="community-org-avatar" style={{ background: p.bgColor }}>
                  {p.initial}
                </div>
                <span className="community-org-name">{p.org}</span>
              </div>
              <h3 className="community-card-title">{p.title}</h3>
              <p className="community-card-desc">{p.desc}</p>
              <div className="community-card-tags">
                {p.tags.map((t) => (
                  <span key={t} className="community-tag">{t}</span>
                ))}
              </div>
              <div className="community-card-meta">
                <span>📅 {p.date}</span>
                <span>📍 {p.plats}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="community-more-text">
          + hundratals fler uppdrag väntar på dig
        </p>
      </div>
    </section>
  );
}

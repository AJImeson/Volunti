import React, { useState, useEffect } from "react";
import "./VolunteerProfileModal.css";
import { getVolunteerProfile } from "../../services/jobService";
import { getProfileImageUrl } from "../../services/authService";

export default function VolunteerProfileModal({ volunteerId, onClose }) {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("Bio");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getVolunteerProfile(volunteerId)
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError("Kunde inte ladda profilen.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [volunteerId]);

  const fullName = profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
    : "";

  return (
    <div className="vp-overlay" onClick={onClose}>
      <div className="vp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="vp-close" onClick={onClose} aria-label="Stäng">
          ×
        </button>

        {isLoading && <p className="vp-status">Laddar profil...</p>}
        {error && <p className="vp-status vp-error">{error}</p>}

        {profile && (
          <>
            <div className="vp-header">
              <div className="vp-avatar">
                {profile.profileImageUrl ? (
                  <img
                    src={getProfileImageUrl(profile.profileImageUrl)}
                    alt=""
                  />
                ) : (
                  <span>{(fullName.charAt(0) || "?").toUpperCase()}</span>
                )}
              </div>
              <div className="vp-header-info">
                <h2>{fullName}</h2>
                <p className="vp-meta">
                  {profile.municipality || "—"} · Volontär
                </p>
                {profile.bio && <p className="vp-bio">{profile.bio}</p>}
              </div>
            </div>

            <div className="vp-tabs">
              {["Bio", "Licenser", "Erfarenhet"].map((t) => (
                <button
                  key={t}
                  className={`vp-tab ${activeTab === t ? "active" : ""}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="vp-content">
              {activeTab === "Bio" && (
                <>
                  <Section title="Skills & Kompetens">
                    {profile.skills?.length > 0 ? (
                      <div className="vp-tags">
                        {profile.skills.map((s) => (
                          <span key={s.id} className="vp-tag">
                            {s.title}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="vp-empty">Inga skills tillagda</p>
                    )}
                  </Section>

                  <Section title="Intressen">
                    {profile.interests?.length > 0 ? (
                      <div className="vp-tags">
                        {profile.interests.map((i) => (
                          <span key={i.id} className="vp-tag">
                            {i.title}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="vp-empty">Inga intressen tillagda</p>
                    )}
                  </Section>

                  <Section title="Kontaktuppgifter">
                    <div className="vp-contact">
                      <p>
                        <strong>Mejl:</strong> {profile.email || "—"}
                      </p>
                      <p>
                        <strong>Telefon:</strong> {profile.phoneNumber || "—"}
                      </p>
                    </div>
                  </Section>
                </>
              )}

              {activeTab === "Licenser" && (
                <Section title="Körkort">
                  {profile.driverLicense?.length > 0 &&
                  !profile.driverLicense.includes("Nej") ? (
                    <div className="vp-tags">
                      {profile.driverLicense.map((d) => (
                        <span key={d} className="vp-tag">
                          {d}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="vp-empty">Inget körkort</p>
                  )}
                </Section>
              )}

              {activeTab === "Erfarenhet" && (
                <Section title="Tidigare erfarenheter">
                  {profile.experiences?.length > 0 ? (
                    <div className="vp-experiences">
                      {profile.experiences.map((e) => (
                        <div key={e.id} className="vp-exp-card">
                          <h4>{e.title}</h4>
                          {e.organization && <p>{e.organization}</p>}
                          {(e.startDate || e.endDate) && (
                            <p className="vp-exp-date">
                              {formatDate(e.startDate)} –{" "}
                              {formatDate(e.endDate) || "Pågående"}
                            </p>
                          )}
                          {e.description && (
                            <p className="vp-exp-desc">{e.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="vp-empty">Ingen erfarenhet tillagd</p>
                  )}
                </Section>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="vp-section">
      <h3 className="vp-section-title">{title}</h3>
      {children}
    </section>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "short",
  });
}

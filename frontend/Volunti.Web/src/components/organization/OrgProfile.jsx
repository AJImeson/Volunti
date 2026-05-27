import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../profile/Profile.css";
import "./OrgProfile.css";
import BottomNav from "../bottomnav/BottomNav";
import OrgEditModal from "./OrgEditModal";
import AvatarCropModal from "../profile/AvatarCropModal";
import {
  fetchOrgProfile,
  updateOrgProfile,
  uploadProfileImage,
  getProfileImageUrl,
  isLoggedIn,
} from "../../services/authService";

export default function OrgProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Om oss");
  const [org, setOrg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingSection, setEditingSection] = useState(null);

  const [pendingAvatarSrc, setPendingAvatarSrc] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [hoveringAvatar, setHoveringAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      queueMicrotask(() => navigate("/landing"));
      return;
    }

    let cancelled = false;
    fetchOrgProfile()
      .then((data) => {
        if (cancelled) return;
        setOrg(data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError("Kunde inte ladda organisationen.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleSaveSection = async (payload) => {
    const updated = await updateOrgProfile(payload);
    setOrg(updated);
    setEditingSection(null);
  };

  const handleAvatarClick = () => avatarInputRef.current?.click();

  const handleAvatarFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPendingAvatarSrc(reader.result);
    reader.readAsDataURL(file);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const handleAvatarCropSave = async (blob) => {
    setAvatarError("");
    setIsUploadingAvatar(true);
    try {
      const file = new File([blob], "org-profile.jpg", { type: "image/jpeg" });
      const result = await uploadProfileImage(file);
      setOrg((prev) => ({ ...prev, profileImageUrl: result.profileImageUrl }));
      setPendingAvatarSrc(null);
    } catch (err) {
      setAvatarError(
        err.response?.data?.detail || err.message || "Uppladdning misslyckades",
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-wrapper">
        <p style={{ color: "white", textAlign: "center", padding: "3rem" }}>
          Laddar profil...
        </p>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="profile-wrapper">
        <p style={{ color: "white", textAlign: "center", padding: "3rem" }}>
          {error || "Hittade ingen organisation."}
        </p>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <div className="header-blue">
        <div className="top-nav">
          <h1 className="volunti-logo">VOLUNTI</h1>
          <button
            className="settings-icon-btn"
            onClick={() => navigate("/settings")}
            aria-label="Inställningar"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>

        <div className="profile-card">
          <div className="avatar-section">
            <input
              ref={avatarInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              style={{ display: "none" }}
              onChange={handleAvatarFileSelected}
            />
            <div
              className="avatar-container"
              onClick={handleAvatarClick}
              onMouseEnter={() => setHoveringAvatar(true)}
              onMouseLeave={() => setHoveringAvatar(false)}
              role="button"
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              {org.profileImageUrl ? (
                <img
                  src={getProfileImageUrl(org.profileImageUrl)}
                  alt={org.orgName}
                  className="profile-img"
                />
              ) : (
                <div className="avatar-placeholder">
                  Lägg till
                  <br />
                  bild
                </div>
              )}
              {isUploadingAvatar ? (
                <div className="avatar-overlay" style={{ fontSize: "0.75rem" }}>Laddar...</div>
              ) : hoveringAvatar && (
                <div className="avatar-overlay">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              )}
            </div>
            {avatarError && <p className="cv-error-text">{avatarError}</p>}
          </div>

          <div className="profile-info">
            <h2>{org.orgName}</h2>
            <div className="profile-stats">
              {org.city && <span>{org.city}</span>}
              {org.city && <span className="separator">|</span>}
              <span>Organisation</span>
            </div>
            {org.bio && <p className="profile-bio">{org.bio}</p>}
          </div>

          <div className="cv-button-group">
            <button
              className="cv-tag-button"
              onClick={() => setEditingSection("header")}
            >
              Redigera profil
            </button>
          </div>
        </div>

        <div className="tab-menu">
          {["Om oss", "Verifiering", "Aktivitet"].map((t) => (
            <button
              key={t}
              className={`tab-btn ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="content-white">
        <div className="tab-content-anim" key={activeTab}>
          {activeTab === "Om oss" && (
            <>
              <Section
                title="Områden"
                onEdit={() => setEditingSection("areas")}
                editLabel={org.areas?.length ? "Ändra" : "+ Lägg till"}
              >
                {renderTags(org.areas, "Inga områden tillagda")}
              </Section>

              <Section
                title="Målgrupp"
                onEdit={() => setEditingSection("targetGroup")}
                editLabel={org.targetGroup?.length ? "Ändra" : "+ Lägg till"}
              >
                {renderTags(org.targetGroup, "Ingen målgrupp tillagd")}
              </Section>

              <Section
                title="Förutsättningar"
                onEdit={() => setEditingSection("requirements")}
                editLabel={org.requirements?.length ? "Ändra" : "+ Lägg till"}
              >
                {renderTags(org.requirements, "Inga förutsättningar")}
              </Section>

              <Section
                title="Vad du gör"
                onEdit={() => setEditingSection("activities")}
                editLabel={org.activities?.length ? "Ändra" : "+ Lägg till"}
              >
                {org.activities?.length > 0 ? (
                  <div className="experience-list">
                    {org.activities.map((a, i) => (
                      <div key={i} className="exp-card">
                        <h4>{a}</h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#999", fontSize: "13px" }}>
                    Inget angivet
                  </p>
                )}
              </Section>
            </>
          )}

          {activeTab === "Verifiering" && (
            <>
              <Section
                title="Organisationsnummer"
                onEdit={() => setEditingSection("orgNumber")}
                editLabel={org.orgNumber ? "Ändra" : "+ Lägg till"}
              >
                {org.orgNumber ? (
                  <div className="exp-card">
                    <h4>{org.orgNumber}</h4>
                  </div>
                ) : (
                  <p style={{ color: "#999", fontSize: "13px" }}>Ej angivet</p>
                )}
              </Section>

              <Section title="Senast verifierad">
                {org.verifiedAt ? (
                  <div className="exp-card">
                    <h4>
                      {new Date(org.verifiedAt).toLocaleDateString("sv-SE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h4>
                  </div>
                ) : (
                  <p style={{ color: "#999", fontSize: "13px" }}>
                    Inte verifierad än
                  </p>
                )}
              </Section>

              <Section
                title="Kontaktperson"
                onEdit={() => setEditingSection("contactPerson")}
                editLabel={org.contactPersonName ? "Ändra" : "+ Lägg till"}
              >
                {org.contactPersonName ? (
                  <div className="exp-card">
                    <h4>{org.contactPersonName}</h4>
                    {org.contactPersonEmail && <p>{org.contactPersonEmail}</p>}
                    {org.contactPersonPhone && <p>{org.contactPersonPhone}</p>}
                  </div>
                ) : (
                  <p style={{ color: "#999", fontSize: "13px" }}>
                    Ingen kontaktperson tillagd
                  </p>
                )}
              </Section>
            </>
          )}

          {activeTab === "Aktivitet" && (
            <>
              <Section title="Impact Tracking">
                <div className="impact-cards-grid">
                  <div className="impact-square-card">
                    <span className="impact-val">0</span>
                    <span className="impact-lab">Timmar</span>
                  </div>
                  <div className="impact-square-card">
                    <span className="impact-val">0</span>
                    <span className="impact-lab">Uppdrag</span>
                  </div>
                  <div className="impact-square-card">
                    <span className="impact-val">0</span>
                    <span className="impact-lab">Volontärer</span>
                  </div>
                </div>
              </Section>

              <Section title="Tidigare uppdrag">
                <p style={{ color: "#999", fontSize: "13px" }}>
                  Inga slutförda uppdrag än.
                </p>
              </Section>
            </>
          )}
        </div>
      </div>

      {editingSection && (
        <OrgEditModal
          section={editingSection}
          org={org}
          onClose={() => setEditingSection(null)}
          onSave={handleSaveSection}
        />
      )}

      {pendingAvatarSrc && (
        <AvatarCropModal
          imageSrc={pendingAvatarSrc}
          onCancel={() => setPendingAvatarSrc(null)}
          onSave={handleAvatarCropSave}
        />
      )}

      <BottomNav />
    </div>
  );
}

function Section({ title, children, onEdit, editLabel }) {
  return (
    <div className="info-section">
      <div className="section-header">
        <h3>{title}</h3>
        {onEdit && (
          <span className="add-link" onClick={onEdit}>
            {editLabel || "Ändra"}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function renderTags(items, emptyText) {
  if (!items || items.length === 0) {
    return <p style={{ color: "#999", fontSize: "13px" }}>{emptyText}</p>;
  }
  return (
    <div className="tags-container">
      {items.map((item, i) => (
        <span key={i} className="skill-tag">
          {item}
        </span>
      ))}
    </div>
  );
}

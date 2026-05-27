import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useOrgRegister } from "../context/OrgRegisterContext";
import AvatarCropModal from "../profile/AvatarCropModal";
import "../profile/Profile.css";

const OrgRegister1 = () => {
  const navigate = useNavigate();
  const { formData, setFormData, setProfileImage } = useOrgRegister();
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pendingAvatarSrc, setPendingAvatarSrc] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [hoveringAvatar, setHoveringAvatar] = useState(false);
  const [hoverAndra, setHoverAndra] = useState(false);
  const [hoverTaBort, setHoverTaBort] = useState(false);
  const avatarInputRef = useRef(null);

  const handleAvatarClick = () => avatarInputRef.current?.click();

  const handleAvatarFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPendingAvatarSrc(reader.result);
    reader.readAsDataURL(file);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const handleAvatarCropSave = (blob) => {
    const file = new File([blob], "org-profile.jpg", { type: "image/jpeg" });
    setProfileImage(file);
    setAvatarPreview(URL.createObjectURL(blob));
    setPendingAvatarSrc(null);
  };

  const eyeOpen = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const eyeClosed = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (
      !formData.foretagsnamn ||
      !formData.organisationsnummer ||
      !formData.email ||
      !formData.confirmEmail ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrorMsg("Fyll i alla obligatoriska fält.");
      return;
    }

    if (formData.email !== formData.confirmEmail) {
      setErrorMsg("E-postadresserna stämmer inte överens.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Lösenorden stämmer inte överens.");
      return;
    }

    const pwd = formData.password;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    const hasSymbol = /[^a-zA-Z0-9]/.test(pwd);

    if (pwd.length < 12 || !hasUpper || !hasLower || !hasDigit || !hasSymbol) {
      const missing = [];
      if (pwd.length < 12) missing.push("minst 12 tecken");
      if (!hasUpper) missing.push("en stor bokstav");
      if (!hasLower) missing.push("en liten bokstav");
      if (!hasDigit) missing.push("en siffra");
      if (!hasSymbol) missing.push("ett specialtecken");
      setErrorMsg(`Lösenordet måste innehålla: ${missing.join(", ")}.`);
      return;
    }

    setErrorMsg("");
    navigate("/org-register/2");
  };

  return (
    <>
    <div className="auth-wrapper">
      {/* --- TOPPMENY --- */}
      <div className="auth-top-nav">
        <h1
          className="auth-logo"
          onClick={() => navigate("/landing")}
          style={{ cursor: "pointer" }}
        >
          VOLUNTI
        </h1>
        <button className="btn-nav-login" onClick={() => navigate("/login")}>
          Logga in
        </button>
      </div>

      {/* --- VOLONTÄR / ORGANISATION --- */}
      <div className="user-type-toggle">
        <button
          type="button"
          className="user-type-btn"
          onClick={() => navigate("/register")}
        >
          Volontär
        </button>
        <button type="button" className="user-type-btn active">
          Organisation
        </button>
      </div>

      {/* --- HEADER --- */}
      <div className="auth-header">
        <div className="stepper">
          <div className="step-dot active"></div>
          <div className="step-line"></div>
          <div className="step-dot"></div>
          <div className="step-line"></div>
          <div className="step-dot"></div>
          <div className="step-line"></div>
          <div className="step-dot"></div>
        </div>

        <p className="auth-step-text">Steg 1 av 4</p>
        <h2 className="auth-title">Skapa ditt konto</h2>
        <p className="auth-subtitle">
          Fyll i dina uppgifter för att komma igång.
        </p>
      </div>

      {/* --- FORMULÄR --- */}
      <div className="bottom-sheet-card auth-form-container">
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
          style={{ margin: "0 auto 0.3rem", cursor: "pointer", border: avatarPreview ? "none" : "2px dashed var(--gray-border)", background: avatarPreview ? "transparent" : "#f8f9fa" }}
        >
          {avatarPreview ? (
            <img src={avatarPreview} alt="Profilbild" className="profile-img" />
          ) : (
            <div className="avatar-placeholder" style={{ background: "transparent", color: "#999" }}>
              Lägg till
              <br />
              bild
            </div>
          )}
          {avatarPreview && hoveringAvatar && (
            <div className="avatar-overlay">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
          )}
        </div>

        {avatarPreview ? (
          <p style={{ textAlign: "center", fontSize: "0.72rem", marginBottom: "0.75rem", color: "var(--gray-text)" }}>
            <span
              onClick={handleAvatarClick}
              onMouseEnter={() => setHoverAndra(true)}
              onMouseLeave={() => setHoverAndra(false)}
              style={{ color: "var(--primary-blue)", cursor: "pointer", textDecoration: hoverAndra ? "underline" : "none" }}
            >Ändra</span>
            <span style={{ margin: "0 0.35rem" }}>·</span>
            <span
              onClick={() => { setAvatarPreview(null); setProfileImage(null); }}
              onMouseEnter={() => setHoverTaBort(true)}
              onMouseLeave={() => setHoverTaBort(false)}
              style={{ color: "#c0392b", cursor: "pointer", textDecoration: hoverTaBort ? "underline" : "none" }}
            >Ta bort</span>
          </p>
        ) : (
          <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--gray-text)", marginBottom: "0.75rem" }}>
            Profilbild (valfritt)
          </p>
        )}

        <input
          type="text"
          name="foretagsnamn"
          value={formData.foretagsnamn}
          onChange={handleChange}
          className="text-input"
          placeholder="Organisationsnamn *"
        />
        <input
          type="text"
          name="organisationsnummer"
          value={formData.organisationsnummer}
          onChange={handleChange}
          className="text-input"
          placeholder="Organisationsnummer *"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="text-input"
          placeholder="E-postadress *"
          autoComplete="email"
        />
        <input
          type="email"
          name="confirmEmail"
          value={formData.confirmEmail}
          onChange={handleChange}
          className="text-input"
          placeholder="Bekräfta e-postadress *"
          autoComplete="off"
        />
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="text-input"
            placeholder="Lösenord *"
            autoComplete="new-password"
          />
          <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? eyeOpen : eyeClosed}
          </button>
        </div>
        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="text-input"
            placeholder="Bekräfta lösenord *"
            autoComplete="new-password"
          />
          <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? eyeOpen : eyeClosed}
          </button>
        </div>

        {errorMsg && (
          <p style={{ color: "red", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            {errorMsg}
          </p>
        )}

        {/* --- NAVIGERINGSKNAPPAR --- */}
        <div className="input-row" style={{ marginTop: "2rem" }}>
          <button
            className="btn-outline-blue"
            onClick={() => navigate("/landing")}
          >
            Föregående
          </button>
          <button
            className="btn-primary"
            onClick={handleNext}
          >
            Nästa
          </button>
        </div>
      </div>
    </div>

    {pendingAvatarSrc && (
      <AvatarCropModal
        imageSrc={pendingAvatarSrc}
        onCancel={() => setPendingAvatarSrc(null)}
        onSave={handleAvatarCropSave}
      />
    )}
    </>
  );
};

export default OrgRegister1;



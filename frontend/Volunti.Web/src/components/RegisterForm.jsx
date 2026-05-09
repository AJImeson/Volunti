import React, { useState } from "react";
import axios from 'axios'
import { saveSession } from '../services/authService';

export default function RegisterPage({ setView }) {
  /* ==========================================================================
     STATE OCH MINNE
     ========================================================================== */

  const [currentStep, setCurrentStep] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phone: "",
    password: "",
    confirmPassword: "",
    kommun: "",
    korkort: [],
    categories: [],
    availability: [],
    distance: 5,
    distanceAny: false,
    notificationLevel: "Rekommenderat",
    emailNotification: "",
  });

  /* ==========================================================================
     FUNKTIONER FÖR ATT HANTERA DATA OCH NAVIGERING
     ========================================================================== */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errorMsg) setErrorMsg("");
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: false });
    }
  };

  const toggleSelection = (field, value) => {
    setFormData((prev) => {
      const currentList = prev[field];
      if (currentList.includes(value)) {
        return {
          ...prev,
          [field]: currentList.filter((item) => item !== value),
        };
      } else {
        return { ...prev, [field]: [...currentList, value] };
      }
    });

    if (errorMsg) setErrorMsg("");
  };

  const handleKorkortToggle = (typ) => {
    setFormData((prev) => {
      let currentList = [...prev.korkort];

      // 1. Om man klickar på "Nej"
      if (typ === "Nej") {
        if (currentList.includes("Nej")) return { ...prev, korkort: [] }; // Klickar ur Nej
        return { ...prev, korkort: ["Nej"] }; // Klickar i Nej (rensar allt annat)
      }

      // 2. Om man klickar på något annat än Nej, måste Nej rensas bort
      currentList = currentList.filter((item) => item !== "Nej");

      if (currentList.includes(typ)) {
        // Om den redan var ikryssad, ta bort den
        currentList = currentList.filter((item) => item !== typ);
      } else {
        currentList.push(typ);

        //Om man klickar i C, lägg automatiskt till B i bakgrunden (om den inte redan finns)
        if (typ === "C" && !currentList.includes("B")) currentList.push("B");
        // Samma för A och AM
        if (typ === "A" && !currentList.includes("AM")) currentList.push("AM");
      }

      return { ...prev, korkort: currentList };
    });

    if (errorMsg) setErrorMsg("");
    if (fieldErrors.korkort) setFieldErrors({ ...fieldErrors, korkort: false });
  };

  // Kollar vilka knappar som ska gråas ut
  const isKorkortDisabled = (typ) => {
    const { korkort } = formData;

    // B är låst om C är ifyllt
    if (typ === "B" && korkort.includes("C")) return true;

    // AM är låst om A är ifyllt
    if (typ === "AM" && korkort.includes("A")) return true;

    // Om något annat än Nej är ifyllt, lås Nej-knappen
    if (typ === "Nej" && korkort.length > 0 && !korkort.includes("Nej"))
      return true;

    // Om Nej är ifyllt lås alla andra knappar
    if (typ !== "Nej" && korkort.includes("Nej")) return true;

    return false;
  };

  const validateStep = () => {
    setErrorMsg("");
    setFieldErrors({});
    let isValid = true;
    let newErrors = {};

    if (currentStep === 1) {
      if (!formData.firstName) {
        newErrors.firstName = true;
        isValid = false;
      }
      if (!formData.lastName) {
        newErrors.lastName = true;
        isValid = false;
      }
      if (!formData.email) {
        newErrors.email = true;
        isValid = false;
      }
      if (!formData.confirmEmail) {
        newErrors.confirmEmail = true;
        isValid = false;
      }
      if (!formData.phone) {
        newErrors.phone = true;
        isValid = false;
      }
      if (!formData.password) {
        newErrors.password = true;
        isValid = false;
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = true;
        isValid = false;
      }

      if (!isValid) {
        setErrorMsg("Vänligen fyll i alla rödmarkerade fält.");
        setFieldErrors(newErrors);
        return false;
      }

      if (formData.email !== formData.confirmEmail) {
        setErrorMsg("Mejladresserna stämmer inte överens.");
        setFieldErrors({ email: true, confirmEmail: true });
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setErrorMsg("Lösenorden stämmer inte överens.");
        setFieldErrors({ password: true, confirmPassword: true });
        return false;
      }

      const hasNumber = /\d/;
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>_]/;
      if (
        formData.password.length < 8 ||
        !hasNumber.test(formData.password) ||
        !hasSymbol.test(formData.password)
      ) {
        setErrorMsg(
          "Lösenordet måste vara minst 8 tecken och innehålla både en siffra och en symbol.",
        );
        setFieldErrors({ password: true });
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.kommun) {
        newErrors.kommun = true;
        isValid = false;
      }
      if (formData.korkort.length === 0) {
        newErrors.korkort = true;
        isValid = false;
      }

      if (!isValid) {
        setErrorMsg("Vänligen välj kommun och om du har körkort.");
        setFieldErrors(newErrors);
        return false;
      }
    }

    if (currentStep === 3) {
      if (
        formData.categories.length === 0 ||
        formData.availability.length === 0
      ) {
        setErrorMsg(
          "Vänligen välj minst en kategori och en tid du är tillgänglig.",
        );
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
  if (!validateStep()) return;

  if (currentStep < 4) {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  } else {
    try {
      // TODO: PRODUKTION - Använd API_URL från authService istället för hårdkodad URL
      // HUR: Importera API_URL från '../services/authService' och använd `${API_URL}/register/volunteer`
      const response = await axios.post('https://localhost:7007/register/volunteer', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone,
        municipality: formData.kommun,
        driverLicense: formData.korkort.join(', '),
        availability: formData.availability.join(', '),
        maxDistanceKm: formData.distanceAny ? null : formData.distance,
        notificationPreference: formData.notificationLevel,
        emailNotifications: formData.emailNotification === 'Ja',
        interests: formData.categories,
        bio: '',
        profileImageUrl: ''
      });
      saveSession(response.data);
      setView('missions');
    } catch (error) {
      setErrorMsg('Något gick fel vid registreringen. Försök igen.');
    }
  }
};

  const handlePrev = () => {
    setErrorMsg("");
    setFieldErrors({});
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setView("landing");
    }
  };

  const handleLogoClick = () => {
    if (typeof setView === "function") {
      setView("landing");
    }
  };

  /* ==========================================================================
     IKONER
     ========================================================================== */

  const renderIcon = (name) => {
    switch (name) {
      case "eye-open":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        );
      case "eye-closed":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        );
      case "bag":
        return (
          <svg className="feature-icon" viewBox="0 0 24 24">
            <rect x="4" y="7" width="16" height="14" rx="2" />
            <path d="M8 7v-2a4 4 0 0 1 8 0v2" />
          </svg>
        );
      case "bell":
        return (
          <svg className="feature-icon" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        );
      case "info":
        return (
          <svg className="feature-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
      case "message":
        return (
          <svg className="feature-icon" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="9" y1="10" x2="15" y2="10" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        );
      case "heart":
        return (
          <svg className="feature-icon" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        );
      default:
        return null;
    }
  };

  /* ==========================================================================
     SIDANS VISUELLA STRUKTUR
     ========================================================================== */

  return (
    <div className="auth-wrapper">
      {/* --- TOPPMENY --- */}
      <div className="auth-top-nav">
        <h1
          className="auth-logo"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        >
          VOLUNTI
        </h1>
        <button className="btn-nav-login" onClick={() => setView("login")}>
          Logga in
        </button>
      </div>

      {/* --- DYNAMISK HEADER OCH STEGINDIKATOR --- */}
      <div className="auth-header">
        <div className="stepper">
          <div className={`step-dot ${currentStep >= 1 ? "active" : ""}`}></div>
          <div className="step-line"></div>
          <div className={`step-dot ${currentStep >= 2 ? "active" : ""}`}></div>
          <div className="step-line"></div>
          <div className={`step-dot ${currentStep >= 3 ? "active" : ""}`}></div>
          <div className="step-line"></div>
          <div className={`step-dot ${currentStep >= 4 ? "active" : ""}`}></div>
        </div>

        <p className="auth-step-text">Steg {currentStep} av 4</p>

        <h2 className="auth-title">
          {currentStep === 1 && "Skapa ditt konto"}
          {currentStep === 2 && "Berätta lite om dig"}
          {currentStep === 3 && "Vad vill du hjälpa till med?"}
          {currentStep === 4 && "Hur vill du bli notifierad?"}
        </h2>

        {(currentStep === 1 || currentStep === 3) && (
          <p className="auth-subtitle">
            Fyll i dina uppgifter för att komma igång.
          </p>
        )}
        {currentStep === 4 && (
          <p className="auth-subtitle">
            Vi anpassar uppdrag efter dig
            <br />– helt på dina villkor.
          </p>
        )}
      </div>

      {/* --- HUVUDCONTAINER FÖR SJÄLVA FORMULÄRET --- */}
      <div className="bottom-sheet-card auth-form-container">
        {errorMsg && <div className="error-msg-box">{errorMsg}</div>}

        {/* ==========================================================================
            STEG 1: PERSONUPPGIFTER
            ========================================================================== */}
        {currentStep === 1 && (
          <>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`text-input ${fieldErrors.firstName ? "input-error" : ""}`}
              placeholder="Förnamn *"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`text-input ${fieldErrors.lastName ? "input-error" : ""}`}
              placeholder="Efternamn *"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`text-input ${fieldErrors.email ? "input-error" : ""}`}
              placeholder="Mejl *"
            />
            <input
              type="email"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleChange}
              className={`text-input ${fieldErrors.confirmEmail ? "input-error" : ""}`}
              placeholder="Bekräfta mejladress *"
            />

            <div className="phone-section">
              <label className="phone-label">Telefonnummer *</label>
              <div className="phone-input-group">
                <div
                  className={`phone-prefix ${fieldErrors.phone ? "input-error" : ""}`}
                >
                  🇸🇪 +46
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`text-input ${fieldErrors.phone ? "input-error" : ""}`}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`text-input ${fieldErrors.password ? "input-error" : ""}`}
                placeholder="Lösenord *"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword
                  ? renderIcon("eye-open")
                  : renderIcon("eye-closed")}
              </button>
            </div>

            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`text-input ${fieldErrors.confirmPassword ? "input-error" : ""}`}
                placeholder="Bekräfta lösenord *"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword
                  ? renderIcon("eye-open")
                  : renderIcon("eye-closed")}
              </button>
            </div>
          </>
        )}

        {/* ==========================================================================
            STEG 2: KOMMUN OCH KÖRKORT
            ========================================================================== */}
        {currentStep === 2 && (
          <>
            <div className="custom-dropdown-container">
              <div
                className={`select-input ${isDropdownOpen ? "open" : ""} ${fieldErrors.kommun ? "input-error" : ""}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {formData.kommun ? (
                  <span style={{ color: "var(--text-dark)" }}>
                    {formData.kommun}
                  </span>
                ) : (
                  <span style={{ color: "var(--gray-text)" }}>Välj kommun</span>
                )}
              </div>

              {isDropdownOpen && (
                <div className="custom-dropdown-menu">
                  {[
                    "Stockholm",
                    "Göteborg",
                    "Malmö",
                    "Uppsala",
                    "Västerås",
                  ].map((city) => (
                    <div
                      key={city}
                      className="custom-dropdown-item"
                      onClick={() => {
                        setFormData({ ...formData, kommun: city });
                        setIsDropdownOpen(false);
                        if (errorMsg) setErrorMsg("");
                        if (fieldErrors.kommun)
                          setFieldErrors({ ...fieldErrors, kommun: false });
                      }}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <h3 className="form-section-title">Har du körkort?*</h3>
            <div
              className={`radio-group ${fieldErrors.korkort ? "input-error" : ""}`}
              style={
                fieldErrors.korkort
                  ? { padding: "1rem", borderRadius: "8px" }
                  : {}
              }
            >
              {["B", "AM", "A", "C", "Nej"].map((typ) => {
                // Vi använder vår funktion för att kolla om just denna knapp ska vara låst
                const disabled = isKorkortDisabled(typ);

                return (
                  <label
                    key={typ}
                    className={`radio-label ${disabled ? "disabled" : ""}`}
                  >
                    <input
                      type="checkbox"
                      name="korkort"
                      value={typ}
                      onChange={() => handleKorkortToggle(typ)}
                      checked={formData.korkort.includes(typ)}
                      disabled={disabled}
                    />
                    {typ === "B"
                      ? "B (Personbil)"
                      : typ === "AM"
                        ? "AM (Moped)"
                        : typ === "A"
                          ? "A (Motorcykel)"
                          : typ === "C"
                            ? "C (Lastbil)"
                            : "Nej"}
                  </label>
                );
              })}
            </div>

            <h3 className="form-section-title" style={{ marginTop: "1.5rem" }}>
              Har du något intyg?*
            </h3>
            <button className="action-link-btn">+ Ladda upp</button>

            <h3 className="form-section-title" style={{ marginTop: "1.5rem" }}>
              Har du några rekommendationer?
            </h3>
            <button className="action-link-btn">+ Lägg till</button>
          </>
        )}

        {/* ==========================================================================
            STEG 3: UPPDRAG OCH TILLGÄNGLIGHET
            ========================================================================== */}
        {currentStep === 3 && (
          <>
            <h3 className="form-section-title" style={{ marginTop: 0 }}>
              Vad vill du hjälpa med?
            </h3>

            <div className="chip-group">
              {[
                "Skola",
                "Äldreomsorg",
                "Miljö",
                "Barn och ungdom",
                "Matutdelning",
                "Djur",
                "Administration",
                "Digital hjälp",
              ].map((cat) => (
                <button
                  key={cat}
                  className={`chip-btn ${formData.categories.includes(cat) ? "active" : ""}`}
                  onClick={() => toggleSelection("categories", cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h3 className="form-section-title">När är du tillgänglig?</h3>
            <div className="chip-group">
              {[
                "Vardag",
                "Kvällar",
                "Helger",
                "Engångsuppdrag",
                "Återkommande",
              ].map((time) => (
                <button
                  key={time}
                  className={`chip-btn ${formData.availability.includes(time) ? "active" : ""}`}
                  onClick={() => toggleSelection("availability", time)}
                >
                  {time}
                </button>
              ))}
            </div>

            {!formData.distanceAny && (
              <div className="range-container">
                <div className="range-header">
                  <h3 className="range-title">Avstånd</h3>
                  <span className="range-value">{formData.distance}km</span>
                </div>
                <input
                  type="range"
                  name="distance"
                  min="1"
                  max="50"
                  value={formData.distance}
                  onChange={handleChange}
                  className="range-input"
                />
              </div>
            )}

            <label
              className="checkbox-row"
              style={formData.distanceAny ? { marginTop: "1.5rem" } : {}}
            >
              <input
                type="checkbox"
                name="distanceAny"
                checked={formData.distanceAny}
                onChange={handleChange}
              />
              <span>Det spelar ingen roll</span>
            </label>
          </>
        )}

        {/* ==========================================================================
            STEG 4: NOTIFIKATIONSINSTÄLLNINGAR
            ========================================================================== */}
        {currentStep === 4 && (
          <>
            <div className="notification-section">
              <span className="notification-label">Rekommenderat</span>
              <div
                className={`notification-card ${formData.notificationLevel === "Rekommenderat" ? "active" : ""}`}
                onClick={() =>
                  setFormData({
                    ...formData,
                    notificationLevel: "Rekommenderat",
                  })
                }
              >
                <div className="card-header">
                  <label
                    className="radio-label"
                    style={{ gap: 0, margin: 0, cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      checked={formData.notificationLevel === "Rekommenderat"}
                      readOnly
                    />
                  </label>
                  <p className="card-title">Lagom med notiser som passar dig</p>
                </div>
                <div className="card-features">
                  <div className="feature-item">
                    {renderIcon("bag")} Uppdrag
                  </div>
                  <div className="feature-item">
                    {renderIcon("bell")} Påminnelser
                  </div>
                  <div className="feature-item">
                    {renderIcon("info")} Viktiga uppdateringar
                  </div>
                  <div className="feature-item">
                    {renderIcon("message")} Utvalda inlägg i community
                  </div>
                </div>
              </div>
            </div>

            <div className="notification-section">
              <span className="notification-label">Minimalt</span>
              <div
                className={`notification-card ${formData.notificationLevel === "Minimalt" ? "active" : ""}`}
                onClick={() =>
                  setFormData({ ...formData, notificationLevel: "Minimalt" })
                }
              >
                <div className="card-header">
                  <label
                    className="radio-label"
                    style={{ gap: 0, margin: 0, cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      checked={formData.notificationLevel === "Minimalt"}
                      readOnly
                    />
                  </label>
                  <p className="card-title">Endast det viktigaste</p>
                </div>
                <div className="card-features">
                  <div className="feature-item">
                    {renderIcon("bag")} Uppdrag
                  </div>
                  <div className="feature-item">
                    {renderIcon("bell")} Påminnelser
                  </div>
                  <div className="feature-item">
                    {renderIcon("info")} Viktiga uppdateringar
                  </div>
                </div>
              </div>
            </div>

            <div className="notification-section">
              <span className="notification-label">Allt</span>
              <div
                className={`notification-card ${formData.notificationLevel === "Allt" ? "active" : ""}`}
                onClick={() =>
                  setFormData({ ...formData, notificationLevel: "Allt" })
                }
              >
                <div className="card-header">
                  <label
                    className="radio-label"
                    style={{ gap: 0, margin: 0, cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      checked={formData.notificationLevel === "Allt"}
                      readOnly
                    />
                  </label>
                  <p className="card-title">Alla notiser och aktiviteter</p>
                </div>
                <div className="card-features">
                  <div className="feature-item">
                    {renderIcon("bag")} Uppdrag
                  </div>
                  <div className="feature-item">
                    {renderIcon("bell")} Påminnelser
                  </div>
                  <div className="feature-item">
                    {renderIcon("info")} Alla uppdateringar
                  </div>
                  <div className="feature-item">
                    {renderIcon("message")} Nya inlägg i communityn
                  </div>
                  <div className="feature-item">
                    {renderIcon("heart")} Likes & Kommentarer
                  </div>
                </div>
              </div>
            </div>

            <h3 className="form-section-title">
              Vill du bli notifierad via mejl?*
            </h3>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="emailNotification"
                  value="Ja"
                  onChange={handleChange}
                  checked={formData.emailNotification === "Ja"}
                />
                Ja
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="emailNotification"
                  value="Nej"
                  onChange={handleChange}
                  checked={formData.emailNotification === "Nej"}
                />
                Nej, enbart via appen.
              </label>
            </div>
          </>
        )}

        {/* ==========================================================================
            NAVIGERINGSKNAPPAR LÄNGST NER
            ========================================================================== */}
        <div className="input-row" style={{ marginTop: "2rem" }}>
          <button className="btn-outline-blue" onClick={handlePrev}>
            Föregående
          </button>

          <button className="btn-primary" onClick={handleNext}>
            {currentStep === 4 ? "Kom igång" : "Nästa"}
          </button>
        </div>
      </div>
    </div>
  );
}

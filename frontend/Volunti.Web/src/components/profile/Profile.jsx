import React, { useState, useEffect } from "react";
import "./Profile.css";
import AvatarCropModal from "./AvatarCropModal";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  clearSession,
  fetchCurrentUserProfile,
  isLoggedIn,
  fetchSkills,
  addSkill,
  removeSkill,
  fetchInterests,
  addInterest,
  removeInterest,
  fetchFiles,
  uploadFile,
  deleteFile,
  downloadFile,
  fetchExperiences,
  addExperience,
  removeExperience,
  uploadProfileImage,
  getProfileImageUrl,
} from "../../services/authService";

/* ==========================================================================
   TAG SEKTION
   ========================================================================== */
function EditableTagSection({
  title,
  items,
  onAdd,
  onRemove,
  emptyText,
  placeholder,
  presetOptions = [],
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const itemTitlesLower = items.map((i) => i.title.toLowerCase());
  const availablePresets = presetOptions.filter(
    (preset) => !itemTitlesLower.includes(preset.toLowerCase()),
  );

  const handlePresetClick = async (title) => {
    setError("");
    setIsSaving(true);
    try {
      await onAdd(title);
    } catch (err) {
      setError(err.message || "Kunde inte spara");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCustom = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setError("");
    setIsSaving(true);
    try {
      await onAdd(trimmed);
      setInputValue("");
    } catch (err) {
      setError(err.message || "Kunde inte spara");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveCustom();
    } else if (e.key === "Escape") {
      setIsExpanded(false);
      setInputValue("");
      setError("");
    }
  };

  return (
    <section className="info-section">
      <div className="section-header">
        <h3>{title}</h3>
        <span
          className="add-link"
          onClick={() => setIsExpanded((v) => !v)}
          role="button"
          tabIndex={0}
        >
          {isExpanded ? "× Stäng" : "+ Lägg till"}
        </span>
      </div>

      <div className="tags-container">
        {items.length > 0
          ? items.map((item) => (
              <span key={item.id} className="skill-tag removable-tag">
                {item.title}
                <button
                  className="tag-remove-btn"
                  onClick={() => onRemove(item.id)}
                  aria-label={`Ta bort ${item.title}`}
                  title="Ta bort"
                >
                  ×
                </button>
              </span>
            ))
          : !isExpanded && (
              <span style={{ color: "#999", fontSize: 14 }}>{emptyText}</span>
            )}
      </div>

      {isExpanded && (
        <div className="add-tag-section">
          {availablePresets.length > 0 && (
            <>
              <p className="add-tag-hint">Välj från förslag:</p>
              <div className="preset-chips">
                {availablePresets.map((preset) => (
                  <button
                    key={preset}
                    className="preset-chip"
                    onClick={() => handlePresetClick(preset)}
                    disabled={isSaving}
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </>
          )}

          <p className="add-tag-hint">Eller skriv eget:</p>
          <div className="add-tag-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="add-tag-input"
              disabled={isSaving}
            />
            <button
              className="add-tag-save-btn"
              onClick={handleSaveCustom}
              disabled={isSaving || !inputValue.trim()}
            >
              {isSaving ? "..." : "Spara"}
            </button>
          </div>

          {error && <p className="add-tag-error">{error}</p>}
        </div>
      )}
    </section>
  );
}

/* ==========================================================================
   FIL SEKTION
   ========================================================================== */
function FileSection({
  title,
  category,
  files,
  onUpload,
  onRemove,
  onDownload,
  emptyText = "Inget tillagt än.",
  acceptTypes = ".pdf,.jpg,.jpeg,.png",
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError("");
      if (!titleInput) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setTitleInput(nameWithoutExt);
      }
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      setError("Välj en fil först.");
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      await onUpload({
        file: selectedFile,
        title: titleInput.trim() || selectedFile.name,
        category,
      });
      setSelectedFile(null);
      setTitleInput("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsExpanded(false);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Uppladdning misslyckades.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setSelectedFile(null);
    setTitleInput("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <section className="info-section">
      <div className="section-header">
        <h3>{title}</h3>
        <span
          className="add-link"
          onClick={() => setIsExpanded((v) => !v)}
          role="button"
          tabIndex={0}
        >
          {isExpanded ? "× Stäng" : "+ Lägg till"}
        </span>
      </div>

      {files.length > 0 ? (
        <div className="file-list">
          {files.map((f) => (
            <div key={f.id} className="file-card">
              <div
                className="file-card-content"
                onClick={() => onDownload(f.id, f.originalFileName)}
                role="button"
                tabIndex={0}
              >
                <div className="file-icon">📄</div>
                <div className="file-info">
                  <p className="file-title">{f.title || f.originalFileName}</p>
                  <p className="file-meta">
                    {f.originalFileName} · {formatFileSize(f.fileSizeBytes)}
                  </p>
                </div>
              </div>
              <button
                className="file-remove-btn"
                onClick={() => onRemove(f.id)}
                aria-label={`Ta bort ${f.title || f.originalFileName}`}
                title="Ta bort"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        !isExpanded && (
          <p style={{ color: "#999", fontSize: 14, margin: 0 }}>{emptyText}</p>
        )
      )}

      {isExpanded && (
        <div className="file-upload-form">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptTypes}
            onChange={handleFileChange}
            className="file-input-hidden"
            id={`file-input-${category}`}
          />
          <label htmlFor={`file-input-${category}`} className="file-pick-btn">
            {selectedFile
              ? `📄 ${selectedFile.name}`
              : "📎 Välj fil (PDF, JPG, PNG)"}
          </label>

          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="Titel (t.ex. 'Intyg från Röda Korset')"
            className="add-tag-input"
            disabled={isSaving}
          />

          {error && <p className="add-tag-error">{error}</p>}

          <div className="file-form-actions">
            <button
              className="add-tag-save-btn"
              onClick={handleSave}
              disabled={isSaving || !selectedFile}
            >
              {isSaving ? "Laddar upp..." : "Spara"}
            </button>
            <button
              className="file-cancel-btn"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Avbryt
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ==========================================================================
   ERFARENHET SEKTION
   ========================================================================== */
function ExperienceSection({
  experiences,
  onAdd,
  onRemove,
  onUploadAttachment,
  onDownloadAttachment,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [form, setForm] = useState({
    title: "",
    organization: "",
    startDate: "",
    endDate: "",
    description: "",
    hoursTotal: "",
  });
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = React.useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAttachmentFile(file);
  };

  const resetForm = () => {
    setForm({
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      hoursTotal: "",
    });
    setAttachmentFile(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("Titel krävs (t.ex. 'Lärare').");
      return;
    }

    const isValidDate = (dateStr) => {
      if (!dateStr) return true;
      const d = new Date(dateStr);
      const year = d.getFullYear();
      return year >= 1950 && year <= 2099 && !isNaN(d.getTime());
    };

    if (!isValidDate(form.startDate) || !isValidDate(form.endDate)) {
      setError("Ogiltigt datum. Året måste vara mellan 1950 och 2099.");
      return;
    }

    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      setError("Slutdatum måste vara efter startdatum.");
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        organization: form.organization.trim() || null,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        description: form.description.trim() || null,
        hoursTotal: form.hoursTotal ? Number(form.hoursTotal) : null,
      };

      const created = await onAdd(payload);

      if (attachmentFile && created?.id) {
        await onUploadAttachment(created.id, attachmentFile);
      }

      resetForm();
      setIsExpanded(false);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Kunde inte spara erfarenheten.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    setIsExpanded(false);
  };

  const formatDateRange = (start, end) => {
    if (!start && !end) return null;
    const fmt = (d) => {
      if (!d) return null;
      const date = new Date(d);
      return date.toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "short",
      });
    };
    const startStr = fmt(start);
    const endStr = fmt(end) || "Pågående";
    return startStr ? `${startStr} – ${endStr}` : endStr;
  };

  return (
    <section className="info-section">
      <div className="section-header">
        <h3>Erfarenhet</h3>
        <span
          className="add-link"
          onClick={() => setIsExpanded((v) => !v)}
          role="button"
          tabIndex={0}
        >
          {isExpanded ? "× Stäng" : "+ Lägg till"}
        </span>
      </div>

      {experiences.length > 0 ? (
        <div className="experience-list">
          {experiences.map((exp) => (
            <div key={exp.id} className="exp-card exp-card-detailed">
              <div className="exp-card-main">
                <div className="card-header-row">
                  <h4>{exp.title}</h4>
                  <button
                    className="file-remove-btn"
                    onClick={() => onRemove(exp.id)}
                    aria-label={`Ta bort ${exp.title}`}
                    title="Ta bort"
                  >
                    ×
                  </button>
                </div>
                {exp.organization && (
                  <p className="exp-org">{exp.organization}</p>
                )}
                {(exp.startDate || exp.endDate) && (
                  <p className="exp-date">
                    {formatDateRange(exp.startDate, exp.endDate)}
                    {exp.hoursTotal ? ` · ${exp.hoursTotal} tim` : ""}
                  </p>
                )}
                {exp.description && (
                  <p className="exp-description">{exp.description}</p>
                )}
                {exp.attachment && (
                  <button
                    className="exp-attachment-btn"
                    onClick={() =>
                      onDownloadAttachment(
                        exp.attachment.id,
                        exp.attachment.originalFileName,
                      )
                    }
                  >
                    📎 {exp.attachment.title || exp.attachment.originalFileName}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isExpanded && (
          <p style={{ color: "#999", fontSize: 14, margin: 0 }}>
            Ingen erfarenhet tillagd än.
          </p>
        )
      )}

      {isExpanded && (
        <div className="experience-form">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Titel * (t.ex. Lärare)"
            className="add-tag-input"
            disabled={isSaving}
          />

          <input
            type="text"
            name="organization"
            value={form.organization}
            onChange={handleChange}
            placeholder="Organisation (t.ex. Gislaveds Gymnasium)"
            className="add-tag-input"
            disabled={isSaving}
          />

          <div className="experience-date-row">
            <div className="experience-date-field">
              <label className="experience-date-label">Från</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="add-tag-input"
                disabled={isSaving}
                min="1950-01-01"
                max="2099-12-31"
              />
            </div>
            <div className="experience-date-field">
              <label className="experience-date-label">Till</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="add-tag-input"
                disabled={isSaving}
                min="1950-01-01"
                max="2099-12-31"
              />
            </div>
          </div>

          <input
            type="number"
            name="hoursTotal"
            value={form.hoursTotal}
            onChange={handleChange}
            placeholder="Totala timmar (valfritt)"
            className="add-tag-input"
            disabled={isSaving}
            min="0"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Beskrivning (valfritt)"
            className="add-tag-input"
            disabled={isSaving}
            rows={3}
            style={{ fontFamily: "inherit", resize: "vertical" }}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="file-input-hidden"
            id="experience-attachment-input"
          />
          <label
            htmlFor="experience-attachment-input"
            className="file-pick-btn"
          >
            {attachmentFile
              ? `📄 ${attachmentFile.name}`
              : "📎 Lägg till bilaga (valfritt)"}
          </label>

          {error && <p className="add-tag-error">{error}</p>}

          <div className="file-form-actions">
            <button
              className="add-tag-save-btn"
              onClick={handleSave}
              disabled={isSaving || !form.title.trim()}
            >
              {isSaving ? "Sparar..." : "Spara"}
            </button>
            <button
              className="file-cancel-btn"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Avbryt
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ==========================================================================
   PROFILE
   ========================================================================== */
const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Bio");
  const [user, setUser] = useState(getCurrentUser());
  const [isLoading, setIsLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [experiences, setExperiences] = useState([]);

  const [cvFile, setCvFile] = useState(null);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [cvError, setCvError] = useState("");
  const cvInputRef = React.useRef(null);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const avatarInputRef = React.useRef(null);
  const [pendingAvatarSrc, setPendingAvatarSrc] = useState(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      queueMicrotask(() => navigate("/landing"));
      return;
    }

    let cancelled = false;

    Promise.all([
      fetchCurrentUserProfile(),
      fetchSkills().catch(() => []),
      fetchInterests().catch(() => []),
      fetchFiles("cv").catch(() => []),
      fetchFiles("certificate").catch(() => []),
      fetchExperiences().catch(() => []),
    ])
      .then(
        ([freshUser, skillsList, interestsList, cvList, certList, expList]) => {
          if (cancelled) return;
          setUser(freshUser);
          setSkills(skillsList || []);
          setInterests(interestsList || []);
          setCvFile(cvList?.[0] || null);
          setCertificates(certList || []);
          setExperiences(expList || []);
        },
      )
      .catch((err) => {
        if (cancelled) return;
        console.error("Kunde inte hämta profil:", err);
        if (err.message?.includes("Sessionen")) {
          navigate("/landing");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  /* ==========================================================================
     SKILLS
     ========================================================================== */
  const handleAddSkill = async (title) => {
    const newSkill = await addSkill(title);
    setSkills((prev) =>
      prev.some((s) => s.id === newSkill.id) ? prev : [...prev, newSkill],
    );
  };

  const handleRemoveSkill = async (id) => {
    await removeSkill(id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  /* ==========================================================================
     INTRESSEN
     ========================================================================== */
  const handleAddInterest = async (title) => {
    const newInterest = await addInterest(title);
    setInterests((prev) =>
      prev.some((i) => i.id === newInterest.id) ? prev : [...prev, newInterest],
    );
  };

  const handleRemoveInterest = async (id) => {
    await removeInterest(id);
    setInterests((prev) => prev.filter((i) => i.id !== id));
  };

  /* ==========================================================================
     ERFARENHET
     ========================================================================== */
  const handleAddExperience = async (payload) => {
    const created = await addExperience(payload);
    setExperiences((prev) => [created, ...prev]);
    return created;
  };

  const handleRemoveExperience = async (id) => {
    if (!window.confirm("Ta bort denna erfarenhet?")) return;
    try {
      await removeExperience(id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert("Kunde inte ta bort: " + (err.message || "okänt fel"));
    }
  };

  const handleExperienceAttachmentUpload = async (experienceId, file) => {
    const uploaded = await uploadFile({
      file,
      category: "experience-attachment",
      title: "Bilaga",
      experienceId,
    });
    setExperiences((prev) =>
      prev.map((e) =>
        e.id === experienceId
          ? {
              ...e,
              attachment: {
                id: uploaded.id,
                originalFileName: uploaded.originalFileName,
                title: uploaded.title,
                fileSizeBytes: uploaded.fileSizeBytes,
              },
            }
          : e,
      ),
    );
  };

  /* ==========================================================================
     INTYG
     ========================================================================== */
  const handleCertificateUpload = async ({ file, title, category }) => {
    const uploaded = await uploadFile({ file, title, category });
    setCertificates((prev) => [uploaded, ...prev]);
  };

  const handleCertificateRemove = async (id) => {
    if (!window.confirm("Ta bort detta intyg?")) return;
    try {
      await deleteFile(id);
      setCertificates((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Kunde inte ta bort: " + (err.message || "okänt fel"));
    }
  };

  const handleFileDownload = async (fileId, fallbackName) => {
    try {
      await downloadFile(fileId, fallbackName);
    } catch (err) {
      alert("Kunde inte ladda ner filen: " + (err.message || "okänt fel"));
    }
  };

  /* ==========================================================================
     CV
     ========================================================================== */
  const handleCvButtonClick = () => {
    if (cvFile) {
      downloadFile(cvFile.id, cvFile.originalFileName);
    } else {
      cvInputRef.current?.click();
    }
  };

  const handleCvFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvError("");
    setIsUploadingCv(true);
    try {
      const uploaded = await uploadFile({
        file,
        category: "cv",
        title: "CV",
      });
      setCvFile(uploaded);
    } catch (err) {
      setCvError(
        err.response?.data?.detail || err.message || "Uppladdning misslyckades",
      );
    } finally {
      setIsUploadingCv(false);
      if (cvInputRef.current) cvInputRef.current.value = "";
    }
  };

  const handleCvRemove = async () => {
    if (!cvFile) return;
    if (!window.confirm("Är du säker på att du vill ta bort ditt CV?")) return;

    try {
      await deleteFile(cvFile.id);
      setCvFile(null);
    } catch (err) {
      setCvError(err.message || "Kunde inte ta bort CV");
    }
  };

  /* ==========================================================================
     PROFILBILD
     ========================================================================== */
  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Läs filen som data URL och öppna crop modalen
    const reader = new FileReader();
    reader.onload = () => {
      setPendingAvatarSrc(reader.result);
    };
    reader.readAsDataURL(file);

    // Återställ input så samma fil kan väljas igen
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const handleAvatarCropSave = async (blob) => {
    setAvatarError("");
    setIsUploadingAvatar(true);
    try {
      // Konvertera blob till en File så uploadProfileImage kan hantera den
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      const result = await uploadProfileImage(file);
      setUser((prev) => ({ ...prev, profileImageUrl: result.profileImageUrl }));
      setPendingAvatarSrc(null);
    } catch (err) {
      setAvatarError(
        err.response?.data?.detail || err.message || "Uppladdning misslyckades",
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarCropCancel = () => {
    setPendingAvatarSrc(null);
  };

  /* ==========================================================================
     RENDER
     ========================================================================== */
  if (!user && isLoading) {
    return (
      <div className="profile-wrapper">
        <div style={{ padding: "3rem", textAlign: "center", color: "white" }}>
          Laddar profil...
        </div>
      </div>
    );
  }

  if (!user) return null;

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName;
  const availability = user.availability || [];
  const driverLicense = user.driverLicense || [];

  return (
    <div className="profile-wrapper">
      <header className="header-blue">
        <div className="top-nav">
          <h1 className="volunti-logo">VOLUNTI</h1>
          <div className="settings-nav-icons">
            <button
              className="icon-btn"
              aria-label="Tillbaka till uppdrag"
              onClick={() => navigate("/missions")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </button>
            <button
              className="icon-btn"
              aria-label="Inställningar"
              onClick={() => navigate("/settings")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
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
              role="button"
              tabIndex={0}
              title={
                user.profileImageUrl
                  ? "Klicka för att byta bild"
                  : "Klicka för att lägga till bild"
              }
            >
              {user.profileImageUrl ? (
                <img
                  src={getProfileImageUrl(user.profileImageUrl)}
                  alt="Profile"
                  className="profile-img"
                />
              ) : (
                <div className="avatar-placeholder">
                  <span>
                    Lägg till
                    <br />
                    bild
                  </span>
                </div>
              )}
              {isUploadingAvatar && (
                <div className="avatar-overlay">
                  <span>...</span>
                </div>
              )}
            </div>

            {avatarError && <p className="cv-error-text">{avatarError}</p>}

            <input
              ref={cvInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: "none" }}
              onChange={handleCvFileSelected}
            />
            <div className="cv-button-group">
              <button
                className="cv-tag-button"
                onClick={handleCvButtonClick}
                disabled={isUploadingCv}
                title={
                  cvFile
                    ? `Ladda ner: ${cvFile.originalFileName}`
                    : "Ladda upp CV"
                }
              >
                {isUploadingCv ? "..." : cvFile ? "CV ✓" : "+ CV"}
              </button>
              {cvFile && (
                <button
                  className="cv-remove-btn"
                  onClick={handleCvRemove}
                  title="Ta bort CV"
                  aria-label="Ta bort CV"
                >
                  ×
                </button>
              )}
            </div>
            {cvError && <p className="cv-error-text">{cvError}</p>}
          </div>

          <div className="profile-info">
            <h2>{fullName}</h2>
            <div className="profile-stats">
              <span>{user.municipality || "–"}</span>
              <span className="separator">|</span>
              <span>Volontär</span>
            </div>
            <p className="profile-bio">{user.bio || `${user.email}`}</p>
          </div>
        </div>

        <nav className="tab-menu">
          <button
            className={`tab-btn ${activeTab === "Bio" ? "active" : ""}`}
            onClick={() => setActiveTab("Bio")}
          >
            Bio
          </button>
          <button
            className={`tab-btn ${activeTab === "Licenser" ? "active" : ""}`}
            onClick={() => setActiveTab("Licenser")}
          >
            Licenser
          </button>
          <button
            className={`tab-btn ${activeTab === "Impact" ? "active" : ""}`}
            onClick={() => setActiveTab("Impact")}
          >
            Impact
          </button>
        </nav>
      </header>

      <main className="content-white">
        {activeTab === "Bio" && (
          <>
            <EditableTagSection
              title="Skills & Kompetens"
              items={skills}
              onAdd={handleAddSkill}
              onRemove={handleRemoveSkill}
              emptyText="Inga skills tillagda än"
              placeholder="T.ex. Snickeri, Tolkning..."
              presetOptions={[
                "Lärare",
                "Spanska",
                "Engelska",
                "Matlagning",
                "Dator",
                "Bil",
                "Första hjälpen",
                "Social",
                "Barn",
              ]}
            />

            <EditableTagSection
              title="Intressen"
              items={interests}
              onAdd={handleAddInterest}
              onRemove={handleRemoveInterest}
              emptyText="Inga intressen tillagda än"
              placeholder="T.ex. Musik, Sport..."
              presetOptions={[
                "Skola",
                "Äldreomsorg",
                "Miljö",
                "Barn och ungdom",
                "Matutdelning",
                "Djur",
                "Administration",
                "Digital hjälp",
              ]}
            />

            <section className="info-section">
              <div className="section-header">
                <h3>Tillgänglighet</h3>
              </div>
              <div className="tags-container">
                {availability.length > 0 ? (
                  availability.map((time) => (
                    <span key={time} className="skill-tag">
                      {time}
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#999", fontSize: 14 }}>
                    Inte angivet
                  </span>
                )}
              </div>
            </section>

            <section className="info-section">
              <div className="section-header">
                <h3>Kontaktuppgifter</h3>
              </div>
              <div className="experience-list">
                <div className="exp-card">
                  <h4>Mejl</h4>
                  <p>{user.email}</p>
                </div>
                {user.phoneNumber && (
                  <div className="exp-card">
                    <h4>Telefon</h4>
                    <p>{user.phoneNumber}</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === "Licenser" && (
          <>
            <section className="info-section">
              <div className="section-header">
                <h3>Körkort</h3>
              </div>
              <div className="tags-container">
                {driverLicense.length > 0 && !driverLicense.includes("Nej") ? (
                  driverLicense.map((typ) => (
                    <span key={typ} className="skill-tag">
                      {typ}
                    </span>
                  ))
                ) : (
                  <span style={{ color: "#999", fontSize: 14 }}>
                    Inget körkort
                  </span>
                )}
              </div>
            </section>

            <ExperienceSection
              experiences={experiences}
              onAdd={handleAddExperience}
              onRemove={handleRemoveExperience}
              onUploadAttachment={handleExperienceAttachmentUpload}
              onDownloadAttachment={handleFileDownload}
            />

            <FileSection
              title="Intyg & Rekommendationer"
              category="certificate"
              files={certificates}
              onUpload={handleCertificateUpload}
              onRemove={handleCertificateRemove}
              onDownload={handleFileDownload}
              emptyText="Inga intyg tillagda än."
            />
          </>
        )}

        {activeTab === "Impact" && (
          <>
            <section className="info-section">
              <div className="section-header">
                <h3>Impact Tracking</h3>
              </div>
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
                  <span className="impact-lab">Organisationer</span>
                </div>
              </div>
              <p
                style={{
                  color: "#999",
                  fontSize: 13,
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                Du har inte slutfört några uppdrag än.
              </p>
            </section>
          </>
        )}

        <button
          onClick={() => {
            clearSession();
            navigate("/landing");
          }}
          style={{
            marginTop: 24,
            padding: "10px 20px",
            border: "1.5px solid #2F44A5",
            borderRadius: 12,
            background: "white",
            color: "#2F44A5",
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
          }}
        >
          Logga ut
        </button>
      </main>
      {pendingAvatarSrc && (
        <AvatarCropModal
          imageSrc={pendingAvatarSrc}
          onCancel={handleAvatarCropCancel}
          onSave={handleAvatarCropSave}
        />
      )}
    </div>
  );
};

export default Profile;

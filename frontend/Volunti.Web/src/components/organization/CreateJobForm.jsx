import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateJobForm.css";
import { createJob, getJobById, updateJob } from "../../services/jobService";

const REQUIREMENTS = [
  { id: "backgroundCheck", label: "Belastningsregister krävs" },
  { id: "drivingLicense", label: "Körkort krävs" },
  { id: "ageLimit18", label: "Minst 18 år" },
  { id: "physicalFitness", label: "Fysisk förmåga (kan lyfta tungt)" },
  { id: "swedishFluency", label: "Flytande svenska" },
];

const CATEGORIES = [
  { value: "Gardening", label: "Miljö" },
  { value: "AnimalCare", label: "Djur" },
  { value: "SocialWork", label: "Socialt" },
  { value: "Teaching", label: "Utbildning" },
  { value: "Healthcare", label: "Hälsa" },
  { value: "Sports", label: "Sport & Fritid" },
  { value: "EventSupport", label: "Kultur" },
  { value: "Administration", label: "Övrigt" },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  startTime: "",
  endTime: "",
  address: "",
  city: "",
  isUrgent: false,
  requirements: [],
};

function toLocalInput(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function CreateJobForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingJob, setIsLoadingJob] = useState(isEditMode);
  const [serverError, setServerError] = useState("");

  // Ladda befintligt jobb i redigeringsläge
  useEffect(() => {
    if (!isEditMode) return;

    let cancelled = false;
    getJobById(id)
      .then((job) => {
        if (cancelled) return;
        setFormData({
          title: job.title || "",
          description: job.description || "",
          category: job.category || "",
          startTime: toLocalInput(job.startTime),
          endTime: toLocalInput(job.endTime),
          address: job.address || "",
          city: job.city || "",
          isUrgent: job.isUrgent || false,
          requirements: job.requirements || [],
        });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setServerError("Kunde inte ladda uppdraget.");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingJob(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, isEditMode]);

  const toggleRequirement = (reqId) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.includes(reqId)
        ? prev.requirements.filter((r) => r !== reqId)
        : [...prev.requirements, reqId],
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (fieldErrors[name])
      setFieldErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = true;
    if (!formData.category) errors.category = true;
    if (!formData.startTime) errors.startTime = true;
    if (!formData.endTime) errors.endTime = true;
    if (
      formData.startTime &&
      formData.endTime &&
      formData.endTime <= formData.startTime
    )
      errors.endTime = "Sluttid måste vara efter starttid";
    if (!formData.city.trim()) errors.city = true;
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setIsLoading(true);
    setServerError("");
    try {
      if (isEditMode) {
        await updateJob(id, formData);
      } else {
        await createJob(formData);
      }
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err.response?.data?.detail ||
          err.response?.data ||
          "Något gick fel, försök igen.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM);
    setFieldErrors({});
    setSubmitted(false);
  };

  if (isLoadingJob) {
    return (
      <div className="create-job-wrapper">
        <div className="create-job-card">
          <p style={{ textAlign: "center", padding: "2rem" }}>
            Laddar uppdrag...
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="create-job-wrapper">
        <div className="create-job-card">
          <div className="create-job-success">
            <div className="create-job-success-icon">✓</div>
            <h2>
              {isEditMode
                ? "Uppdraget har uppdaterats!"
                : "Uppdraget är skapat!"}
            </h2>
            <p>
              {isEditMode
                ? "Ändringarna har sparats."
                : "Volontärer kan nu se och ansöka till uppdraget."}
            </p>
            {!isEditMode && (
              <button className="btn-primary" onClick={handleReset}>
                Skapa nytt uppdrag
              </button>
            )}
            <button
              className="btn-outline-blue"
              onClick={() => navigate("/org-dashboard")}
            >
              Tillbaka till dashboarden
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-job-wrapper">
      <div className="create-job-card">
        <h2 className="create-job-title">
          {isEditMode ? "Redigera uppdrag" : "Publicera nytt uppdrag"}
        </h2>
        <p className="create-job-subtitle">
          {isEditMode
            ? "Uppdatera information om uppdraget."
            : "Fyll i information om uppdraget du söker volontärer till."}
        </p>

        <form onSubmit={handleSubmit} className="create-job-form" noValidate>
          <div className="create-job-field">
            <label className="create-job-label">Titel *</label>
            <input
              type="text"
              name="title"
              className={`text-input${fieldErrors.title ? " input-error" : ""}`}
              placeholder="Ex. Hjälp med sopsortering i parken"
              value={formData.title}
              onChange={handleChange}
            />
            {fieldErrors.title && (
              <span className="field-error-msg">Titel är obligatorisk</span>
            )}
          </div>

          <div className="create-job-field">
            <label className="create-job-label">Beskrivning</label>
            <textarea
              name="description"
              className="text-input create-job-textarea"
              placeholder="Beskriv vad uppdraget innebär, vad volontären ska göra och vad som krävs..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="create-job-field">
            <label className="create-job-label">Kategori *</label>
            <select
              name="category"
              className={`text-input create-job-select${fieldErrors.category ? " input-error" : ""}`}
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Välj kategori</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {fieldErrors.category && (
              <span className="field-error-msg">Välj en kategori</span>
            )}
          </div>

          <div className="input-row">
            <div className="create-job-field">
              <label className="create-job-label">Starttid *</label>
              <input
                type="datetime-local"
                name="startTime"
                className={`text-input${fieldErrors.startTime ? " input-error" : ""}`}
                value={formData.startTime}
                onChange={handleChange}
              />
              {fieldErrors.startTime && (
                <span className="field-error-msg">Ange starttid</span>
              )}
            </div>
            <div className="create-job-field">
              <label className="create-job-label">Sluttid *</label>
              <input
                type="datetime-local"
                name="endTime"
                className={`text-input${fieldErrors.endTime ? " input-error" : ""}`}
                value={formData.endTime}
                onChange={handleChange}
              />
              {fieldErrors.endTime && (
                <span className="field-error-msg">
                  {typeof fieldErrors.endTime === "string"
                    ? fieldErrors.endTime
                    : "Ange sluttid"}
                </span>
              )}
            </div>
          </div>

          <div className="input-row">
            <div className="create-job-field">
              <label className="create-job-label">Adress</label>
              <input
                type="text"
                name="address"
                className="text-input"
                placeholder="Gatuadress"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="create-job-field">
              <label className="create-job-label">Stad *</label>
              <input
                type="text"
                name="city"
                className={`text-input${fieldErrors.city ? " input-error" : ""}`}
                placeholder="Ex. Stockholm"
                value={formData.city}
                onChange={handleChange}
              />
              {fieldErrors.city && (
                <span className="field-error-msg">Ange stad</span>
              )}
            </div>
          </div>

          <div className="create-job-field">
            <label className="create-job-label">Krav på volontären</label>
            <div className="create-job-requirements">
              {REQUIREMENTS.map((req) => (
                <label key={req.id} className="create-job-requirement-item">
                  <input
                    type="checkbox"
                    className="create-job-checkbox"
                    checked={formData.requirements.includes(req.id)}
                    onChange={() => toggleRequirement(req.id)}
                  />
                  {req.label}
                </label>
              ))}
            </div>
          </div>

          <div className="create-job-urgent">
            <input
              type="checkbox"
              id="isUrgent"
              name="isUrgent"
              checked={formData.isUrgent}
              onChange={handleChange}
              className="create-job-checkbox"
            />
            <label htmlFor="isUrgent" className="create-job-urgent-label">
              Markera som brådskande
            </label>
          </div>

          {serverError && <div className="error-msg-box">{serverError}</div>}

          <div className="create-job-actions">
            <button
              type="button"
              className="btn-outline-blue"
              onClick={() => navigate("/org-dashboard")}
            >
              Avbryt
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading
                ? isEditMode
                  ? "Sparar..."
                  : "Publicerar..."
                : isEditMode
                  ? "Spara ändringar"
                  : "Publicera uppdrag"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

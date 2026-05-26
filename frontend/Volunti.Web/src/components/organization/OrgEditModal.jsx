import React, { useState } from "react";
import "./OrgEditModal.css";

const SECTION_CONFIG = {
  header: {
    title: "Redigera profil",
    fields: [
      { name: "orgName", label: "Organisationsnamn", type: "text" },
      { name: "city", label: "Ort", type: "text" },
      { name: "bio", label: "Kort beskrivning", type: "textarea" },
      { name: "website", label: "Webbplats", type: "text" },
    ],
  },
  areas: {
    title: "Områden",
    listField: "areas",
    placeholder: "T.ex. Skola, Socialt arbete, Miljö",
  },
  targetGroup: {
    title: "Målgrupp",
    listField: "targetGroup",
    placeholder: "T.ex. Barn (6-12), Ungdom (13-18)",
  },
  requirements: {
    title: "Förutsättningar",
    listField: "requirements",
    placeholder: "T.ex. Har bil, Social kompetens",
  },
  activities: {
    title: "Vad du gör",
    listField: "activities",
    placeholder: "T.ex. Hjälper till vid läxhjälp",
  },
  orgNumber: {
    title: "Organisationsnummer",
    fields: [{ name: "orgNumber", label: "Organisationsnummer", type: "text" }],
  },
  contactPerson: {
    title: "Kontaktperson",
    fields: [
      { name: "contactPersonName", label: "Namn", type: "text" },
      { name: "contactPersonEmail", label: "E-post", type: "email" },
      { name: "contactPersonPhone", label: "Telefon", type: "text" },
    ],
  },
};

export default function OrgEditModal({ section, org, onClose, onSave }) {
  const config = SECTION_CONFIG[section];
  const isList = Boolean(config?.listField);

  // För text-fält
  const [fieldValues, setFieldValues] = useState(() => {
    if (isList) return {};
    const initial = {};
    config?.fields?.forEach((f) => {
      initial[f.name] = org[f.name] || "";
    });
    return initial;
  });

  // För list-fält
  const [items, setItems] = useState(() => {
    if (!isList) return [];
    return org[config.listField] || [];
  });
  const [newItem, setNewItem] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  if (!config) return null;

  const handleAddItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    if (items.includes(trimmed)) {
      setNewItem("");
      return;
    }
    setItems((prev) => [...prev, trimmed]);
    setNewItem("");
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      const payload = isList ? { [config.listField]: items } : fieldValues;
      await onSave(payload);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Kunde inte spara.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="oem-overlay" onClick={onClose}>
      <div className="oem-modal" onClick={(e) => e.stopPropagation()}>
        <div className="oem-header">
          <h3>{config.title}</h3>
          <button className="oem-close" onClick={onClose} aria-label="Stäng">
            ×
          </button>
        </div>

        <form className="oem-body" onSubmit={handleSubmit}>
          {isList ? (
            <>
              <p className="oem-hint">{config.placeholder}</p>

              {items.length > 0 && (
                <div className="oem-list">
                  {items.map((item, i) => (
                    <div key={i} className="oem-list-item">
                      <span>{item}</span>
                      <button
                        type="button"
                        className="oem-list-remove"
                        onClick={() => handleRemoveItem(i)}
                        aria-label={`Ta bort ${item}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="oem-add-row">
                <input
                  type="text"
                  className="oem-input"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddItem();
                    }
                  }}
                  placeholder="Lägg till..."
                  disabled={isSaving}
                />
                <button
                  type="button"
                  className="oem-add-btn"
                  onClick={handleAddItem}
                  disabled={!newItem.trim() || isSaving}
                >
                  Lägg till
                </button>
              </div>
            </>
          ) : (
            config.fields.map((f) => (
              <div key={f.name} className="oem-field">
                <label>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    className="oem-input oem-textarea"
                    value={fieldValues[f.name]}
                    onChange={(e) =>
                      setFieldValues((prev) => ({
                        ...prev,
                        [f.name]: e.target.value,
                      }))
                    }
                    rows={3}
                    disabled={isSaving}
                  />
                ) : (
                  <input
                    type={f.type}
                    className="oem-input"
                    value={fieldValues[f.name]}
                    onChange={(e) =>
                      setFieldValues((prev) => ({
                        ...prev,
                        [f.name]: e.target.value,
                      }))
                    }
                    disabled={isSaving}
                  />
                )}
              </div>
            ))
          )}

          {error && <p className="oem-error">{error}</p>}

          <div className="oem-actions">
            <button
              type="button"
              className="oem-btn-cancel"
              onClick={onClose}
              disabled={isSaving}
            >
              Avbryt
            </button>
            <button type="submit" className="oem-btn-save" disabled={isSaving}>
              {isSaving ? "Sparar..." : "Spara"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { createGroup } from "../../services/messageService";

export default function CreateGroupModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Namn krävs.");
      return;
    }
    if (trimmedName.length > 100) {
      setError("Namnet får vara max 100 tecken.");
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      const result = await createGroup(trimmedName, description.trim() || null);
      onCreated?.(result.id);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setError("Endast organisationer kan skapa grupper.");
      } else {
        setError(err.response?.data?.detail || "Kunde inte skapa gruppen.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="cg-overlay" onClick={onClose}>
      <div className="cg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cg-header">
          <h3>Skapa ny grupp</h3>
          <button
            type="button"
            className="cg-close"
            onClick={onClose}
            aria-label="Stäng"
          >
            ×
          </button>
        </div>

        <form className="cg-body" onSubmit={handleSubmit}>
          <label className="cg-label">
            Namn på gruppen *
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="T.ex. Volontärer Stockholm"
              className="cg-input"
              maxLength={100}
              disabled={isSaving}
              autoFocus
            />
          </label>

          <label className="cg-label">
            Beskrivning (valfritt)
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Vad används gruppen till?"
              className="cg-textarea"
              maxLength={500}
              disabled={isSaving}
              rows={3}
            />
          </label>

          {error && <p className="cg-error">{error}</p>}

          <div className="cg-actions">
            <button
              type="button"
              className="cg-btn-cancel"
              onClick={onClose}
              disabled={isSaving}
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="cg-btn-save"
              disabled={isSaving || !name.trim()}
            >
              {isSaving ? "Skapar..." : "Skapa grupp"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

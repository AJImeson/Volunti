import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import "./AvatarCropModal.css";

/* ==========================================================================
   AVATAR CROP MODAL
   ========================================================================== */
export default function AvatarCropModal({ imageSrc, onCancel, onSave }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsSaving(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      onSave(blob);
    } catch (err) {
      console.error("Kunde inte beskära bilden:", err);
      setIsSaving(false);
    }
  };

  return (
    <div className="crop-backdrop" onClick={onCancel}>
      <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
        <div className="crop-header">
          <h2>Justera bilden</h2>
          <p>Dra och zooma för att välja vad som syns</p>
        </div>

        <div className="crop-area">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="crop-controls">
          <label className="crop-zoom-label">
            Zoom
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.01}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="crop-zoom-slider"
            />
          </label>
        </div>

        <div className="crop-actions">
          <button
            className="file-cancel-btn"
            onClick={onCancel}
            disabled={isSaving}
          >
            Avbryt
          </button>
          <button
            className="add-tag-save-btn"
            onClick={handleSave}
            disabled={isSaving || !croppedAreaPixels}
          >
            {isSaving ? "Sparar..." : "Spara"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   HJÄLPFUNKTION FÖR CANVAS BESKÄRNING
   ========================================================================== */
async function getCroppedBlob(imageSrc, pixelCrop) {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas-konvertering misslyckades"));
      },
      "image/jpeg",
      0.9,
    );
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

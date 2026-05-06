import React, { useRef } from "react";

export default function MediaForm({
  existingImages,
  setExistingImages,
  newImages,
  setNewImages,
  removedImages,
  setRemovedImages,
  imageAttrs,
  setImageAttrs,
}) {
  const fileInputRef = useRef(null);

  // ================== UPLOAD IMAGE (NEW) ==================
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const formatted = files.map((file) => ({
      // id: crypto.randomUUID(),               // ✅ stable id
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),               // ✅ stable id
      file,                                 // ✅ real File
      url: URL.createObjectURL(file),        // ✅ preview
    }));

    setNewImages((prev) => [...prev, ...formatted]);
    e.target.value = ""; // reset input
  };
  // =======================================================

  // ================== REMOVE IMAGE ==================
  const removeImage = (img, isExisting) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((i) => i !== img));
      setRemovedImages((prev) => [...prev, img]); // ✅ mark for delete
    } else {
      setNewImages((prev) => prev.filter((i) => i.id !== img.id));
    }
  };
  // ==================================================

  return (
    <div className="border p-3 rounded">
      <h4>Media</h4>

      <div className="row g-3 mt-3">
        <div className="col-md-6">
          <label htmlFor="image-upload" className="d-flex align-items-center gap-2 mb-2 btn btn-outline-secondary w-100 justify-content-center py-3">
            <span className="fs-4">📁</span>
            <span>Upload Images</span>
          </label>
          <input
            id="image-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="visually-hidden"
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="image-capture" className="d-flex align-items-center gap-2 mb-2 btn btn-outline-secondary w-100 justify-content-center py-3">
            <span className="fs-4">📸</span>
            <span>Capture Images</span>
          </label>
          <input
            id="image-capture"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={handleImageUpload}
            className="visually-hidden"
          />
        </div>
      </div>

      {/* EXISTING IMAGES */}
      <h6 className="mt-4">Existing Images</h6>
      <div className="d-flex gap-2 flex-wrap">
        {existingImages.map((img) => (
          <div key={img} className="border rounded p-2 text-center" style={{ width: 160 }}>
            <img src={`${process.env.REACT_APP_BACKEND}${img.url}`} width="150" className="mb-2 rounded" />
            <button
              className="btn btn-sm btn-danger"
              onClick={() => removeImage(img, true)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* NEW IMAGES */}
      <h6 className="mt-4">New Images</h6>
      <div className="d-flex gap-2 flex-wrap">
        {newImages.map((img) => (
          <div key={img.id} className="border rounded p-2 text-center" style={{ width: 160 }}>
            <img src={img.url} width="150" className="mb-2 rounded" />
            <button
              className="btn btn-sm btn-danger"
              onClick={() => removeImage(img, false)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

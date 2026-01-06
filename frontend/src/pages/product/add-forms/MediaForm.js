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

      {/* Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        // capture="environment"        // ✅ camera support
        multiple
        onChange={handleImageUpload}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"        // ✅ camera support
        multiple
        onChange={handleImageUpload}
      />

      {/* EXISTING IMAGES */}
      <h6 className="mt-3">Existing Images</h6>
      <div className="d-flex gap-2 flex-wrap">
        {existingImages.map((img) => (
          <div key={img} className="border p-2">
            {/* {img.url} */}
            <img src={`${process.env.REACT_APP_BACKEND}${img.url}`} width="150" />
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
      <h6 className="mt-3">New Images</h6>
      <div className="d-flex gap-2 flex-wrap">
        {newImages.map((img) => (
          <div key={img.id} className="border p-2">
            <img src={img.url} width="150" />
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

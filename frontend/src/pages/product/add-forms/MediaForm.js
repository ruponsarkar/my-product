// MediaForm.js
import React, { useState, useEffect, useRef } from "react";
import Modal from "../../../components/modal/modal";
import ImgAttributes from "./utils/imgAttributes";
import { uploadProductImage } from "../../../api/services/product/productApi";

export default function MediaForm({ handleChange, form, productId }) {
  const [images, setImages] = useState([]);
  const [imageAttrs, setImageAttrs] = useState({}); // <-- map: filename -> { attrName: [values] }
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgForm, setImgForm] = useState({});

  const handleOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // when uploading, give each image a stable id and keep file
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file, i) => ({
      id: `${Date.now()}-${i}`, // stable unique id
      url: URL.createObjectURL(file),
      file, // real File for upload
    }));

    // Append new images
    setImages((prev) => [...prev, ...newImages]);

    // Optionally initialize attributes entries (empty object)
    const newAttrEntries = {};
    newImages.forEach((img) => {
      const key = img.file?.name || img.id;
      if (!imageAttrs[key]) {
        newAttrEntries[key] = {};
      }
    });
    if (Object.keys(newAttrEntries).length > 0) {
      setImageAttrs((prev) => ({ ...prev, ...newAttrEntries }));
    }

    // reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index) => {
    const img = images[index];
    const key = img?.file?.name || img?.id;
    setImages((prev) => prev.filter((_, i) => i !== index));
    // remove attrs entry
    if (key) {
      setImageAttrs((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  // Called by ImgAttributes when attributes change for a particular image
  const handleAttributesUpdate = (key, attrsObject) => {
    // key = filename or id
    setImageAttrs((prev) => ({ ...prev, [key]: { ...(prev[key] || {}), ...attrsObject } }));
  };

  // Example: expose images + attributes together to parent on Save (if you want)
  const saveAllToParent = () => {
    // don't write attributes into `form` — return them separately or call a different handler
    // Example: if parent expects handleChange for images only, we send images
    // if (typeof handleChange === "function") {
    //   handleChange({ target: { name: "images", value: images } });
    // }
    // Caller can separately read imageAttrs via some callback — here we log
    console.log("imageAttrs (object by filename):", imageAttrs);
    updateImage(imageAttrs);
  };

  const updateImage = async () => {
    const formData = new FormData();
    images.forEach((img) => formData.append("images", img.file));
    formData.append("attributes", JSON.stringify(imageAttrs));

    const res = await uploadProductImage(productId, formData);
    console.log("upload image response: ", res);

  }

  return (
    <>
      <div className="row mb-4 p-3 border rounded">
        <h4>Media</h4>

        {/* Upload Images */}
        <div className="mt-3 col-md-12">
          <label>Images</label>
          <input
            ref={fileInputRef}
            multiple
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={handleImageUpload}
          />
        </div>

        {/* Preview */}
        {images.length > 0 && (
          <div className="d-flex flex-wrap gap-3 mt-3">
            {images.map((img, i) => {
              const key = img.file?.name || img.id;
              const attrsForThis = imageAttrs[key];

              return (
                <div
                  key={img.id}
                  className="position-relative border rounded p-2"
                  style={{ width: "220px", textAlign: "center", backgroundColor: "white" }}
                >
                  <img
                    src={img.url}
                    alt={`preview-${i}`}
                    style={{ width: "100%", height: "auto", objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-primary mt-1"
                    onClick={() => handleOpen(img)}
                  >
                    Edit attrs
                  </button>{" "}
                  &nbsp;
                  <button
                    type="button"
                    className="btn btn-sm btn-danger mt-1"
                    onClick={() => removeImage(i)}
                  >
                    X
                  </button>

                  <div style={{ textAlign: "left", marginTop: 8 }}>
                    {attrsForThis && Object.keys(attrsForThis).length > 0 ? (
                      Object.entries(attrsForThis).map(([k, v]) => (
                        <div key={`${key}-${k}`}>
                          <strong>{k}:</strong> {Array.isArray(v) ? v.join(", ") : v}
                        </div>
                      ))
                    ) : (
                      <div>No attributes</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Video Upload */}
        <div className="mt-3 col-md-6">
          <label>Upload Video</label>
          <input type="file" accept="video/*" />
        </div>

        {/* Video Link */}
        <div className="mt-3">
          <label>Video Link</label>
          <input
            type="text"
            className="form-control"
            name="videoLink"
            value={form.videoLink || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <Modal
        open={open}
        handleClose={handleClose}
        content={
          <ImgAttributes
            form={form}
            imgForm={imgForm}
            setImgForm={setImgForm}
            handleAttributeChange={() => { }}
            handleChange={() => { }}
            images={images}
            selectedImage={selectedImage}
            setImages={setImages}
            imageAttrs={imageAttrs}
            setImageAttrs={setImageAttrs}
            onAttributesUpdate={handleAttributesUpdate}
          />
        }
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={saveAllToParent} className="btn btn-success">
          Save (images → form.images)
        </button>
        &nbsp;
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => console.log("attrs map:", imageAttrs)}
        >
          Log attrs
        </button>
      </div>
    </>
  );
}

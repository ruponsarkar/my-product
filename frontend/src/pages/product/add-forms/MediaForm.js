import React, { useState, useEffect, useRef } from "react";
import Modal from "../../../components/modal/modal";
import ImgAttributes from "./utils/imgAttributes";

export default function MediaForm({ handleChange, form }) {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);


  const handleOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Initialize from form (only once)
  // useEffect(() => {
  //   if (form?.images && Array.isArray(form.images) && form.images.length > 0) {
  //     setImages(form.images);
  //   }
  // }, [form?.images]);

  // Sync local state to parent form
  // useEffect(() => {
  //   handleChange({
  //     target: { name: "images", value: images },
  //   });
  // }, [images, handleChange]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file, i) => ({
      id: i + 1,
      url: URL.createObjectURL(file),
      file, // keep actual File for upload later
      // attributes: [
      //   {
      //     name: 'colour',
      //     value: ['black', 'white']
      //   },
      //   {
      //     name: 'test',
      //     value: ['a', 'b']
      //   }
      // ],
      // attributes: [
      //   {
      //     colour: ['black', 'white'],
      //     test: ['a', 'b']
      //   }
      // ],


    }));

    setImages((prev) => [...prev, ...newImages]);

    // reset file input (so selecting same file again works)
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

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
            {images.map((img, i) => (
              <div
                key={i}
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
                  className="btn btn-sm btn-danger mt-1"
                  onClick={() => handleOpen(img)}
                >
                  +
                </button> &nbsp;
                <button
                  type="button"
                  className="btn btn-sm btn-danger mt-1"
                  onClick={() => removeImage(i)}
                >
                  X
                </button>

                {/* <div>
                  {img.attributes.map((attribute, index) => (
                    <div key={index}>
                      <strong>{attribute.name}: </strong>
                      {attribute.value.map((value, valueIndex) => (
                        <span key={valueIndex}>
                          {value}
                          {valueIndex < attribute.value.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  ))}
                </div> */}

                <div>
                  {Array.isArray(img.attributes) && img.attributes.length > 0 ? (
                    img.attributes.flatMap((attribute, index) => {
                      // Case 1: canonical shape → { name, value: [...] }
                      if (attribute.name && Array.isArray(attribute.value)) {
                        return (
                          <div key={`${index}-${attribute.name}`}>
                            <strong>{attribute.name}:</strong>{" "}
                            {attribute.value.join(", ")}
                          </div>
                        );
                      }

                      // Case 2: old shape → { colour: [...], test: [...] }
                      if (typeof attribute === "object") {
                        return Object.entries(attribute).map(([key, values]) => (
                          <div key={`${index}-${key}`}>
                            <strong>{key}:</strong>{" "}
                            {Array.isArray(values) ? values.join(", ") : values}
                          </div>
                        ));
                      }

                      // Fallback (if attribute is invalid)
                      return null;
                    })
                  ) : (
                    <div>No attributes</div>
                  )}
                </div>



              </div>
            ))}
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

      {console.log("on here form ", form)}

      <Modal
        open={open}
        handleClose={handleClose}
        content={
          <ImgAttributes
            form={form}
            handleChange={handleChange}
            images={images}
            selectedImage={selectedImage}
            setImages={setImages}
          />
        } />


    </>
  );
}

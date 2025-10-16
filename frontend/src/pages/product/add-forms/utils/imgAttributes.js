import React, { useState, useEffect } from "react";
import MultiSelectInput from "../../../../components/form/multiselect";

/**
 * Helper: normalize attributes to the canonical array-of-{name, value} shape
 * Accepts:
 *  - [{ name: 'colour', value: ['a','b'] }, ...]
 *  - or [{ colour: ['a','b'], test: ['x'] }]  <-- older shape you had in handleImageUpload
 * Returns: [{ name, value }]
 */
function normalizeAttributes(attributes = []) {
  if (!Array.isArray(attributes)) return [];

  // If already in canonical shape (has name prop), return copy
  if (attributes.length > 0 && attributes[0] && typeof attributes[0].name === "string") {
    return attributes.map((a) => ({
      name: a.name,
      value: Array.isArray(a.value) ? [...a.value] : (a.value ? [a.value] : []),
    }));
  }

  // If first element is an object with keys as attribute names (older shape)
  if (attributes.length > 0 && typeof attributes[0] === "object" && !attributes[0].name) {
    const obj = attributes[0];
    return Object.keys(obj).map((key) => ({
      name: key,
      value: Array.isArray(obj[key]) ? [...obj[key]] : (obj[key] ? [obj[key]] : []),
    }));
  }

  // fallback: empty
  return [];
}

export default function ImgAttributes({
  handleChange,
  form = {},
  images = [],
  setImages,
  selectedImage,
}) {
  const [localImages, setLocalImages] = useState(images);

  // keep a local copy in sync if parent images prop changes
  useEffect(() => {
    setLocalImages(images);
  }, [images]);

  // Find the selected image (by id) in the current images array
  const getSelectedImage = () => {
    if (!selectedImage) return null;
    return localImages.find((img) => img.id === selectedImage.id) || selectedImage || null;
  };

  const onChangeImgAttribute = (newValueArray = [], attributeName) => {
    if (!selectedImage) return;

    const updated = localImages.map((img) => {
      if (img.id !== selectedImage.id) return img;

      // normalize existing attributes
      const normalized = normalizeAttributes(img.attributes);

      const existingIndex = normalized.findIndex((a) => a.name === attributeName);

      if (existingIndex !== -1) {
        normalized[existingIndex] = {
          ...normalized[existingIndex],
          value: Array.isArray(newValueArray) ? [...newValueArray] : [newValueArray],
        };
      } else {
        normalized.push({
          name: attributeName,
          value: Array.isArray(newValueArray) ? [...newValueArray] : [newValueArray],
        });
      }

      return {
        ...img,
        attributes: normalized,
      };
    });

    // update local state and parent
    setLocalImages(updated);
    if (typeof setImages === "function") setImages(updated);
    // propagate to parent form handler if available (keeps form.images in sync)
    if (typeof handleChange === "function") {
      handleChange({ target: { name: "images", value: updated } });
    }
  };

  const selImg = getSelectedImage();

  // Guard UI when there's no selectedImage or it has no attributes
  const attributeKeys = form?.attributes ? Object.keys(form.attributes) : [];

  return (
    <div>
      {!selImg && <div>No image selected.</div>}

      {selImg && (
        <>
          {attributeKeys.length === 0 && (
            <div>No attribute options available in the form (form.attributes is empty).</div>
          )}

          {attributeKeys.map((key) => {
            // get current values for this attribute from the selected image
            const normalized = normalizeAttributes(selImg.attributes);
            const found = normalized.find((a) => a.name === key);
            // MultiSelectInput expects an array of selected values
            const currentValues = Array.isArray(found?.value) ? found.value.flat() : [];

            return (
              <div className="mb-3" key={`${selImg.id}-${key}`}>
                <MultiSelectInput
                  label={key.toUpperCase()}
                  name={key}
                  options={form.attributes[key] || []}
                  values={currentValues}
                  // Expecting onChange to pass an array of selected values
                  onChange={(selectedArray) => onChangeImgAttribute(selectedArray, key)}
                />
              </div>
            );
          })}

          <div className="mt-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                // explicit save: ensure parent has latest images
                if (typeof handleChange === "function") {
                  handleChange({ target: { name: "images", value: localImages } });
                }
              }}
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
}

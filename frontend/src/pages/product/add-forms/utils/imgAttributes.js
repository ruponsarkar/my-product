// imgAttributes.js
import React, { useState, useEffect } from "react";
import MultiSelectInput from "../../../../components/form/multiselect";

/**
 * This component no longer writes to `form`. Instead it reads/writes the
 * `imageAttrs` map passed from MediaForm.
 *
 * Props:
 * - images: array of image objects (id, url, file)
 * - selectedImage: the image object selected to edit
 * - imageAttrs: { filenameOrId: { attrName: [values] } }
 * - setImageAttrs: setter for the above map
 * - onAttributesUpdate(key, attrsObject): callback used when an attribute changes
 *
 * Note: we store attributes keyed by file.name when available, otherwise image.id
 */

export default function ImgAttributes({
  form = {},
  images = [],
  setImages,
  selectedImage,
  imageAttrs = {},
  setImageAttrs,
  onAttributesUpdate = () => {},
}) {
  const [localAttrs, setLocalAttrs] = useState({}); // attributes for selected image only

  useEffect(() => {
    if (!selectedImage) {
      setLocalAttrs({});
      return;
    }
    const key = selectedImage.file?.name || selectedImage.id;
    // initialize local attributes from imageAttrs map
    setLocalAttrs(imageAttrs[key] ? { ...imageAttrs[key] } : {});
  }, [selectedImage, imageAttrs]);

  if (!selectedImage) return <div>No image selected.</div>;

  const key = selectedImage.file?.name || selectedImage.id;

  // form.attributes contains available options for each attribute (e.g. color, size)
  const attributeKeys = form?.attributes ? Object.keys(form.attributes) : [];

  const handleMultiChange = (selectedArray, attributeName) => {
    // update localAttrs
    setLocalAttrs((prev) => {
      const next = { ...prev, [attributeName]: Array.isArray(selectedArray) ? selectedArray : [selectedArray] };
      return next;
    });

    // also update parent map immediately (optimistic)
    const updatedAttrs = { ...(imageAttrs[key] || {}), [attributeName]: Array.isArray(selectedArray) ? selectedArray : [selectedArray] };
    setImageAttrs((prev) => ({ ...prev, [key]: updatedAttrs }));

    // notify parent
    onAttributesUpdate(key, updatedAttrs);
  };

  return (
    <div>
      <h5>Editing attributes for: {selectedImage.file?.name || selectedImage.id}</h5>

      {attributeKeys.length === 0 && (
        <div>No attribute options available in the form (form.attributes is empty).</div>
      )}

      {attributeKeys.map((attrKey) => {
        const currentValues = Array.isArray(localAttrs[attrKey]) ? localAttrs[attrKey] : [];

        return (
          <div className="mb-3" key={`${key}-${attrKey}`}>
            <MultiSelectInput
              label={attrKey.toUpperCase()}
              name={attrKey}
              options={form.attributes[attrKey] || []}
              values={currentValues}
              onChange={(selectedArray) => handleMultiChange(selectedArray, attrKey)}
            />
          </div>
        );
      })}

      <div className="mt-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            // Save is already applied to imageAttrs via onChange, but we also ensure it's persisted
            setImageAttrs((prev) => ({ ...prev, [key]: { ...(prev[key] || {}), ...localAttrs } }));
            onAttributesUpdate(key, { ...(imageAttrs[key] || {}), ...localAttrs });
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

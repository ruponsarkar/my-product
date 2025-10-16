import React, { useState } from "react";
import Input, { MultiInput } from "../../../components/form/input";
import Modal from "../../../components/modal/modal";

/**
 * Props:
 *  - handleChange: function that accepts an event-like object { target: { name, value, type? } }
 *  - form: the parent form object (so we can keep attributes in sync)
 */
export default function AttributesForm({ handleChange, form }) {
  const [inputNames, setInputNames] = useState([
    { name: "weight", label: "Weight" },
    { name: "dimensions", label: "Dimensions (L x W x H)" },
    { name: "color", label: "Color" },
    { name: "material", label: "Material" },
    { name: "size", label: "Size" }
  ]);

  // attributes shape: { weight: ["10kg"], color: ["red","blue"], ... }
  const [attributes, setAttributes] = useState(form.attributes || {});

  const [open, setOpen] = useState(false);

  // Helper: sync attributes to parent form via handleChange
  const syncAttributesToForm = (newAttrs) => {
    // If your handleChange expects e.target style, provide that shape.
    // We use target.name = "attributes" and target.value = newAttrs
    handleChange({
      target: {
        name: "attributes",
        value: newAttrs
      }
    });
  };

  // Called by MultiInput when values change for a specific attribute name
  const setAttributesData = (valueArray, name) => {
    // Build new attributes object (don't mutate)
    const newAttrs = {
      ...attributes,
      [name]: valueArray
    };

    // If valueArray is empty or undefined, remove the key
    if (!valueArray || (Array.isArray(valueArray) && valueArray.length === 0)) {
      delete newAttrs[name];
    }

    setAttributes(newAttrs);
    syncAttributesToForm(newAttrs);
  };

  // Draft for adding a new attribute field
  const [draft, setDraft] = useState({
    name: "",
    label: ""
  });

  const addAttribute = (e) => {
    e?.preventDefault();
    if (!draft.name) {
      return; // require a name
    }

    // sanitize name (no spaces) — you can change this rule if needed
    const sanitized = draft.name.trim().replace(/\s+/g, "_");

    // avoid duplicates
    if (inputNames.some((i) => i.name === sanitized)) {
      setDraft({ name: "", label: "" });
      setOpen(false);
      return;
    }

    const newInput = { name: sanitized, label: draft.label || draft.name };
    const updatedInputNames = [...inputNames, newInput];
    setInputNames(updatedInputNames);

    // initialize attribute key in attributes state as empty array
    const newAttrs = { ...attributes, [sanitized]: [] };
    setAttributes(newAttrs);
    syncAttributesToForm(newAttrs);

    setDraft({ name: "", label: "" });
    setOpen(false);
  };

  const addAttributeForm = () => {
    return (
      <>
        <div className="mt-3 col-md-12">
          <Input
            type={"text"}
            label={"Attribute Name"}
            name={"name"}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </div>
        <div className="mt-3 col-md-12">
          <Input
            type={"text"}
            label={"Attribute Label"}
            name={"label"}
            value={draft.label}
            onChange={(e) => setDraft({ ...draft, label: e.target.value })}
          />
        </div>
        <div className="mt-3 col-md-12">
          <button className="btn btn-primary btn-sm" onClick={addAttribute}>
            Add Attribute
          </button>
        </div>
      </>
    );
  };

  const removeAttributeAtIndex = (index) => {
    const removedKey = inputNames[index].name;
    const updatedInputNames = inputNames.filter((_, i) => i !== index);
    setInputNames(updatedInputNames);

    const newAttrs = { ...attributes };
    delete newAttrs[removedKey];
    setAttributes(newAttrs);
    syncAttributesToForm(newAttrs);
  };

  return (
    <>
      <div className="row mb-4 p-3 border rounded">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Product Attributes</h4>
          <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
            + Add more Attribute
          </button>
        </div>

        {inputNames.length > 0 &&
          inputNames.map((input, index) => (
            <div key={input.name} className="mt-3 col-md-4 position-relative">
              {/* show delete icon only when attribute has no values (optional) */}
              {!attributes[input.name]?.length && (
                <button
                  type="button"
                  className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center position-absolute top-0 end-0"
                  style={{ width: "24px", height: "24px", padding: 0 }}
                  onClick={() => removeAttributeAtIndex(index)}
                >
                  ✕
                </button>
              )}

              {/* MultiInput expects values (array). Provide fallback [] */}
              <MultiInput
                values={attributes[input.name] || []}
                name={input.name}
                onChange={(values) => setAttributesData(values, input.name)}
                label={input.label}
              />
            </div>
          ))}
      </div>



      <Modal
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
        title="Add Attribute"
        content={addAttributeForm()}
      />
    </>
  );
}

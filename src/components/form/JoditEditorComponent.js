import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

const JoditEditorComponent = ({ value, onChange }) => {
  const editor = useRef(null);

  // ✅ useMemo to prevent re-creating config object on every render
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
      height: 400,
      toolbarSticky: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "link",
        "image",
        "|",
        "align",
        "undo",
        "redo",
      ],
    }),
    []
  );

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      onBlur={(newContent) => onChange?.(newContent)} // trigger onBlur, not onChange
    />
  );
};

export default JoditEditorComponent;

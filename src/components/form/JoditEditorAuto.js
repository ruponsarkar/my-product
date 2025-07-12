import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

const JoditEditorAuto = ({ value, onChange, placeholder }) => {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "",
      height: 300,
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
      onChange={(newContent) => onChange?.(newContent)} // real-time content update
    />
  );
};

export default JoditEditorAuto;

import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";

/**
 * MultiSelectInput
 *
 * Props:
 *  - label: string
 *  - name: string
 *  - options: string[] (list of choices)
 *  - values: string[] (selected values) controlled
 *  - onChange: fn(selectedValues: string[]) -> void
 *  - placeholder: string
 */
export default function MultiSelectInput({
  label,
  name,
  options = [],
  values = [],
  onChange = () => {},
  placeholder = ""
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  // helper to toggle single option
  const toggleOption = (opt) => {
    const exists = values.includes(opt);
    const next = exists ? values.filter((v) => v !== opt) : [...values, opt];
    onChange(next);
  };

  // select all / deselect all
  const handleSelectAll = () => {
    if (values.length === options.length) onChange([]);
    else onChange([...options]);
  };

  // close on outside click
  useEffect(() => {
    function handleDocClick(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  const displayValue = (values || []).join(", ");

  const clearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <TextField
        label={label}
        name={name}
        size="small"
        value={displayValue}
        placeholder={placeholder}
        onClick={() => setOpen((s) => !s)}
        onFocus={() => setOpen(true)}
        fullWidth
        InputProps={{
          readOnly: true,
          endAdornment: (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {values && values.length > 0 && (
                <IconButton size="small" onClick={clearAll} aria-label="clear selection">
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((s) => !s);
                }}
                aria-label="toggle dropdown"
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>
          )
        }}
      />

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          style={{
            position: "absolute",
            zIndex: 9999,
            top: 44,
            left: 0,
            right: 0,
            maxHeight: 260,
            overflow: "auto",
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 6,
            padding: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
          }}
        >
          <div style={{ marginBottom: 6, borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: 6 }}>
            <FormControlLabel
              control={<Checkbox checked={values.length === options.length && options.length > 0} onChange={handleSelectAll} />}
              label={options.length > 0 ? (values.length === options.length ? "Deselect all" : `Select all (${options.length})`) : "No options"}
            />
          </div>

          <div>
            {options.map((opt) => (
              <div key={opt} style={{ display: "flex", alignItems: "center", padding: "4px 2px" }}>
                <Checkbox
                  checked={values.includes(opt)}
                  onChange={() => toggleOption(opt)}
                  inputProps={{ "aria-label": opt }}
                />
                <button
                  type="button"
                  onClick={() => toggleOption(opt)}
                  style={{
                    border: "none",
                    background: "transparent",
                    textAlign: "left",
                    padding: 0,
                    margin: 0,
                    cursor: "pointer",
                    flex: 1
                  }}
                >
                  {opt}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

MultiSelectInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  values: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  placeholder: PropTypes.string
};

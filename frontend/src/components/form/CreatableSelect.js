import * as React from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function CreatableSelect({ label, options, value, onChange, size }) {
  return (
    <Autocomplete
      freeSolo // allow new values
      options={options || []}
      value={value}
      size={size || "small"}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        onChange(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
    />
  );
}

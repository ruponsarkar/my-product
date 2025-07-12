import React from 'react';
import TextField from '@mui/material/TextField';

export default function Input({label, id, defaultValue, size}) {
  return (
    <div>
        <TextField
          label={label || "Title"}
          id={id || "outlined-size-small"}
          defaultValue={defaultValue || ''}
          size={size || "small"}
          fullWidth
        />
    </div>
  )
}

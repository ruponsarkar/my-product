import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export default function Input({label, name, id, defaultValue, size, type, value, onChange}) {
  return (
    <div>
        <TextField
          name={name || label}
          label={label || "Title"}
          id={id || "outlined-size-small"}
          defaultValue={defaultValue || ''}
          size={size || "small"}
          fullWidth
          type={type || "text"}
          value={value || ''}
          onChange={(e) => onChange(e)}
        />
    </div>
  )
}


export function MultiInput({ label, values = [], onChange, name }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
   
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim() !== '') {
      e.preventDefault();
      if (!values.includes(inputValue.trim())) {
        onChange([...values, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const handleDelete = (chipToDelete) => {
    onChange(values.filter((val) => val !== chipToDelete));
  };

  return (
    <div>
      <TextField
        name={name || label}
        label={label || "Add item"}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        size="small"
        fullWidth
      />
      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
        {values.map((val, index) => (
          <Chip
            key={index}
            label={val}
            onDelete={() => handleDelete(val)}
            color="primary"
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>
    </div>
  );
}


import { Box, Button, TextField, IconButton } from '@mui/material'
import { useState } from 'react'
import { Add, DeleteOutline } from '@mui/icons-material'

// Consistent Input Style
const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#fff',
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#5b3df5' },
  },
}

export const CustomFieldsBuilder = ({
  onChange,
}: {
  onChange: (fields: Record<string, any>) => void
}) => {
  const [fields, setFields] = useState<{ key: string; value: string }[]>([])

  const updateFields = (updated: any) => {
    setFields(updated)
    const obj: Record<string, any> = {}
    updated.forEach((f: any) => {
      if (f.key) obj[f.key] = f.value
    })
    onChange(obj)
  }

  // UX Feature: Helper to remove a field
  const removeField = (index: number) => {
    const updated = fields.filter((_, i) => i !== index)
    updateFields(updated)
  }

  return (
    <Box className="space-y-3">
      {fields.map((field, index) => (
        <Box key={index} className="flex gap-2 items-start">
          <TextField
            label="Field Name"
            placeholder="e.g. Location"
            size="small"
            value={field.key}
            onChange={(e) => {
              const updated = [...fields]
              updated[index].key = e.target.value
              updateFields(updated)
            }}
            sx={{ ...inputSx, flex: 1 }}
          />
          <TextField
            label="Value"
            placeholder="e.g. New York"
            size="small"
            value={field.value}
            onChange={(e) => {
              const updated = [...fields]
              updated[index].value = e.target.value
              updateFields(updated)
            }}
            sx={{ ...inputSx, flex: 1 }}
          />
          <IconButton
            size="small"
            onClick={() => removeField(index)}
            className="mt-1 text-slate-400 hover:text-red-500"
          >
            <DeleteOutline fontSize="small" />
          </IconButton>
        </Box>
      ))}

      <Button
        variant="text"
        size="small"
        startIcon={<Add />}
        onClick={() => updateFields([...fields, { key: '', value: '' }])}
        sx={{
          textTransform: 'none',
          color: '#6366f1',
          fontWeight: 600,
        }}
      >
        Add Custom Field
      </Button>
    </Box>
  )
}

import { Box, Button, TextField } from '@mui/material'
import { useState } from 'react'

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

  return (
    <Box className="space-y-3">
      {fields.map((field, index) => (
        <Box key={index} className="flex gap-2">
          <TextField
            label="Field Name"
            value={field.key}
            onChange={(e) => {
              const updated = [...fields]
              updated[index].key = e.target.value
              updateFields(updated)
            }}
          />
          <TextField
            label="Value"
            value={field.value}
            onChange={(e) => {
              const updated = [...fields]
              updated[index].value = e.target.value
              updateFields(updated)
            }}
          />
        </Box>
      ))}

      <Button
        variant="outlined"
        onClick={() => updateFields([...fields, { key: '', value: '' }])}
      >
        Add Field
      </Button>
    </Box>
  )
}

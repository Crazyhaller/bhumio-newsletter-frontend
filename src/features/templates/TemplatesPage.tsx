import { Box, Typography, Paper, TextField } from '@mui/material'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTemplate, fetchTemplates } from '../../lib/api/templateApi'
import { TemplateEditor } from './TemplateEditor'
import { PageHeader } from '../../components/ui/PageHeader'

export const TemplatesPage = () => {
  const [name, setName] = useState('')
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  })

  const mutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      setName('')
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    },
  })

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Templates"
        subtitle="Create and manage your email templates for campaigns"
      />
      <Paper className="p-4 space-y-4">
        <TextField
          label="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TemplateEditor
          onSave={(html) => mutation.mutate({ name, content: html })}
        />
      </Paper>

      <Paper className="p-4">
        <Typography variant="h6">Saved Templates</Typography>
        {data?.map((t) => (
          <div key={t.id} className="border p-2 my-2">
            <strong>{t.name}</strong>
          </div>
        ))}
      </Paper>
    </Box>
  )
}

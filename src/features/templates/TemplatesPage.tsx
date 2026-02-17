import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createTemplate, fetchTemplates } from '../../lib/api/templateApi'
import { TemplateEditor } from './TemplateEditor'
import { PageHeader } from '../../components/ui/PageHeader'
import {
  Article,
  DriveFileRenameOutline,
  DeleteOutline,
  Add,
  AutoFixHigh,
} from '@mui/icons-material'

// Consistent Input Style
const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: '#fff',
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#5b3df5' },
    '&.Mui-focused': { backgroundColor: '#fff' },
  },
}

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
      toast.success('Template saved successfully')
    },
    onError: () => toast.error('Failed to save template'),
  })

  return (
    <Box>
      <PageHeader
        title="Templates"
        subtitle="Design reusable email layouts for your campaigns."
      />

      {/* --- CREATE SECTION --- */}
      <div className="mb-12">
        <Typography
          variant="h6"
          className="font-bold text-slate-800 mb-6 flex items-center gap-2"
        >
          <Add className="text-indigo-600" /> Create New Template
        </Typography>

        {/* Increased gap-4 to gap-8 for better separation */}
        <div className="flex flex-col gap-8">
          {/* Template Settings Group */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Template Name
            </label>
            <div className="max-w-md">
              <TextField
                fullWidth
                placeholder="e.g. Monthly Newsletter Layout"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={inputSx}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DriveFileRenameOutline
                        fontSize="small"
                        className="text-slate-400"
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          {/* The Editor Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AutoFixHigh fontSize="small" className="text-slate-500" />
              <Typography
                variant="subtitle2"
                className="font-semibold text-slate-700"
              >
                Visual Builder
              </Typography>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <TemplateEditor
                onSave={(html) => {
                  if (!name) {
                    toast.error('Please enter a template name')
                    return
                  }
                  mutation.mutate({ name, content: html })
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- GALLERY SECTION --- */}
      <div className="space-y-6 pt-8 border-t border-slate-200">
        <Typography variant="h6" className="font-bold text-slate-800">
          Saved Templates
        </Typography>

        {!data || data.length === 0 ? (
          <Paper
            elevation={0}
            className="p-8 text-center border border-dashed border-slate-300 rounded-2xl bg-slate-50"
          >
            <Article className="text-slate-300 mb-2" style={{ fontSize: 48 }} />
            <Typography className="text-slate-500 font-medium">
              You haven't saved any templates yet.
            </Typography>
          </Paper>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map((t) => (
              <Paper
                key={t.id}
                elevation={0}
                className="group overflow-hidden border border-slate-200 rounded-xl bg-white hover:shadow-lg hover:border-indigo-200 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Preview Placeholder */}
                <div className="h-32 bg-slate-100 flex items-center justify-center border-b border-slate-100 group-hover:bg-indigo-50 transition-colors">
                  <Article
                    style={{ fontSize: 40 }}
                    className="text-slate-300 group-hover:text-indigo-400 transition-colors"
                  />
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col gap-2">
                  <Typography
                    variant="subtitle1"
                    className="font-bold text-slate-800 truncate"
                  >
                    {t.name}
                  </Typography>
                  <Typography variant="caption" className="text-slate-400">
                    HTML Template
                  </Typography>

                  <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="small" color="error" className="min-w-0 p-1">
                      <DeleteOutline fontSize="small" />
                    </Button>
                  </div>
                </div>
              </Paper>
            ))}
          </div>
        )}
      </div>
    </Box>
  )
}

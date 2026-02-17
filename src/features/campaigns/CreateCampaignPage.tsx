import {
  Box,
  TextField,
  Button,
  Paper,
  Select,
  MenuItem,
  Typography,
  FormControl,
} from '@mui/material'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { fetchLists } from '../../lib/api/listApi'
import { createCampaign } from '../../lib/api/campaignApi'
import { fetchTemplates } from '../../lib/api/templateApi'
import { PageHeader } from '../../components/ui/PageHeader'
import { Save, AutoFixHigh } from '@mui/icons-material'

// Consistent Styling
const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#5b3df5' },
    '&.Mui-focused': { backgroundColor: '#fff' },
  },
}

export const CreateCampaignPage = () => {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [listId, setListId] = useState('')
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ['lists'],
    queryFn: () => fetchLists(1, ''),
  })

  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  })

  const mutation = useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      toast.success('Campaign created successfully!')
      navigate('/campaigns')
    },
    onError: () => toast.error('Failed to create campaign'),
  })

  return (
    <Box>
      <PageHeader
        title="Create Campaign"
        subtitle="Design your email campaign. Choose an audience, set a subject, and craft your content."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Paper
            elevation={0}
            className="p-6 border border-slate-200 rounded-xl bg-white space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Subject Line
              </label>
              <TextField
                fullWidth
                placeholder="e.g. Big News: Our Summer Sale Starts Now! ☀️"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                sx={inputSx}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Email Content (HTML)
                </label>
                <Button
                  size="small"
                  startIcon={<AutoFixHigh />}
                  className="text-indigo-600 normal-case"
                  // In a real app, this might open a modal or separate editor
                >
                  Open Visual Editor
                </Button>
              </div>
              <TextField
                fullWidth
                multiline
                minRows={12}
                placeholder="<html><body><h1>Hello!</h1></body></html>"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{
                  ...inputSx,
                  '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    fontSize: '14px',
                  },
                }}
              />
            </div>
          </Paper>
        </div>

        {/* Right Column: Settings */}
        <div className="flex flex-col gap-6">
          <Paper
            elevation={0}
            className="p-6 border border-slate-200 rounded-xl bg-white space-y-6"
          >
            <Typography
              variant="h6"
              className="font-bold text-slate-800 text-sm uppercase tracking-wide"
            >
              Campaign Settings
            </Typography>

            <FormControl fullWidth>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Recipient List
              </label>
              <Select
                value={listId}
                onChange={(e) => setListId(e.target.value)}
                displayEmpty
                sx={{
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e2e8f0',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Select a list
                </MenuItem>
                {data?.data.map((list: any) => (
                  <MenuItem key={list.id} value={list.id}>
                    {list.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="border-t border-slate-100 pt-6">
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Load from Template
              </label>
              <Typography
                variant="caption"
                className="text-slate-400 block mb-2"
              >
                Warning: Selecting a template will overwrite your current
                content.
              </Typography>
              <Select
                fullWidth
                value=""
                displayEmpty
                onChange={(e) => {
                  const selected = templates?.find(
                    (t) => t.id === e.target.value,
                  )
                  if (selected) {
                    setContent(selected.content)
                    toast.info(`Loaded template: ${selected.name}`)
                  }
                }}
                sx={{
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e2e8f0',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Choose a template...
                </MenuItem>
                {templates?.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                  </MenuItem>
                ))}
              </Select>
            </div>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Save />}
              disabled={!subject || !content || !listId || mutation.isPending}
              onClick={() => mutation.mutate({ subject, content, listId })}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: '#5b3df5',
                height: '48px',
                marginTop: '1rem',
                '&:hover': { backgroundColor: '#4c32cc' },
              }}
            >
              {mutation.isPending ? 'Creating...' : 'Create Campaign'}
            </Button>
          </Paper>
        </div>
      </div>
    </Box>
  )
}

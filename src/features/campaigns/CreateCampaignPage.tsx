import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Select,
  MenuItem,
} from '@mui/material'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchLists } from '../../lib/api/listApi'
import { createCampaign } from '../../lib/api/campaignApi'
import { fetchTemplates } from '../../lib/api/templateApi'

export const CreateCampaignPage = () => {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [listId, setListId] = useState('')

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
      toast.success('Campaign created')
      setSubject('')
      setContent('')
    },
  })

  return (
    <Box className="space-y-6">
      <Typography variant="h5">Create Campaign</Typography>

      <Paper className="p-4 space-y-4">
        <TextField
          fullWidth
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <Select
          fullWidth
          value={listId}
          onChange={(e) => setListId(e.target.value)}
        >
          {data?.data.map((list: any) => (
            <MenuItem key={list.id} value={list.id}>
              {list.name}
            </MenuItem>
          ))}
        </Select>

        <Select
          fullWidth
          value=""
          onChange={(e) => {
            const selected = templates?.find((t) => t.id === e.target.value)
            if (selected) setContent(selected.content)
          }}
        >
          {templates?.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {t.name}
            </MenuItem>
          ))}
        </Select>

        <TextField
          fullWidth
          multiline
          minRows={6}
          label="HTML Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={() => mutation.mutate({ subject, content, listId })}
        >
          Create
        </Button>
      </Paper>
    </Box>
  )
}

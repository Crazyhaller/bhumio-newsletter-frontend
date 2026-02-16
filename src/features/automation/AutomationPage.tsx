import { Box, Paper, TextField, Select, MenuItem, Button } from '@mui/material'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAutomation,
  fetchAutomations,
  checkRssFeeds,
} from '../../lib/api/automationApi'
import { PageHeader } from '../../components/ui/PageHeader'

export const AutomationPage = () => {
  const [name, setName] = useState('')
  const [triggerType, setTriggerType] = useState('subscriber_added')
  const [actionType, setActionType] = useState('send_campaign')

  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['automations'],
    queryFn: fetchAutomations,
  })

  const mutation = useMutation({
    mutationFn: createAutomation,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['automations'] }),
  })

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Automations"
        subtitle="Automate your email marketing workflows. Create automations that trigger on specific events and perform actions like sending campaigns or creating new ones from templates."
      />

      <Paper className="p-4 space-y-4">
        <TextField
          label="Automation Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Select
          value={triggerType}
          onChange={(e) => setTriggerType(e.target.value)}
        >
          <MenuItem value="subscriber_added">Subscriber Added</MenuItem>
          <MenuItem value="campaign_sent">Campaign Sent</MenuItem>
          <MenuItem value="rss_new_item">RSS New Item</MenuItem>
        </Select>

        <Select
          value={actionType}
          onChange={(e) => setActionType(e.target.value)}
        >
          <MenuItem value="send_campaign">Send Campaign</MenuItem>
          <MenuItem value="create_campaign_from_template">
            Create Campaign from Template
          </MenuItem>
        </Select>

        <Button
          variant="contained"
          onClick={() =>
            mutation.mutate({
              name,
              triggerType,
              triggerConfig: {},
              actionType,
              actionConfig: {},
            })
          }
        >
          Create Automation
        </Button>
      </Paper>

      <Paper className="p-4">
        {data?.map((a) => (
          <div key={a.id} className="border p-2 my-2">
            {a.name} — {a.triggerType} → {a.actionType}
          </div>
        ))}
      </Paper>

      <Button variant="outlined" onClick={() => checkRssFeeds()}>
        Simulate RSS Check
      </Button>
    </Box>
  )
}

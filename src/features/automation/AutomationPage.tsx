import {
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  FormControl,
  Chip,
} from '@mui/material'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAutomation,
  fetchAutomations,
  checkRssFeeds,
} from '../../lib/api/automationApi'
import { PageHeader } from '../../components/ui/PageHeader'
import {
  Bolt,
  ArrowForward,
  Send,
  RssFeed,
  PersonAdd,
  AutoFixHigh,
  PlayCircleOutline,
} from '@mui/icons-material'

// Consistent Input Styling
const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: '#f8fafc',
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#5b3df5' },
    '&.Mui-focused': { backgroundColor: '#fff' },
  },
}

const selectSx = {
  borderRadius: '10px',
  backgroundColor: '#f8fafc',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#5b3df5' },
  '&.Mui-focused': { backgroundColor: '#fff' },
}

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] })
      setName('') // Optional: Clear name on success
    },
  })

  // Helper to get icons based on type
  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'rss_new_item':
        return <RssFeed fontSize="small" className="text-orange-500" />
      case 'subscriber_added':
        return <PersonAdd fontSize="small" className="text-blue-500" />
      default:
        return <Bolt fontSize="small" className="text-yellow-500" />
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'create_campaign_from_template':
        return <AutoFixHigh fontSize="small" className="text-purple-500" />
      default:
        return <Send fontSize="small" className="text-green-500" />
    }
  }

  // Format labels for display
  const formatLabel = (str: string) => {
    return str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <Box>
      <PageHeader
        title="Automations"
        subtitle="Build powerful workflows to put your marketing on autopilot."
      />

      <div className="flex flex-col gap-8">
        {/* --- CREATOR SECTION --- */}
        <div className="flex flex-col gap-4">
          <Typography
            variant="h6"
            className="text-slate-800 font-bold flex items-center gap-2"
          >
            <Bolt className="text-indigo-500" />
            Create New Workflow
          </Typography>

          <Paper
            elevation={0}
            className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm"
          >
            <div className="flex flex-col gap-6">
              {/* Name Input */}
              <div className="w-full">
                <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                  Automation Name
                </label>
                <TextField
                  fullWidth
                  placeholder="e.g. Welcome Series for New Users"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={inputSx}
                  size="small"
                />
              </div>

              {/* Logic Builder Row */}
              <div className="flex flex-col md:flex-row items-start md:items-end gap-4 w-full">
                {/* Trigger */}
                <div className="flex-1 w-full">
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                    When this happens...
                  </label>
                  <FormControl fullWidth size="small">
                    <Select
                      value={triggerType}
                      onChange={(e) => setTriggerType(e.target.value)}
                      sx={selectSx}
                      displayEmpty
                    >
                      <MenuItem value="subscriber_added" className="gap-2">
                        <PersonAdd
                          fontSize="small"
                          className="text-slate-400"
                        />{' '}
                        Subscriber Added
                      </MenuItem>
                      <MenuItem value="campaign_sent" className="gap-2">
                        <Send fontSize="small" className="text-slate-400" />{' '}
                        Campaign Sent
                      </MenuItem>
                      <MenuItem value="rss_new_item" className="gap-2">
                        <RssFeed fontSize="small" className="text-slate-400" />{' '}
                        RSS New Item
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>

                {/* Arrow Visual */}
                <div className="hidden md:flex items-center justify-center pb-2 text-slate-300">
                  <ArrowForward />
                </div>

                {/* Action */}
                <div className="flex-1 w-full">
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                    Do this action...
                  </label>
                  <FormControl fullWidth size="small">
                    <Select
                      value={actionType}
                      onChange={(e) => setActionType(e.target.value)}
                      sx={selectSx}
                    >
                      <MenuItem value="send_campaign" className="gap-2">
                        <Send fontSize="small" className="text-slate-400" />{' '}
                        Send Campaign
                      </MenuItem>
                      <MenuItem
                        value="create_campaign_from_template"
                        className="gap-2"
                      >
                        <AutoFixHigh
                          fontSize="small"
                          className="text-slate-400"
                        />{' '}
                        Create from Template
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>

                {/* Submit Button */}
                <div className="w-full md:w-auto">
                  <Button
                    variant="contained"
                    disabled={mutation.isPending || !name}
                    onClick={() =>
                      mutation.mutate({
                        name,
                        triggerType,
                        triggerConfig: {},
                        actionType,
                        actionConfig: {},
                      })
                    }
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 normal-case font-semibold shadow-none hover:shadow-lg transition-all rounded-xl h-[40px]"
                  >
                    {mutation.isPending ? 'Building...' : 'Create Workflow'}
                  </Button>
                </div>
              </div>
            </div>
          </Paper>
        </div>

        {/* --- LIST SECTION --- */}
        <div className="flex flex-col gap-4">
          <Typography variant="h6" className="text-slate-800 font-bold">
            Active Workflows
          </Typography>

          {!data || data.length === 0 ? (
            <Paper
              elevation={0}
              className="p-8 text-center border border-dashed border-slate-300 rounded-2xl bg-slate-50"
            >
              <Typography className="text-slate-500">
                No automations created yet.
              </Typography>
            </Paper>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((a) => (
                <Paper
                  key={a.id}
                  elevation={0}
                  className="p-5 border border-slate-200 rounded-xl hover:shadow-md transition-shadow bg-white flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start">
                    <Typography
                      variant="subtitle1"
                      className="font-bold text-slate-800 leading-tight"
                    >
                      {a.name}
                    </Typography>
                    <Chip
                      label="Active"
                      size="small"
                      className="bg-green-100 text-green-700 font-bold h-6 text-xs"
                    />
                  </div>

                  {/* Flow Visualization Card */}
                  <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between text-sm">
                    <div className="flex flex-col items-center gap-1 min-w-[80px]">
                      {getTriggerIcon(a.triggerType)}
                      <span className="text-xs text-slate-500 text-center font-medium">
                        {formatLabel(a.triggerType)}
                      </span>
                    </div>

                    <ArrowForward fontSize="small" className="text-slate-300" />

                    <div className="flex flex-col items-center gap-1 min-w-[80px]">
                      {getActionIcon(a.actionType)}
                      <span className="text-xs text-slate-500 text-center font-medium">
                        {formatLabel(a.actionType)}
                      </span>
                    </div>
                  </div>
                </Paper>
              ))}
            </div>
          )}
        </div>

        {/* --- UTILITIES SECTION --- */}
        <div className="mt-4 pt-6 border-t border-slate-200">
          <Typography
            variant="subtitle2"
            className="text-slate-400 uppercase tracking-wider font-bold mb-4 text-xs"
          >
            Developer Utilities
          </Typography>
          <Paper
            elevation={0}
            className="p-4 border border-slate-200 rounded-xl bg-slate-50 inline-flex items-center gap-4"
          >
            <div className="flex-1">
              <Typography
                variant="body2"
                className="font-semibold text-slate-700"
              >
                RSS Feed Simulator
              </Typography>
              <Typography variant="caption" className="text-slate-500">
                Manually trigger the RSS check job to test "RSS New Item"
                workflows.
              </Typography>
            </div>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PlayCircleOutline />}
              onClick={() => checkRssFeeds()}
              sx={{
                borderColor: '#cbd5e1',
                color: '#475569',
                textTransform: 'none',
                '&:hover': { borderColor: '#94a3b8', bgcolor: '#fff' },
              }}
            >
              Run Check
            </Button>
          </Paper>
        </div>
      </div>
    </Box>
  )
}

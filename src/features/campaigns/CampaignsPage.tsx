import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCampaigns, sendCampaign } from '../../lib/api/campaignApi'
import { useNavigate, Link } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader'
import { Send, BarChart, Add, MarkEmailRead } from '@mui/icons-material'

export const CampaignsPage = () => {
  const { data } = useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns,
  })

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: sendCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })

  return (
    <Box>
      <PageHeader
        title="Campaigns"
        subtitle="Manage, send, and track your email marketing campaigns."
      />

      {/* ACTION BAR: Separated from Header and Table */}
      <div className="flex justify-end mb-4">
        <Button
          component={Link}
          to="/campaigns/create"
          variant="contained"
          startIcon={<Add />}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            backgroundColor: '#5b3df5',
            paddingX: '20px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#4c32cc',
              boxShadow: '0 4px 12px rgba(91, 61, 245, 0.2)',
            },
          }}
        >
          Create Campaign
        </Button>
      </div>

      <Paper
        elevation={0}
        className="border border-slate-200 rounded-xl overflow-hidden shadow-sm"
      >
        <Table>
          <TableHead className="bg-slate-50">
            <TableRow>
              <TableCell className="font-semibold text-slate-600 py-4 pl-6">
                Subject
              </TableCell>
              <TableCell className="font-semibold text-slate-600 py-4">
                Status
              </TableCell>
              <TableCell className="font-semibold text-slate-600 py-4 text-right pr-6">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-slate-500"
                >
                  No campaigns found. Create your first one!
                </TableCell>
              </TableRow>
            )}
            {data?.map((c: any) => (
              <TableRow key={c.id} hover>
                <TableCell className="font-medium text-slate-800 pl-6">
                  {c.subject}
                </TableCell>
                <TableCell>
                  <Chip
                    label={c.sent ? 'Sent' : 'Draft'}
                    size="small"
                    icon={
                      c.sent ? (
                        <MarkEmailRead style={{ fontSize: 16 }} />
                      ) : undefined
                    }
                    className={
                      c.sent
                        ? 'bg-green-100 text-green-700 font-bold border-none'
                        : 'bg-slate-100 text-slate-600 font-bold border-none'
                    }
                  />
                </TableCell>
                <TableCell align="right" className="pr-6">
                  <div className="flex justify-end gap-1">
                    {!c.sent && (
                      <Tooltip title="Send Now">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => mutation.mutate(c.id)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600"
                        >
                          <Send fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="View Stats">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/campaigns/${c.id}/stats`)}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      >
                        <BarChart fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}

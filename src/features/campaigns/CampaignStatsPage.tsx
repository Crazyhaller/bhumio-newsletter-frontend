import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Button,
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchClickStats } from '../../lib/api/campaignApi'
import { PageHeader } from '../../components/ui/PageHeader'
import { ArrowBack, Link as LinkIcon, Mouse } from '@mui/icons-material'

export const CampaignStatsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ['clickStats', id],
    queryFn: () => fetchClickStats(id!),
  })

  // Calculate total clicks for a summary card
  const totalClicks = data?.reduce((acc, curr) => acc + curr.clickCount, 0) || 0

  return (
    <Box>
      <div className="mb-4">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/campaigns')}
          className="text-slate-500 hover:text-slate-800 normal-case"
        >
          Back to Campaigns
        </Button>
      </div>

      <PageHeader
        title="Campaign Performance"
        subtitle="Analyze engagement and link click activity for this campaign."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Paper
          elevation={0}
          className="p-6 border border-slate-200 rounded-xl bg-white"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Mouse />
            </div>
            <Typography
              variant="subtitle2"
              className="text-slate-500 font-bold uppercase tracking-wider"
            >
              Total Clicks
            </Typography>
          </div>
          <Typography variant="h3" className="font-bold text-slate-800">
            {totalClicks}
          </Typography>
        </Paper>
      </div>

      <Paper
        elevation={0}
        className="border border-slate-200 rounded-xl overflow-hidden shadow-sm"
      >
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <Typography
            variant="h6"
            className="text-slate-800 font-bold text-sm uppercase tracking-wide"
          >
            Detailed Link Breakdown
          </Typography>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-semibold text-slate-600 w-3/4">
                Link URL
              </TableCell>
              <TableCell className="font-semibold text-slate-600 text-right">
                Unique Clicks
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center py-8 text-slate-500"
                >
                  No clicks recorded yet.
                </TableCell>
              </TableRow>
            )}
            {data?.map((stat) => (
              <TableRow key={stat.id} hover>
                <TableCell className="font-mono text-sm text-indigo-600 break-all">
                  <div className="flex items-center gap-2">
                    <LinkIcon
                      fontSize="small"
                      className="text-slate-300 flex-shrink-0"
                    />
                    {stat.link}
                  </div>
                </TableCell>
                <TableCell align="right">
                  <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full text-xs">
                    {stat.clickCount}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}

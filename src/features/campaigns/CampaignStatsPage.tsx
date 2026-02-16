import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchClickStats } from '../../lib/api/campaignApi'

export const CampaignStatsPage = () => {
  const { id } = useParams()

  const { data } = useQuery({
    queryKey: ['clickStats', id],
    queryFn: () => fetchClickStats(id!),
  })

  return (
    <Box className="space-y-6">
      <Typography variant="h5">Click Statistics</Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Link</TableCell>
              <TableCell>Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((stat) => (
              <TableRow key={stat.id}>
                <TableCell>{stat.link}</TableCell>
                <TableCell>{stat.clickCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}

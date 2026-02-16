import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCampaigns, sendCampaign } from '../../lib/api/campaignApi'
import { useNavigate } from 'react-router-dom'

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
    <Box className="space-y-6">
      <Typography variant="h5">Campaigns</Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((c: any) => (
              <TableRow key={c.id}>
                <TableCell>{c.subject}</TableCell>
                <TableCell>{c.sent ? 'Sent' : 'Draft'}</TableCell>
                <TableCell>
                  {!c.sent && (
                    <Button onClick={() => mutation.mutate(c.id)}>Send</Button>
                  )}
                  <Button onClick={() => navigate(`/campaigns/${c.id}/stats`)}>
                    Stats
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}

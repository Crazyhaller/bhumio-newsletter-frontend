import { Box, Typography, Grid, Paper } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../app/store/authStore'
import { fetchCampaigns } from '../../lib/api/campaignApi'
import { fetchLists } from '../../lib/api/listApi'
import { fetchSubscribers } from '../../lib/api/subscriberApi'
import { PageHeader } from '../../components/ui/PageHeader'

export const DashboardPage = () => {
  const org = useAuthStore((s) => s.currentOrg)

  const { data: campaigns } = useQuery({
    queryKey: ['dashboard-campaigns', org?.id],
    queryFn: fetchCampaigns,
    enabled: !!org,
  })

  const { data: lists } = useQuery({
    queryKey: ['dashboard-lists', org?.id],
    queryFn: () => fetchLists(1, ''),
    enabled: !!org,
  })

  const { data: subscribers } = useQuery({
    queryKey: ['dashboard-subscribers', org?.id],
    queryFn: () => fetchSubscribers(1, ''),
    enabled: !!org,
  })

  if (!org) {
    return <Typography>Select an organization</Typography>
  }

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Get a quick overview of your email marketing performance. View key metrics like total campaigns, lists, and subscribers at a glance. Use this dashboard to monitor your email marketing health and make informed decisions to grow your audience."
      />

      {/* Grid container syntax remains mostly the same */}
      <Grid container spacing={3}>
        {/* UPDATED: item prop removed, size prop used for breakpoints */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper className="p-6 rounded-xl shadow">
            <Typography variant="h6">Campaigns</Typography>
            <Typography variant="h3">{campaigns?.length || 0}</Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper className="p-6 rounded-xl shadow">
            <Typography variant="h6">Lists</Typography>
            <Typography variant="h3">{lists?.total || 0}</Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper className="p-6 rounded-xl shadow">
            <Typography variant="h6">Subscribers</Typography>
            <Typography variant="h3">{subscribers?.total || 0}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

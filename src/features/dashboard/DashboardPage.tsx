import { Box, Paper, Typography, Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../app/store/authStore'
import { fetchCampaigns } from '../../lib/api/campaignApi'
import { fetchLists } from '../../lib/api/listApi'
import { fetchSubscribers } from '../../lib/api/subscriberApi'
import { PageHeader } from '../../components/ui/PageHeader'
import {
  Campaign,
  People,
  ListAlt,
  ArrowForward,
  Add,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { fetchOrganizations } from '../../lib/api/orgApi'

// Reusable Stat Card Component
const StatCard = ({
  title,
  value,
  icon,
  colorClass,
  bgClass,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
  colorClass: string
  bgClass: string
}) => (
  <Paper
    elevation={0}
    className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200 flex items-start justify-between"
  >
    <div>
      <Typography
        variant="subtitle2"
        className="text-slate-500 font-semibold uppercase tracking-wider text-xs mb-1"
      >
        {title}
      </Typography>
      <Typography variant="h3" className="font-bold text-slate-800">
        {value}
      </Typography>
    </div>
    <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>{icon}</div>
  </Paper>
)

export const DashboardPage = () => {
  const org = useAuthStore((s) => s.currentOrg)
  const navigate = useNavigate()

  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  })

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
    const hasOrgs = organizations && organizations.length > 0

    return (
      <Box className="h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <ListAlt className="text-slate-400" fontSize="large" />
        </div>

        <Typography variant="h5" className="font-bold text-slate-800">
          {hasOrgs ? 'No Organization Selected' : 'No Organization Found'}
        </Typography>

        <Typography className="text-slate-500 max-w-md mt-2">
          {hasOrgs
            ? 'Please select an organization from the top right menu.'
            : 'You need to create your first organization to continue.'}
        </Typography>

        {!hasOrgs && (
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => navigate('/organizations')}
          >
            Create Organization
          </Button>
        )}
      </Box>
    )
  }

  return (
    <Box className="space-y-8">
      <PageHeader
        title={`Hello there 👋`}
        subtitle="Here is what's happening with your email marketing today."
      />

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Campaigns"
          value={campaigns?.length || 0}
          icon={<Campaign fontSize="medium" />}
          colorClass="text-purple-600"
          bgClass="bg-purple-50"
        />

        <StatCard
          title="Total Subscribers"
          value={lists?.total || 0} // Assuming this maps to total subscribers across lists for summary
          icon={<People fontSize="medium" />}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />

        <StatCard
          title="Active Lists"
          value={subscribers?.total || 0} // Swapped based on your original code mapping
          icon={<ListAlt fontSize="medium" />}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
        />
      </div>

      {/* QUICK ACTIONS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="space-y-4">
          <Typography variant="h6" className="font-bold text-slate-800">
            Quick Actions
          </Typography>
          <Paper
            elevation={0}
            className="border border-slate-200 rounded-xl overflow-hidden bg-white"
          >
            <div className="divide-y divide-slate-100">
              <Link
                to="/campaigns/create"
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group text-decoration-none"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                    <Add fontSize="small" />
                  </div>
                  <div>
                    <Typography className="font-semibold text-slate-700">
                      Create Campaign
                    </Typography>
                    <Typography variant="caption" className="text-slate-500">
                      Draft and send a new email
                    </Typography>
                  </div>
                </div>
                <ArrowForward
                  fontSize="small"
                  className="text-slate-300 group-hover:text-indigo-500 transition-colors"
                />
              </Link>

              <Link
                to="/subscribers"
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group text-decoration-none"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                    <People fontSize="small" />
                  </div>
                  <div>
                    <Typography className="font-semibold text-slate-700">
                      Add Subscriber
                    </Typography>
                    <Typography variant="caption" className="text-slate-500">
                      Manually add a contact to a list
                    </Typography>
                  </div>
                </div>
                <ArrowForward
                  fontSize="small"
                  className="text-slate-300 group-hover:text-emerald-500 transition-colors"
                />
              </Link>
            </div>
          </Paper>
        </div>

        {/* Recent Campaigns (Mini List) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="h6" className="font-bold text-slate-800">
              Recent Campaigns
            </Typography>
            <Button
              component={Link}
              to="/campaigns"
              size="small"
              className="text-indigo-600 normal-case"
            >
              View all
            </Button>
          </div>

          <Paper
            elevation={0}
            className="border border-slate-200 rounded-xl overflow-hidden bg-white min-h-[160px]"
          >
            {campaigns && campaigns.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {campaigns.slice(0, 3).map((c: any) => (
                  <div
                    key={c.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${c.sent ? 'bg-green-500' : 'bg-slate-300'}`}
                      ></div>
                      <Typography className="font-medium text-slate-700 truncate max-w-[200px]">
                        {c.subject}
                      </Typography>
                    </div>
                    <Typography
                      variant="caption"
                      className="text-slate-400 bg-slate-50 px-2 py-1 rounded"
                    >
                      {c.sent ? 'Sent' : 'Draft'}
                    </Typography>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <Typography className="text-slate-400 mb-2">
                  No campaigns yet
                </Typography>
                <Button
                  component={Link}
                  to="/campaigns/create"
                  variant="outlined"
                  size="small"
                  className="normal-case border-slate-300 text-slate-600 hover:border-indigo-500 hover:text-indigo-600"
                >
                  Create your first one
                </Button>
              </div>
            )}
          </Paper>
        </div>
      </div>
    </Box>
  )
}

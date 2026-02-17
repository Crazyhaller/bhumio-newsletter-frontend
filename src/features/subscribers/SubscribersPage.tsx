import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  InputAdornment,
  Chip,
} from '@mui/material'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSubscribers, createSubscriber } from '../../lib/api/subscriberApi'
import { CustomFieldsBuilder } from './CustomFieldsBuilder'
import { CsvImport } from './CsvImport'
import { useAuthStore } from '../../app/store/authStore'
import { PageHeader } from '../../components/ui/PageHeader'
import {
  Search,
  PersonAdd,
  Email,
  CalendarToday,
  Person,
} from '@mui/icons-material'
import { toast } from 'sonner'

// Consistent Input Style
const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: '#fff',
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#5b3df5' },
    '&.Mui-focused': { backgroundColor: '#fff' },
  },
}

export const SubscribersPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [email, setEmail] = useState('')
  const [customFields, setCustomFields] = useState({})

  const org = useAuthStore((s) => s.currentOrg)
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['subscribers', page, search, org?.id],
    queryFn: () => fetchSubscribers(page, search),
    enabled: !!org,
  })

  const mutation = useMutation({
    mutationFn: createSubscriber,
    onSuccess: () => {
      setEmail('')
      setCustomFields({})
      queryClient.invalidateQueries({ queryKey: ['subscribers'] })
      toast.success('Subscriber added successfully')
    },
    onError: () => toast.error('Failed to add subscriber'),
  })

  if (!org) {
    return (
      <Box className="h-[50vh] flex flex-col items-center justify-center">
        <Typography variant="h6" className="text-slate-500">
          Please select an organization first.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader
        title="Subscribers"
        subtitle="Manage your audience. Add individual subscribers or import them in bulk."
      />

      <div className="flex flex-col-reverse lg:flex-row gap-8 items-start">
        {/* LEFT COLUMN: Data Table (2/3 width) */}
        <div className="w-full lg:w-2/3 space-y-4">
          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="text-slate-400" />
                </InputAdornment>
              ),
            }}
          />

          {/* Table */}
          <Paper
            elevation={0}
            className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white"
          >
            <Table>
              <TableHead className="bg-slate-50">
                <TableRow>
                  <TableCell className="font-semibold text-slate-600 py-4 pl-6">
                    Subscriber
                  </TableCell>
                  <TableCell className="font-semibold text-slate-600 py-4 text-right pr-6">
                    Joined
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-center py-12 text-slate-500"
                    >
                      No subscribers found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
                {data?.data.map((s: any) => (
                  <TableRow key={s.id} hover>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Person fontSize="small" />
                        </div>
                        <div>
                          <Typography
                            variant="body2"
                            className="font-medium text-slate-900"
                          >
                            {s.email}
                          </Typography>
                          {/* Optional: Display a few custom field keys if available as tags */}
                          {s.customFields &&
                            Object.keys(s.customFields).length > 0 && (
                              <div className="flex gap-1 mt-0.5">
                                <Chip
                                  label="Has Data"
                                  size="small"
                                  className="h-4 text-[9px] bg-slate-100"
                                />
                              </div>
                            )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6 text-slate-500">
                      <div className="inline-flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md text-xs font-medium">
                        <CalendarToday style={{ fontSize: 12 }} />
                        {new Date(s.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <div className="flex justify-center pt-2">
            <Pagination
              count={Math.ceil((data?.total || 0) / 5)}
              page={page}
              onChange={(_, val) => setPage(val)}
              color="primary"
              shape="rounded"
              sx={{
                '& .Mui-selected': {
                  backgroundColor: '#5b3df5 !important',
                  color: '#fff',
                },
              }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Tools (1/3 width) */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* Manual Add Card */}
          <Paper
            elevation={0}
            className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4 text-slate-800">
              <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
                <PersonAdd fontSize="small" />
              </div>
              <Typography variant="subtitle1" className="font-bold">
                Add Subscriber
              </Typography>
            </div>

            <div className="space-y-4">
              <TextField
                fullWidth
                label="Email Address"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email fontSize="small" className="text-slate-400" />
                    </InputAdornment>
                  ),
                }}
              />

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <Typography
                  variant="caption"
                  className="font-semibold text-slate-500 uppercase tracking-wide block mb-2"
                >
                  Custom Attributes
                </Typography>
                <CustomFieldsBuilder onChange={setCustomFields} />
              </div>

              <Button
                fullWidth
                variant="contained"
                onClick={() => mutation.mutate({ email, customFields })}
                disabled={!email || mutation.isPending}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: '#5b3df5',
                  boxShadow: 'none',
                  paddingY: '10px',
                  '&:hover': {
                    backgroundColor: '#4c32cc',
                    boxShadow: '0 4px 12px rgba(91, 61, 245, 0.2)',
                  },
                }}
              >
                {mutation.isPending ? 'Adding...' : 'Add Subscriber'}
              </Button>
            </div>
          </Paper>

          {/* CSV Import Card */}
          <CsvImport />
        </div>
      </div>
    </Box>
  )
}

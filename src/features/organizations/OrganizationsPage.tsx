import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchOrganizations, createOrganization } from '../../lib/api/orgApi'
import { PageHeader } from '../../components/ui/PageHeader'
import { Business, Add, ArrowForward, Settings } from '@mui/icons-material'

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

export const OrganizationsPage = () => {
  const [name, setName] = useState('')
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  })

  const mutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      setName('')
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
  })

  return (
    <Box>
      <PageHeader
        title="Organizations"
        subtitle="Manage your workspaces and team settings."
      />

      {/* CREATION BAR */}
      <div className="mb-8">
        <Typography variant="h6" className="font-bold text-slate-800 mb-3">
          Create New Workspace
        </Typography>
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <TextField
            placeholder="e.g. Acme Marketing Team"
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              ...inputSx,
              width: '100%',
              maxWidth: '400px',
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Business fontSize="small" className="text-slate-400" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={() => mutation.mutate(name)}
            disabled={!name || mutation.isPending}
            startIcon={<Add />}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: '#5b3df5',
              height: '40px',
              paddingX: '24px',
              '&:hover': { backgroundColor: '#4c32cc' },
            }}
          >
            {mutation.isPending ? 'Creating...' : 'Create Organization'}
          </Button>
        </div>
      </div>

      {/* ORGANIZATION GRID */}
      <div className="space-y-4">
        <Typography variant="h6" className="font-bold text-slate-800">
          Your Organizations
        </Typography>

        {!data || data.length === 0 ? (
          <Paper
            elevation={0}
            className="p-8 text-center border border-dashed border-slate-300 rounded-2xl bg-slate-50"
          >
            <Business
              className="text-slate-300 mb-2"
              style={{ fontSize: 48 }}
            />
            <Typography className="text-slate-500 font-medium">
              You haven't created any organizations yet.
            </Typography>
          </Paper>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((org) => (
              <Paper
                key={org.id}
                elevation={0}
                className="group relative p-6 border border-slate-200 rounded-xl bg-white hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                      <Business fontSize="medium" />
                    </div>
                    <div>
                      <Typography
                        variant="h6"
                        className="font-bold text-slate-800 leading-tight"
                      >
                        {org.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        className="text-slate-500 font-medium"
                      >
                        Workspace ID: {org.id.toString().slice(0, 8)}...
                      </Typography>
                    </div>
                  </div>

                  <IconButton
                    size="small"
                    className="text-slate-300 group-hover:text-indigo-600 transition-colors"
                  >
                    <Settings fontSize="small" />
                  </IconButton>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex -space-x-2">
                    {/* Fake avatars for "Team Members" visual */}
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-200"></div>
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-300"></div>
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                      +1
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-indigo-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-200">
                    Manage{' '}
                    <ArrowForward fontSize="small" sx={{ fontSize: 16 }} />
                  </div>
                </div>
              </Paper>
            ))}
          </div>
        )}
      </div>
    </Box>
  )
}

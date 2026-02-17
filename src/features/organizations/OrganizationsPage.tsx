import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from '../../lib/api/orgApi'
import { PageHeader } from '../../components/ui/PageHeader'
import { Business, ArrowForward, Settings } from '@mui/icons-material'
import { useAuthStore } from '../../app/store/authStore'
import { useNavigate } from 'react-router-dom'

export const OrganizationsPage = () => {
  const [name, setName] = useState('')
  const [selectedOrg, setSelectedOrg] = useState<any>(null)
  const [editName, setEditName] = useState('')
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { user, setOrganization } = useAuthStore()

  const { data } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  })

  // CREATE
  const createMutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      setName('')
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
  })

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, name }: any) => updateOrganization(id, name),
    onSuccess: () => {
      setSelectedOrg(null)
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
  })

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      setSelectedOrg(null)
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
  })

  const handleSwitchOrg = (org: any) => {
    setOrganization(org)
    navigate('/')
  }

  return (
    <Box>
      <PageHeader
        title="Organizations"
        subtitle="Manage your workspaces and team settings."
      />

      {/* CREATE */}
      <Box className="mb-8">
        <Typography variant="h6" className="font-bold mb-3">
          Create New Workspace
        </Typography>

        <Box className="flex gap-3">
          <TextField
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Marketing Team"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Business fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={() => createMutation.mutate(name)}
            disabled={!name}
          >
            Create
          </Button>
        </Box>
      </Box>

      {/* GRID */}
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data?.map((org) => (
          <Paper
            key={org.id}
            className="p-6 cursor-pointer hover:shadow-md transition"
            onClick={() => handleSwitchOrg(org)}
          >
            <Box className="flex justify-between items-start">
              <Box>
                <Typography variant="h6">{org.name}</Typography>
                <Typography variant="caption">ID: {org.id}</Typography>
              </Box>

              {user?.role === 'Superadmin' && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedOrg(org)
                    setEditName(org.name)
                  }}
                >
                  <Settings />
                </IconButton>
              )}
            </Box>

            <Box className="mt-4 text-indigo-600 text-sm flex items-center">
              Manage <ArrowForward fontSize="small" />
            </Box>
          </Paper>
        ))}
      </Box>

      {/* SETTINGS MODAL */}
      <Dialog
        open={!!selectedOrg}
        onClose={() => setSelectedOrg(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Organization Settings</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            placeholder="Organization Name"
            label="Organization Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            // FIX: Use sx prop for reliable spacing in MUI Dialogs
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            color="error"
            onClick={() => deleteMutation.mutate(selectedOrg.id)}
          >
            Delete
          </Button>

          <Button onClick={() => setSelectedOrg(null)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={() =>
              updateMutation.mutate({
                id: selectedOrg.id,
                name: editName,
              })
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

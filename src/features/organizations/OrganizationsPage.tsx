import { Box, Typography, Paper, TextField, Button } from '@mui/material'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchOrganizations, createOrganization } from '../../lib/api/orgApi'

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
    <Box className="space-y-6">
      <PageHeader
        title="Organizations"
        subtitle="Manage your organizations and teams"
      />

      <Paper className="p-4 space-y-4">
        <TextField
          label="New Organization"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="contained" onClick={() => mutation.mutate(name)}>
          Create
        </Button>
      </Paper>

      <Paper className="p-4">
        {data?.map((org) => (
          <div key={org.id} className="border p-2 my-2">
            {org.name}
          </div>
        ))}
      </Paper>
    </Box>
  )
}

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
} from '@mui/material'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSubscribers, createSubscriber } from '../../lib/api/subscriberApi'

import { CustomFieldsBuilder } from './CustomFieldsBuilder'
import { CsvImport } from './CsvImport'
import { useAuthStore } from '../../app/store/authStore'
import { PageHeader } from '../../components/ui/PageHeader'

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
    },
  })

  if (!org) return <Typography>Select an organization</Typography>

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Subscribers"
        subtitle="Manage your email subscribers and their custom fields"
      />

      <Paper className="p-4 space-y-4">
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <CustomFieldsBuilder onChange={setCustomFields} />

        <Button
          variant="contained"
          onClick={() => mutation.mutate({ email, customFields })}
        >
          Add Subscriber
        </Button>

        <CsvImport />
      </Paper>

      <TextField
        label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((s: any) => (
              <TableRow key={s.id}>
                <TableCell>{s.email}</TableCell>
                <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Pagination
        count={Math.ceil((data?.total || 0) / 5)}
        page={page}
        onChange={(_, val) => setPage(val)}
      />
    </Box>
  )
}

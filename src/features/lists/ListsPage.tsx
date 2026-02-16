import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
} from '@mui/material'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchLists, createList } from '../../lib/api/listApi'
import { useAuthStore } from '../../app/store/authStore'
import { PageHeader } from '../../components/ui/PageHeader'

export const ListsPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [newName, setNewName] = useState('')

  const org = useAuthStore((s) => s.currentOrg)
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['lists', page, search, org?.id],
    queryFn: () => fetchLists(page, search),
    enabled: !!org,
  })

  const mutation = useMutation({
    mutationFn: createList,

    onMutate: async (name) => {
      await queryClient.cancelQueries({
        queryKey: ['lists', page, search, org?.id],
      })

      const previousData = queryClient.getQueryData([
        'lists',
        page,
        search,
        org?.id,
      ])

      queryClient.setQueryData(
        ['lists', page, search, org?.id],
        (old: any) => ({
          ...old,
          data: [
            {
              id: 'temp-id',
              name,
              createdAt: new Date().toISOString(),
            },
            ...(old?.data || []),
          ],
          total: (old?.total || 0) + 1,
        }),
      )

      return { previousData }
    },

    onError: (_err, _newList, context) => {
      queryClient.setQueryData(
        ['lists', page, search, org?.id],
        context?.previousData,
      )
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['lists'],
      })
    },
  })

  if (!org) {
    return <Typography>Select an organization</Typography>
  }

  return (
    <Box className="space-y-6">
      <PageHeader
        title="Lists"
        subtitle="Manage your private subscriber lists"
      />

      <Paper className="p-4 flex gap-4">
        <TextField
          label="New List Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => mutation.mutate(newName)}
          disabled={!newName}
        >
          Create
        </Button>
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
              <TableCell>Name</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((list: any) => (
              <TableRow key={list.id}>
                <TableCell>{list.name}</TableCell>
                <TableCell>
                  {new Date(list.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Pagination
        count={Math.ceil((data?.total || 0) / 5)}
        page={page}
        onChange={(_, value) => setPage(value)}
      />
    </Box>
  )
}

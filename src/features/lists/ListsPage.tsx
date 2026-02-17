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
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchLists, createList } from '../../lib/api/listApi'
import { useAuthStore } from '../../app/store/authStore'
import { PageHeader } from '../../components/ui/PageHeader'
import {
  Search,
  Add,
  ListAlt,
  CalendarToday,
  ArrowForward,
} from '@mui/icons-material'

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
              isTemp: true, // Marker for UI
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
      setNewName('') // Clear input on success
    },
  })

  if (!org) {
    return (
      <Box className="h-[50vh] flex flex-col items-center justify-center">
        <Typography variant="h6" className="text-slate-500">
          Please select an organization to view lists.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader
        title="Subscriber Lists"
        subtitle="Segment your audience into targeted lists for better engagement."
      />

      {/* CONTROL BAR: Creation & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-end md:items-center">
        {/* Create List Section */}
        <div className="w-full md:w-auto flex gap-2 items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <TextField
            placeholder="New list name..."
            size="small"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{
              ...inputSx,
              '& .MuiOutlinedInput-root': {
                border: 'none',
                backgroundColor: 'transparent',
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' },
              },
              minWidth: '240px',
            }}
          />
          <Button
            variant="contained"
            onClick={() => mutation.mutate(newName)}
            disabled={!newName || mutation.isPending}
            startIcon={<Add />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              backgroundColor: '#5b3df5',
              boxShadow: 'none',
              height: '36px',
              '&:hover': { backgroundColor: '#4c32cc', boxShadow: 'none' },
            }}
          >
            Create
          </Button>
        </div>

        {/* Search Section */}
        <div className="w-full md:w-64">
          <TextField
            fullWidth
            placeholder="Search lists..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" className="text-slate-400" />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <Paper
        elevation={0}
        className="border border-slate-200 rounded-xl overflow-hidden shadow-sm"
      >
        <Table>
          <TableHead className="bg-slate-50">
            <TableRow>
              <TableCell className="font-semibold text-slate-600 py-4 pl-6">
                List Name
              </TableCell>
              <TableCell className="font-semibold text-slate-600 py-4">
                Created Date
              </TableCell>
              <TableCell className="font-semibold text-slate-600 py-4 text-right pr-6">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(!data?.data || data.data.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-12 text-slate-500"
                >
                  <ListAlt
                    className="text-slate-300 mb-2"
                    style={{ fontSize: 40 }}
                  />
                  <Typography>No lists found.</Typography>
                </TableCell>
              </TableRow>
            )}

            {data?.data.map((list: any) => (
              <TableRow
                key={list.id}
                hover
                className={list.isTemp ? 'bg-indigo-50/50' : ''}
              >
                <TableCell className="font-medium text-slate-800 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <ListAlt fontSize="small" />
                    </div>
                    {list.name}
                    {list.isTemp && (
                      <Chip
                        label="Creating..."
                        size="small"
                        className="bg-indigo-100 text-indigo-700 h-5 text-[10px]"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-slate-500">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarToday
                      style={{ fontSize: 14 }}
                      className="text-slate-400"
                    />
                    {new Date(list.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </TableCell>
                <TableCell align="right" className="pr-6">
                  <IconButton
                    size="small"
                    className="text-slate-400 hover:text-indigo-600"
                  >
                    <ArrowForward fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6">
        <Pagination
          count={Math.ceil((data?.total || 0) / 5)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          shape="rounded"
          sx={{
            '& .MuiPaginationItem-root': {
              borderRadius: '8px',
            },
            '& .Mui-selected': {
              backgroundColor: '#5b3df5 !important',
              color: 'white',
            },
          }}
        />
      </div>
    </Box>
  )
}

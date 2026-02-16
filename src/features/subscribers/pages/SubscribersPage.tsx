import { useEffect, useState } from 'react'
import { Typography, Button, Paper, TextField, Pagination } from '@mui/material'
import SubscriberTable from '../components/SubscriberTable'
import SubscriberDialog from '../components/SubscriberDialog'
import { getSubscribers } from '../subscriberService'
import type { PaginatedSubscribers } from '../../../types/subscriber'

export default function SubscribersPage() {
  const [data, setData] = useState<PaginatedSubscribers>()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)

  const load = async () => {
    const res = await getSubscribers(page, 10, search)
    setData(res)
  }

  useEffect(() => {
    load()
  }, [page, search])

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Typography variant="h4">Subscribers</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Subscriber
        </Button>
      </div>

      <TextField
        label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Paper>
        {data && (
          <SubscriberTable
            data={data.data}
            onEdit={(sub) => {
              setSelected(sub)
              setOpen(true)
            }}
          />
        )}
      </Paper>

      {data && (
        <Pagination
          count={Math.ceil(data.total / data.limit)}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
      )}

      <SubscriberDialog
        open={open}
        subscriber={selected}
        onClose={() => {
          setSelected(null)
          setOpen(false)
          load()
        }}
      />
    </div>
  )
}

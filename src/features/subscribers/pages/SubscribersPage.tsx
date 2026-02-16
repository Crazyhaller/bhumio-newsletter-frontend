import { useEffect, useState } from 'react'
import { Typography, Button, Paper, TextField, Pagination } from '@mui/material'
import SubscriberTable from '../components/SubscriberTable'
import CreateSubscriberDialog from '../components/CreateSubscriberDialog'
import { getSubscribers } from '../subscriberService'
import type { PaginatedSubscribers } from '../../../types/subscriber'

export default function SubscribersPage() {
  const [data, setData] = useState<PaginatedSubscribers>()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

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

      <Paper>{data && <SubscriberTable data={data.data} />}</Paper>

      {data && (
        <Pagination
          count={Math.ceil(data.total / data.limit)}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
      )}

      <CreateSubscriberDialog
        open={open}
        onClose={() => {
          setOpen(false)
          load()
        }}
      />
    </div>
  )
}

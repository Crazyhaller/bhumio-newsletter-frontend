import { useEffect, useState } from 'react'
import { Button, Typography, Paper } from '@mui/material'
import type { Organization } from '../../../types/organization'
import { getOrganizations } from '../organizationService'
import OrganizationTable from '../components/OrganizationTable'
import CreateOrganizationDialog from '../components/CreateOrganizationDialog'

export default function OrganizationsPage() {
  const [data, setData] = useState<Organization[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await getOrganizations()
      setData(res)
    }
    load()
  }, [])

  const load = async () => {
    const res = await getOrganizations()
    setData(res)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Typography variant="h4">Organizations</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Create Organization
        </Button>
      </div>

      <Paper>
        <OrganizationTable data={data} />
      </Paper>

      <CreateOrganizationDialog
        open={open}
        onClose={() => {
          setOpen(false)
          load()
        }}
      />
    </div>
  )
}

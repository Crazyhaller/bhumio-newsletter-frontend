import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { fetchOrganizations } from '../../lib/api/orgApi'
import { useAuthStore } from '../../app/store/authStore'

export const OrganizationSelector = () => {
  const { data } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  })

  const setOrganization = useAuthStore((s) => s.setOrganization)
  const currentOrg = useAuthStore((s) => s.currentOrg)

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Organization</InputLabel>
      <Select
        value={currentOrg?.id || ''}
        label="Organization"
        onChange={(e) => {
          const org = data?.find((o) => o.id === e.target.value)
          if (org) setOrganization(org)
        }}
      >
        {data?.map((org) => (
          <MenuItem key={org.id} value={org.id}>
            {org.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

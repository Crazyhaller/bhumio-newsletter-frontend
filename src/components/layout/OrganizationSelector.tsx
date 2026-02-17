import { FormControl, Select, MenuItem, Typography, Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { fetchOrganizations } from '../../lib/api/orgApi'
import { useAuthStore } from '../../app/store/authStore'
import { UnfoldMore, Business } from '@mui/icons-material'
import { useEffect } from 'react'

export const OrganizationSelector = () => {
  const { data } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  })

  const setOrganization = useAuthStore((s) => s.setOrganization)
  const currentOrg = useAuthStore((s) => s.currentOrg)

  // Custom styles to remove the "form input" look
  const selectSx = {
    '.MuiOutlinedInput-notchedOutline': { border: 'none' },
    '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
    backgroundColor: '#f1f5f9', // slate-100
    borderRadius: '10px',
    height: '40px',
    color: '#334155', // slate-700
    fontWeight: 600,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '12px',
    },
  }

  useEffect(() => {
    if (!currentOrg && data && data.length > 0) {
      setOrganization(data[0])
    }
  }, [data, currentOrg])

  return (
    <FormControl size="small" sx={{ minWidth: 220 }}>
      <Select
        value={currentOrg?.id || ''}
        displayEmpty
        onChange={(e) => {
          const org = data?.find((o) => o.id === e.target.value)
          if (org) setOrganization(org)
        }}
        IconComponent={UnfoldMore} // Custom arrow icon
        sx={selectSx}
        renderValue={(selected) => {
          if (!selected) {
            return (
              <Box className="flex items-center gap-2 text-slate-500">
                <Business fontSize="small" />
                <span>Select Organization</span>
              </Box>
            )
          }
          return (
            <Box className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 rounded text-xs">
                <Business style={{ fontSize: 14 }} />
              </div>
              <span>{currentOrg?.name}</span>
            </Box>
          )
        }}
      >
        <MenuItem disabled value="">
          <Typography variant="caption" className="text-slate-400 pl-2">
            Switch Organization
          </Typography>
        </MenuItem>
        {data?.map((org) => (
          <MenuItem key={org.id} value={org.id} className="gap-2">
            {org.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

import { Outlet } from 'react-router-dom'
import { Box, Drawer, List, ListItemButton } from '@mui/material'

export const DashboardLayout = () => {
  return (
    <Box className="flex min-h-screen">
      <Drawer variant="permanent">
        <List>
          <ListItemButton>Dashboard</ListItemButton>
        </List>
      </Drawer>
      <Box className="flex-1 p-8">
        <Outlet />
      </Box>
    </Box>
  )
}

import { Outlet } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material'
import { OrganizationSelector } from './OrganizationSelector'

export const DashboardLayout = () => {
  return (
    <Box className="flex min-h-screen">
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar className="flex justify-between">
          <Typography variant="h6">Newsletter SaaS</Typography>
          <OrganizationSelector />
        </Toolbar>
      </AppBar>
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

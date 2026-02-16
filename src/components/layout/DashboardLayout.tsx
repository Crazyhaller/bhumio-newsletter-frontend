import { Outlet, Link } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material'
import { OrganizationSelector } from './OrganizationSelector'

export const DashboardLayout = () => {
  return (
    <Box className="flex min-h-screen">
      {/* Sidebar */}
      <Drawer variant="permanent">
        <List sx={{ width: 240 }}>
          <ListItemButton component={Link} to="/">
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton component={Link} to="/lists">
            <ListItemText primary="Lists" />
          </ListItemButton>
          <ListItemButton component={Link} to="/subscribers">
            <ListItemText primary="Subscribers" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box className="flex-1">
        {/* Top Bar */}
        <AppBar position="static" elevation={0} color="transparent">
          <Toolbar className="flex justify-between">
            <Typography variant="h6">Newsletter SaaS</Typography>
            <OrganizationSelector />
          </Toolbar>
        </AppBar>

        {/* Routed Content */}
        <Box className="p-8">
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

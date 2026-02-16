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
  Divider,
} from '@mui/material'
import { OrganizationSelector } from './OrganizationSelector'
import type { UserRole } from '../../types/auth'
import { useAuthStore } from '../../app/store/authStore'

interface NavItem {
  label: string
  path: string
  allowed: UserRole[]
}

export const DashboardLayout = () => {
  const role = useAuthStore((s) => s.user?.role)

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/',
      allowed: ['Superadmin', 'Admin', 'User'],
    },
    {
      label: 'Lists',
      path: '/lists',
      allowed: ['Superadmin', 'Admin'],
    },
    {
      label: 'Subscribers',
      path: '/subscribers',
      allowed: ['Superadmin', 'Admin'],
    },
    {
      label: 'Campaigns',
      path: '/campaigns',
      allowed: ['Superadmin', 'Admin'],
    },
    {
      label: 'Create Campaign',
      path: '/campaigns/create',
      allowed: ['Superadmin', 'Admin'],
    },
    {
      label: 'Templates',
      path: '/templates',
      allowed: ['Superadmin', 'Admin'],
    },
    {
      label: 'Automation',
      path: '/automation',
      allowed: ['Superadmin', 'Admin'],
    },
    {
      label: 'Organizations',
      path: '/organizations',
      allowed: ['Superadmin'],
    },
  ]

  return (
    <Box className="flex min-h-screen">
      {/* Sidebar */}
      <Drawer variant="permanent">
        <List sx={{ width: 240 }}>
          {navItems
            .filter((item) => role && item.allowed.includes(role))
            .map((item) => (
              <ListItemButton key={item.path} component={Link} to={item.path}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}

          <Divider sx={{ my: 2 }} />
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

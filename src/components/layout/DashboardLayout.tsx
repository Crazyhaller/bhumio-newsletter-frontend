import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material'
import { OrganizationSelector } from './OrganizationSelector'
import type { UserRole } from '../../types/auth'
import { useAuthStore } from '../../app/store/authStore'
import {
  Dashboard as DashboardIcon,
  FormatListBulleted,
  PeopleAlt,
  Campaign,
  AddCircleOutline,
  Web,
  AutoMode,
  Business,
  NotificationsNone,
  Logout,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { fetchOrganizations } from '../../lib/api/orgApi'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  allowed: UserRole[]
  action?: boolean // Special styling for actions like "Create"
}

// Sidebar Width
const DRAWER_WIDTH = 260

export const DashboardLayout = () => {
  const { pathname } = useLocation()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const role = user?.role

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <DashboardIcon />,
      allowed: ['Superadmin', 'Admin', 'User'],
    },
    {
      label: 'Lists',
      path: '/lists',
      icon: <FormatListBulleted />,
      allowed: ['Superadmin', 'Admin'],
    },
    {
      label: 'Subscribers',
      path: '/subscribers',
      icon: <PeopleAlt />,
      allowed: ['Superadmin', 'Admin'],
    },
    {
      label: 'Campaigns',
      path: '/campaigns',
      icon: <Campaign />,
      allowed: ['Superadmin', 'Admin'],
    },
    {
      label: 'Templates',
      path: '/templates',
      icon: <Web />,
      allowed: ['Superadmin', 'Admin'],
    },
    {
      label: 'Automation',
      path: '/automation',
      icon: <AutoMode />,
      allowed: ['Superadmin', 'Admin'],
    },
    {
      label: 'Organizations',
      path: '/organizations',
      icon: <Business />,
      allowed: ['Superadmin'],
    },
  ]

  // Special Action Item
  const createCampaignItem: NavItem = {
    label: 'Create Campaign',
    path: '/campaigns/create',
    icon: <AddCircleOutline />,
    allowed: ['Superadmin', 'Admin'],
    action: true,
  }

  const navigate = useNavigate()

  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  })

  const currentOrg = useAuthStore((s) => s.currentOrg)

  useEffect(() => {
    if (
      role === 'Superadmin' &&
      organizations &&
      organizations.length === 0 &&
      pathname !== '/organizations'
    ) {
      navigate('/organizations')
    }
  }, [organizations, role, pathname])

  return (
    <Box className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
          },
        }}
      >
        {/* Logo Area */}
        <Box className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <Typography
            variant="h6"
            className="font-bold text-slate-800 tracking-tight"
          >
            Newsletter
          </Typography>
        </Box>

        {/* Navigation List */}
        <List className="px-4 space-y-1">
          {/* Main Items */}
          {navItems
            .filter((item) => role && item.allowed.includes(role))
            .map((item) => {
              const isActive = pathname === item.path
              return (
                <ListItemButton
                  key={item.path}
                  component={Link}
                  to={item.path}
                  selected={isActive}
                  sx={{
                    borderRadius: '12px',
                    mb: 0.5,
                    padding: '10px 16px',
                    color: isActive ? '#4f46e5' : '#64748b',
                    backgroundColor: isActive
                      ? '#eef2ff !important'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                      color: '#0f172a',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: 'inherit', // Inherit color from parent for active state
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              )
            })}

          {/* Divider or Spacer could go here */}
          <Box className="my-4 border-t border-slate-100 mx-2" />

          {/* Create Campaign Action */}
          {role && createCampaignItem.allowed.includes(role) && (
            <ListItemButton
              component={Link}
              to={createCampaignItem.path}
              sx={{
                borderRadius: '12px',
                padding: '10px 16px',
                color: '#4f46e5',
                backgroundColor: '#eef2ff',
                border: '1px dashed #6366f1',
                '&:hover': {
                  backgroundColor: '#e0e7ff',
                  border: '1px solid #6366f1',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                {createCampaignItem.icon}
              </ListItemIcon>
              <ListItemText
                primary={createCampaignItem.label}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          )}
        </List>

        {/* User Profile Section at Bottom */}
        <Box className="mt-auto p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer group">
            <Avatar
              sx={{ width: 36, height: 36, bgcolor: '#cbd5e1', fontSize: 14 }}
            >
              {'U'}
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <Typography
                variant="caption"
                className="truncate text-slate-500 block"
              >
                {role}
              </Typography>
            </div>
            <IconButton size="small" onClick={() => logout()}>
              <Logout
                fontSize="small"
                className="text-slate-400 hover:text-red-500"
              />
            </IconButton>
          </div>
        </Box>
      </Drawer>

      {/* MAIN CONTENT AREA */}
      <Box className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <Toolbar className="flex justify-between h-16">
            <Typography variant="h6" className="text-slate-800 font-semibold">
              {/* Dynamic Page Title based on Route could go here */}
              {navItems.find((i) => i.path === pathname)?.label || 'Overview'}
            </Typography>

            <Box className="flex items-center gap-4">
              <IconButton className="text-slate-400 hover:text-indigo-600">
                <NotificationsNone />
              </IconButton>
              {/* Vertical Divider */}
              <div className="h-6 w-px bg-slate-200"></div>
              <OrganizationSelector />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box className="flex-1 p-8 overflow-auto">
          {/* Max width container to prevent stretching on huge screens */}
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </Box>
      </Box>
    </Box>
  )
}

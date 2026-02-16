import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { useAuth } from '../../features/auth/useAuth'

export default function Topbar() {
  const { logout } = useAuth()

  return (
    <AppBar position="static" color="primary">
      <Toolbar className="flex justify-between">
        <Typography variant="h6">Admin Panel</Typography>
        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

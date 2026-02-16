import { Link } from 'react-router-dom'
import { List, ListItemButton, ListItemText } from '@mui/material'

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4 font-bold text-lg">Newsletter</div>
      <List>
        <ListItemButton component={Link} to="/">
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={Link} to="/organizations">
          <ListItemText primary="Organizations" />
        </ListItemButton>
        <ListItemButton component={Link} to="/subscribers">
          <ListItemText primary="Subscribers" />
        </ListItemButton>
      </List>
    </div>
  )
}

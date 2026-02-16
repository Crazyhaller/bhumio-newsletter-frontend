import { ReactNode } from 'react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { AuthProvider } from '../features/auth/AuthContext'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb' },
  },
})

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material'
import { type ReactNode } from 'react'

const theme = createTheme({
  palette: {
    primary: {
      main: '#5b3df5',
    },
    secondary: {
      main: '#ff6b6b',
    },
  },
  shape: {
    borderRadius: 12,
  },
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}

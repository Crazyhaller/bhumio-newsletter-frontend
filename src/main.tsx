import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from './app/providers/ThemeProvider'
import { QueryProvider } from './app/providers/QueryProvider'
import { AppRouter } from './app/routes/AppRouter'
import { Toaster } from 'sonner'
import './index.css'

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./lib/mock/browser')
    await worker.start()
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider>
        <QueryProvider>
          <AppRouter />
          <Toaster richColors />
        </QueryProvider>
      </ThemeProvider>
    </React.StrictMode>,
  )
})

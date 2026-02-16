import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginPage } from '../../../features/auth/LoginPage'

const renderComponent = () => {
  const client = new QueryClient()
  return render(
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </QueryClientProvider>,
  )
}

test('renders login form', () => {
  renderComponent()
  expect(screen.getByText('Login')).toBeInTheDocument()
})

test('shows validation errors', async () => {
  renderComponent()
  fireEvent.click(screen.getByText('Login'))
  expect(await screen.findAllByText(/required|invalid/i)).toBeTruthy()
})

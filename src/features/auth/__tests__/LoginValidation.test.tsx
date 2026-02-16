import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import { AuthProvider } from '../AuthProvider'
import { describe, it, expect } from 'vitest'

describe('Login Validation', () => {
  it('shows validation errors', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument()
  })
})

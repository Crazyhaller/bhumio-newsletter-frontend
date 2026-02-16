import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import { AuthProvider } from '../AuthProvider'
import { describe, it, expect, vi } from 'vitest'
import api from '../../../services/axios'

vi.mock('../../../services/axios')

describe('LoginPage', () => {
  it('logs in successfully', async () => {
    ;(api.post as any).mockResolvedValue({
      data: {
        token: btoa(
          JSON.stringify({
            userId: '1',
            organizationId: 'org-1',
            role: 'Admin',
          }),
        ),
      },
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>,
    )

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' },
    })

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123456' },
    })

    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled()
    })
  })
})

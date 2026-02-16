import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute'
import { AuthProvider } from '../AuthProvider'
import { describe, it } from 'vitest'

describe('ProtectedRoute', () => {
  it('redirects if not authenticated', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>Protected</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>,
    )
  })
})

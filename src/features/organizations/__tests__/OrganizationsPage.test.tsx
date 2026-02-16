import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import OrganizationsPage from '../pages/OrganizationsPage'
import { describe, it, expect } from 'vitest'

describe('OrganizationsPage', () => {
  it('renders organizations list', async () => {
    render(
      <BrowserRouter>
        <OrganizationsPage />
      </BrowserRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText(/organizations/i)).toBeInTheDocument()
    })
  })
})

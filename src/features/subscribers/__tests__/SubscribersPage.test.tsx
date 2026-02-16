import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SubscribersPage from '../pages/SubscribersPage'
import { describe, it, expect } from 'vitest'

describe('SubscribersPage', () => {
  it('renders subscribers', async () => {
    render(
      <BrowserRouter>
        <SubscribersPage />
      </BrowserRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText(/subscribers/i)).toBeInTheDocument()
    })
  })
})

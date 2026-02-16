import { render } from '@testing-library/react'

import { MemoryRouter } from 'react-router-dom'
import { useAuthStore } from '../../app/store/authStore'
import { RoleGuard } from '../../app/routes/RoleGuard'

test('blocks unauthorized role', () => {
  useAuthStore.setState({
    user: {
      id: '1',
      email: 'test@test.com',
      organizationId: '1',
      role: 'User',
    },
    token: 't',
    currentOrg: null,
  })

  const { container } = render(
    <MemoryRouter>
      <RoleGuard allowed={['Admin']}>
        <div>Secret</div>
      </RoleGuard>
    </MemoryRouter>,
  )

  expect(container.textContent).not.toContain('Secret')
})

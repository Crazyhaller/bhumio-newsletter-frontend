import { renderHook, act } from '@testing-library/react'
import { AuthProvider } from '../AuthProvider'
import { useAuth } from '../useAuth'
import { describe, it, expect } from 'vitest'

describe('AuthContext', () => {
  it('logs in and logs out', () => {
    const wrapper = ({ children }: any) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    const token = btoa(
      JSON.stringify({ userId: '1', organizationId: 'org-1', role: 'Admin' }),
    )

    act(() => result.current.login(token))
    expect(result.current.token).toBe(token)

    act(() => result.current.logout())
    expect(result.current.token).toBeNull()
  })
})

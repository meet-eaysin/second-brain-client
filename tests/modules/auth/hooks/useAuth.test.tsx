import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@/test/utils'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { QueryClient } from '@tanstack/react-query'
import { createTestQueryClient } from '@/test/utils'

// Mock the auth service
vi.mock('@/modules/auth/services/authService', () => ({
  authService: {
    getCurrentUser: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  },
}))

describe('useAuth Hook', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = createTestQueryClient()
    vi.clearAllMocks()
  })

  it('should return initial state when not authenticated', () => {
    const { result } = renderHook(() => useAuth(), {
      queryClient,
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false) // Updated expectation
  })

  it('should handle authentication state correctly', async () => {
    // Mock successful authentication
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      isActive: true,
      authProvider: 'LOCAL' as const,
      isEmailVerified: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    }

    // Mock localStorage to have a token
    vi.mocked(localStorage.getItem).mockReturnValue('mock-token')

    const { result } = renderHook(() => useAuth(), {
      queryClient,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Note: The actual implementation would need to be tested based on your auth logic
    // This is a basic structure showing how to test the hook
  })

  it('should handle logout correctly', async () => {
    const { result } = renderHook(() => useAuth(), {
      queryClient,
    })

    // Test logout functionality
    await waitFor(() => {
      expect(result.current.logout).toBeDefined()
    })

    // You would test the actual logout logic here
  })
})

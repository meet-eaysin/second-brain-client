import React from 'react'
import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

function AllTheProviders({
  children,
  queryClient = createTestQueryClient()
}: {
  children: React.ReactNode
  queryClient?: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { queryClient, ...renderOptions } = options

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders queryClient={queryClient}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  })
}

// Mock user for authentication tests
export const mockUser = {
  id: 'test-user-id',
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

// Mock database for database tests
export const mockDatabase = {
  id: 'test-database-id',
  name: 'Test Database',
  description: 'A test database',
  workspaceId: 'test-workspace-id',
  ownerId: 'test-user-id',
  isPublic: false,
  properties: [],
  views: [],
  permissions: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

// Helper to create mock API responses
export const createMockApiResponse = <T,>(data: T) => ({
  success: true,
  data,
  message: 'Success',
  timestamp: new Date().toISOString(),
})

// Helper to create mock API error responses
export const createMockApiError = (message: string, statusCode = 400) => ({
  success: false,
  message,
  statusCode,
  timestamp: new Date().toISOString(),
})

// Helper to wait for async operations
export const waitForTimeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Re-export specific testing-library functions to avoid conflicts
export {
  screen,
  fireEvent,
  waitFor,
  act,
  renderHook,
  cleanup,
} from '@testing-library/react'

// Export our custom render function
export { customRender as render }
export { createTestQueryClient }

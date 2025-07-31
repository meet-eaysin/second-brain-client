import { setupServer } from 'msw/node'
import { afterEach, afterAll } from 'vitest'
import { handlers } from './handlers'

// Setup MSW server for Node.js environment (tests)
export const server = setupServer(...handlers)

// Start server before all tests
server.listen({
  onUnhandledRequest: 'warn',
})

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers()
})

// Clean up after all tests
afterAll(() => {
  server.close()
})

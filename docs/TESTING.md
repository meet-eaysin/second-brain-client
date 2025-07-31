# Testing Guide

This project uses **Vitest** as the primary testing framework with modern testing tools and best practices.

## 🧪 Testing Stack

- **[Vitest](https://vitest.dev/)** - Fast unit test framework
- **[@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)** - React component testing utilities
- **[@testing-library/jest-dom](https://github.com/testing-library/jest-dom)** - Custom Jest matchers
- **[@testing-library/user-event](https://testing-library.com/docs/user-event/intro/)** - User interaction simulation
- **[MSW](https://mswjs.io/)** - API mocking
- **[Happy DOM](https://github.com/capricorn86/happy-dom)** - Fast DOM implementation

## 🚀 Quick Start

### Running Tests

```bash
# Run tests in watch mode
yarn test

# Run tests once
yarn test:run

# Run tests with coverage
yarn test:coverage

# Run tests with UI
yarn test:ui

# Run tests for CI
yarn test:ci
```

### Writing Your First Test

Create tests in the `tests/` directory following the same structure as your `src/` directory:

```typescript
// tests/components/ui/my-component.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { MyComponent } from '@/components/ui/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Hello World" />)

    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
```

## 📁 Test Structure

All tests are centralized in the `tests/` directory for better organization:

```
tests/
├── components/
│   └── ui/                # UI component tests
│       ├── button.test.tsx
│       └── input.test.tsx
├── modules/
│   ├── auth/              # Auth module tests
│   │   ├── hooks/
│   │   └── pages/
│   └── databases/         # Database module tests
│       ├── components/
│       └── services/
├── hooks/                 # Custom hook tests
│   └── useLocalStorage.test.tsx
├── utils/                 # Utility function tests
│   └── helpers.test.ts
├── integration/           # Integration tests
│   ├── auth-flow.test.tsx
│   └── database-crud.test.tsx
├── e2e/                   # End-to-end tests
│   └── user-journey.test.tsx
├── performance/           # Performance tests
│   └── component-rendering.test.tsx
└── accessibility/         # A11y tests
    └── a11y.test.tsx

src/
└── test/                  # Test utilities only
    ├── setup.ts           # Global test setup
    ├── utils.tsx          # Custom render utilities
    └── mocks/
        ├── handlers.ts    # MSW request handlers
        └── server.ts      # MSW server setup
```

## 🛠️ Testing Utilities

### Custom Render Function

Use the custom render function from `@/test/utils` instead of the default one:

```typescript
import { render, screen } from '@/test/utils'

// This automatically wraps components with:
// - QueryClientProvider
// - BrowserRouter
// - Other necessary providers
```

### Mock Data

Pre-defined mock data is available:

```typescript
import { mockUser, mockDatabase } from '@/test/utils'

// Use in your tests
const user = mockUser
const database = { ...mockDatabase, name: 'Custom Name' }
```

### API Mocking with MSW

API calls are automatically mocked. To customize responses:

```typescript
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'

// Override default handler for a specific test
server.use(
  http.get('/api/v1/users', () => {
    return HttpResponse.json({ users: [] })
  })
)
```

## 🗂️ Test Categories

### **Unit Tests** (`tests/components/`, `tests/hooks/`, `tests/utils/`)
Test individual components, hooks, and utility functions in isolation.

### **Integration Tests** (`tests/integration/`)
Test how multiple components work together, including API interactions.

### **End-to-End Tests** (`tests/e2e/`)
Test complete user workflows from start to finish.

### **Performance Tests** (`tests/performance/`)
Test rendering performance and identify potential bottlenecks.

### **Accessibility Tests** (`tests/accessibility/`)
Test ARIA attributes, keyboard navigation, and screen reader compatibility.

## 📋 Testing Patterns

### Component Testing

```typescript
describe('Button Component', () => {
  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Hook Testing

```typescript
import { renderHook, waitFor } from '@/test/utils'

describe('useAuth Hook', () => {
  it('returns user data when authenticated', async () => {
    const { result } = renderHook(() => useAuth())
    
    await waitFor(() => {
      expect(result.current.user).toBeTruthy()
    })
  })
})
```

### Integration Testing

```typescript
describe('Login Flow', () => {
  it('logs in user successfully', async () => {
    render(<LoginPage />)
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument()
    })
  })
})
```

## 🎯 Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ❌ Testing implementation details
expect(component.state.isLoading).toBe(true)

// ✅ Testing user-visible behavior
expect(screen.getByText('Loading...')).toBeInTheDocument()
```

### 2. Use Semantic Queries

```typescript
// ✅ Preferred order
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email/i)
screen.getByText(/welcome/i)
screen.getByTestId('custom-element') // Last resort
```

### 3. Async Testing

```typescript
// ✅ Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Data loaded')).toBeInTheDocument()
})

// ✅ Use findBy for elements that will appear
const element = await screen.findByText('Async content')
```

### 4. Mock External Dependencies

```typescript
// Mock modules at the top of test files
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
}))
```

## 📊 Coverage Requirements

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## 🔧 Configuration

### Vitest Config

Configuration is in `vitest.config.ts`:

- **Environment**: Happy DOM (faster than jsdom)
- **Coverage**: V8 provider
- **Globals**: Enabled for describe/it/expect
- **Setup**: Automatic test setup and cleanup

### VS Code Integration

Install the [Vitest extension](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer) for:

- Test discovery and running
- Inline test results
- Debug support

## 🚨 Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout in `vitest.config.ts`
2. **Module not found**: Check path aliases in config
3. **DOM not available**: Ensure using custom render from utils
4. **API calls failing**: Check MSW handlers are set up correctly

### Debug Tests

```bash
# Run specific test file
yarn test auth.test.tsx

# Run tests matching pattern
yarn test --grep "login"

# Debug with UI
yarn test:ui
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

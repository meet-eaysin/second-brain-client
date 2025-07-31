import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils'
import { SignInPage } from '@/modules/auth/pages/sign-in-page'
import { QueryClient } from '@tanstack/react-query'
import { createTestQueryClient } from '@/test/utils'

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
  }
})

describe('SignInPage Integration Tests', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = createTestQueryClient()
    vi.clearAllMocks()
  })

  it('should render sign in form', () => {
    render(<SignInPage />, { queryClient })

    expect(screen.getByText(/sign in/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('should handle successful login flow', async () => {
    render(<SignInPage />, { queryClient })

    // Fill in the login form
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })
    fireEvent.click(submitButton)

    // Wait for the API call to complete
    await waitFor(() => {
      // Check for success indicators (this depends on your implementation)
      // For example, a success message or redirect
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument()
    })
  })

  it('should handle login failure', async () => {
    render(<SignInPage />, { queryClient })

    // Fill in the login form with invalid credentials
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('should validate form fields', async () => {
    render(<SignInPage />, { queryClient })

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('should show loading state during login', async () => {
    render(<SignInPage />, { queryClient })

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })
    fireEvent.click(submitButton)

    // Check for loading state
    expect(submitButton).toBeDisabled()
    // You might also check for a loading spinner or text
  })
})

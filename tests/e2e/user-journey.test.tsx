import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils'
import { QueryClient } from '@tanstack/react-query'
import { createTestQueryClient } from '@/test/utils'

// Mock App component since it might not exist yet
const MockApp = () => <div>Mock App Component</div>

// Mock the App import
vi.mock('@/App', () => ({
  App: MockApp
}))

describe('Complete User Journey E2E', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = createTestQueryClient()
    localStorage.clear()
  })

  it('should complete full user journey: register -> login -> create database -> manage data', async () => {
    // Step 1: Start at registration
    render(<MockApp />, { queryClient })

    // Register new user
    const firstNameInput = screen.getByLabelText(/first name/i)
    const lastNameInput = screen.getByLabelText(/last name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const registerButton = screen.getByRole('button', { name: /sign up/i })

    fireEvent.change(firstNameInput, { target: { value: 'John' } })
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(registerButton)

    // Step 2: Should redirect to login after registration
    await waitFor(() => {
      expect(screen.getByText(/sign in/i)).toBeInTheDocument()
    })

    // Login with new credentials
    const loginEmailInput = screen.getByLabelText(/email/i)
    const loginPasswordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(loginEmailInput, { target: { value: 'john.doe@example.com' } })
    fireEvent.change(loginPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)

    // Step 3: Should redirect to dashboard
    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument()
    })

    // Step 4: Navigate to databases
    const databasesLink = screen.getByRole('link', { name: /databases/i })
    fireEvent.click(databasesLink)

    await waitFor(() => {
      expect(screen.getByText(/your databases/i)).toBeInTheDocument()
    })

    // Step 5: Create new database
    const createDatabaseButton = screen.getByRole('button', { name: /create database/i })
    fireEvent.click(createDatabaseButton)

    const databaseNameInput = screen.getByLabelText(/database name/i)
    const databaseDescInput = screen.getByLabelText(/description/i)

    fireEvent.change(databaseNameInput, { target: { value: 'My First Database' } })
    fireEvent.change(databaseDescInput, { target: { value: 'A database for my project' } })

    const createButton = screen.getByRole('button', { name: /create/i })
    fireEvent.click(createButton)

    // Step 6: Should show new database
    await waitFor(() => {
      expect(screen.getByText('My First Database')).toBeInTheDocument()
    })

    // Step 7: Open database to manage data
    const openDatabaseButton = screen.getByRole('button', { name: /open/i })
    fireEvent.click(openDatabaseButton)

    await waitFor(() => {
      expect(screen.getByText(/database view/i)).toBeInTheDocument()
    })

    // Step 8: Add properties to database
    const addPropertyButton = screen.getByRole('button', { name: /add property/i })
    fireEvent.click(addPropertyButton)

    const propertyNameInput = screen.getByLabelText(/property name/i)
    const propertyTypeSelect = screen.getByLabelText(/property type/i)

    fireEvent.change(propertyNameInput, { target: { value: 'Title' } })
    fireEvent.change(propertyTypeSelect, { target: { value: 'text' } })

    const savePropertyButton = screen.getByRole('button', { name: /save property/i })
    fireEvent.click(savePropertyButton)

    // Step 9: Add a record
    const addRecordButton = screen.getByRole('button', { name: /add record/i })
    fireEvent.click(addRecordButton)

    const titleInput = screen.getByLabelText(/title/i)
    fireEvent.change(titleInput, { target: { value: 'My First Record' } })

    const saveRecordButton = screen.getByRole('button', { name: /save record/i })
    fireEvent.click(saveRecordButton)

    // Step 10: Verify record is displayed
    await waitFor(() => {
      expect(screen.getByText('My First Record')).toBeInTheDocument()
    })

    // Step 11: Test user profile access
    const profileButton = screen.getByRole('button', { name: /profile/i })
    fireEvent.click(profileButton)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    })

    // Step 12: Test logout
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    fireEvent.click(logoutButton)

    await waitFor(() => {
      expect(screen.getByText(/sign in/i)).toBeInTheDocument()
    })

    // Verify user is logged out
    expect(localStorage.getItem('auth_token')).toBeNull()
  })

  it('should handle error scenarios gracefully', async () => {
    render(<MockApp />, { queryClient })

    // Test invalid login
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(loginButton)

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })

    // Should remain on login page
    expect(screen.getByText(/sign in/i)).toBeInTheDocument()
  })
})

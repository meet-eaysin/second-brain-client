import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils'
import { DatabasesPage } from '@/modules/databases/pages/databases-page'
import { QueryClient } from '@tanstack/react-query'
import { createTestQueryClient } from '@/test/utils'

describe('Database CRUD Integration', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = createTestQueryClient()
  })

  it('should display list of databases', async () => {
    render(<DatabasesPage />, { queryClient })

    await waitFor(() => {
      expect(screen.getByText(/databases/i)).toBeInTheDocument()
    })

    // Should show database cards
    expect(screen.getByText('Database 1')).toBeInTheDocument()
    expect(screen.getByText('Database 2')).toBeInTheDocument()
  })

  it('should create a new database', async () => {
    render(<DatabasesPage />, { queryClient })

    // Click create database button
    const createButton = screen.getByRole('button', { name: /create database/i })
    fireEvent.click(createButton)

    // Fill in database form
    const nameInput = screen.getByLabelText(/name/i)
    const descriptionInput = screen.getByLabelText(/description/i)

    fireEvent.change(nameInput, { target: { value: 'New Test Database' } })
    fireEvent.change(descriptionInput, { target: { value: 'A new test database' } })

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create/i })
    fireEvent.click(submitButton)

    // Should show success message and new database
    await waitFor(() => {
      expect(screen.getByText('New Test Database')).toBeInTheDocument()
    })
  })

  it('should edit an existing database', async () => {
    render(<DatabasesPage />, { queryClient })

    await waitFor(() => {
      expect(screen.getByText('Database 1')).toBeInTheDocument()
    })

    // Find and click edit button for first database
    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)

    // Update database name
    const nameInput = screen.getByDisplayValue('Database 1')
    fireEvent.change(nameInput, { target: { value: 'Updated Database 1' } })

    // Submit changes
    const saveButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(saveButton)

    // Should show updated name
    await waitFor(() => {
      expect(screen.getByText('Updated Database 1')).toBeInTheDocument()
    })
  })

  it('should delete a database', async () => {
    render(<DatabasesPage />, { queryClient })

    await waitFor(() => {
      expect(screen.getByText('Database 1')).toBeInTheDocument()
    })

    // Find and click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    fireEvent.click(confirmButton)

    // Database should be removed
    await waitFor(() => {
      expect(screen.queryByText('Database 1')).not.toBeInTheDocument()
    })
  })

  it('should handle database sharing', async () => {
    render(<DatabasesPage />, { queryClient })

    await waitFor(() => {
      expect(screen.getByText('Database 1')).toBeInTheDocument()
    })

    // Find and click share button
    const shareButton = screen.getByRole('button', { name: /share/i })
    fireEvent.click(shareButton)

    // Should open share dialog
    expect(screen.getByText(/share database/i)).toBeInTheDocument()

    // Add user to share with
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } })

    const shareSubmitButton = screen.getByRole('button', { name: /share/i })
    fireEvent.click(shareSubmitButton)

    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/shared successfully/i)).toBeInTheDocument()
    })
  })

  it('should filter databases by search', async () => {
    render(<DatabasesPage />, { queryClient })

    await waitFor(() => {
      expect(screen.getByText('Database 1')).toBeInTheDocument()
      expect(screen.getByText('Database 2')).toBeInTheDocument()
    })

    // Search for specific database
    const searchInput = screen.getByPlaceholderText(/search databases/i)
    fireEvent.change(searchInput, { target: { value: 'Database 1' } })

    // Should only show matching database
    await waitFor(() => {
      expect(screen.getByText('Database 1')).toBeInTheDocument()
      expect(screen.queryByText('Database 2')).not.toBeInTheDocument()
    })
  })

  it('should handle pagination', async () => {
    render(<DatabasesPage />, { queryClient })

    await waitFor(() => {
      expect(screen.getByText(/databases/i)).toBeInTheDocument()
    })

    // Should show pagination controls if there are many databases
    const nextButton = screen.queryByRole('button', { name: /next/i })
    if (nextButton) {
      fireEvent.click(nextButton)

      // Should load next page
      await waitFor(() => {
        expect(screen.getByText(/page 2/i)).toBeInTheDocument()
      })
    }
  })
})

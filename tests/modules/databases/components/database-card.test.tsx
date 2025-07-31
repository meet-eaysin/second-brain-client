import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import { DatabaseCard } from '@/modules/databases/components/database-card'
import { mockDatabase } from '@/test/utils'

// Mock the router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

describe('DatabaseCard Component', () => {
  const mockProps = {
    database: mockDatabase,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onShare: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders database information correctly', () => {
    render(<DatabaseCard {...mockProps} />)
    
    expect(screen.getByText(mockDatabase.name)).toBeInTheDocument()
    if (mockDatabase.description) {
      expect(screen.getByText(mockDatabase.description)).toBeInTheDocument()
    }
  })

  it('shows public badge when database is public', () => {
    const publicDatabase = { ...mockDatabase, isPublic: true }
    render(<DatabaseCard {...mockProps} database={publicDatabase} />)
    
    expect(screen.getByText(/public/i)).toBeInTheDocument()
  })

  it('calls onEdit when edit action is triggered', () => {
    render(<DatabaseCard {...mockProps} />)
    
    // Look for dropdown trigger first
    const dropdownTrigger = screen.getByRole('button', { name: '' })
    fireEvent.click(dropdownTrigger)
    
    // Then look for edit option in dropdown
    const editOption = screen.getByText(/edit/i)
    fireEvent.click(editOption)
    
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockDatabase)
  })

  it('calls onDelete when delete action is triggered', () => {
    render(<DatabaseCard {...mockProps} />)
    
    // Look for dropdown trigger first
    const dropdownTrigger = screen.getByRole('button', { name: '' })
    fireEvent.click(dropdownTrigger)
    
    // Then look for delete option in dropdown
    const deleteOption = screen.getByText(/delete/i)
    fireEvent.click(deleteOption)
    
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockDatabase.id)
  })

  it('calls onShare when share action is triggered', () => {
    render(<DatabaseCard {...mockProps} />)
    
    // Look for dropdown trigger first
    const dropdownTrigger = screen.getByRole('button', { name: '' })
    fireEvent.click(dropdownTrigger)
    
    // Then look for share option in dropdown
    const shareOption = screen.getByText(/share/i)
    fireEvent.click(shareOption)
    
    expect(mockProps.onShare).toHaveBeenCalledWith(mockDatabase)
  })

  it('displays update date', () => {
    render(<DatabaseCard {...mockProps} />)
    
    // Check if date is displayed (format may vary based on implementation)
    expect(screen.getByText(/updated/i)).toBeInTheDocument()
  })

  it('handles missing description gracefully', () => {
    const databaseWithoutDescription = { ...mockDatabase, description: undefined }
    render(<DatabaseCard {...mockProps} database={databaseWithoutDescription} />)
    
    expect(screen.getByText(mockDatabase.name)).toBeInTheDocument()
    // Should not crash and should still render the card
  })

  it('applies correct styling classes', () => {
    render(<DatabaseCard {...mockProps} />)
    
    // Look for the card container with data-slot="card"
    const card = screen.getByRole('article') || document.querySelector('[data-slot="card"]')
    expect(card).toBeInTheDocument()
  })
})

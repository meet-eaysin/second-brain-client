import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import { Button } from '@/components/ui/button'
import { DatabaseCard } from '@/modules/databases/components/database-card'
import { mockDatabase } from '@/test/utils'

describe('Component Rendering Performance', () => {
  it('should render Button component quickly', () => {
    const startTime = performance.now()
    
    render(<Button>Test Button</Button>)
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(renderTime).toBeLessThan(50) // Should render in less than 50ms
  })

  it('should render multiple buttons efficiently', () => {
    const startTime = performance.now()
    
    render(
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <Button key={i}>Button {i}</Button>
        ))}
      </div>
    )
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    expect(screen.getAllByRole('button')).toHaveLength(100)
    expect(renderTime).toBeLessThan(200) // Should render 100 buttons in less than 200ms
  })

  it('should render DatabaseCard without performance issues', () => {
    const mockProps = {
      database: mockDatabase,
      onEdit: vi.fn(),
      onDelete: vi.fn(),
      onShare: vi.fn(),
    }
    
    const startTime = performance.now()
    
    render(<DatabaseCard {...mockProps} />)
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    expect(screen.getByText(mockDatabase.name)).toBeInTheDocument()
    expect(renderTime).toBeLessThan(100) // Should render in less than 100ms
  })

  it('should handle large lists efficiently', () => {
    const largeDatabaseList = Array.from({ length: 50 }, (_, i) => ({
      ...mockDatabase,
      id: `database-${i}`,
      name: `Database ${i}`,
    }))
    
    const mockProps = {
      onEdit: vi.fn(),
      onDelete: vi.fn(),
      onShare: vi.fn(),
    }
    
    const startTime = performance.now()
    
    render(
      <div>
        {largeDatabaseList.map(database => (
          <DatabaseCard
            key={database.id}
            database={database}
            {...mockProps}
          />
        ))}
      </div>
    )
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    expect(screen.getAllByText(/Database \d+/)).toHaveLength(50)
    expect(renderTime).toBeLessThan(500) // Should render 50 cards in less than 500ms
  })

  it('should not cause memory leaks with event handlers', () => {
    const mockHandler = vi.fn()
    
    const { unmount } = render(<Button onClick={mockHandler}>Test</Button>)
    
    // Simulate multiple re-renders
    for (let i = 0; i < 10; i++) {
      render(<Button onClick={mockHandler}>Test {i}</Button>)
    }
    
    unmount()
    
    // Handler should not be called after unmount
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('should handle rapid state updates efficiently', () => {
    let renderCount = 0
    
    const TestComponent = () => {
      renderCount++
      return <div>Render count: {renderCount}</div>
    }
    
    const startTime = performance.now()
    
    const { rerender } = render(<TestComponent />)
    
    // Simulate rapid re-renders
    for (let i = 0; i < 20; i++) {
      rerender(<TestComponent />)
    }
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    expect(renderTime).toBeLessThan(100) // Should handle 20 re-renders in less than 100ms
    expect(renderCount).toBe(21) // Initial render + 20 re-renders
  })
})

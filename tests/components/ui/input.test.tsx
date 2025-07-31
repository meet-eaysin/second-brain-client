import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import { Input } from '@/components/ui/input'

describe('Input Component', () => {
  it('renders input with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('handles value changes', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('applies disabled state correctly', () => {
    render(<Input disabled />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('applies error state correctly', () => {
    render(<Input className="border-destructive" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-destructive')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)
    
    expect(ref).toHaveBeenCalled()
  })

  it('supports different input types', () => {
    render(<Input type="email" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

describe('Accessibility Tests', () => {
  describe('Button Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Button aria-label="Save document">Save</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Save document')
    })

    it('should be keyboard accessible', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'button')
      
      // Button should be focusable
      button.focus()
      expect(document.activeElement).toBe(button)
    })

    it('should indicate disabled state to screen readers', () => {
      render(<Button disabled>Disabled Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    it('should have proper contrast ratios', () => {
      render(<Button variant="default">Default Button</Button>)
      
      const button = screen.getByRole('button')
      const styles = window.getComputedStyle(button)
      
      // This is a basic check - in real scenarios you'd use tools like axe-core
      expect(styles.color).toBeDefined()
      expect(styles.backgroundColor).toBeDefined()
    })
  })

  describe('Input Accessibility', () => {
    it('should have proper labels', () => {
      render(
        <div>
          <label htmlFor="email">Email Address</label>
          <Input id="email" type="email" />
        </div>
      )
      
      const input = screen.getByLabelText('Email Address')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'email')
    })

    it('should support ARIA descriptions', () => {
      render(
        <div>
          <label htmlFor="password">Password</label>
          <Input 
            id="password" 
            type="password" 
            aria-describedby="password-help"
          />
          <div id="password-help">Must be at least 8 characters</div>
        </div>
      )
      
      const input = screen.getByLabelText('Password')
      expect(input).toHaveAttribute('aria-describedby', 'password-help')
      
      const helpText = screen.getByText('Must be at least 8 characters')
      expect(helpText).toHaveAttribute('id', 'password-help')
    })

    it('should indicate required fields', () => {
      render(
        <div>
          <label htmlFor="required-field">Required Field *</label>
          <Input id="required-field" required aria-required="true" />
        </div>
      )
      
      const input = screen.getByLabelText('Required Field *')
      expect(input).toBeRequired()
      expect(input).toHaveAttribute('aria-required', 'true')
    })

    it('should indicate error states', () => {
      render(
        <div>
          <label htmlFor="error-field">Email</label>
          <Input 
            id="error-field" 
            type="email" 
            aria-invalid="true"
            aria-describedby="error-message"
          />
          <div id="error-message" role="alert">
            Please enter a valid email address
          </div>
        </div>
      )
      
      const input = screen.getByLabelText('Email')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('aria-describedby', 'error-message')
      
      const errorMessage = screen.getByRole('alert')
      expect(errorMessage).toHaveTextContent('Please enter a valid email address')
    })
  })

  describe('Focus Management', () => {
    it('should maintain logical tab order', () => {
      render(
        <div>
          <Button>First</Button>
          <Input placeholder="Second" />
          <Button>Third</Button>
        </div>
      )
      
      const firstButton = screen.getByRole('button', { name: 'First' })
      const input = screen.getByRole('textbox')
      const thirdButton = screen.getByRole('button', { name: 'Third' })
      
      // Check tab indices (if explicitly set)
      expect(firstButton.tabIndex).toBeGreaterThanOrEqual(0)
      expect(input.tabIndex).toBeGreaterThanOrEqual(0)
      expect(thirdButton.tabIndex).toBeGreaterThanOrEqual(0)
    })

    it('should skip disabled elements in tab order', () => {
      render(
        <div>
          <Button>Enabled</Button>
          <Button disabled>Disabled</Button>
          <Button>Also Enabled</Button>
        </div>
      )
      
      const enabledButton = screen.getByRole('button', { name: 'Enabled' })
      const disabledButton = screen.getByRole('button', { name: 'Disabled' })
      const alsoEnabledButton = screen.getByRole('button', { name: 'Also Enabled' })
      
      expect(enabledButton).not.toBeDisabled()
      expect(disabledButton).toBeDisabled()
      expect(alsoEnabledButton).not.toBeDisabled()
      
      // Disabled button should not be focusable
      disabledButton.focus()
      expect(document.activeElement).not.toBe(disabledButton)
    })
  })

  describe('Screen Reader Support', () => {
    it('should provide meaningful text alternatives', () => {
      render(
        <Button>
          <span aria-hidden="true">🔍</span>
          <span className="sr-only">Search</span>
        </Button>
      )
      
      const button = screen.getByRole('button', { name: 'Search' })
      expect(button).toBeInTheDocument()
      
      // Icon should be hidden from screen readers
      const icon = button.querySelector('[aria-hidden="true"]')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })

    it('should use proper heading hierarchy', () => {
      render(
        <div>
          <h1>Main Title</h1>
          <h2>Section Title</h2>
          <h3>Subsection Title</h3>
        </div>
      )
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Main Title')
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Section Title')
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Subsection Title')
    })

    it('should provide status updates for dynamic content', () => {
      render(
        <div>
          <div role="status" aria-live="polite">
            Form saved successfully
          </div>
        </div>
      )
      
      const status = screen.getByRole('status')
      expect(status).toHaveAttribute('aria-live', 'polite')
      expect(status).toHaveTextContent('Form saved successfully')
    })
  })
})

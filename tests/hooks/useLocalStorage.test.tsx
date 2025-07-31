import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@/test/utils'
import { useLocalStorage } from '@/hooks/useLocalStorage'

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should return initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    
    expect(result.current[0]).toBe('initial-value')
  })

  it('should return stored value when it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    
    expect(result.current[0]).toBe('stored-value')
  })

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    
    act(() => {
      result.current[1]('new-value')
    })
    
    expect(result.current[0]).toBe('new-value')
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'))
  })

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0))
    
    act(() => {
      result.current[1](prev => prev + 1)
    })
    
    expect(result.current[0]).toBe(1)
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify(1))
  })

  it('should handle complex objects', () => {
    const initialObject = { name: 'John', age: 30 }
    const { result } = renderHook(() => useLocalStorage('test-key', initialObject))
    
    const updatedObject = { name: 'Jane', age: 25 }
    
    act(() => {
      result.current[1](updatedObject)
    })
    
    expect(result.current[0]).toEqual(updatedObject)
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify(updatedObject))
  })

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage.setItem to throw an error
    const originalSetItem = localStorage.setItem
    localStorage.setItem = vi.fn(() => {
      throw new Error('Storage quota exceeded')
    })
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    
    // Should not throw error when setting value
    act(() => {
      result.current[1]('new-value')
    })
    
    // Value should still be updated in state
    expect(result.current[0]).toBe('new-value')
    
    // Restore original setItem
    localStorage.setItem = originalSetItem
  })

  it('should handle invalid JSON in localStorage', () => {
    localStorage.setItem('test-key', 'invalid-json{')
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback-value'))
    
    // Should fall back to initial value when JSON is invalid
    expect(result.current[0]).toBe('fallback-value')
  })

  it('should remove item from localStorage when set to undefined', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    
    act(() => {
      result.current[1](undefined)
    })
    
    expect(result.current[0]).toBe('initial-value')
    expect(localStorage.getItem('test-key')).toBeNull()
  })
})

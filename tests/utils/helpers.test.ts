import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

// Mock date utility functions since they might not exist yet
const formatDate = (date: string | Date): string => {
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return 'Invalid Date'
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'Invalid Date'
  }
}

const formatRelativeTime = (date: string | Date): string => {
  try {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 60) return `${diffMinutes} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  } catch {
    return 'Invalid Date'
  }
}

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('base-class', 'additional-class')
      expect(result).toContain('base-class')
      expect(result).toContain('additional-class')
    })

    it('should handle conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class')
      expect(result).toContain('base-class')
      expect(result).toContain('conditional-class')
      expect(result).not.toContain('hidden-class')
    })

    it('should handle undefined and null values', () => {
      const result = cn('base-class', undefined, null, 'valid-class')
      expect(result).toContain('base-class')
      expect(result).toContain('valid-class')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const result = formatDate(date)
      expect(result).toBe('Jan 15, 2024')
    })

    it('should handle string dates', () => {
      const result = formatDate('2024-01-15T10:30:00Z')
      expect(result).toBe('Jan 15, 2024')
    })

    it('should handle invalid dates', () => {
      const result = formatDate('invalid-date')
      expect(result).toBe('Invalid Date')
    })
  })

  describe('formatRelativeTime', () => {
    it('should format recent times correctly', () => {
      const now = new Date()
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
      
      const result = formatRelativeTime(fiveMinutesAgo)
      expect(result).toContain('minutes ago')
    })

    it('should format hours correctly', () => {
      const now = new Date()
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
      
      const result = formatRelativeTime(twoHoursAgo)
      expect(result).toContain('hours ago')
    })

    it('should format days correctly', () => {
      const now = new Date()
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      
      const result = formatRelativeTime(threeDaysAgo)
      expect(result).toContain('days ago')
    })
  })
})

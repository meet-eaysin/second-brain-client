import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockDatabase, createMockApiResponse } from '@/test/utils'

// Mock database API service
const mockDatabaseApi = {
  getDatabases: vi.fn(),
  getDatabase: vi.fn(),
  createDatabase: vi.fn(),
  updateDatabase: vi.fn(),
  deleteDatabase: vi.fn(),
}

// Mock the API client
vi.mock('@/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

// Mock the database API service
vi.mock('@/modules/databases/services/databaseApi', () => ({
  databaseApi: mockDatabaseApi
}))

describe('Database API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getDatabases', () => {
    it('should fetch databases successfully', async () => {
      const mockResponse = [mockDatabase]
      mockDatabaseApi.getDatabases.mockResolvedValue(mockResponse)

      const result = await mockDatabaseApi.getDatabases()

      expect(mockDatabaseApi.getDatabases).toHaveBeenCalled()
      expect(result).toEqual([mockDatabase])
    })

    it('should handle pagination parameters', async () => {
      const mockResponse = [mockDatabase]
      mockDatabaseApi.getDatabases.mockResolvedValue(mockResponse)

      await mockDatabaseApi.getDatabases(2, 20)

      expect(mockDatabaseApi.getDatabases).toHaveBeenCalledWith(2, 20)
    })
  })

  describe('getDatabase', () => {
    it('should fetch a single database successfully', async () => {
      mockDatabaseApi.getDatabase.mockResolvedValue(mockDatabase)

      const result = await mockDatabaseApi.getDatabase('test-id')

      expect(mockDatabaseApi.getDatabase).toHaveBeenCalledWith('test-id')
      expect(result).toEqual(mockDatabase)
    })
  })

  describe('createDatabase', () => {
    it('should create a database successfully', async () => {
      const newDatabase = { name: 'New Database', description: 'Test database' }
      const createdDatabase = { ...mockDatabase, ...newDatabase }
      mockDatabaseApi.createDatabase.mockResolvedValue(createdDatabase)

      const result = await mockDatabaseApi.createDatabase(newDatabase)

      expect(mockDatabaseApi.createDatabase).toHaveBeenCalledWith(newDatabase)
      expect(result.name).toBe(newDatabase.name)
    })
  })

  describe('updateDatabase', () => {
    it('should update a database successfully', async () => {
      const updates = { name: 'Updated Database' }
      const updatedDatabase = { ...mockDatabase, ...updates }
      mockDatabaseApi.updateDatabase.mockResolvedValue(updatedDatabase)

      const result = await mockDatabaseApi.updateDatabase('test-id', updates)

      expect(mockDatabaseApi.updateDatabase).toHaveBeenCalledWith('test-id', updates)
      expect(result.name).toBe(updates.name)
    })
  })

  describe('deleteDatabase', () => {
    it('should delete a database successfully', async () => {
      mockDatabaseApi.deleteDatabase.mockResolvedValue(undefined)

      await mockDatabaseApi.deleteDatabase('test-id')

      expect(mockDatabaseApi.deleteDatabase).toHaveBeenCalledWith('test-id')
    })
  })

  describe('error handling', () => {
    it('should handle API errors gracefully', async () => {
      mockDatabaseApi.getDatabases.mockRejectedValue(new Error('Network error'))

      await expect(mockDatabaseApi.getDatabases()).rejects.toThrow('Network error')
    })
  })
})

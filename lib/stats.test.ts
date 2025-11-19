/**
 * @testSuite Stats
 * 
 * Test suite for statistics utility functions
 * 
 * @remarks
 * Comprehensive tests for Firestore statistics functions covering:
 * - getTotalSocieties: Fetch count of all societies
 * - getTotalUsers: Fetch count of all registered users
 * - getTotalEvents: Fetch count of all events
 * - Error handling and fallback to 0
 * - Edge cases (zero values, large numbers, undefined counts)
 * 
 * @testCoverage
 * - **Success Cases**: Validates correct Firestore collection queries and count retrieval
 * - **Error Handling**: Ensures functions return 0 on errors with console logging
 * - **Edge Cases**: Tests zero values, large numbers, missing data, undefined counts
 * - **Integration Tests**: Verifies correct collection names for all functions
 * 
 * @edgeCases
 * - Firestore errors return 0 instead of throwing
 * - Missing count field in snapshot returns undefined
 * - Zero count handled correctly (not treated as error)
 * - Large numbers (999999) processed correctly
 * - Console.error called on failures
 * 
 * @expectedValues
 * **getTotalSocieties:**
 * - Success: 25 societies
 * - Error: 0 (with console.error)
 * - Missing count: undefined
 * - Collection: 'societies'
 * 
 * **getTotalUsers:**
 * - Success: 1000 users
 * - Error: 0 (with console.error)
 * - Zero users: 0 (valid)
 * - Collection: 'users'
 * 
 * **getTotalEvents:**
 * - Success: 50 events
 * - Error: 0 (with console.error)
 * - Large count: 999999
 * - Collection: 'events'
 */

import { getTotalSocieties, getTotalUsers, getTotalEvents } from './stats'
import { firestore } from '@/firebase'
import { collection, getCountFromServer } from 'firebase/firestore'

// Mock firebase modules
jest.mock('@/firebase', () => ({
  firestore: {},
}))

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getCountFromServer: jest.fn(),
}))

describe('stats', () => {
  const mockCollection = collection as jest.Mock
  const mockGetCountFromServer = getCountFromServer as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getTotalSocieties', () => {
    it('should return the count of societies from Firestore', async () => {
      const mockSnapshot = {
        data: () => ({ count: 25 }),
      }
      mockGetCountFromServer.mockResolvedValue(mockSnapshot)

      const result = await getTotalSocieties()

      expect(mockCollection).toHaveBeenCalledWith(firestore, 'societies')
      expect(mockGetCountFromServer).toHaveBeenCalled()
      expect(result).toBe(25)
    })

    it('should return 0 when an error occurs', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      mockGetCountFromServer.mockRejectedValue(new Error('Firestore error'))

      const result = await getTotalSocieties()

      expect(result).toBe(0)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching total societies:',
        expect.any(Error)
      )
      
      consoleErrorSpy.mockRestore()
    })

    it('should handle missing count in snapshot data', async () => {
      const mockSnapshot = {
        data: () => ({ count: undefined }),
      }
      mockGetCountFromServer.mockResolvedValue(mockSnapshot)

      const result = await getTotalSocieties()

      expect(result).toBeUndefined()
    })
  })

  describe('getTotalUsers', () => {
    it('should return the count of users from Firestore', async () => {
      const mockSnapshot = {
        data: () => ({ count: 1000 }),
      }
      mockGetCountFromServer.mockResolvedValue(mockSnapshot)

      const result = await getTotalUsers()

      expect(mockCollection).toHaveBeenCalledWith(firestore, 'users')
      expect(mockGetCountFromServer).toHaveBeenCalled()
      expect(result).toBe(1000)
    })

    it('should return 0 when an error occurs', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      mockGetCountFromServer.mockRejectedValue(new Error('Firestore error'))

      const result = await getTotalUsers()

      expect(result).toBe(0)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching total users:',
        expect.any(Error)
      )
      
      consoleErrorSpy.mockRestore()
    })

    it('should handle zero users correctly', async () => {
      const mockSnapshot = {
        data: () => ({ count: 0 }),
      }
      mockGetCountFromServer.mockResolvedValue(mockSnapshot)

      const result = await getTotalUsers()

      expect(result).toBe(0)
    })
  })

  describe('getTotalEvents', () => {
    it('should return the count of events from Firestore', async () => {
      const mockSnapshot = {
        data: () => ({ count: 50 }),
      }
      mockGetCountFromServer.mockResolvedValue(mockSnapshot)

      const result = await getTotalEvents()

      expect(mockCollection).toHaveBeenCalledWith(firestore, 'events')
      expect(mockGetCountFromServer).toHaveBeenCalled()
      expect(result).toBe(50)
    })

    it('should return 0 when an error occurs', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      mockGetCountFromServer.mockRejectedValue(new Error('Firestore error'))

      const result = await getTotalEvents()

      expect(result).toBe(0)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching total events:',
        expect.any(Error)
      )
      
      consoleErrorSpy.mockRestore()
    })

    it('should handle large event counts', async () => {
      const mockSnapshot = {
        data: () => ({ count: 999999 }),
      }
      mockGetCountFromServer.mockResolvedValue(mockSnapshot)

      const result = await getTotalEvents()

      expect(result).toBe(999999)
    })
  })

  describe('all functions integration', () => {
    it('should call correct Firestore collections for each function', async () => {
      const mockSnapshot = {
        data: () => ({ count: 10 }),
      }
      mockGetCountFromServer.mockResolvedValue(mockSnapshot)

      await getTotalSocieties()
      expect(mockCollection).toHaveBeenCalledWith(firestore, 'societies')

      await getTotalUsers()
      expect(mockCollection).toHaveBeenCalledWith(firestore, 'users')

      await getTotalEvents()
      expect(mockCollection).toHaveBeenCalledWith(firestore, 'events')

      expect(mockCollection).toHaveBeenCalledTimes(3)
    })
  })
})

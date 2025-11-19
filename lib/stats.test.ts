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

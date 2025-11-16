import {
  UserPrivilege,
  getUserPrivilege,
  updateUserPrivilege,
  isNormalUser,
  isSocietyHead,
  isAdmin,
  canManageSociety,
  getPrivilegeName,
} from './privileges'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}))

jest.mock('../firebase', () => ({
  firestore: {},
}))

describe('UserPrivilege Enum', () => {
  it('should have correct privilege level values', () => {
    expect(UserPrivilege.NORMAL_USER).toBe(0)
    expect(UserPrivilege.SOCIETY_HEAD).toBe(1)
    expect(UserPrivilege.ADMIN).toBe(2)
  })
})

describe('getUserPrivilege', () => {
  const mockUserId = 'test-user-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return privilege level when user document exists', async () => {
    const mockUserData = { privilege: 1, fullName: 'Test User' }
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => mockUserData,
    })

    const privilege = await getUserPrivilege(mockUserId)

    expect(privilege).toBe(1)
    expect(getDoc).toHaveBeenCalledTimes(1)
  })

  it('should return 0 when user document does not exist', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    })

    const privilege = await getUserPrivilege(mockUserId)

    expect(privilege).toBe(0)
  })

  it('should return 0 when privilege field is missing', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ fullName: 'Test User' }), // No privilege field
    })

    const privilege = await getUserPrivilege(mockUserId)

    expect(privilege).toBe(0)
  })

  it('should return 0 when an error occurs', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    ;(getDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'))

    const privilege = await getUserPrivilege(mockUserId)

    expect(privilege).toBe(0)
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error getting user privilege:',
      expect.any(Error)
    )

    consoleErrorSpy.mockRestore()
  })

  it('should handle privilege level 0 (normal user)', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ privilege: 0 }),
    })

    const privilege = await getUserPrivilege(mockUserId)

    expect(privilege).toBe(UserPrivilege.NORMAL_USER)
  })

  it('should handle privilege level 2 (admin)', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ privilege: 2 }),
    })

    const privilege = await getUserPrivilege(mockUserId)

    expect(privilege).toBe(UserPrivilege.ADMIN)
  })
})

describe('updateUserPrivilege', () => {
  const mockUserId = 'test-user-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should update privilege to society head', async () => {
    ;(updateDoc as jest.Mock).mockResolvedValue(undefined)
    ;(doc as jest.Mock).mockReturnValue({ id: mockUserId })

    await updateUserPrivilege(mockUserId, UserPrivilege.SOCIETY_HEAD)

    expect(updateDoc).toHaveBeenCalledTimes(1)
    expect(updateDoc).toHaveBeenCalledWith(
      expect.objectContaining({ id: mockUserId }),
      {
        privilege: 1,
        privilegeUpdatedAt: expect.any(String),
      }
    )
  })

  it('should update privilege to admin', async () => {
    ;(updateDoc as jest.Mock).mockResolvedValue(undefined)
    ;(doc as jest.Mock).mockReturnValue({ id: mockUserId })

    await updateUserPrivilege(mockUserId, UserPrivilege.ADMIN)

    expect(updateDoc).toHaveBeenCalledWith(
      expect.objectContaining({ id: mockUserId }),
      {
        privilege: 2,
        privilegeUpdatedAt: expect.any(String),
      }
    )
  })

  it('should update privilege to normal user (downgrade)', async () => {
    ;(updateDoc as jest.Mock).mockResolvedValue(undefined)
    ;(doc as jest.Mock).mockReturnValue({ id: mockUserId })

    await updateUserPrivilege(mockUserId, UserPrivilege.NORMAL_USER)

    expect(updateDoc).toHaveBeenCalledWith(
      expect.objectContaining({ id: mockUserId }),
      {
        privilege: 0,
        privilegeUpdatedAt: expect.any(String),
      }
    )
  })

  it('should include timestamp when updating privilege', async () => {
    const beforeTime = new Date().toISOString()
    ;(updateDoc as jest.Mock).mockResolvedValue(undefined)

    await updateUserPrivilege(mockUserId, UserPrivilege.SOCIETY_HEAD)

    const callArgs = (updateDoc as jest.Mock).mock.calls[0][1]
    const afterTime = new Date().toISOString()

    expect(callArgs.privilegeUpdatedAt).toBeDefined()
    expect(callArgs.privilegeUpdatedAt >= beforeTime).toBe(true)
    expect(callArgs.privilegeUpdatedAt <= afterTime).toBe(true)
  })

  it('should throw error when update fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    const mockError = new Error('Firestore update failed')
    ;(updateDoc as jest.Mock).mockRejectedValue(mockError)

    await expect(
      updateUserPrivilege(mockUserId, UserPrivilege.ADMIN)
    ).rejects.toThrow('Firestore update failed')

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error updating user privilege:',
      mockError
    )

    consoleErrorSpy.mockRestore()
  })
})

describe('isNormalUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return true for normal user (privilege 0)', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ privilege: 0 }),
    })

    const result = await isNormalUser('user-123')

    expect(result).toBe(true)
  })

  it('should return false for society head (privilege 1)', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ privilege: 1 }),
    })

    const result = await isNormalUser('user-123')

    expect(result).toBe(false)
  })

  it('should return false for admin (privilege 2)', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ privilege: 2 }),
    })

    const result = await isNormalUser('user-123')

    expect(result).toBe(false)
  })
})

describe('isSocietyHead', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return true for society head (privilege 1)', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ privilege: 1 }),
    })

    const result = await isSocietyHead('user-123')

    expect(result).toBe(true)
  })

  it('should return false for normal user (privilege 0)', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ privilege: 0 }),
    })

    const result = await isSocietyHead('user-123')

    expect(result).toBe(false)
  })

  it('should return false for admin (privilege 2)', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ privilege: 2 }),
    })

    const result = await isSocietyHead('user-123')

    expect(result).toBe(false)
  })
})

describe('isAdmin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return true for admin (privilege 2)', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ privilege: 2 }),
    })

    const result = await isAdmin('user-123')

    expect(result).toBe(true)
  })

  it('should return false for normal user (privilege 0)', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ privilege: 0 }),
    })

    const result = await isAdmin('user-123')

    expect(result).toBe(false)
  })

  it('should return false for society head (privilege 1)', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ privilege: 1 }),
    })

    const result = await isAdmin('user-123')

    expect(result).toBe(false)
  })
})

describe('canManageSociety', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return true for society head (privilege 1)', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ privilege: 1 }),
    })

    const result = await canManageSociety('user-123')

    expect(result).toBe(true)
  })

  it('should return true for admin (privilege 2)', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ privilege: 2 }),
    })

    const result = await canManageSociety('user-123')

    expect(result).toBe(true)
  })

  it('should return false for normal user (privilege 0)', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ privilege: 0 }),
    })

    const result = await canManageSociety('user-123')

    expect(result).toBe(false)
  })

  it('should return false for non-existent user', async () => {
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    })

    const result = await canManageSociety('user-123')

    expect(result).toBe(false)
  })
})

describe('getPrivilegeName', () => {
  it('should return "Normal User" for privilege 0', () => {
    expect(getPrivilegeName(0)).toBe('Normal User')
    expect(getPrivilegeName(UserPrivilege.NORMAL_USER)).toBe('Normal User')
  })

  it('should return "Society Head" for privilege 1', () => {
    expect(getPrivilegeName(1)).toBe('Society Head')
    expect(getPrivilegeName(UserPrivilege.SOCIETY_HEAD)).toBe('Society Head')
  })

  it('should return "Admin" for privilege 2', () => {
    expect(getPrivilegeName(2)).toBe('Admin')
    expect(getPrivilegeName(UserPrivilege.ADMIN)).toBe('Admin')
  })

  it('should return "Unknown" for invalid privilege level', () => {
    expect(getPrivilegeName(3)).toBe('Unknown')
    expect(getPrivilegeName(-1)).toBe('Unknown')
    expect(getPrivilegeName(999)).toBe('Unknown')
  })

  it('should handle edge cases', () => {
    expect(getPrivilegeName(NaN)).toBe('Unknown')
    expect(getPrivilegeName(Infinity)).toBe('Unknown')
  })
})

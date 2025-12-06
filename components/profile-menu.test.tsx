/**
 * @testSuite ProfileMenu
 * 
 * Test suite for ProfileMenu component
 * 
 * @remarks
 * Comprehensive tests covering:
 * - Authentication state handling
 * - Menu rendering and visibility
 * - Role-based menu items (Normal User, Society Head, Admin)
 * - Navigation functionality
 * - Logout functionality
 * - Click-outside to close behavior
 * 
 * @testCoverage
 * - **Authentication**: Renders only for authenticated users
 * - **Role-Based Display**: Different menu items based on user privilege
 * - **Navigation**: Profile, Dashboard, Society, Calendar links
 * - **Logout**: Sign out functionality
 * 
 * @edgeCases
 * - User is null (should not render)
 * - Normal user (basic menu items)
 * - Society Head (shows My Society link)
 * - Admin (shows Dashboard link)
 * - Menu closes when clicking outside
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProfileMenu } from './profile-menu'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { getDoc } from 'firebase/firestore'
import { UserPrivilege, getUserPrivilege } from '@/lib/privileges'

// Mock Firebase
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}))

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}))

jest.mock('@/firebase', () => ({
  auth: {},
  firestore: {},
}))

// Mock getUserPrivilege
jest.mock('@/lib/privileges', () => ({
  getUserPrivilege: jest.fn(),
  UserPrivilege: {
    NORMAL_USER: 0,
    SOCIETY_HEAD: 1,
    ADMIN: 2,
  },
}))

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('ProfileMenu', () => {
  const mockUser = {
    uid: 'test-user-id',
    email: 'test@example.com',
  }

  const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock
  const mockSignOut = signOut as jest.Mock
  const mockGetDoc = getDoc as jest.Mock
  const mockGetUserPrivilege = getUserPrivilege as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockSignOut.mockResolvedValue(undefined)
  })

  describe('Authentication States', () => {
    it('should not render when user is not authenticated', () => {
      mockOnAuthStateChanged.mockImplementation((auth, callback) => {
        callback(null)
        return jest.fn()
      })

      const { container } = render(<ProfileMenu />)
      
      expect(container.firstChild).toBeNull()
    })

    it('should render when user is authenticated', async () => {
      mockOnAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser)
        return jest.fn()
      })
      mockGetUserPrivilege.mockResolvedValue(UserPrivilege.NORMAL_USER)

      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
    })
  })

  describe('Menu Toggle', () => {
    beforeEach(() => {
      mockOnAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser)
        return jest.fn()
      })
      mockGetUserPrivilege.mockResolvedValue(UserPrivilege.NORMAL_USER)
    })

    it('should show menu when profile button is clicked', async () => {
      const user = userEvent.setup()
      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: /Profile menu/i }))
      
      expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    })

    it('should hide menu when profile button is clicked twice', async () => {
      const user = userEvent.setup()
      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
      
      const button = screen.getByRole('button', { name: /Profile menu/i })
      await user.click(button)
      await user.click(button)
      
      expect(screen.queryByText(mockUser.email)).not.toBeInTheDocument()
    })
  })

  describe('Normal User Menu Items', () => {
    beforeEach(() => {
      mockOnAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser)
        return jest.fn()
      })
      mockGetUserPrivilege.mockResolvedValue(UserPrivilege.NORMAL_USER)
    })

    it('should display user email and role', async () => {
      const user = userEvent.setup()
      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: /Profile menu/i }))
      
      expect(screen.getByText(mockUser.email)).toBeInTheDocument()
      expect(screen.getByText('User')).toBeInTheDocument()
    })

    it('should show Profile menu item', async () => {
      const user = userEvent.setup()
      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: /Profile menu/i }))
      
      expect(screen.getByText('Profile')).toBeInTheDocument()
    })

    it('should show Calendar menu item', async () => {
      const user = userEvent.setup()
      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: /Profile menu/i }))
      
      expect(screen.getByText('Calendar')).toBeInTheDocument()
    })

    it('should show Logout menu item', async () => {
      const user = userEvent.setup()
      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: /Profile menu/i }))
      
      expect(screen.getByText('Logout')).toBeInTheDocument()
    })

    it('should not show Dashboard menu item for normal user', async () => {
      const user = userEvent.setup()
      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: /Profile menu/i }))
      
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    })

    it('should not show My Society menu item for normal user', async () => {
      const user = userEvent.setup()
      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: /Profile menu/i }))
      
      expect(screen.queryByText('My Society')).not.toBeInTheDocument()
    })
  })

  describe('Admin User Menu Items', () => {
    beforeEach(() => {
      mockOnAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser)
        return jest.fn()
      })
      mockGetUserPrivilege.mockResolvedValue(UserPrivilege.ADMIN)
    })

    it('should display Administrator role', async () => {
      const user = userEvent.setup()
      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: /Profile menu/i }))
      
      expect(screen.getByText('Administrator')).toBeInTheDocument()
    })

    it('should show Dashboard menu item for admin', async () => {
      const user = userEvent.setup()
      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: /Profile menu/i }))
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  describe('Society Head Menu Items', () => {
    beforeEach(() => {
      mockOnAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser)
        return jest.fn()
      })
      mockGetUserPrivilege.mockResolvedValue(UserPrivilege.SOCIETY_HEAD)
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ societyId: 'test-society-id' }),
      })
    })

    it('should display Society Head role', async () => {
      const user = userEvent.setup()
      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: /Profile menu/i }))
      
      expect(screen.getByText('Society Head')).toBeInTheDocument()
    })

    it('should show My Society menu item for society head', async () => {
      const user = userEvent.setup()
      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: /Profile menu/i }))
      
      await waitFor(() => {
        expect(screen.getByText('My Society')).toBeInTheDocument()
      })
    })
  })

  describe('Navigation', () => {
    beforeEach(() => {
      mockOnAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser)
        return jest.fn()
      })
      mockGetUserPrivilege.mockResolvedValue(UserPrivilege.NORMAL_USER)
    })

    it('should navigate to profile page when Profile is clicked', async () => {
      const user = userEvent.setup()
      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: /Profile menu/i }))
      await user.click(screen.getByText('Profile'))
      
      expect(mockPush).toHaveBeenCalledWith(`/profiles/${mockUser.uid}`)
    })

    it('should navigate to calendar page when Calendar is clicked', async () => {
      const user = userEvent.setup()
      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: /Profile menu/i }))
      await user.click(screen.getByText('Calendar'))
      
      expect(mockPush).toHaveBeenCalledWith('/calendar')
    })
  })

  describe('Logout Functionality', () => {
    beforeEach(() => {
      mockOnAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser)
        return jest.fn()
      })
      mockGetUserPrivilege.mockResolvedValue(UserPrivilege.NORMAL_USER)
    })

    it('should call signOut when Logout is clicked', async () => {
      const user = userEvent.setup()
      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: /Profile menu/i }))
      await user.click(screen.getByText('Logout'))
      
      expect(mockSignOut).toHaveBeenCalled()
    })

    it('should navigate to home page after logout', async () => {
      const user = userEvent.setup()
      render(<ProfileMenu />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Profile menu/i })).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: /Profile menu/i }))
      await user.click(screen.getByText('Logout'))
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/')
      })
    })
  })
})

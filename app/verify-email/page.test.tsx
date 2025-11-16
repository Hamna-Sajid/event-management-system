import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { getAuth, onAuthStateChanged, sendEmailVerification } from 'firebase/auth'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import VerifyEmail from './page'

// Type for mock user
type MockUser = {
  uid?: string
  email: string
  emailVerified: boolean
  reload?: () => Promise<void>
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendEmailVerification: jest.fn(),
}))

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
  getDoc: jest.fn(),
}))

// Mock Firebase app
jest.mock('../../firebase', () => ({
  app: {},
  firestore: {},
}))

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Mail: () => <div data-testid="mail-icon">Mail Icon</div>,
  RefreshCw: () => <div data-testid="refresh-icon">Refresh Icon</div>,
  CheckCircle2: () => <div data-testid="check-icon">Check Icon</div>,
  AlertCircle: () => <div data-testid="alert-icon">Alert Icon</div>,
}))

describe('VerifyEmail Page', () => {
  const mockPush = jest.fn()
  const mockRouter = { push: mockPush }
  const mockAuth: { currentUser: MockUser | null } = { currentUser: null }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(getAuth as jest.Mock).mockReturnValue(mockAuth)
    ;(doc as jest.Mock).mockReturnValue({})
    ;(updateDoc as jest.Mock).mockResolvedValue(undefined)
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ privilege: 0, fullName: 'Test User' }),
    })
  })

  describe('User not signed in', () => {
    it('should redirect to signup page when user is not signed in', async () => {
      let authCallback: ((user: MockUser | null) => void) | null = null
      ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        authCallback = callback
        return jest.fn()
      })

      render(<VerifyEmail />)

      act(() => {
        authCallback!(null)
      })

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/signup')
      })
    })
  })

  describe('User signed up but not verified', () => {
    it('should display verification page with email and instructions', async () => {
      const mockUser = {
        email: 'test@example.com',
        emailVerified: false,
      }

      let authCallback: ((user: MockUser | null) => void) | null = null
      ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        authCallback = callback
        return jest.fn()
      })

      render(<VerifyEmail />)
      act(() => {
        authCallback!(mockUser)
      })

      await waitFor(() => {
        expect(screen.getByText('Verify Your Email')).toBeInTheDocument()
        expect(screen.getByText('test@example.com')).toBeInTheDocument()
        expect(screen.getByText("I've Verified My Email")).toBeInTheDocument()
        expect(screen.getByText('Resend Verification Email')).toBeInTheDocument()
      })
    })

    it('should allow user to resend verification link', async () => {
      const mockUser = {
        email: 'test@example.com',
        emailVerified: false,
      }
      mockAuth.currentUser = mockUser

      let authCallback: ((user: MockUser | null) => void) | null = null
      ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        authCallback = callback
        return jest.fn()
      })
      ;(sendEmailVerification as jest.Mock).mockResolvedValue(undefined)

      render(<VerifyEmail />)
      act(() => {
        authCallback!(mockUser)
      })

      await waitFor(() => {
        expect(screen.getByText('Resend Verification Email')).toBeInTheDocument()
      })

      const resendButton = screen.getByText('Resend Verification Email')
      fireEvent.click(resendButton)

      await waitFor(() => {
        expect(sendEmailVerification).toHaveBeenCalledWith(mockUser)
        expect(screen.getByText('Verification email sent! Please check your inbox.')).toBeInTheDocument()
      })
    })
  })

  describe('User not verified and clicks verify button', () => {
    it('should display error when email is not verified yet', async () => {
      const mockReload = jest.fn().mockResolvedValue(undefined)
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        emailVerified: false,
        reload: mockReload,
      }
      mockAuth.currentUser = mockUser

      let authCallback: ((user: MockUser | null) => void) | null = null
      ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        authCallback = callback
        return jest.fn()
      })

      render(<VerifyEmail />)
      act(() => {
        authCallback!(mockUser)
      })

      await waitFor(() => {
        expect(screen.getByText("I've Verified My Email")).toBeInTheDocument()
      })

      const checkButton = screen.getByText("I've Verified My Email")
      fireEvent.click(checkButton)

      await waitFor(() => {
        expect(mockReload).toHaveBeenCalled()
        expect(screen.getByText(/Email not verified yet/i)).toBeInTheDocument()
      })
    })
  })

  describe('User with privilege < 2 (normal user or society head)', () => {
    it('should redirect to /waitlist when verified user has privilege 0', async () => {
      jest.useFakeTimers()

      ;(getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => ({ privilege: 0, fullName: 'Test User' }),
      })

      const mockReload = jest.fn().mockImplementation(() => {
        if (mockAuth.currentUser) {
          mockAuth.currentUser = { ...mockAuth.currentUser, emailVerified: true }
        }
        return Promise.resolve()
      })

      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        emailVerified: false,
        reload: mockReload,
      }
      mockAuth.currentUser = mockUser

      let authCallback: ((user: MockUser | null) => void) | null = null
      ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        authCallback = callback
        return jest.fn()
      })

      render(<VerifyEmail />)
      act(() => {
        authCallback!(mockUser)
      })

      await waitFor(() => {
        expect(screen.getByText("I've Verified My Email")).toBeInTheDocument()
      })

      mockUser.emailVerified = true

      const checkButton = screen.getByText("I've Verified My Email")
      fireEvent.click(checkButton)

      await waitFor(() => {
        expect(screen.getByText('Email Verified!')).toBeInTheDocument()
      })

      jest.advanceTimersByTime(2000)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/waitlist')
      })

      jest.useRealTimers()
    })

    it('should redirect to /waitlist when verified user has privilege 1 (society head)', async () => {
      jest.useFakeTimers()

      ;(getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => ({ privilege: 1, fullName: 'Society Head' }),
      })

      const mockReload = jest.fn().mockImplementation(() => {
        if (mockAuth.currentUser) {
          mockAuth.currentUser = { ...mockAuth.currentUser, emailVerified: true }
        }
        return Promise.resolve()
      })

      const mockUser = {
        uid: 'test-uid',
        email: 'societyhead@khi.iba.edu.pk',
        emailVerified: false,
        reload: mockReload,
      }
      mockAuth.currentUser = mockUser

      let authCallback: ((user: MockUser | null) => void) | null = null
      ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        authCallback = callback
        return jest.fn()
      })

      render(<VerifyEmail />)
      act(() => {
        authCallback!(mockUser)
      })

      await waitFor(() => {
        expect(screen.getByText("I've Verified My Email")).toBeInTheDocument()
      })

      mockUser.emailVerified = true

      const checkButton = screen.getByText("I've Verified My Email")
      fireEvent.click(checkButton)

      await waitFor(() => {
        expect(screen.getByText('Email Verified!')).toBeInTheDocument()
      })

      jest.advanceTimersByTime(2000)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/waitlist')
      })

      jest.useRealTimers()
    })

    it('should redirect to /waitlist if already verified user with privilege < 2 revisits page', async () => {
      jest.useFakeTimers()

      ;(getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => ({ privilege: 0, fullName: 'Test User' }),
      })

      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        emailVerified: true,
      }

      let authCallback: ((user: MockUser | null) => void) | null = null
      ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        authCallback = callback
        return jest.fn()
      })

      render(<VerifyEmail />)
      act(() => {
        authCallback!(mockUser)
      })

      await waitFor(() => {
        expect(getDoc).toHaveBeenCalled()
      })

      jest.advanceTimersByTime(2000)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/waitlist')
      })

      jest.useRealTimers()
    })
  })

  describe('User with privilege >= 2 (admin)', () => {
    it('should redirect to /admin when verified admin user', async () => {
      jest.useFakeTimers()

      ;(getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => ({ privilege: 2, fullName: 'Admin User' }),
      })

      const mockReload = jest.fn().mockImplementation(() => {
        if (mockAuth.currentUser) {
          mockAuth.currentUser = { ...mockAuth.currentUser, emailVerified: true }
        }
        return Promise.resolve()
      })

      const mockUser = {
        uid: 'admin-uid',
        email: 'admin@khi.iba.edu.pk',
        emailVerified: false,
        reload: mockReload,
      }
      mockAuth.currentUser = mockUser

      let authCallback: ((user: MockUser | null) => void) | null = null
      ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        authCallback = callback
        return jest.fn()
      })

      render(<VerifyEmail />)
      act(() => {
        authCallback!(mockUser)
      })

      await waitFor(() => {
        expect(screen.getByText("I've Verified My Email")).toBeInTheDocument()
      })

      mockUser.emailVerified = true

      const checkButton = screen.getByText("I've Verified My Email")
      fireEvent.click(checkButton)

      await waitFor(() => {
        expect(screen.getByText('Email Verified!')).toBeInTheDocument()
      })

      jest.advanceTimersByTime(2000)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/admin')
      })

      jest.useRealTimers()
    })

    it('should redirect to /admin if already verified admin revisits page', async () => {
      jest.useFakeTimers()

      ;(getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => ({ privilege: 2, fullName: 'Admin User' }),
      })

      const mockUser = {
        uid: 'admin-uid',
        email: 'admin@khi.iba.edu.pk',
        emailVerified: true,
      }

      let authCallback: ((user: MockUser | null) => void) | null = null
      ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        authCallback = callback
        return jest.fn()
      })

      render(<VerifyEmail />)
      act(() => {
        authCallback!(mockUser)
      })

      await waitFor(() => {
        expect(getDoc).toHaveBeenCalled()
      })

      jest.advanceTimersByTime(2000)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/admin')
      })

      jest.useRealTimers()
    })
  })
})





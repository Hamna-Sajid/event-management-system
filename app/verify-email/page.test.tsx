import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { getAuth, onAuthStateChanged, sendEmailVerification } from 'firebase/auth'
import VerifyEmail from './page'

// Type for mock user
type MockUser = {
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

// Mock Firebase app
jest.mock('../../firebase', () => ({
  app: {},
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
  })

  describe('Authentication State', () => {
    it('should redirect to signup if no user is logged in', async () => {
      let authCallback: ((user: MockUser | null) => void) | null = null
      ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        authCallback = callback
        return jest.fn() // unsubscribe function
      })

      render(<VerifyEmail />)

      // Simulate no user logged in
      act(() => {
        authCallback!(null)
      })

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/signup')
      })
    })

    it('should display user email when logged in', async () => {
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
        expect(screen.getByText('test@example.com')).toBeInTheDocument()
      })
    })

    it('should redirect to create-society if email already verified', async () => {
      jest.useFakeTimers()
      const mockUser = {
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

      jest.advanceTimersByTime(2000)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/create-society')
      })

      jest.useRealTimers()
    })
  })

  describe('UI Rendering', () => {
    it('should render verify email heading and instructions', async () => {
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
        expect(screen.getByText(/We've sent a verification email to/i)).toBeInTheDocument()
      })
    })

    it('should render mail icon', async () => {
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
        expect(screen.getByTestId('mail-icon')).toBeInTheDocument()
      })
    })

    it('should render verification instructions with numbered steps', async () => {
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
        expect(screen.getByText(/Check your email inbox/i)).toBeInTheDocument()
        expect(screen.getByText(/Click the verification link/i)).toBeInTheDocument()
        expect(screen.getByText(/Return to this page/i)).toBeInTheDocument()
      })
    })

    it('should render both action buttons', async () => {
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
        expect(screen.getByText("I've Verified My Email")).toBeInTheDocument()
        expect(screen.getByText('Resend Verification Email')).toBeInTheDocument()
      })
    })

    it('should render help text about spam folder', async () => {
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
        expect(screen.getByText(/check your spam folder/i)).toBeInTheDocument()
      })
    })
  })

  describe('Resend Email Functionality', () => {
    it('should send verification email when resend button is clicked', async () => {
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
      })
    })

    it('should show success message after resending email', async () => {
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
        expect(screen.getByText('Verification email sent! Please check your inbox.')).toBeInTheDocument()
      })
    })

    it('should show error message when too many requests', async () => {
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
      ;(sendEmailVerification as jest.Mock).mockRejectedValue({
        code: 'auth/too-many-requests',
      })

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
        expect(screen.getByText(/Too many requests/i)).toBeInTheDocument()
      })
    })

    it('should show generic error message for other errors', async () => {
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
      ;(sendEmailVerification as jest.Mock).mockRejectedValue({
        message: 'Network error',
      })

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
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })

    it('should disable buttons while sending email', async () => {
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
      ;(sendEmailVerification as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 1000))
      )

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
        expect(screen.getByText('Sending...')).toBeInTheDocument()
      })
    })
  })

  describe('Check Verification Functionality', () => {
    it('should reload user and check verification status', async () => {
      const mockReload = jest.fn().mockResolvedValue(undefined)
      const mockUser = {
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
      })
    })

    it('should show error if email not verified yet', async () => {
      const mockReload = jest.fn().mockResolvedValue(undefined)
      const mockUser = {
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
        expect(screen.getByText(/Email not verified yet/i)).toBeInTheDocument()
      })
    })

    it('should redirect to create-society when verified', async () => {
      jest.useFakeTimers()
      const mockReload = jest.fn().mockImplementation(() => {
        if (mockAuth.currentUser) {
          mockAuth.currentUser = { ...mockAuth.currentUser, emailVerified: true }
        }
        return Promise.resolve()
      })
      const mockUser = {
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

      // Mock emailVerified to become true after reload
      mockUser.emailVerified = true

      const checkButton = screen.getByText("I've Verified My Email")
      fireEvent.click(checkButton)

      await waitFor(() => {
        expect(screen.getByText('Email Verified!')).toBeInTheDocument()
        expect(screen.getByText(/Redirecting you to complete your profile/i)).toBeInTheDocument()
      })

      jest.advanceTimersByTime(2000)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/create-society')
      })

      jest.useRealTimers()
    })
  })

  describe('Verified State UI', () => {
    it('should show success UI when email is verified', async () => {
      jest.useFakeTimers()
      const mockUser = {
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
        expect(screen.getByText('Email Verified!')).toBeInTheDocument()
        expect(screen.getByText(/Redirecting you to complete your profile/i)).toBeInTheDocument()
      })

      jest.useRealTimers()
    })

    it('should show check circle icon when verified', async () => {
      jest.useFakeTimers()
      const mockUser = {
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
        expect(screen.getByTestId('check-icon')).toBeInTheDocument()
      })

      jest.useRealTimers()
    })
  })
})





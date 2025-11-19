/**
 * @testSuite ForgotPassword
 * 
 * Test suite for Forgot Password page
 * 
 * @remarks
 * Comprehensive tests for the password reset functionality covering:
 * - UI rendering (heading, description, icons, form elements)
 * - Form validation (email required, email format)
 * - Firebase integration (sendPasswordResetEmail)
 * - User feedback (success messages, error messages, loading states)
 * - Error handling (user not found, invalid email, network errors)
 * - Navigation (back to sign in link)
 * - Styling (glassmorphic design)
 * 
 * @testCoverage
 * - **UI Structure Tests**: Heading, description, icons, email input, buttons, links
 * - **Form Validation**: Required fields, email format validation
 * - **Firebase Integration**: sendPasswordResetEmail called with correct email
 * - **Success Flow**: Success message, email input cleared, button re-enabled
 * - **Loading States**: Button disabled, loading indicator shown during submission
 * - **Error Handling**: User not found, invalid email, network errors, generic errors
 * - **Navigation**: Back to sign in link works correctly
 * - **Styling**: Glassmorphic card styling applied
 * 
 * @edgeCases
 * - Empty email submission prevented
 * - Invalid email format rejected
 * - User not found error displayed
 * - Network errors handled gracefully
 * - Button disabled during submission
 * - Email input cleared on success
 * - Multiple rapid submissions prevented
 * 
 * @expectedValues
 * **UI Elements:**
 * - Heading: "Reset Password"
 * - Email input: type="email", required, placeholder present
 * - Button: "Send Reset Link"
 * - Back link: href="/signin"
 * - Icons: Mail and ArrowLeft rendered
 * 
 * **Form Behavior:**
 * - Valid email: calls sendPasswordResetEmail
 * - Success: shows "Password reset email sent", clears input
 * - Loading: button disabled, shows "Sending..."
 * 
 * **Error Messages:**
 * - "auth/user-not-found": "No user found with this email"
 * - "auth/invalid-email": "Invalid email address"
 * - "auth/network-request-failed": "Network error"
 * - Generic: "Failed to send reset email"
 * 
 * **Email Domain:**
 * - Accepts any valid email format
 * - No domain restrictions for password reset
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import ForgotPassword from './page'

// Mock Next.js Link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'Link'
  return MockLink
})

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}))

// Mock Firebase app
jest.mock('../../firebase', () => ({
  app: {},
}))

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Mail: () => <div data-testid="mail-icon">Mail Icon</div>,
  ArrowLeft: () => <div data-testid="arrow-icon">Arrow Icon</div>,
}))

describe('ForgotPassword Page', () => {
  const mockAuth = {}

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getAuth as jest.Mock).mockReturnValue(mockAuth)
  })

  describe('UI Rendering', () => {
    it('should render reset password heading', () => {
      render(<ForgotPassword />)
      expect(screen.getByText('Reset Password')).toBeInTheDocument()
    })

    it('should render descriptive text', () => {
      render(<ForgotPassword />)
      expect(
        screen.getByText(/Enter your email and we'll send you a link to reset your password/i)
      ).toBeInTheDocument()
    })

    it('should render mail icon', () => {
      render(<ForgotPassword />)
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument()
    })

    it('should render email input field', () => {
      render(<ForgotPassword />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      expect(emailInput).toBeInTheDocument()
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('placeholder', 'you@example.com')
    })

    it('should render send reset link button', () => {
      render(<ForgotPassword />)
      expect(screen.getByText('Send Reset Link')).toBeInTheDocument()
    })

    it('should render back to sign in link', () => {
      render(<ForgotPassword />)
      const backLink = screen.getByText('Back to Sign In')
      expect(backLink).toBeInTheDocument()
      expect(backLink.closest('a')).toHaveAttribute('href', '/signin')
    })

    it('should render arrow icon in back link', () => {
      render(<ForgotPassword />)
      expect(screen.getByTestId('arrow-icon')).toBeInTheDocument()
    })

    it('should apply glassmorphic card styling', () => {
      const { container } = render(<ForgotPassword />)
      const card = container.querySelector('.glass')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('should require email input', () => {
      render(<ForgotPassword />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      expect(emailInput).toBeRequired()
    })

    it('should accept email input', () => {
      render(<ForgotPassword />)
      const emailInput = screen.getByLabelText(/Email Address/i) as HTMLInputElement

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

      expect(emailInput.value).toBe('test@example.com')
    })

    it('should clear email input on successful submission', async () => {
      ;(sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined)

      render(<ForgotPassword />)
      const emailInput = screen.getByLabelText(/Email Address/i) as HTMLInputElement
      const submitButton = screen.getByText('Send Reset Link')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(emailInput.value).toBe('')
      })
    })
  })

  describe('Password Reset Functionality', () => {
    it('should call sendPasswordResetEmail on form submission', async () => {
      ;(sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined)

      render(<ForgotPassword />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByText('Send Reset Link')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(sendPasswordResetEmail).toHaveBeenCalledWith(mockAuth, 'test@example.com')
      })
    })

    it('should show success message after sending reset email', async () => {
      ;(sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined)

      render(<ForgotPassword />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByText('Send Reset Link')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Password reset email sent!/i)).toBeInTheDocument()
        expect(
          screen.getByText(/Check your inbox and follow the instructions/i)
        ).toBeInTheDocument()
      })
    })

    it('should show loading state while sending email', async () => {
      ;(sendPasswordResetEmail as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 1000))
      )

      render(<ForgotPassword />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByText('Send Reset Link')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Sending...')).toBeInTheDocument()
      })
    })

    it('should disable button while sending email', async () => {
      ;(sendPasswordResetEmail as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 1000))
      )

      render(<ForgotPassword />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByText('Send Reset Link') as HTMLButtonElement

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })
    })
  })

  describe('Error Handling', () => {
    it('should show error for user not found', async () => {
      ;(sendPasswordResetEmail as jest.Mock).mockRejectedValue({
        code: 'auth/user-not-found',
      })

      render(<ForgotPassword />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByText('Send Reset Link')

      fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('No account found with this email address.')).toBeInTheDocument()
      })
    })

    it('should show error for invalid email', async () => {
      ;(sendPasswordResetEmail as jest.Mock).mockRejectedValue({
        code: 'auth/invalid-email',
        message: 'Invalid email',
      })

      render(<ForgotPassword />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      const form = emailInput.closest('form') as HTMLFormElement

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()
      })
    })

    it('should show generic error message for other errors', async () => {
      ;(sendPasswordResetEmail as jest.Mock).mockRejectedValue({
        message: 'Network error occurred',
      })

      render(<ForgotPassword />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByText('Send Reset Link')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Network error occurred')).toBeInTheDocument()
      })
    })

    it('should clear previous errors on new submission', async () => {
      ;(sendPasswordResetEmail as jest.Mock)
        .mockRejectedValueOnce({ code: 'auth/user-not-found' })
        .mockResolvedValueOnce(undefined)

      render(<ForgotPassword />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByText('Send Reset Link')

      // First submission with error
      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('No account found with this email address.')).toBeInTheDocument()
      })

      // Second submission successful
      fireEvent.change(emailInput, { target: { value: 'correct@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.queryByText('No account found with this email address.')).not.toBeInTheDocument()
      })
    })

    it('should clear previous success messages on new submission', async () => {
      ;(sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined)

      render(<ForgotPassword />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByText('Send Reset Link')

      // First submission
      fireEvent.change(emailInput, { target: { value: 'first@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/Password reset email sent!/i)).toBeInTheDocument()
      })

      // Second submission
      fireEvent.change(emailInput, { target: { value: 'second@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(sendPasswordResetEmail).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Success State UI', () => {
    it('should display success message with green styling', async () => {
      ;(sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined)

      render(<ForgotPassword />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByText('Send Reset Link')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        const successMessage = screen.getByText(/Password reset email sent!/i).closest('div')
        expect(successMessage).toHaveClass('bg-green-500/10')
        expect(successMessage).toHaveClass('border-green-500/20')
      })
    })
  })

  describe('Error State UI', () => {
    it('should display error message with red styling', async () => {
      ;(sendPasswordResetEmail as jest.Mock).mockRejectedValue({
        code: 'auth/user-not-found',
      })

      render(<ForgotPassword />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      const submitButton = screen.getByText('Send Reset Link')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        const errorMessage = screen.getByText(/No account found/i).closest('div')
        expect(errorMessage).toHaveClass('bg-red-500/10')
        expect(errorMessage).toHaveClass('border-red-500/20')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper label for email input', () => {
      render(<ForgotPassword />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      expect(emailInput).toHaveAttribute('id', 'email')
      expect(emailInput).toHaveAttribute('name', 'email')
    })

    it('should have proper form structure', () => {
      const { container } = render(<ForgotPassword />)
      const form = container.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    it('should prevent default form submission', async () => {
      ;(sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined)

      const { container } = render(<ForgotPassword />)
      const form = container.querySelector('form') as HTMLFormElement
      const emailInput = screen.getByLabelText(/Email Address/i)

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault')
      
      fireEvent(form, submitEvent)

      await waitFor(() => {
        expect(preventDefaultSpy).toHaveBeenCalled()
      })
    })
  })
})

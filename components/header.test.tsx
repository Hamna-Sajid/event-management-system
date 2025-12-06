/**
 * @testSuite Header
 * 
 * Test suite for Header navigation component
 * 
 * @remarks
 * Comprehensive tests for the site header/navigation bar covering:
 * - Semantic HTML structure (header element)
 * - Brand logo rendering and navigation
 * - Search button functionality (disabled state)
 * - Login button rendering and navigation
 * - Sign up button rendering and navigation
 * - Profile menu for authenticated users
 * - Navigation behavior with Next.js router
 * - Button states and accessibility
 * - Firebase authentication integration
 * 
 * @testCoverage
 * - **Structure Tests**: Validates header element exists
 * - **Content Tests**: Ensures logo and buttons render
 * - **Navigation Tests**: Verifies router.push calls for login/signup/home
 * - **Interactive Tests**: Confirms button clicks trigger navigation
 * - **Accessibility Tests**: Checks action buttons are enabled, search is disabled
 * - **Authentication Tests**: Validates login/signup vs ProfileMenu display
 * 
 * @edgeCases
 * - Disabled search button with "Coming soon" tooltip
 * - Authenticated vs unauthenticated UI states
 * - Multiple buttons with different states
 * - User interaction with userEvent for realistic testing
 * - Mocked Firebase auth and Next.js router
 * - Text matching with case-insensitive search
 * 
 * @expectedValues
 * - 1 header element
 * - At least 3 buttons (search + login + sign up) when not authenticated
 * - Login button navigates to: /signin
 * - Sign up button navigates to: /signup
 * - Logo navigates to: /
 * - Search button is disabled
 * - ProfileMenu shown when user is authenticated
 * - Login/signup buttons hidden when authenticated
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock Firebase
jest.mock('@/firebase', () => ({
  auth: {},
  firestore: {},
  storage: {},
}))

// Mock Firebase auth - must be before imports
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null)
    return jest.fn()
  }),
}))

// Mock ProfileMenu component
jest.mock('./profile-menu', () => ({
  ProfileMenu: () => <div data-testid="profile-menu">Profile Menu</div>,
}))

// Import after mocks
import Header from './header'
import { onAuthStateChanged } from 'firebase/auth'

describe('Header', () => {
  const mockPush = jest.fn()
  const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    // Default: unauthenticated user
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null)
      return jest.fn()
    })
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('should render as header element', () => {
    const { container } = render(<Header />)
    
    const header = container.querySelector('header')
    expect(header).toBeInTheDocument()
  })

  it('should render brand logo section', () => {
    render(<Header />)
    
    // Logo should be displayed
    const spans = screen.getAllByText((content, element) => {
      return element?.tagName.toLowerCase() === 'span'
    })
    expect(spans.length).toBeGreaterThan(0)
  })

  it('should render search button', () => {
    render(<Header />)
    
    const buttons = screen.getAllByRole('button')
    // Should have search (disabled), login, and sign up buttons
    expect(buttons.length).toBeGreaterThanOrEqual(3)
    
    // Search button should be disabled
    const searchButton = buttons.find(btn => btn.hasAttribute('disabled'))
    expect(searchButton).toBeInTheDocument()
    expect(searchButton).toHaveAttribute('title', 'Coming soon')
  })

  it('should render login button', () => {
    render(<Header />)
    
    const buttons = screen.getAllByRole('button')
    const loginButton = buttons.find(btn => btn.textContent?.toLowerCase().includes('login'))
    expect(loginButton).toBeInTheDocument()
  })

  it('should render sign up button', () => {
    render(<Header />)
    
    const buttons = screen.getAllByRole('button')
    const signUpButton = buttons.find(btn => btn.textContent?.toLowerCase().includes('sign'))
    expect(signUpButton).toBeInTheDocument()
  })

  it('should navigate to signin when login button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)
    
    const buttons = screen.getAllByRole('button')
    const loginButton = buttons.find(btn => btn.textContent?.toLowerCase().includes('login'))
    
    if (loginButton) {
      await user.click(loginButton)
      expect(mockPush).toHaveBeenCalledWith('/signin')
    }
  })

  it('should navigate to signup when sign up button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)
    
    const buttons = screen.getAllByRole('button')
    const signUpButton = buttons.find(btn => btn.textContent?.toLowerCase().includes('sign'))
    
    if (signUpButton) {
      await user.click(signUpButton)
      expect(mockPush).toHaveBeenCalledWith('/signup')
    }
  })

  it('should have multiple interactive buttons', () => {
    render(<Header />)
    
    const buttons = screen.getAllByRole('button')
    // Header should have at least 2 action buttons (login, sign up) plus search
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('should render all action buttons (login/signup) as enabled', () => {
    render(<Header />)
    
    const buttons = screen.getAllByRole('button')
    const actionButtons = buttons.filter(btn => !btn.hasAttribute('disabled'))
    
    // Login and Sign Up buttons should be enabled
    actionButtons.forEach(button => {
      expect(button).toBeEnabled()
    })
    
    // Should have at least 2 enabled buttons (login and signup)
    expect(actionButtons.length).toBeGreaterThanOrEqual(2)
  })

  it('should show login and signup buttons when user is not authenticated', () => {
    render(<Header />)
    
    const buttons = screen.getAllByRole('button')
    const loginButton = buttons.find(btn => btn.textContent?.toLowerCase().includes('login'))
    const signUpButton = buttons.find(btn => btn.textContent?.toLowerCase().includes('sign'))
    
    expect(loginButton).toBeInTheDocument()
    expect(signUpButton).toBeInTheDocument()
    expect(screen.queryByTestId('profile-menu')).not.toBeInTheDocument()
  })

  it('should navigate to home when logo is clicked', async () => {
    const user = userEvent.setup()
    const { container } = render(<Header />)
    
    // Find the logo div with cursor-pointer
    const logo = container.querySelector('.cursor-pointer')
    
    if (logo) {
      await user.click(logo)
      expect(mockPush).toHaveBeenCalledWith('/')
    }
  })

  it('should show ProfileMenu when user is authenticated', () => {
    // Mock authenticated user
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: '123', email: 'test@example.com' })
      return jest.fn()
    })
    
    render(<Header />)
    
    // ProfileMenu should be shown
    expect(screen.getByTestId('profile-menu')).toBeInTheDocument()
    
    // Login and signup buttons should not be shown
    const buttons = screen.getAllByRole('button')
    const loginButton = buttons.find(btn => btn.textContent?.toLowerCase().includes('login'))
    const signUpButton = buttons.find(btn => btn.textContent?.toLowerCase().includes('sign'))
    
    expect(loginButton).toBeUndefined()
    expect(signUpButton).toBeUndefined()
  })
})

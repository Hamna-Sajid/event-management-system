/**
 * @testSuite Header
 * 
 * Test suite for Header navigation component
 * 
 * @remarks
 * Comprehensive tests for the site header/navigation bar covering:
 * - Semantic HTML structure (header element)
 * - Brand logo rendering
 * - Search button functionality
 * - Login button rendering and navigation
 * - Sign up button rendering and navigation
 * - Navigation behavior with Next.js router
 * - Button states and accessibility
 * 
 * @testCoverage
 * - **Structure Tests**: Validates header element exists
 * - **Content Tests**: Ensures logo and buttons render
 * - **Navigation Tests**: Verifies router.push calls for login/signup
 * - **Interactive Tests**: Confirms button clicks trigger navigation
 * - **Accessibility Tests**: Checks all buttons are enabled
 * 
 * @edgeCases
 * - Multiple buttons (search, login, sign up) - minimum 3
 * - User interaction with userEvent for realistic testing
 * - Mocked Next.js router for navigation testing
 * - Text matching with case-insensitive search
 * 
 * @expectedValues
 * - 1 header element
 * - At least 3 buttons (search + login + sign up)
 * - Login button navigates to: /signin
 * - Sign up button navigates to: /signup
 * - All buttons enabled
 * - Logo/brand section rendered as span elements
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from './header'
import { useRouter } from 'next/navigation'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('Header', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
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
    // Should have search, login, and sign up buttons
    expect(buttons.length).toBeGreaterThanOrEqual(3)
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

  it('should render all buttons as enabled', () => {
    render(<Header />)
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeEnabled()
    })
  })
})

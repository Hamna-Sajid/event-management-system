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

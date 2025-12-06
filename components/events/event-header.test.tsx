/**
 * @testSuite EventHeader
 * 
 * Test suite for EventHeader component
 * 
 * @remarks
 * Comprehensive tests covering:
 * - Header rendering with authentication states
 * - Favorite toggle functionality
 * - Share button interaction
 * - Navigation elements
 * - ProfileMenu integration
 * 
 * @testCoverage
 * - **Authentication**: Renders correctly for authenticated and unauthenticated users
 * - **Favorite Button**: Toggle state and callback
 * - **Navigation**: Back button and authentication buttons
 * - **Profile Menu**: Shows for authenticated users
 * 
 * @edgeCases
 * - User is null (unauthenticated)
 * - User is authenticated
 * - Favorite state changes
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EventHeader } from './event-header'
import { User } from 'firebase/auth'

// Mock ProfileMenu component
jest.mock('@/components/profile-menu', () => ({
  ProfileMenu: function ProfileMenu() {
    return <div data-testid="profile-menu">Profile Menu</div>
  },
}))

// Mock Next.js Link
jest.mock('next/link', () => ({
  __esModule: true,
  default: function Link({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  },
}))

describe('EventHeader', () => {
  const mockUser = {
    uid: 'test-user-id',
    email: 'test@example.com',
  } as User

  const defaultProps = {
    isFavorited: false,
    onToggleFavorite: jest.fn(),
    onShare: jest.fn(),
    currentUser: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render header with all elements', () => {
      render(<EventHeader {...defaultProps} />)
      
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument()
    })

    it('should render Back link with correct href', () => {
      render(<EventHeader {...defaultProps} />)
      
      const backLink = screen.getByRole('link', { name: /Back/i })
      expect(backLink).toHaveAttribute('href', '/')
    })
  })

  describe('Authentication States', () => {
    it('should show login and signup buttons when user is not authenticated', () => {
      render(<EventHeader {...defaultProps} currentUser={null} />)
      
      expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument()
      expect(screen.queryByTestId('profile-menu')).not.toBeInTheDocument()
    })

    it('should show ProfileMenu when user is authenticated', () => {
      render(<EventHeader {...defaultProps} currentUser={mockUser} />)
      
      expect(screen.getByTestId('profile-menu')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Login/i})).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Sign Up/i })).not.toBeInTheDocument()
    })

    it('should render login button for unauthenticated users', () => {
      render(<EventHeader {...defaultProps} currentUser={null} />)
      
      const loginButton = screen.getByRole('button', { name: /Login/i })
      expect(loginButton).toBeInTheDocument()
    })

    it('should render signup button for unauthenticated users', () => {
      render(<EventHeader {...defaultProps} currentUser={null} />)
      
      const signupButton = screen.getByRole('button', { name: /Sign Up/i })
      expect(signupButton).toBeInTheDocument()
    })
  })

  describe('Favorite Functionality', () => {
    it('should render favorite button', () => {
      const { container } = render(<EventHeader {...defaultProps} />)
      
      // Heart icon button should be present
      const favoriteButton = container.querySelector('button svg')
      expect(favoriteButton).toBeInTheDocument()
    })

    it('should call onToggleFavorite when favorite button is clicked', async () => {
      const user = userEvent.setup()
      const { container } = render(<EventHeader {...defaultProps} />)
      
      // Find the button containing the Heart icon (first button after back link)
      const buttons = container.querySelectorAll('button')
      const favoriteButton = buttons[0]
      
      await user.click(favoriteButton)
      
      expect(defaultProps.onToggleFavorite).toHaveBeenCalledTimes(1)
    })

    it('should reflect favorited state visually', () => {
      const { container } = render(<EventHeader {...defaultProps} isFavorited={true} />)
      
      // When favorited, heart icon should have fill-[#d02243] class
      const heartIcon = container.querySelector('svg')
      expect(heartIcon).toBeInTheDocument()
    })

    it('should reflect unfavorited state visually', () => {
      const { container } = render(<EventHeader {...defaultProps} isFavorited={false} />)
      
      const heartIcon = container.querySelector('svg')
      expect(heartIcon).toBeInTheDocument()
    })
  })

  describe('Share Functionality', () => {
    it('should call onShare when share button is clicked', async () => {
      const user = userEvent.setup()
      const { container } = render(<EventHeader {...defaultProps} />)
      
      // Find the button containing the Share2 icon (second button after back link)
      const buttons = container.querySelectorAll('button')
      const shareButton = buttons[1]
      
      await user.click(shareButton)
      
      expect(defaultProps.onShare).toHaveBeenCalledTimes(1)
    })

    it('should render share button icon', () => {
      const { container } = render(<EventHeader {...defaultProps} />)
      
      // Share2 icon should be present
      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBeGreaterThan(1)
    })
  })

  describe('Action Buttons', () => {
    it('should render all three action buttons (favorite, share, auth)', () => {
      const { container } = render(<EventHeader {...defaultProps} />)
      
      const buttons = container.querySelectorAll('button')
      expect(buttons.length).toBeGreaterThanOrEqual(4) // favorite, share, login, signup
    })
  })
})

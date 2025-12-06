import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SocietyHeader from './society-header'
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation'
import { getAuth, signOut } from 'firebase/auth'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signOut: jest.fn(() => Promise.resolve()),
}))

// Mock app from firebase
jest.mock('../firebase', () => ({
    app: {},
}))

describe('SocietyHeader', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    ;(getAuth as jest.Mock).mockReturnValue({}) // Mock getAuth to return a dummy auth object
  })

  it('should render Dashboard link with correct href', () => {
    render(<SocietyHeader theme="default" />)
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    expect(dashboardLink).toHaveAttribute('href', '/coming-soon')
  })

  it('should render My Profile link with correct href', () => {
    render(<SocietyHeader theme="default" />)
    const myProfileLink = screen.getByRole('link', { name: /my profile/i })
    expect(myProfileLink).toHaveAttribute('href', '/coming-soon')
  })

  it('should render Bell icon link with correct href', () => {
    render(<SocietyHeader theme="default" />)
    const bellLink = screen.getByRole('link', { name: 'Bell' })
    expect(bellLink).toHaveAttribute('href', '/coming-soon')
  })

  it('should call signOut and redirect to "/" when logout button is clicked', async () => {
    render(<SocietyHeader theme="default" />)
    
    // The logout button is now a button, not a link
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    expect(logoutButton).toBeInTheDocument()

    // The old test checked for a link, so we make sure that's gone.
    const logoutLink = screen.queryByRole('link', { name: /logout/i })
    expect(logoutLink).not.toBeInTheDocument()
    
    // Click the button
    fireEvent.click(logoutButton)
    
    // Wait for promises to resolve
    await waitFor(() => {
      // Check that signOut was called
      expect(signOut).toHaveBeenCalled()
      
      // Check that router.push was called with the correct path
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })
})

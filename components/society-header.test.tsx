import React from 'react'
import { render, screen } from '@testing-library/react'
import SocietyHeader from './society-header'
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href, 'aria-label': ariaLabel }: { children: React.ReactNode, href: string, 'aria-label'?: string }) => {
    return <a href={href} aria-label={ariaLabel}>{children}</a>
  }
  MockLink.displayName = 'Link'
  return MockLink
})

describe('SocietyHeader', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
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

  it('should render Logout link with correct href', () => {
    render(<SocietyHeader theme="default" />)
    const logoutLink = screen.getByRole('link', { name: /logout/i })
    expect(logoutLink).toHaveAttribute('href', '/landing-page')
  })
})

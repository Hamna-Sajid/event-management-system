import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SocietyHero from './society-hero'
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'Link'
  return MockLink
})

describe('SocietyHero', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('should render the society name', () => {
    render(<SocietyHero societyName="Test Society" theme="default" societyId="123" />)
    expect(screen.getByText('Test Society')).toBeInTheDocument()
  })

  it('should render "Edit Profile" and "Settings" buttons when isManagementView is true', () => {
    render(<SocietyHero societyName="Test Society" theme="default" societyId="123" isManagementView />)
    expect(screen.getByText('Edit Profile')).toBeInTheDocument()
    expect(screen.getByTitle('Edit Society Profile')).toBeInTheDocument()
  })

  it('should render "Follow Society" button when isManagementView is false', () => {
    render(<SocietyHero societyName="Test Society" theme="default" societyId="123" isManagementView={false} />)
    expect(screen.getByText('Follow Society')).toBeInTheDocument()
  })

  it('should call router.push with "/coming-soon" when "Edit Profile" is clicked', async () => {
    const user = userEvent.setup()
    render(<SocietyHero societyName="Test Society" theme="default" societyId="123" isManagementView />)
    
    await user.click(screen.getByText('Edit Profile'))
    
    expect(mockPush).toHaveBeenCalledWith('/coming-soon')
  })

  it('should call router.push with "/coming-soon" when "Settings" is clicked', async () => {
    const user = userEvent.setup()
    render(<SocietyHero societyName="Test Society" theme="default" societyId="123" isManagementView />)
    
    await user.click(screen.getByTitle('Edit Society Profile'))
    
    expect(mockPush).toHaveBeenCalledWith('/coming-soon')
  })
})

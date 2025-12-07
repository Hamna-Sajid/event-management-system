/**
 * @testSuite SocietyHeader
 * 
 * Test suite for SocietyHeader component
 * 
 * @remarks
 * Tests for the society page header navigation:
 * - Header rendering with logo and branding
 * - Navigation links functionality
 * - ProfileMenu integration
 * 
 * @testCoverage
 * - **Rendering Tests**: Logo, branding, navigation links
 * - **Integration Tests**: ProfileMenu component rendering
 * - **Navigation Tests**: Dashboard link
 * 
 * @edgeCases
 * - ProfileMenu handles auth internally (tested in profile-menu.test.tsx)
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import SocietyHeader from './society-header'
import '@testing-library/jest-dom'

// Mock ProfileMenu component
jest.mock('@/components/profile-menu', () => ({
  ProfileMenu: function MockProfileMenu() {
    return <div data-testid="profile-menu">Profile Menu</div>
  }
}))

describe('SocietyHeader', () => {
  it('should render Dashboard link with correct href', () => {
    render(<SocietyHeader theme="default" />)
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    expect(dashboardLink).toHaveAttribute('href', '/coming-soon')
  })

  it('should render the logo and branding', () => {
    render(<SocietyHeader theme="default" />)
    expect(screen.getByText('IE')).toBeInTheDocument()
    expect(screen.getByText('IEMS')).toBeInTheDocument()
  })

  it('should render the ProfileMenu component', () => {
    render(<SocietyHeader theme="default" />)
    expect(screen.getByTestId('profile-menu')).toBeInTheDocument()
  })
})

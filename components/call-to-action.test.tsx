/**
 * @testSuite CallToAction
 * Test suite for Call-to-Action component
 * 
 * @remarks
 * Tests for the promotional call-to-action section covering:
 * - Semantic HTML structure (section element)
 * - Heading display for context (h2 heading)
 * - Primary CTA button rendering and functionality
 * - Navigation link to signup page
 * - Descriptive paragraph content
 * - Button accessibility and meaningful content
 * - Semantic heading hierarchy
 * 
 * @testCoverage
 * - **Structure Tests**: Validates section element and semantic HTML
 * - **Content Tests**: Ensures heading and paragraphs render
 * - **Interactive Tests**: Verifies button and link functionality
 * - **Accessibility Tests**: Confirms button has meaningful content and is enabled
 * - **SEO Tests**: Checks proper heading hierarchy for screen readers
 * 
 * @edgeCases
 * - Multiple paragraphs for trust indicators
 * - Button must have non-empty text content
 * - At least one heading for accessibility
 * 
 * @expectedValues
 * - 1 section element
 * - 1 h2 heading
 * - 1 enabled button
 * - Link href: /signup
 * - At least 1 paragraph
 * - Button text length > 0
 * - At least 1 heading for screen readers
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import CallToAction from './call-to-action'

describe('CallToAction', () => {
  it('should render as semantic section element', () => {
    const { container } = render(<CallToAction />)
    
    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
  })

  it('should display a heading to provide context', () => {
    render(<CallToAction />)
    
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toBeInTheDocument()
  })

  it('should provide a primary call-to-action button', () => {
    render(<CallToAction />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toBeEnabled()
  })

  it('should link CTA to signup page for user registration', () => {
    const { container } = render(<CallToAction />)
    
    const signupLink = container.querySelector('a[href="/signup"]')
    expect(signupLink).toBeInTheDocument()
  })

  it('should contain descriptive paragraphs for context', () => {
    const { container } = render(<CallToAction />)
    
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs.length).toBeGreaterThan(0)
  })

  it('should have accessible button with meaningful content', () => {
    render(<CallToAction />)
    
    const button = screen.getByRole('button')
    expect(button.textContent).toBeTruthy()
    expect(button.textContent?.trim().length).toBeGreaterThan(0)
  })

  it('should structure content with proper semantic hierarchy', () => {
    render(<CallToAction />)
    
    // Should have at least one heading for screen readers
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThanOrEqual(1)
  })
})




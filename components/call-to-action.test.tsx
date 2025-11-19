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




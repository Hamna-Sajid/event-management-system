import React from 'react'
import { render, screen } from '@testing-library/react'
import CallToAction from './call-to-action'

describe('CallToAction', () => {
  it('should render the main headline', () => {
    render(<CallToAction />)
    
    expect(screen.getByText(/Ready to Transform Your IBA Experience/i)).toBeInTheDocument()
  })

  it('should render the description text', () => {
    render(<CallToAction />)
    
    expect(screen.getByText(/Join the waitlist to get early access/i)).toBeInTheDocument()
  })

  it('should render Join Waitlist Now button', () => {
    render(<CallToAction />)
    
    expect(screen.getByRole('button', { name: /Join Waitlist Now/i })).toBeInTheDocument()
  })

  it('should display trust badges', () => {
    render(<CallToAction />)
    
    expect(screen.getByText(/No credit card required/i)).toBeInTheDocument()
    expect(screen.getByText(/Free to join/i)).toBeInTheDocument()
    expect(screen.getByText(/Early access guaranteed/i)).toBeInTheDocument()
  })

  it('should render sparkles icon', () => {
    const { container } = render(<CallToAction />)
    
    const iconContainer = container.querySelector('.bg-gradient-to-br')
    expect(iconContainer).toBeInTheDocument()
  })

  it('should have Join Waitlist link pointing to signup', () => {
    const { container } = render(<CallToAction />)
    
    const link = container.querySelector('a[href="/signup"]')
    expect(link).toBeInTheDocument()
  })

  it('should apply glassmorphism effect to main container', () => {
    const { container } = render(<CallToAction />)
    
    const glassCard = container.querySelector('.glass')
    expect(glassCard).toHaveClass('glass-hover', 'rounded-2xl')
  })

  it('should apply correct button styling', () => {
    render(<CallToAction />)
    
    const waitlistButton = screen.getByRole('button', { name: /Join Waitlist Now/i })
    
    expect(waitlistButton).toHaveClass('bg-[#d02243]')
  })

  it('should have large button size', () => {
    render(<CallToAction />)
    
    const waitlistButton = screen.getByRole('button', { name: /Join Waitlist Now/i })
    
    expect(waitlistButton).toHaveClass('py-6')
  })

  it('should center align content', () => {
    const { container } = render(<CallToAction />)
    
    const mainDiv = container.querySelector('.text-center')
    expect(mainDiv).toBeInTheDocument()
  })
})


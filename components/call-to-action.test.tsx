import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CallToAction from './call-to-action'

describe('CallToAction', () => {
  it('should render the main headline', () => {
    render(<CallToAction />)
    
    expect(screen.getByText(/Ready to Experience IBA Events/i)).toBeInTheDocument()
  })

  it('should render the description text', () => {
    render(<CallToAction />)
    
    expect(screen.getByText(/Join our community of professionals and enthusiasts/i)).toBeInTheDocument()
  })

  it('should render Create Account button', () => {
    render(<CallToAction />)
    
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument()
  })

  it('should render Browse Events button', () => {
    render(<CallToAction />)
    
    expect(screen.getByRole('button', { name: /Browse Events/i })).toBeInTheDocument()
  })

  it('should display trust badges', () => {
    render(<CallToAction />)
    
    expect(screen.getByText(/No credit card required/i)).toBeInTheDocument()
    expect(screen.getByText(/Free to join/i)).toBeInTheDocument()
    expect(screen.getByText(/Instant access/i)).toBeInTheDocument()
  })

  it('should render sparkles icon', () => {
    const { container } = render(<CallToAction />)
    
    const iconContainer = container.querySelector('.bg-gradient-to-br')
    expect(iconContainer).toBeInTheDocument()
  })

  it('should handle Create Account button click', async () => {
    const user = userEvent.setup()
    render(<CallToAction />)
    
    const createAccountButton = screen.getByRole('button', { name: /Create Account/i })
    await user.click(createAccountButton)
    
    expect(createAccountButton).toBeInTheDocument()
  })

  it('should handle Browse Events button click', async () => {
    const user = userEvent.setup()
    render(<CallToAction />)
    
    const browseEventsButton = screen.getByRole('button', { name: /Browse Events/i })
    await user.click(browseEventsButton)
    
    expect(browseEventsButton).toBeInTheDocument()
  })

  it('should apply glassmorphism effect to main container', () => {
    const { container } = render(<CallToAction />)
    
    const glassCard = container.querySelector('.glass')
    expect(glassCard).toHaveClass('glass-hover', 'rounded-2xl')
  })

  it('should apply correct button variants', () => {
    render(<CallToAction />)
    
    const createAccountButton = screen.getByRole('button', { name: /Create Account/i })
    const browseEventsButton = screen.getByRole('button', { name: /Browse Events/i })
    
    expect(createAccountButton).toHaveClass('bg-[#d02243]')
    expect(browseEventsButton).toHaveClass('border-[rgba(255,255,255,0.2)]')
  })

  it('should have large button sizes', () => {
    render(<CallToAction />)
    
    const createAccountButton = screen.getByRole('button', { name: /Create Account/i })
    const browseEventsButton = screen.getByRole('button', { name: /Browse Events/i })
    
    expect(createAccountButton).toHaveClass('py-6')
    expect(browseEventsButton).toHaveClass('py-6')
  })

  it('should center align content', () => {
    const { container } = render(<CallToAction />)
    
    const mainDiv = container.querySelector('.text-center')
    expect(mainDiv).toBeInTheDocument()
  })
})

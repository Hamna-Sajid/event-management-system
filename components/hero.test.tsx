import React from 'react'
import { render, screen } from '@testing-library/react'
import Hero from './hero'

describe('Hero', () => {
  it('should render the main headline', () => {
    render(<Hero />)
    
    expect(screen.getByText(/Your Gateway to/i)).toBeInTheDocument()
    // Use getAllByText since "IBA Events" appears in both the headline and description
    const ibaEventsElements = screen.getAllByText(/IBA Events/i)
    expect(ibaEventsElements.length).toBeGreaterThan(0)
  })

  it('should render the badge with coming soon text', () => {
    render(<Hero />)
    
    expect(screen.getByText(/Coming Soon to IBA/i)).toBeInTheDocument()
  })

  it('should render the subheadline description', () => {
    render(<Hero />)
    
    expect(screen.getByText(/Discover events, connect with societies/i)).toBeInTheDocument()
  })

  it('should display statistics correctly', () => {
    render(<Hero />)
    
    expect(screen.getByText('500+')).toBeInTheDocument()
    expect(screen.getByText('Events Annually')).toBeInTheDocument()
    
    expect(screen.getByText('50+')).toBeInTheDocument()
    expect(screen.getByText('Active Societies')).toBeInTheDocument()
    
    expect(screen.getByText('5K+')).toBeInTheDocument()
    expect(screen.getByText('IBA Students')).toBeInTheDocument()
  })

  it('should render Join Waitlist button', () => {
    render(<Hero />)
    
    expect(screen.getByRole('button', { name: /Join Waitlist/i })).toBeInTheDocument()
  })

  it('should render Already have an account button', () => {
    render(<Hero />)
    
    expect(screen.getByRole('button', { name: /Already have an account/i })).toBeInTheDocument()
  })

  it('should have Join Waitlist link pointing to signup', () => {
    const { container } = render(<Hero />)
    
    const links = container.querySelectorAll('a[href="/signup"]')
    expect(links.length).toBeGreaterThan(0)
  })

  it('should have signin link', () => {
    const { container } = render(<Hero />)
    
    const link = container.querySelector('a[href="/signin"]')
    expect(link).toBeInTheDocument()
  })

  it('should apply glassmorphism styling to hero card', () => {
    const { container } = render(<Hero />)
    // Select the main hero card (not the badge)
    const glassCards = container.querySelectorAll('.glass')
    const heroCard = glassCards[1] // Second .glass element is the hero card
    
    expect(heroCard).toHaveClass('glass-hover')
  })

  it('should render early access message', () => {
    render(<Hero />)
    
    expect(screen.getByText(/Be among the first to experience/i)).toBeInTheDocument()
  })
})

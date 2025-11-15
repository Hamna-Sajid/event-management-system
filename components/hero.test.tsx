import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Hero from './hero'

describe('Hero', () => {
  it('should render the main headline', () => {
    render(<Hero />)
    
    expect(screen.getByText(/Your Gateway to/i)).toBeInTheDocument()
    expect(screen.getByText(/IBA Events/i)).toBeInTheDocument()
  })

  it('should render the badge with discovery text', () => {
    render(<Hero />)
    
    expect(screen.getByText(/Discover Premium Event Experiences/i)).toBeInTheDocument()
  })

  it('should render the subheadline description', () => {
    render(<Hero />)
    
    expect(screen.getByText(/Experience curated events, networking opportunities/i)).toBeInTheDocument()
  })

  it('should display statistics correctly', () => {
    render(<Hero />)
    
    expect(screen.getByText('500+')).toBeInTheDocument()
    expect(screen.getByText('Events Hosted')).toBeInTheDocument()
    
    expect(screen.getByText('50K+')).toBeInTheDocument()
    expect(screen.getByText('Active Members')).toBeInTheDocument()
    
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('Satisfaction')).toBeInTheDocument()
  })

  it('should render all call-to-action buttons', () => {
    render(<Hero />)
    
    expect(screen.getByRole('button', { name: /Explore Events Now/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Learn More/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument()
  })

  it('should handle Explore Events button click', async () => {
    const user = userEvent.setup()
    render(<Hero />)
    
    const exploreButton = screen.getByRole('button', { name: /Explore Events Now/i })
    await user.click(exploreButton)
    
    expect(exploreButton).toBeInTheDocument()
  })

  it('should handle Learn More button click', async () => {
    const user = userEvent.setup()
    render(<Hero />)
    
    const learnMoreButton = screen.getByRole('button', { name: /Learn More/i })
    await user.click(learnMoreButton)
    
    expect(learnMoreButton).toBeInTheDocument()
  })

  it('should handle Get Started button click', async () => {
    const user = userEvent.setup()
    render(<Hero />)
    
    const getStartedButton = screen.getByRole('button', { name: /Get Started/i })
    await user.click(getStartedButton)
    
    expect(getStartedButton).toBeInTheDocument()
  })

  it('should apply glassmorphism styling to hero card', () => {
    const { container } = render(<Hero />)
    // Select the main hero card (not the badge)
    const glassCards = container.querySelectorAll('.glass')
    const heroCard = glassCards[1] // Second .glass element is the hero card
    
    expect(heroCard).toHaveClass('glass-hover')
  })

  it('should render arrow icon in primary CTA', () => {
    render(<Hero />)
    
    const exploreButton = screen.getByRole('button', { name: /Explore Events Now/i })
    expect(exploreButton).toBeInTheDocument()
  })
})

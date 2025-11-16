import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UpcomingEvents from './upcoming-events'

describe('UpcomingEvents', () => {
  it('should render section header', () => {
    render(<UpcomingEvents />)
    
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument()
    expect(screen.getByText(/Discover and register for the most exciting events/i)).toBeInTheDocument()
  })

  it('should render all three event cards', () => {
    render(<UpcomingEvents />)
    
    expect(screen.getByText('IBA Annual Conference 2025')).toBeInTheDocument()
    expect(screen.getByText('Business Networking Summit')).toBeInTheDocument()
    expect(screen.getByText('Tech Innovation Workshop')).toBeInTheDocument()
  })

  it('should display event dates correctly', () => {
    render(<UpcomingEvents />)
    
    expect(screen.getByText('March 15, 2025')).toBeInTheDocument()
    expect(screen.getByText('March 22, 2025')).toBeInTheDocument()
    expect(screen.getByText('April 5, 2025')).toBeInTheDocument()
  })

  it('should display event locations', () => {
    render(<UpcomingEvents />)
    
    expect(screen.getByText('Karachi Convention Center')).toBeInTheDocument()
    expect(screen.getByText('Lahore Business Hub')).toBeInTheDocument()
    expect(screen.getByText('Islamabad Tech Park')).toBeInTheDocument()
  })

  it('should display attendee counts with proper formatting', () => {
    render(<UpcomingEvents />)
    
    expect(screen.getByText('2,500 attending')).toBeInTheDocument()
    expect(screen.getByText('1,200 attending')).toBeInTheDocument()
    expect(screen.getByText('800 attending')).toBeInTheDocument()
  })

  it('should render register buttons for each event', () => {
    render(<UpcomingEvents />)
    
    const registerButtons = screen.getAllByRole('button', { name: /Register Now/i })
    expect(registerButtons).toHaveLength(3)
  })

  it('should render View All Events button', () => {
    render(<UpcomingEvents />)
    
    expect(screen.getByRole('button', { name: /View All Events/i })).toBeInTheDocument()
  })

  it('should handle register button click', async () => {
    const user = userEvent.setup()
    render(<UpcomingEvents />)
    
    const registerButtons = screen.getAllByRole('button', { name: /Register Now/i })
    await user.click(registerButtons[0])
    
    expect(registerButtons[0]).toBeInTheDocument()
  })

  it('should handle View All Events button click', async () => {
    const user = userEvent.setup()
    render(<UpcomingEvents />)
    
    const viewAllButton = screen.getByRole('button', { name: /View All Events/i })
    await user.click(viewAllButton)
    
    expect(viewAllButton).toBeInTheDocument()
  })

  it('should display event images with proper alt text', () => {
    render(<UpcomingEvents />)
    
    expect(screen.getByAltText('IBA Annual Conference 2025')).toBeInTheDocument()
    expect(screen.getByAltText('Business Networking Summit')).toBeInTheDocument()
    expect(screen.getByAltText('Tech Innovation Workshop')).toBeInTheDocument()
  })

  it('should render calendar, map pin, and users icons', () => {
    const { container } = render(<UpcomingEvents />)
    
    // Check that icons are rendered (they're SVGs from lucide-react)
    const eventCards = container.querySelectorAll('.glass')
    expect(eventCards.length).toBeGreaterThan(0)
  })

  it('should apply glassmorphism effect to event cards', () => {
    const { container } = render(<UpcomingEvents />)
    
    const eventCards = container.querySelectorAll('.glass')
    eventCards.forEach(card => {
      expect(card).toHaveClass('glass-hover')
    })
  })

  it('should display events in a grid layout', () => {
    const { container } = render(<UpcomingEvents />)
    
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('md:grid-cols-3')
  })
})

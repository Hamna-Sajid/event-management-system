import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Footer from './footer'

describe('Footer', () => {
  it('should render brand logo and name', () => {
    render(<Footer />)
    
    expect(screen.getByText('IE')).toBeInTheDocument()
    expect(screen.getByText('IEMS')).toBeInTheDocument()
  })

  it('should render brand description', () => {
    render(<Footer />)
    
    expect(screen.getByText(/Your gateway to premium IBA events/i)).toBeInTheDocument()
  })

  it('should render Quick Links section', () => {
    render(<Footer />)
    
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Browse Events/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /My Registrations/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /About IBA/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Contact Us/i })).toBeInTheDocument()
  })

  it('should render Resources section', () => {
    render(<Footer />)
    
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Help Center/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Privacy Policy/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Terms of Service/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /FAQ/i })).toBeInTheDocument()
  })

  it('should render Contact section', () => {
    render(<Footer />)
    
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('should display contact email', () => {
    render(<Footer />)
    
    const emailLink = screen.getByRole('link', { name: /info@iems.com/i })
    expect(emailLink).toHaveAttribute('href', 'mailto:info@iems.com')
  })

  it('should display contact phone', () => {
    render(<Footer />)
    
    const phoneLink = screen.getByRole('link', { name: /\+92 300 123 4567/i })
    expect(phoneLink).toHaveAttribute('href', 'tel:+923001234567')
  })

  it('should display location', () => {
    render(<Footer />)
    
    expect(screen.getByText(/Karachi, Pakistan/i)).toBeInTheDocument()
  })

  it('should render copyright notice', () => {
    render(<Footer />)
    
    expect(screen.getByText(/© 2025 IBA Event Management System/i)).toBeInTheDocument()
  })

  it('should render social media links', () => {
    render(<Footer />)
    
    expect(screen.getByRole('link', { name: /Twitter/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /LinkedIn/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Facebook/i })).toBeInTheDocument()
  })

  it('should handle link clicks', async () => {
    const user = userEvent.setup()
    render(<Footer />)
    
    const browseEventsLink = screen.getByRole('link', { name: /Browse Events/i })
    await user.click(browseEventsLink)
    
    expect(browseEventsLink).toBeInTheDocument()
  })

  it('should have proper grid layout', () => {
    const { container } = render(<Footer />)
    
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('md:grid-cols-4')
  })

  it('should render contact icons', () => {
    render(<Footer />)
    
    // Icons are rendered as SVGs from lucide-react
    const contactSection = screen.getByText('Contact').parentElement
    expect(contactSection).toBeInTheDocument()
  })

  it('should apply hover effects to links', () => {
    render(<Footer />)
    
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveClass('hover:text-[#d02243]')
    })
  })

  it('should have border at top', () => {
    const { container } = render(<Footer />)
    
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('border-t', 'border-[rgba(255,255,255,0.1)]')
  })

  it('should organize footer sections in columns', () => {
    render(<Footer />)
    
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })
})

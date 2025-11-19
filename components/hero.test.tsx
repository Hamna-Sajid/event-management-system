import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import Hero from './hero'
import * as stats from '@/lib/stats'

// Mock the stats functions
jest.mock('@/lib/stats', () => ({
  getTotalEvents: jest.fn(),
  getTotalSocieties: jest.fn(),
  getTotalUsers: jest.fn(),
}))

describe('Hero', () => {
  beforeEach(() => {
    // Setup default mock values
    ;(stats.getTotalEvents as jest.Mock).mockResolvedValue(50)
    ;(stats.getTotalSocieties as jest.Mock).mockResolvedValue(25)
    ;(stats.getTotalUsers as jest.Mock).mockResolvedValue(1000)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render as section element', async () => {
    const { container } = render(<Hero />)
    
    // Wait for async state updates to complete
    await waitFor(() => {
      expect(stats.getTotalEvents).toHaveBeenCalled()
    })
    
    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
  })

  it('should render main heading', async () => {
    render(<Hero />)
    
    // Wait for async state updates to complete
    await waitFor(() => {
      expect(stats.getTotalEvents).toHaveBeenCalled()
    })
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toBeTruthy()
  })

  it('should render badge element', async () => {
    render(<Hero />)
    
    // Wait for async state updates to complete
    await waitFor(() => {
      expect(stats.getTotalEvents).toHaveBeenCalled()
    })
    
    // Badge should be a span with text content
    const spans = screen.getAllByText((content, element) => {
      return element?.tagName.toLowerCase() === 'span' && content.length > 0
    })
    expect(spans.length).toBeGreaterThan(0)
  })

  it('should render description paragraph', async () => {
    render(<Hero />)
    
    // Wait for async state updates to complete
    await waitFor(() => {
      expect(stats.getTotalEvents).toHaveBeenCalled()
    })
    
    const paragraphs = screen.getAllByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p'
    })
    expect(paragraphs.length).toBeGreaterThan(0)
  })

  it('should display statistics section', async () => {
    render(<Hero />)
    
    // Wait for all state updates to complete
    await waitFor(async () => {
      expect(await screen.findByText('50')).toBeInTheDocument()
      expect(await screen.findByText('25')).toBeInTheDocument()
      expect(await screen.findByText('1000')).toBeInTheDocument()
    })
  })

  it('should render primary call-to-action button', async () => {
    render(<Hero />)
    
    // Wait for async state updates to complete
    await waitFor(() => {
      expect(stats.getTotalEvents).toHaveBeenCalled()
    })
    
    const buttons = screen.getAllByRole('button')
    // Should have at least 2 buttons (Join Waitlist and Already have account)
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('should have link to signup page', async () => {
    const { container } = render(<Hero />)
    
    // Wait for async state updates to complete
    await waitFor(() => {
      expect(stats.getTotalEvents).toHaveBeenCalled()
    })
    
    const signupLinks = container.querySelectorAll('a[href="/signup"]')
    expect(signupLinks.length).toBeGreaterThan(0)
  })

  it('should have link to signin page', async () => {
    const { container } = render(<Hero />)
    
    // Wait for async state updates to complete
    await waitFor(() => {
      expect(stats.getTotalEvents).toHaveBeenCalled()
    })
    
    const signinLink = container.querySelector('a[href="/signin"]')
    expect(signinLink).toBeInTheDocument()
  })

  it('should render all buttons as enabled', async () => {
    render(<Hero />)
    
    // Wait for async state updates to complete
    await waitFor(() => {
      expect(stats.getTotalEvents).toHaveBeenCalled()
    })
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeEnabled()
    })
  })

  it('should have proper semantic heading hierarchy', async () => {
    render(<Hero />)
    
    // Wait for async state updates to complete
    await waitFor(() => {
      expect(stats.getTotalEvents).toHaveBeenCalled()
    })
    
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeInTheDocument()
  })

  it('should render promotional content section', async () => {
    render(<Hero />)
    
    // Wait for async state updates to complete
    await waitFor(() => {
      expect(stats.getTotalEvents).toHaveBeenCalled()
    })
    
    // Hero card should contain paragraphs
    const paragraphs = screen.getAllByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && content.length > 10
    })
    expect(paragraphs.length).toBeGreaterThan(0)
  })
})

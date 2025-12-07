import React from 'react'
import { render, screen } from '@testing-library/react'
import EventForm from '@/components/ui/event-form'

// Mock using Jest
jest.mock('@/components/ui/toast', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  showToast: jest.fn(),
}))

describe('EventForm', () => {
  const mockSubmit = jest.fn()
  const mockCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    const { container } = render(
      <EventForm onSubmit={mockSubmit} onCancel={mockCancel} />
    )
    expect(container).toBeInTheDocument()
  })

  it('has form', () => {
    render(<EventForm onSubmit={mockSubmit} onCancel={mockCancel} />)
    
    // Check for any form element
    const forms = document.querySelectorAll('form')
    expect(forms.length).toBeGreaterThan(0)
  })

  it('has buttons', () => {
    render(<EventForm onSubmit={mockSubmit} onCancel={mockCancel} />)
    
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it('submit button is present', () => {
    render(<EventForm onSubmit={mockSubmit} onCancel={mockCancel} />)
    
    const buttons = screen.getAllByRole('button')
    const hasSubmit = buttons.some(button => 
      button.textContent?.toLowerCase().includes('create') || 
      button.textContent?.toLowerCase().includes('submit')
    )
    expect(hasSubmit).toBe(true)
  })
})
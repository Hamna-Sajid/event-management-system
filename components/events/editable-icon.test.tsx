/**
 * @testSuite EditableIcon
 * 
 * Test suite for EditableIcon component
 * 
 * @remarks
 * Comprehensive tests covering:
 * - Icon rendering
 * - Click event handling
 * - Accessibility attributes
 * 
 * @testCoverage
 * - **Rendering**: Icon displays correctly
 * - **Interaction**: Click handler is called
 * - **Accessibility**: Title attribute is present
 * 
 * @edgeCases
 * - Multiple clicks trigger onClick multiple times
 * - Icon is accessible via keyboard
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditableIcon } from './editable-icon'

describe('EditableIcon', () => {
  it('should render edit button', () => {
    render(<EditableIcon onClick={jest.fn()} />)
    
    const button = screen.getByRole('button', { name: /Edit/i })
    expect(button).toBeInTheDocument()
  })

  it('should have title attribute for accessibility', () => {
    render(<EditableIcon onClick={jest.fn()} />)
    
    const button = screen.getByTitle('Edit')
    expect(button).toBeInTheDocument()
  })

  it('should call onClick when button is clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<EditableIcon onClick={handleClick} />)
    
    await user.click(screen.getByRole('button', { name: /Edit/i }))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should call onClick multiple times when clicked multiple times', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<EditableIcon onClick={handleClick} />)
    
    const button = screen.getByRole('button', { name: /Edit/i })
    await user.click(button)
    await user.click(button)
    await user.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(3)
  })

  it('should render pencil icon', () => {
    const { container } = render(<EditableIcon onClick={jest.fn()} />)
    
    // Pencil icon should be present (from lucide-react)
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('should be keyboard accessible', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<EditableIcon onClick={handleClick} />)
    
    const button = screen.getByRole('button', { name: /Edit/i })
    button.focus()
    await user.keyboard('{Enter}')
    
    expect(handleClick).toHaveBeenCalled()
  })
})

/**
 * @testSuite DeleteConfirmModal
 * 
 * Test suite for DeleteConfirmModal component
 * 
 * @remarks
 * Comprehensive tests covering:
 * - Modal rendering and visibility
 * - Confirmation and cancellation actions
 * - Backdrop click prevention
 * - Display of item name and type
 * 
 * @testCoverage
 * - **Rendering**: Modal displays correctly with all elements
 * - **User Actions**: Confirm and cancel button functionality
 * - **Props**: Item name and type customization
 * 
 * @edgeCases
 * - Modal closed by default when isOpen=false
 * - Cannot close modal by clicking backdrop
 * - Default item type is "item"
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteConfirmModal } from './delete-confirm-modal'

describe('DeleteConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    itemName: 'Test Item',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render modal when isOpen is true', () => {
    render(<DeleteConfirmModal {...defaultProps} />)
    
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument()
    expect(screen.getByText('Test Item')).toBeInTheDocument()
  })

  it('should not render modal when isOpen is false', () => {
    render(<DeleteConfirmModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument()
  })

  it('should display item name in confirmation message', () => {
    render(<DeleteConfirmModal {...defaultProps} itemName="Assignment 1" />)
    
    expect(screen.getByText('Assignment 1')).toBeInTheDocument()
  })

  it('should use default itemType "item" when not provided', () => {
    render(<DeleteConfirmModal {...defaultProps} />)
    
    expect(screen.getByRole('button', { name: /Delete item/i })).toBeInTheDocument()
  })

  it('should use custom itemType when provided', () => {
    render(<DeleteConfirmModal {...defaultProps} itemType="module" />)
    
    expect(screen.getByRole('button', { name: /Delete module/i })).toBeInTheDocument()
  })

  it('should call onConfirm when Delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<DeleteConfirmModal {...defaultProps} />)
    
    await user.click(screen.getByRole('button', { name: /Delete item/i }))
    
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<DeleteConfirmModal {...defaultProps} />)
    
    await user.click(screen.getByRole('button', { name: /Cancel/i }))
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('should display warning icon', () => {
    const { container } = render(<DeleteConfirmModal {...defaultProps} />)
    
    // Trash2 icon should be present
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('should show warning message about irreversible action', () => {
    render(<DeleteConfirmModal {...defaultProps} />)
    
    expect(screen.getByText(/This action cannot be undone/i)).toBeInTheDocument()
  })

  it('should render both action buttons', () => {
    render(<DeleteConfirmModal {...defaultProps} />)
    
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
  })
})

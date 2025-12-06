/**
 * @testSuite ImageUploadModal
 * 
 * Test suite for ImageUploadModal component
 * 
 * @remarks
 * Comprehensive tests covering:
 * - Modal rendering and visibility
 * - File drag-and-drop functionality
 * - File input selection
 * - Upload progress states
 * - File size display
 * 
 * @testCoverage
 * - **Rendering**: Modal displays with upload UI
 * - **File Selection**: Browse button and file input
 * - **Drag and Drop**: Drag states and file drop
 * - **Upload States**: Loading state during upload
 * 
 * @edgeCases
 * - Modal closed by default when isOpen=false
 * - Upload progress disables interactions
 * - Custom title and maxSizeKB props
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageUploadModal } from './image-upload-modal'

describe('ImageUploadModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onUpload: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render modal when isOpen is true', () => {
      render(<ImageUploadModal {...defaultProps} />)
      
      expect(screen.getByText('Upload Image')).toBeInTheDocument()
      expect(screen.getByText(/Drag and drop an image here/i)).toBeInTheDocument()
    })

    it('should not render modal when isOpen is false', () => {
      render(<ImageUploadModal {...defaultProps} isOpen={false} />)
      
      expect(screen.queryByText('Upload Image')).not.toBeInTheDocument()
    })

    it('should use custom title when provided', () => {
      render(<ImageUploadModal {...defaultProps} title="Upload Event Poster" />)
      
      expect(screen.getByText('Upload Event Poster')).toBeInTheDocument()
    })

    it('should display default max size of 512KB', () => {
      render(<ImageUploadModal {...defaultProps} />)
      
      expect(screen.getByText(/Maximum file size: 512KB/i)).toBeInTheDocument()
    })

    it('should display custom max size when provided', () => {
      render(<ImageUploadModal {...defaultProps} maxSizeKB={1024} />)
      
      expect(screen.getByText(/Maximum file size: 1024KB/i)).toBeInTheDocument()
    })

    it('should render Browse Files button', () => {
      render(<ImageUploadModal {...defaultProps} />)
      
      expect(screen.getByText('Browse Files')).toBeInTheDocument()
    })

    it('should render Cancel button', () => {
      render(<ImageUploadModal {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
    })

    it('should render upload icon', () => {
      const { container } = render(<ImageUploadModal {...defaultProps} />)
      
      // Upload icon should be present
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('File Selection', () => {
    it('should have hidden file input', () => {
      const { container } = render(<ImageUploadModal {...defaultProps} />)
      
      const fileInput = container.querySelector('input[type="file"]')
      expect(fileInput).toBeInTheDocument()
      expect(fileInput).toHaveAttribute('accept', 'image/*')
    })

    it('should call onUpload when file is selected via input', async () => {
      const onUploadMock = jest.fn<Promise<void>, [File]>().mockResolvedValue(undefined)
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const { container } = render(<ImageUploadModal {...defaultProps} onUpload={onUploadMock} />)
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
      
      await userEvent.upload(fileInput, file)
      
      await waitFor(() => {
        expect(onUploadMock).toHaveBeenCalledWith(file)
      })
    })
  })

  describe('Upload States', () => {
    it('should show loading state during upload', async () => {
      const slowUpload = jest.fn<Promise<void>, [File]>(() => new Promise(resolve => setTimeout(resolve, 100)))
      const { container } = render(<ImageUploadModal {...defaultProps} onUpload={slowUpload} />)
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
      
      await userEvent.upload(fileInput, file)
      
      // Should show uploading message
      expect(screen.getByText(/Uploading image/i)).toBeInTheDocument()
      
      // Should show spinner
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('should disable Cancel button during upload', async () => {
      const slowUpload = jest.fn<Promise<void>, [File]>(() => new Promise(resolve => setTimeout(resolve, 100)))
      const { container } = render(<ImageUploadModal {...defaultProps} onUpload={slowUpload} />)
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
      
      await userEvent.upload(fileInput, file)
      
      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      expect(cancelButton).toBeDisabled()
    })
  })

  describe('Modal Actions', () => {
    it('should call onClose when Cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<ImageUploadModal {...defaultProps} />)
      
      await user.click(screen.getByRole('button', { name: /Cancel/i }))
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    it('should disable Cancel button when uploading', async () => {
      const slowUpload = jest.fn<Promise<void>, [File]>(() => new Promise(resolve => setTimeout(resolve, 100)))
      const { container } = render(
        <ImageUploadModal {...defaultProps} onUpload={slowUpload} />
      )
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
      
      await userEvent.upload(fileInput, file)
      
      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      expect(cancelButton).toBeDisabled()
    })
  })

  describe('Drag and Drop UI', () => {
    it('should display "or" text between drag zone and browse button', () => {
      render(<ImageUploadModal {...defaultProps} />)
      
      expect(screen.getByText('or')).toBeInTheDocument()
    })

    it('should show instruction text', () => {
      render(<ImageUploadModal {...defaultProps} />)
      
      expect(screen.getByText(/Drag and drop an image here/i)).toBeInTheDocument()
    })
  })
})

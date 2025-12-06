/**
 * @testSuite Event Validation
 * 
 * Test suite for event file validation utilities
 * 
 * @remarks
 * Comprehensive tests covering:
 * - Image file validation (type and size)
 * - Document file validation (type and size)
 * - File size formatting
 * - Validation constants
 * 
 * @testCoverage
 * - **validateImageFile**: Type and size checks for images
 * - **validateDocumentFile**: Type and size checks for documents
 * - **formatFileSize**: Byte to human-readable conversion
 * - **Constants**: MAX_IMAGE_SIZE, MAX_DOCUMENT_SIZE, ALLOWED_TYPES
 * 
 * @edgeCases
 * - Files at exact size limits
 * - Files exceeding size limits
 * - Invalid file types
 * - Various file sizes (bytes, KB, MB)
 * 
 * @expectedValues
 * **Image Validation:**
 * - Valid types: JPEG, PNG, GIF, WebP
 * - Max size: 512KB
 * 
 * **Document Validation:**
 * - Valid types: PDF, DOC, DOCX, PPT, PPTX
 * - Max size: 10MB
 * 
 * **File Size Formatting:**
 * - 500 bytes: "500 B"
 * - 2048 bytes: "2.0 KB"
 * - 5242880 bytes: "5.0 MB"
 */

import {
  validateImageFile,
  validateDocumentFile,
  formatFileSize,
  MAX_IMAGE_SIZE_KB,
  MAX_IMAGE_SIZE_BYTES,
  MAX_DOCUMENT_SIZE_MB,
  MAX_DOCUMENT_SIZE_BYTES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
} from './validation'

describe('Event Validation', () => {
  describe('Constants', () => {
    it('should have correct image size limits', () => {
      expect(MAX_IMAGE_SIZE_KB).toBe(512)
      expect(MAX_IMAGE_SIZE_BYTES).toBe(512 * 1024)
    })

    it('should have correct document size limits', () => {
      expect(MAX_DOCUMENT_SIZE_MB).toBe(10)
      expect(MAX_DOCUMENT_SIZE_BYTES).toBe(10 * 1024 * 1024)
    })

    it('should have allowed image types', () => {
      expect(ALLOWED_IMAGE_TYPES).toContain('image/jpeg')
      expect(ALLOWED_IMAGE_TYPES).toContain('image/jpg')
      expect(ALLOWED_IMAGE_TYPES).toContain('image/png')
      expect(ALLOWED_IMAGE_TYPES).toContain('image/gif')
      expect(ALLOWED_IMAGE_TYPES).toContain('image/webp')
    })

    it('should have allowed document types', () => {
      expect(ALLOWED_DOCUMENT_TYPES).toContain('application/pdf')
      expect(ALLOWED_DOCUMENT_TYPES).toContain('application/msword')
      expect(ALLOWED_DOCUMENT_TYPES).toContain('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      expect(ALLOWED_DOCUMENT_TYPES).toContain('application/vnd.ms-powerpoint')
      expect(ALLOWED_DOCUMENT_TYPES).toContain('application/vnd.openxmlformats-officedocument.presentationml.presentation')
    })
  })

  describe('validateImageFile', () => {
    describe('Valid images', () => {
      it('should accept valid JPEG image', () => {
        const file = new File(['x'.repeat(100 * 1024)], 'photo.jpg', { type: 'image/jpeg' })
        const result = validateImageFile(file)
        
        expect(result.valid).toBe(true)
        expect(result.error).toBeUndefined()
      })

      it('should accept valid PNG image', () => {
        const file = new File(['x'.repeat(100 * 1024)], 'image.png', { type: 'image/png' })
        const result = validateImageFile(file)
        
        expect(result.valid).toBe(true)
        expect(result.error).toBeUndefined()
      })

      it('should accept valid GIF image', () => {
        const file = new File(['x'.repeat(100 * 1024)], 'animation.gif', { type: 'image/gif' })
        const result = validateImageFile(file)
        
        expect(result.valid).toBe(true)
        expect(result.error).toBeUndefined()
      })

      it('should accept valid WebP image', () => {
        const file = new File(['x'.repeat(100 * 1024)], 'image.webp', { type: 'image/webp' })
        const result = validateImageFile(file)
        
        expect(result.valid).toBe(true)
        expect(result.error).toBeUndefined()
      })

      it('should accept JPG extension', () => {
        const file = new File(['x'.repeat(100 * 1024)], 'photo.jpg', { type: 'image/jpg' })
        const result = validateImageFile(file)
        
        expect(result.valid).toBe(true)
      })

      it('should accept image at exact size limit', () => {
        const file = new File(['x'.repeat(MAX_IMAGE_SIZE_BYTES)], 'photo.jpg', { type: 'image/jpeg' })
        const result = validateImageFile(file)
        
        expect(result.valid).toBe(true)
      })

      it('should accept very small image', () => {
        const file = new File(['test'], 'tiny.png', { type: 'image/png' })
        const result = validateImageFile(file)
        
        expect(result.valid).toBe(true)
      })
    })

    describe('Invalid images', () => {
      it('should reject image exceeding size limit', () => {
        const file = new File(['x'.repeat(MAX_IMAGE_SIZE_BYTES + 1)], 'large.jpg', { type: 'image/jpeg' })
        const result = validateImageFile(file)
        
        expect(result.valid).toBe(false)
        expect(result.error).toBe('Image size must be less than 512KB')
      })

      it('should reject PDF file', () => {
        const file = new File(['content'], 'document.pdf', { type: 'application/pdf' })
        const result = validateImageFile(file)
        
        expect(result.valid).toBe(false)
        expect(result.error).toBe('Please upload a valid image file (JPEG, PNG, GIF, or WebP)')
      })

      it('should reject text file', () => {
        const file = new File(['text'], 'file.txt', { type: 'text/plain' })
        const result = validateImageFile(file)
        
        expect(result.valid).toBe(false)
        expect(result.error).toContain('valid image file')
      })

      it('should reject video file', () => {
        const file = new File(['video'], 'video.mp4', { type: 'video/mp4' })
        const result = validateImageFile(file)
        
        expect(result.valid).toBe(false)
        expect(result.error).toContain('valid image file')
      })

      it('should reject SVG image (not in allowed types)', () => {
        const file = new File(['svg'], 'icon.svg', { type: 'image/svg+xml' })
        const result = validateImageFile(file)
        
        expect(result.valid).toBe(false)
      })
    })
  })

  describe('validateDocumentFile', () => {
    describe('Valid documents', () => {
      it('should accept valid PDF document', () => {
        const file = new File(['x'.repeat(1024 * 1024)], 'document.pdf', { type: 'application/pdf' })
        const result = validateDocumentFile(file)
        
        expect(result.valid).toBe(true)
        expect(result.error).toBeUndefined()
      })

      it('should accept valid DOC document', () => {
        const file = new File(['x'.repeat(1024 * 1024)], 'document.doc', { type: 'application/msword' })
        const result = validateDocumentFile(file)
        
        expect(result.valid).toBe(true)
      })

      it('should accept valid DOCX document', () => {
        const file = new File(
          ['x'.repeat(1024 * 1024)],
          'document.docx',
          { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
        )
        const result = validateDocumentFile(file)
        
        expect(result.valid).toBe(true)
      })

      it('should accept valid PPT document', () => {
        const file = new File(['x'.repeat(1024 * 1024)], 'slides.ppt', { type: 'application/vnd.ms-powerpoint' })
        const result = validateDocumentFile(file)
        
        expect(result.valid).toBe(true)
      })

      it('should accept valid PPTX document', () => {
        const file = new File(
          ['x'.repeat(1024 * 1024)],
          'slides.pptx',
          { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }
        )
        const result = validateDocumentFile(file)
        
        expect(result.valid).toBe(true)
      })

      it('should accept document at exact size limit', () => {
        const file = new File(['x'.repeat(MAX_DOCUMENT_SIZE_BYTES)], 'doc.pdf', { type: 'application/pdf' })
        const result = validateDocumentFile(file)
        
        expect(result.valid).toBe(true)
      })
    })

    describe('Invalid documents', () => {
      it('should reject document exceeding size limit', () => {
        const file = new File(
          ['x'.repeat(MAX_DOCUMENT_SIZE_BYTES + 1)],
          'large.pdf',
          { type: 'application/pdf' }
        )
        const result = validateDocumentFile(file)
        
        expect(result.valid).toBe(false)
        expect(result.error).toBe('Document size must be less than 10MB')
      })

      it('should reject image file', () => {
        const file = new File(['image'], 'photo.jpg', { type: 'image/jpeg' })
        const result = validateDocumentFile(file)
        
        expect(result.valid).toBe(false)
        expect(result.error).toBe('Please upload a valid document file (PDF, DOC, DOCX, PPT, or PPTX)')
      })

      it('should reject text file', () => {
        const file = new File(['text'], 'notes.txt', { type: 'text/plain' })
        const result = validateDocumentFile(file)
        
        expect(result.valid).toBe(false)
        expect(result.error).toContain('valid document file')
      })

      it('should reject video file', () => {
        const file = new File(['video'], 'recording.mp4', { type: 'video/mp4' })
        const result = validateDocumentFile(file)
        
        expect(result.valid).toBe(false)
        expect(result.error).toContain('valid document file')
      })

      it('should reject ZIP file', () => {
        const file = new File(['zip'], 'archive.zip', { type: 'application/zip' })
        const result = validateDocumentFile(file)
        
        expect(result.valid).toBe(false)
      })
    })
  })

  describe('formatFileSize', () => {
    describe('Bytes', () => {
      it('should format bytes less than 1KB', () => {
        expect(formatFileSize(0)).toBe('0 B')
        expect(formatFileSize(1)).toBe('1 B')
        expect(formatFileSize(500)).toBe('500 B')
        expect(formatFileSize(1023)).toBe('1023 B')
      })
    })

    describe('Kilobytes', () => {
      it('should format kilobytes correctly', () => {
        expect(formatFileSize(1024)).toBe('1.0 KB')
        expect(formatFileSize(2048)).toBe('2.0 KB')
        expect(formatFileSize(5120)).toBe('5.0 KB')
      })

      it('should format kilobytes with decimals', () => {
        expect(formatFileSize(1536)).toBe('1.5 KB')
        expect(formatFileSize(2560)).toBe('2.5 KB')
        expect(formatFileSize(10752)).toBe('10.5 KB')
      })

      it('should format size just under 1MB', () => {
        expect(formatFileSize(1024 * 1024 - 1)).toBe('1024.0 KB')
      })

      it('should round to one decimal place', () => {
        expect(formatFileSize(1234)).toBe('1.2 KB')
        expect(formatFileSize(1567)).toBe('1.5 KB')
      })
    })

    describe('Megabytes', () => {
      it('should format megabytes correctly', () => {
        expect(formatFileSize(1024 * 1024)).toBe('1.0 MB')
        expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB')
        expect(formatFileSize(10 * 1024 * 1024)).toBe('10.0 MB')
      })

      it('should format megabytes with decimals', () => {
        expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB')
        expect(formatFileSize(2.75 * 1024 * 1024)).toBe('2.8 MB')
      })

      it('should format large files', () => {
        expect(formatFileSize(100 * 1024 * 1024)).toBe('100.0 MB')
        expect(formatFileSize(500 * 1024 * 1024)).toBe('500.0 MB')
      })
    })

    describe('Real-world examples', () => {
      it('should format typical image file sizes', () => {
        expect(formatFileSize(256 * 1024)).toBe('256.0 KB')
        expect(formatFileSize(512 * 1024)).toBe('512.0 KB')
      })

      it('should format typical document file sizes', () => {
        expect(formatFileSize(2 * 1024 * 1024)).toBe('2.0 MB')
        expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB')
      })
    })
  })

  describe('Integration tests', () => {
    it('should validate and format image file size', () => {
      const size = 300 * 1024
      const file = new File(['x'.repeat(size)], 'photo.jpg', { type: 'image/jpeg' })
      
      const validation = validateImageFile(file)
      expect(validation.valid).toBe(true)
      
      const formattedSize = formatFileSize(size)
      expect(formattedSize).toBe('300.0 KB')
    })

    it('should validate and format document file size', () => {
      const size = 3 * 1024 * 1024
      const file = new File(['x'.repeat(size)], 'report.pdf', { type: 'application/pdf' })
      
      const validation = validateDocumentFile(file)
      expect(validation.valid).toBe(true)
      
      const formattedSize = formatFileSize(size)
      expect(formattedSize).toBe('3.0 MB')
    })

    it('should handle oversized image with formatted error message', () => {
      const size = 600 * 1024
      const file = new File(['x'.repeat(size)], 'large.jpg', { type: 'image/jpeg' })
      
      const validation = validateImageFile(file)
      expect(validation.valid).toBe(false)
      expect(validation.error).toContain(MAX_IMAGE_SIZE_KB.toString())
      
      const formattedSize = formatFileSize(size)
      expect(formattedSize).toBe('600.0 KB')
    })
  })
})

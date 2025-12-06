/**
 * @library Event Validation
 * 
 * File validation utilities for event-related uploads
 * 
 * @remarks
 * This library provides validation functions for:
 * - Image file uploads (size and type validation)
 * - Document file uploads (size and type validation)
 * - File size formatting for display
 * 
 * Includes predefined constants for:
 * - Maximum file sizes (images: 512KB, documents: 10MB)
 * - Allowed file types (images: JPEG, PNG, GIF, WebP)
 * - Allowed document types (PDF, DOC, DOCX, PPT, PPTX)
 */

/** Maximum image file size in kilobytes */
export const MAX_IMAGE_SIZE_KB = 512
/** Maximum image file size in bytes */
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024

/** Maximum document file size in megabytes */
export const MAX_DOCUMENT_SIZE_MB = 10
/** Maximum document file size in bytes */
export const MAX_DOCUMENT_SIZE_BYTES = MAX_DOCUMENT_SIZE_MB * 1024 * 1024

/** Allowed image MIME types for upload */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
/** Allowed document MIME types for upload */
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
]

/**
 * @function validateImageFile
 * 
 * Validates an image file for type and size constraints
 * 
 * @param file - The File object to validate
 * @returns Object with validation result and optional error message
 * 
 * @remarks
 * Validation checks:
 * 1. File type must be in ALLOWED_IMAGE_TYPES (JPEG, PNG, GIF, WebP)
 * 2. File size must not exceed MAX_IMAGE_SIZE_KB (512KB)
 * 
 * Returns an object with:
 * - `valid`: boolean indicating if file passed validation
 * - `error`: string with user-friendly error message (only if invalid)
 * 
 * @example
 * Valid image:
 * ```ts
 * const file = new File(['...'], 'photo.jpg', { type: 'image/jpeg' })
 * const result = validateImageFile(file)
 * // result: { valid: true }
 * ```
 * 
 * @example
 * Invalid type:
 * ```ts
 * const file = new File(['...'], 'doc.pdf', { type: 'application/pdf' })
 * const result = validateImageFile(file)
 * // result: { 
 * //   valid: false, 
 * //   error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)'
 * // }
 * ```
 * 
 * @example
 * File too large:
 * ```ts
 * const largeFile = new File([new ArrayBuffer(600 * 1024)], 'large.jpg', { type: 'image/jpeg' })
 * const result = validateImageFile(largeFile)
 * // result: { valid: false, error: 'Image size must be less than 512KB' }
 * ```
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)'
    }
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image size must be less than ${MAX_IMAGE_SIZE_KB}KB`
    }
  }

  return { valid: true }
}

/**
 * @function validateDocumentFile
 * 
 * Validates a document file for type and size constraints
 * 
 * @param file - The File object to validate
 * @returns Object with validation result and optional error message
 * 
 * @remarks
 * Validation checks:
 * 1. File type must be in ALLOWED_DOCUMENT_TYPES (PDF, DOC, DOCX, PPT, PPTX)
 * 2. File size must not exceed MAX_DOCUMENT_SIZE_MB (10MB)
 * 
 * Returns an object with:
 * - `valid`: boolean indicating if file passed validation
 * - `error`: string with user-friendly error message (only if invalid)
 * 
 * @example
 * Valid document:
 * ```ts
 * const file = new File(['...'], 'report.pdf', { type: 'application/pdf' })
 * const result = validateDocumentFile(file)
 * // result: { valid: true }
 * ```
 * 
 * @example
 * Invalid type:
 * ```ts
 * const file = new File(['...'], 'image.jpg', { type: 'image/jpeg' })
 * const result = validateDocumentFile(file)
 * // result: { 
 * //   valid: false,
 * //   error: 'Please upload a valid document file (PDF, DOC, DOCX, PPT, or PPTX)'
 * // }
 * ```
 * 
 * @example
 * File too large:
 * ```ts
 * const largeFile = new File([new ArrayBuffer(15 * 1024 * 1024)], 'huge.pdf', { type: 'application/pdf' })
 * const result = validateDocumentFile(largeFile)
 * // result: { valid: false, error: 'Document size must be less than 10MB' }
 * ```
 */
export function validateDocumentFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid document file (PDF, DOC, DOCX, PPT, or PPTX)'
    }
  }

  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return {
      valid: false,
      error: `Document size must be less than ${MAX_DOCUMENT_SIZE_MB}MB`
    }
  }

  return { valid: true }
}

/**
 * @function formatFileSize
 * 
 * Converts file size in bytes to human-readable format
 * 
 * @param bytes - File size in bytes
 * @returns Formatted string with appropriate unit (B, KB, or MB)
 * 
 * @remarks
 * Formatting rules:
 * - Less than 1024 bytes: Shows as "X B"
 * - Less than 1MB: Shows as "X.X KB"
 * - 1MB or greater: Shows as "X.X MB"
 * 
 * Values are rounded to 1 decimal place for KB and MB.
 * 
 * @example
 * Bytes:
 * ```ts
 * formatFileSize(500)
 * // Returns: "500 B"
 * ```
 * 
 * @example
 * Kilobytes:
 * ```ts
 * formatFileSize(2048)
 * // Returns: "2.0 KB"
 * 
 * formatFileSize(512000)
 * // Returns: "500.0 KB"
 * ```
 * 
 * @example
 * Megabytes:
 * ```ts
 * formatFileSize(5242880)
 * // Returns: "5.0 MB"
 * 
 * formatFileSize(10485760)
 * // Returns: "10.0 MB"
 * ```
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

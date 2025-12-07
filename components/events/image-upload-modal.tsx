/**
 * @component ImageUploadModal
 * 
 * Modal dialog for uploading images with drag-and-drop support
 * 
 * @remarks
 * This component provides a user-friendly image upload interface:
 * - Drag-and-drop functionality for easy file selection
 * - Traditional file browser option
 * - Visual feedback during upload (loading spinner)
 * - Drag state indication with color changes
 * - File size limit display and enforcement
 * 
 * Features:
 * - Drag-over visual feedback (red border and background)
 * - Async upload handling with loading state
 * - Accept only image file types
 * - Configurable title and max file size
 * - Small modal size optimized for upload UI
 * 
 * @example
 * Basic usage:
 * ```tsx
 * const [showUpload, setShowUpload] = useState(false)
 * 
 * const handleUpload = async (file: File) => {
 *   const validation = validateImageFile(file)
 *   if (!validation.valid) {
 *     showToast(validation.error!, 'error')
 *     return
 *   }
 *   // Upload logic here
 *   await uploadToFirebase(file)
 *   setShowUpload(false)
 * }
 * 
 * <ImageUploadModal
 *   isOpen={showUpload}
 *   onClose={() => setShowUpload(false)}
 *   onUpload={handleUpload}
 * />
 * ```
 * 
 * @example
 * With custom settings:
 * ```tsx
 * <ImageUploadModal
 *   isOpen={uploadModalOpen}
 *   onClose={closeUploadModal}
 *   onUpload={handleImageUpload}
 *   title="Upload Event Poster"
 *   maxSizeKB={1024}
 * />
 * ```
 */

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"

/**
 * Props for the ImageUploadModal component.
 */
interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File) => Promise<void>
  title?: string
  maxSizeKB?: number
}

/**
 * Modal dialog for uploading images with drag-and-drop support
 * 
 * @remarks
 * This component provides a user-friendly image upload interface:
 * - Drag-and-drop functionality for easy file selection
 * - Traditional file browser option
 * - Visual feedback during upload (loading spinner)
 * - Drag state indication with color changes
 * - File size limit display and enforcement
 * 
 * Features:
 * - Drag-over visual feedback (red border and background)
 * - Async upload handling with loading state
 * - Accept only image file types
 * - Configurable title and max file size
 * - Small modal size optimized for upload UI
 * 
 * @example
 * Basic usage:
 * ```tsx
 * const [showUpload, setShowUpload] = useState(false)
 * 
 * const handleUpload = async (file: File) => {
 *   const validation = validateImageFile(file)
 *   if (!validation.valid) {
 *     showToast(validation.error!, 'error')
 *     return
 *   }
 *   // Upload logic here
 *   await uploadToFirebase(file)
 *   setShowUpload(false)
 * }
 * 
 * <ImageUploadModal
 *   isOpen={showUpload}
 *   onClose={() => setShowUpload(false)}
 *   onUpload={handleUpload}
 * />
 * ```
 * 
 * @example
 * With custom settings:
 * ```tsx
 * <ImageUploadModal
 *   isOpen={uploadModalOpen}
 *   onClose={closeUploadModal}
 *   onUpload={handleImageUpload}
 *   title="Upload Event Poster"
 *   maxSizeKB={1024}
 * />
 * ```
 */
export function ImageUploadModal({ 
  isOpen, 
  onClose, 
  onUpload,
  title = "Upload Image",
  maxSizeKB = 512
}: ImageUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true)
      await onUpload(file)
      setIsUploading(false)
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      await onUpload(file)
      setIsUploading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging
            ? 'border-[#d02243] bg-[rgba(208,34,67,0.1)]'
            : 'border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)]'
        }`}
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d02243] mx-auto mb-4"></div>
            <p className="text-white font-semibold">Uploading image...</p>
          </>
        ) : (
          <>
            <Upload size={48} className="mx-auto mb-4 text-[rgba(255,255,255,0.5)]" />
            <p className="text-white font-semibold mb-2">Drag and drop an image here</p>
            <p className="text-[rgba(255,255,255,0.6)] text-sm mb-4">or</p>
            <label className="inline-block">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                disabled={isUploading}
              />
              <span className="px-6 py-3 bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold rounded-lg cursor-pointer inline-block">
                Browse Files
              </span>
            </label>
            <p className="text-[rgba(255,255,255,0.5)] text-xs mt-4">
              Maximum file size: {maxSizeKB}KB
            </p>
          </>
        )}
      </div>

      <Button
        onClick={onClose}
        variant="outline"
        className="w-full mt-6 border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] bg-transparent"
        disabled={isUploading}
      >
        Cancel
      </Button>
    </Modal>
  )
}

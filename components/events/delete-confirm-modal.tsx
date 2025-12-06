/**
 * @component DeleteConfirmModal
 * 
 * Confirmation dialog for destructive delete operations
 * 
 * @remarks
 * This component displays a modal dialog to confirm deletion of items:
 * - Warning icon with red accent color
 * - Item name and type display
 * - Destructive action confirmation
 * - Cannot be dismissed by clicking backdrop
 * 
 * Design features:
 * - Centered layout with glassmorphism styling
 * - Red color scheme for destructive action warning
 * - Dual-action buttons (delete/cancel)
 * - Prevents accidental clicks outside modal
 * 
 * @example
 * Basic usage:
 * ```tsx
 * <DeleteConfirmModal
 *   isOpen={showDeleteModal}
 *   onClose={() => setShowDeleteModal(false)}
 *   onConfirm={handleDelete}
 *   itemName="Assignment 1"
 *   itemType="module"
 * />
 * ```
 * 
 * @example
 * With custom item type:
 * ```tsx
 * <DeleteConfirmModal
 *   isOpen={deleteModalOpen}
 *   onClose={closeModal}
 *   onConfirm={deleteDocument}
 *   itemName="Resume.pdf"
 *   itemType="document"
 * />
 * ```
 */

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"

/**
 * Props for the DeleteConfirmModal component.
 */
interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
  itemType?: string
}

/**
 * Confirmation dialog for destructive delete operations
 * 
 * @remarks
 * This component displays a modal dialog to confirm deletion of items:
 * - Warning icon with red accent color
 * - Item name and type display
 * - Destructive action confirmation
 * - Cannot be dismissed by clicking backdrop
 * 
 * Design features:
 * - Centered layout with glassmorphism styling
 * - Red color scheme for destructive action warning
 * - Dual-action buttons (delete/cancel)
 * - Prevents accidental clicks outside modal
 * 
 * @example
 * Basic usage:
 * ```tsx
 * <DeleteConfirmModal
 *   isOpen={showDeleteModal}
 *   onClose={() => setShowDeleteModal(false)}
 *   onConfirm={handleDelete}
 *   itemName="Assignment 1"
 *   itemType="module"
 * />
 * ```
 * 
 * @example
 * With custom item type:
 * ```tsx
 * <DeleteConfirmModal
 *   isOpen={deleteModalOpen}
 *   onClose={closeModal}
 *   onConfirm={deleteDocument}
 *   itemName="Resume.pdf"
 *   itemType="document"
 * />
 * ```
 */
export function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName,
  itemType = "item" 
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnBackdrop={false}>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[rgba(208,34,67,0.1)] flex items-center justify-center mx-auto">
          <Trash2 size={32} className="text-[#d02243]" />
        </div>
        <h3 className="text-2xl font-bold text-white">Confirm Delete</h3>
        <p className="text-[rgba(255,255,255,0.8)]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">{itemName}</span>?
          <br />
          This action cannot be undone.
        </p>
        <div className="flex gap-3 pt-4">
          <Button
            onClick={onConfirm}
            className="flex-1 bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold"
          >
            Delete {itemType}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}

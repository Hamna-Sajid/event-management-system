import { ReactNode, MouseEvent } from "react"
import { X } from "lucide-react"

/**
 * Props for the Modal component.
 */
interface ModalProps {
  /** Controls modal visibility */
  isOpen: boolean
  /** Callback function when modal is closed */
  onClose: () => void
  /** Optional title displayed at top of modal with close button */
  title?: string
  /** Content to render inside the modal */
  children: ReactNode
  /** Modal width size preset */
  size?: "sm" | "md" | "lg" | "xl"
  /** If true, clicking backdrop closes modal (default: true) */
  closeOnBackdrop?: boolean
}

/**
 * @component Modal
 * 
 * Flexible modal dialog component with backdrop and size variants
 * 
 * @remarks
 * This component provides a reusable modal dialog:
 * - Centered overlay with backdrop blur
 * - Four size options (sm, md, lg, xl)
 * - Optional title with close button
 * - Backdrop click to close (configurable)
 * - Glassmorphism styling
 * - Scrollable content area
 * 
 * Design features:
 * - Fixed positioning with z-index 50
 * - Dark backdrop with blur effect
 * - Responsive padding and max-height
 * - Prevents clicks inside modal from closing it
 * 
 * @example
 * Simple modal:
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false)
 * 
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirmation"
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </Modal>
 * ```
 * 
 * @example
 * Large modal without backdrop close:
 * ```tsx
 * <Modal
 *   isOpen={showDetails}
 *   onClose={closeDetails}
 *   title="Event Details"
 *   size="lg"
 *   closeOnBackdrop={false}
 * >
 *   <EventDetailsForm />
 * </Modal>
 * ```
 * 
 * @example
 * Modal without title:
 * ```tsx
 * <Modal isOpen={open} onClose={close} size="sm">
 *   <CustomContent />
 * </Modal>
 * ```
 */
export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "md",
  closeOnBackdrop = true 
}: ModalProps) {
  if (!isOpen) return null

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  }

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose()
    }
  }

  const handleContentClick = (e: MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={`glass rounded-2xl p-8 w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
        onClick={handleContentClick}
      >
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <button 
              onClick={onClose} 
              className="text-[rgba(255,255,255,0.6)] hover:text-white transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

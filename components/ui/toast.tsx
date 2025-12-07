'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

/**
 * Toast notification type.
 */
export type ToastType = 'success' | 'error'

/**
 * Internal toast object structure.
 */
interface Toast {
  /** Unique identifier for the toast */
  id: number
  /** Message text to display */
  message: string
  /** Visual style variant */
  type: ToastType
}

let toastId = 0
let addToastCallback: ((message: string, type: ToastType) => void) | null = null

/**
 * @function showToast
 * 
 * Displays a toast notification message to the user
 * 
 * @param message - The text message to display in the toast
 * @param type - The type of toast ('success' or 'error'), defaults to 'success'
 * 
 * @remarks
 * This is the primary API for showing toast notifications throughout the app.
 * Must be used after ToastContainer is mounted in the app layout.
 * 
 * Toast behavior:
 * - Auto-dismisses after 5 seconds
 * - Can be manually dismissed by clicking X button
 * - Multiple toasts stack vertically
 * - Success toasts have green background
 * - Error toasts have red background
 * 
 * @example
 * Success notification:
 * ```tsx
 * showToast('Event created successfully!', 'success')
 * ```
 * 
 * @example
 * Error notification:
 * ```tsx
 * showToast('Failed to save changes', 'error')
 * ```
 * 
 * @example
 * In async operations:
 * ```tsx
 * try {
 *   await saveEvent(eventData)
 *   showToast('Event saved!', 'success')
 * } catch (error) {
 *   showToast('Failed to save event', 'error')
 * }
 * ```
 */
export function showToast(message: string, type: ToastType = 'success') {
  if (addToastCallback) {
    addToastCallback(message, type)
  }
}

/**
 * @component ToastContainer
 * 
 * Container component that renders and manages toast notifications
 * 
 * @remarks
 * This component must be included once in your app layout (typically in root layout.tsx).
 * It manages the lifecycle of toast notifications:
 * - Displays toasts in top-right corner
 * - Auto-dismisses after 5 seconds
 * - Allows manual dismissal via close button
 * - Animates toast entry with slide-in effect
 * - Stacks multiple toasts vertically
 * 
 * Technical details:
 * - Uses module-level callback for global showToast access
 * - Manages toast state internally
 * - Positioned fixed with high z-index (9999)
 * - Responsive max-width for mobile devices
 * 
 * @example
 * Add to root layout:
 * ```tsx
 * // app/layout.tsx
 * import { ToastContainer } from '@/components/ui/toast'
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <ToastContainer />
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    addToastCallback = (message: string, type: ToastType) => {
      const id = toastId++
      setToasts((prev) => [...prev, { id, message, type }])
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, 5000)
    }

    return () => {
      addToastCallback = null
    }
  }, [])

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            animate-slide-in-right
            rounded-lg shadow-lg p-4 pr-12
            flex items-center gap-3
            ${toast.type === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
            }
          `}
        >
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

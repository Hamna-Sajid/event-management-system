'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export type ToastType = 'success' | 'error'

interface Toast {
  id: number
  message: string
  type: ToastType
}

let toastId = 0
let addToastCallback: ((message: string, type: ToastType) => void) | null = null

export function showToast(message: string, type: ToastType = 'success') {
  if (addToastCallback) {
    addToastCallback(message, type)
  }
}

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

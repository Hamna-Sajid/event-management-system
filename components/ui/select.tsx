"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

/**
 * Represents a single option in the select dropdown.
 */
interface SelectOption {
  /** The internal value of the option */
  value: string
  /** Display text shown to the user */
  label: string
  /** If true, option is disabled and cannot be selected */
  disabled?: boolean
}

/**
 * Props for the Select component.
 */
interface SelectProps {
  /** Currently selected value */
  value: string
  /** Callback fired when selection changes */
  onChange: (value: string) => void
  /** Array of options to display in dropdown */
  options: SelectOption[]
  /** Placeholder text when no option is selected */
  placeholder?: string
  /** Additional CSS classes to apply to container */
  className?: string
  /** ID for the select button (for label association) */
  id?: string
}

/**
 * @component Select
 * 
 * Custom dropdown select component with keyboard navigation
 * 
 * @remarks
 * This component provides a styled select dropdown:
 * - Custom design matching app theme (replaces native select)
 * - Click-outside detection to close dropdown
 * - Disabled option support
 * - Animated chevron icon
 * - Hover and focus states
 * - Glassmorphism styling
 * 
 * Features:
 * - Automatically closes when clicking outside
 * - Disabled options are grayed out and non-clickable
 * - Visual feedback for selected option
 * - Dropdown positioning with z-index management
 * 
 * @example
 * Basic usage:
 * ```tsx
 * const [venue, setVenue] = useState('')
 * const venueOptions = [
 *   { value: 'aman', label: 'Aman Tower' },
 *   { value: 'tabba', label: 'Tabba Academic Block' },
 *   { value: 'city', label: 'City Campus' }
 * ]
 * 
 * <Select
 *   value={venue}
 *   onChange={setVenue}
 *   options={venueOptions}
 *   placeholder="Select venue"
 * />
 * ```
 * 
 * @example
 * With disabled options:
 * ```tsx
 * const statusOptions = [
 *   { value: 'draft', label: 'Draft' },
 *   { value: 'published', label: 'Published' },
 *   { value: 'archived', label: 'Archived', disabled: true }
 * ]
 * 
 * <Select
 *   value={status}
 *   onChange={setStatus}
 *   options={statusOptions}
 * />
 * ```
 */
export function Select({ value, onChange, options, placeholder = "Select an option", className = "", id }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value.toLowerCase() === value.toLowerCase())

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:border-ring focus:bg-input/80 flex items-center justify-between hover:bg-input/80 transition-colors"
      >
        <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg backdrop-blur-md">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => !option.disabled && handleSelect(option.value)}
              className={`w-full px-4 py-2 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                option.disabled
                  ? 'text-muted-foreground cursor-not-allowed'
                  : 'text-foreground hover:text-primary hover:bg-accent/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Additional components to handle the Radix UI style API
export function SelectTrigger({ children, className = "" }: any) {
  // This is a placeholder to match the Radix UI pattern
  return <div className={className}>{children}</div>;
}

export function SelectValue({ placeholder = "Select an option" }: any) {
  // This is a placeholder to match the Radix UI pattern
  return <>{placeholder}</>;
}

export function SelectContent({ children, className = "" }: any) {
  // This is a placeholder to match the Radix UI pattern
  return <div className={className}>{children}</div>;
}

export function SelectItem({ children, value, disabled = false }: any) {
  // This is a placeholder to match the Radix UI pattern
  return <div>{children}</div>;
}
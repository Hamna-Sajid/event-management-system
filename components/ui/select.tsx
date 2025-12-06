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
export function Select({ value, onChange, options, placeholder = "Select an option", className = "" }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

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
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white focus:outline-none focus:border-[#d02243] focus:bg-[rgba(255,255,255,0.1)] flex items-center justify-between hover:bg-[rgba(255,255,255,0.1)] transition-colors"
      >
        <span className={selectedOption ? "text-white" : "text-[rgba(255,255,255,0.5)]"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-[rgba(255,255,255,0.6)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#110205] border border-[rgba(255,255,255,0.15)] rounded-lg shadow-lg backdrop-blur-md">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => !option.disabled && handleSelect(option.value)}
              className={`w-full px-4 py-2 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                option.disabled
                  ? 'text-[rgba(255,255,255,0.3)] cursor-not-allowed'
                  : 'text-[rgba(255,255,255,0.8)] hover:text-[#d02243] hover:bg-[rgba(208,34,67,0.1)]'
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
/**
 * Props for the FormInput component.
 * Extends standard HTML input/textarea attributes.
 */
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  /** Optional label displayed above the input field */
  label?: string
  /** Error message displayed below the input in red */
  error?: string
  /** If true, renders a textarea instead of input */
  textarea?: boolean
  /** Number of rows for textarea (only used when textarea=true) */
  rows?: number
}

/**
 * @component FormInput
 * 
 * Reusable form input component with label and error message support
 * 
 * @remarks
 * This component provides a styled input or textarea field:
 * - Supports both single-line input and multi-line textarea
 * - Optional label and error message display
 * - Consistent glassmorphism styling across forms
 * - Focus state with red accent border
 * - All standard HTML input/textarea props supported
 * 
 * Design features:
 * - Semi-transparent background with border
 * - White text with placeholder opacity
 * - Error messages in red theme color
 * - Smooth transitions on focus
 * 
 * @example
 * Text input with label:
 * ```tsx
 * <FormInput
 *   label="Event Title"
 *   value={title}
 *   onChange={e => setTitle(e.target.value)}
 *   placeholder="Enter event title"
 * />
 * ```
 * 
 * @example
 * Textarea with error:
 * ```tsx
 * <FormInput
 *   label="Description"
 *   textarea
 *   rows={6}
 *   value={description}
 *   onChange={e => setDescription(e.target.value)}
 *   error={errors.description}
 * />
 * ```
 * 
 * @example
 * Required input:
 * ```tsx
 * <FormInput
 *   label="Email Address"
 *   type="email"
 *   required
 *   value={email}
 *   onChange={e => setEmail(e.target.value)}
 * />
 * ```
 */
export function FormInput({ 
  label, 
  error, 
  textarea = false, 
  rows = 4,
  className = "",
  ...props 
}: FormInputProps) {
  const baseClasses = "w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-3 text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243] transition-colors"
  
  const Element = textarea ? "textarea" : "input"

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-[rgba(255,255,255,0.8)] block">
          {label}
        </label>
      )}
      <Element
        className={`${baseClasses} ${className}`}
        {...(textarea ? { rows } : {})}
        {...props}
      />
      {error && (
        <p className="text-[#d02243] text-sm">{error}</p>
      )}
    </div>
  )
}

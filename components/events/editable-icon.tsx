/**
 * @component EditableIcon
 * 
 * Small edit button icon for inline editing functionality
 * 
 * @remarks
 * This component displays a pencil icon button for triggering edit mode:
 * - Compact 6x6 circular button
 * - Glassmorphism styling with hover effects
 * - Red accent color matching app theme
 * - Includes accessible title attribute
 * 
 * Commonly used inline next to editable content like event titles,
 * descriptions, or other user-editable fields.
 * 
 * @example
 * Inline with text:
 * ```tsx
 * <h1>
 *   Event Title
 *   <EditableIcon onClick={() => setEditMode(true)} />
 * </h1>
 * ```
 * 
 * @example
 * With state management:
 * ```tsx
 * const [isEditing, setIsEditing] = useState(false)
 * 
 * <div>
 *   {isEditing ? (
 *     <input value={text} onChange={e => setText(e.target.value)} />
 *   ) : (
 *     <>
 *       <span>{text}</span>
 *       <EditableIcon onClick={() => setIsEditing(true)} />
 *     </>
 *   )}
 * </div>
 * ```
 */

import { Pencil } from "lucide-react"

/**
 * Props for the EditableIcon component.
 */
interface EditableIconProps {
  /** Callback function triggered when the edit icon is clicked */
  onClick: () => void
}

/**
 * Small edit button icon for inline editing functionality
 * 
 * @remarks
 * This component displays a pencil icon button for triggering edit mode:
 * - Compact 6x6 circular button
 * - Glassmorphism styling with hover effects
 * - Red accent color matching app theme
 * - Includes accessible title attribute
 * 
 * Commonly used inline next to editable content like event titles,
 * descriptions, or other user-editable fields.
 * 
 * @example
 * Inline with text:
 * ```tsx
 * <h1>
 *   Event Title
 *   <EditableIcon onClick={() => setEditMode(true)} />
 * </h1>
 * ```
 * 
 * @example
 * With state management:
 * ```tsx
 * const [isEditing, setIsEditing] = useState(false)
 * 
 * <div>
 *   {isEditing ? (
 *     <input value={text} onChange={e => setText(e.target.value)} />
 *   ) : (
 *     <>
 *       <span>{text}</span>
 *       <EditableIcon onClick={() => setIsEditing(true)} />
 *     </>
 *   )}
 * </div>
 * ```
 */
export function EditableIcon({ onClick }: EditableIconProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center w-6 h-6 rounded-full glass glass-hover ml-2 cursor-pointer"
      title="Edit"
    >
      <Pencil size={14} className="text-primary" />
    </button>
  )
}

/**
 * @component SocietyHero
 * 
 * Hero section for society pages with themed styling and management controls
 * 
 * @remarks
 * This component displays the society's hero section with:
 * - Animated gradient background based on society theme
 * - Society name with dynamic text styling
 * - Action buttons (Follow, Share, Settings)
 * - Management view toggle for society heads
 * - Responsive layout with glassmorphism effects
 * 
 * Features:
 * - Theme-aware styling with custom CSS variables
 * - Hover and active states for interactive elements
 * - ThemedButton sub-component for consistent button styling
 * - Conditional rendering based on management permissions
 * 
 * @example
 * Basic usage:
 * ```tsx
 * <SocietyHero
 *   societyName="Computing Society"
 *   theme="blue"
 *   societyId="computing-soc-001"
 * />
 * ```
 * 
 * @example
 * Management view:
 * ```tsx
 * <SocietyHero
 *   societyName="Arts Society"
 *   theme="purple"
 *   societyId="arts-soc-001"
 *   isManagementView={true}
 * />
 * ```
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

/**
 * Props for the {@link SocietyHero} component.
 */
interface SocietyHeroProps {
  /** The name of the society. */
  societyName: string;
  /** The theme to apply for styling. */
  theme: string;
  /** Optional flag to enable management controls. */
  isManagementView?: boolean;
  /** The ID of the society, used for navigation or actions. */
  societyId: string;
}

/**
 * @component ThemedButton
 * 
 * A themed button that can function as a link or a standard button, with dynamic hover/active styles.
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - The content to render inside the button.
 * @param {() => void} [props.onClick] - Optional click handler.
 * @param {string} [props.linkHref] - Optional URL. If provided, the button acts as a link.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.CSSProperties} [props.buttonStyle] - Inline styles.
 * @param {"default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"} [props.size] - The button size.
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {string} [props.title] - Tooltip text for the button.
 * @param {string} props.theme - The theme to apply.
 * 
 * @remarks
 * This component's background color changes on hover and active states. It's styled using CSS
 * variables derived from the `theme` prop. It's a local helper component within `SocietyHero`.
 * 
 * @example
 * ```tsx
 * // As a disabled button
 * <ThemedButton theme="default" disabled={true}>Follow</ThemedButton>
 * ```
 */
const ThemedButton = ({ children, onClick, linkHref, className = "", buttonStyle = {}, size, disabled, title, theme }: { children: React.ReactNode, onClick?: () => void, linkHref?: string, className?: string, buttonStyle?: React.CSSProperties, size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg", disabled?: boolean, title?: string, theme: string }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const baseStyle: React.CSSProperties = {
    backgroundColor: `var(--accent-1-${theme})`,
    color: "white",
    ...buttonStyle
  }

  const hoverStyle: React.CSSProperties = {
    backgroundColor: `var(--accent-2-${theme})`,
  }

  const activeStyle: React.CSSProperties = {
    backgroundColor: `var(--accent-1-${theme})`, // Or a darker shade
  }

  const currentStyle = {
    ...baseStyle,
    ...(isHovered && hoverStyle),
    ...(isActive && activeStyle),
  }

  const commonProps = {
    className: `font-semibold flex items-center gap-2 transition-all ${className}`,
    style: currentStyle,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onMouseDown: () => setIsActive(true),
    onMouseUp: () => setIsActive(false),
    onClick: onClick,
    size: size,
    disabled: disabled,
    title: title,
  }

  if (linkHref) {
    return (
      <Link href={linkHref}>
        <Button {...commonProps}>{children}</Button>
      </Link>
    )
  }

  return <Button {...commonProps}>{children}</Button>
}

/**
 * @component SocietyHero
 * 
 * Displays a hero section for a society page, including the society's logo,
 * name, and primary actions.
 * 
 * @remarks
 * This component adapts its content based on the `isManagementView` prop.
 * - In management view, it shows an "Edit Profile" button and a settings icon
 *   that currently navigates to a "coming soon" page.
 * - In the public view, it displays a disabled "Follow Society" button.
 * 
 * The society logo is generated from the first letter of the society's name.
 * 
 * @example
 * ```tsx
 * import SocietyHero from '@/components/society-hero'
 * 
 * export default function SocietyPage() {
 *   return (
 *     <div>
 *       <SocietyHero 
 *         societyName="Tech Club"
 *         theme="default"
 *         isManagementView={true}
 *         societyId="tech-club-123"
 *       />
 *       // ... rest of the page
 *     </div>
 *   )
 * }
 * ```
 */
export default function SocietyHero({ societyName, theme, isManagementView = false }: SocietyHeroProps) {
  const router = useRouter()
  const logo = societyName ? societyName.charAt(0).toUpperCase() : ''

  const handleEditClick = () => {
    router.push('/coming-soon')
  }

  return (
    <div
      className="relative py-12 px-6 border-b"
      style={{
        borderColor: `var(--border-${theme})`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          {/* Society Logo */}
          <div
            className="w-32 h-32 rounded-2xl flex-shrink-0 flex items-center justify-center text-4xl font-bold"
            style={{
              backgroundColor: `var(--glass-${theme})`,
              color: `var(--accent-1-${theme})`,
              backdropFilter: "blur(10px)",
              border: `1px solid var(--border-${theme})`,
            }}
          >
            {logo}
          </div>

          {/* Society Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold" style={{ color: `var(--text-primary-${theme})` }}>
                {societyName}
              </h1>
              {isManagementView && (
                <ThemedButton
                  onClick={handleEditClick}
                  className="p-2 rounded-lg"
                  buttonStyle={{ backgroundColor: `var(--glass-${theme})`, color: `var(--accent-1-${theme})`, border: `1px solid var(--border-${theme})` }}
                  size="icon"
                  title="Edit Society Profile"
                  theme={theme}
                >
                  <Settings size={24} />
                </ThemedButton>
              )}
            </div>
            <p className="mb-6" style={{ color: `var(--text-secondary-${theme})` }}>
              {isManagementView ? "Manage your society and events" : "Join our community and explore amazing events"}
            </p>
            <ThemedButton
              onClick={isManagementView ? handleEditClick : undefined}
              disabled={!isManagementView}
              className="font-semibold"
              theme={theme}
            >
              {isManagementView ? "Edit Profile" : "Follow Society"}
            </ThemedButton>
          </div>
        </div>
      </div>
    </div>
  )
}

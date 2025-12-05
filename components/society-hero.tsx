"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface SocietyHeroProps {
  societyName: string
  theme: string
  isManagementView?: boolean
  societyId: string
}

// Helper component for buttons with dynamic hover/active styles
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
 * @param {object} props
 * @param {string} props.societyName - The name of the society.
 * @param {string} props.theme - The theme to apply to the hero section.
 * @param {boolean} [props.isManagementView] - Optional flag to show management controls.
 * @param {string} props.societyId - The ID of the society.
 * 
 * @remarks
 * This component displays a hero section for a society page with:
 * - Society logo (first letter of the name)
 * - Society name
 * - A brief description that changes based on whether the user is in management view.
 * - A primary action button ("Edit Profile" for management, "Follow Society" for others)
 * - An "Edit Society Profile" button for management view.
 * 
 * @example
 * ```tsx
 * import SocietyHero from '@/components/society-hero'
 * 
 * export default function SocietyPage() {
 *   return (
 *     <div>
 *       <SocietyHero societyName="Test Society" theme="default" isManagementView={true} societyId="123" />
 *       // ... rest of the page
 *     </div>
 *   )
 * }
 * ```
 * 
 * @category Components
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SocietyHero({ societyName, theme, isManagementView = false, societyId }: SocietyHeroProps) {
  const router = useRouter()
  const logo = societyName ? societyName.charAt(0).toUpperCase() : ''

  const handleEditClick = () => {
    router.push('/coming-soon')
  }

  return (
    <div
      className="relative py-12 px-6 border-b"
      style={{
        backgroundColor: `var(--bg-${theme})`,
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

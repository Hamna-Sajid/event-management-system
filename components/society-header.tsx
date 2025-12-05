"use client"

import { Bell, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react" // Import useState

// Helper component for outline buttons with dynamic hover/active styles
const ThemedOutlineButton = ({ children, onClick, linkHref, className = "", buttonStyle = {}, size, theme }: { children: React.ReactNode, onClick?: () => void, linkHref: string, className?: string, buttonStyle?: React.CSSProperties, size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg", theme: string }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const baseStyle: React.CSSProperties = {
    color: `var(--text-primary-${theme})`,
    ...buttonStyle
  }

  const hoverStyle: React.CSSProperties = {
    backgroundColor: `var(--accent-1-${theme})`,
    color: "white",
  }

  const activeStyle: React.CSSProperties = {
    backgroundColor: `var(--accent-2-${theme})`,
    color: "white",
  }

  const currentStyle = {
    ...baseStyle,
    ...(isHovered && hoverStyle),
    ...(isActive && activeStyle),
  }

  const commonProps = {
    className: `transition-all ${className}`,
    style: currentStyle,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onMouseDown: () => setIsActive(true),
    onMouseUp: () => setIsActive(false),
    onClick: onClick,
    size: size,
    variant: "outline" as const, // Ensure variant is outline
  }

  return (
    <Link href={linkHref}>
      <Button {...commonProps}>{children}</Button>
    </Link>
  )
}

interface SocietyHeaderProps {
  theme: string
}

/**
 * @component SocietyHeader
 * 
 * @param {object} props
 * @param {string} props.theme - The theme to apply to the header.
 * 
 * @remarks
 * This component displays a society-specific header with:
 * - Logo and society name
 * - Navigation links (Dashboard, My Profile, Bell, Logout)
 * - Themed buttons with dynamic hover/active styles
 * - Glass morphism styling with backdrop blur
 * 
 * @example
 * ```tsx
 * import SocietyHeader from '@/components/society-header'
 * 
 * export default function SocietyPage() {
 *   return (
 *     <div>
 *       <SocietyHeader theme="default" />
 *       // ... rest of the page
 *     </div>
 *   )
 * }
 * ```
 * 
 * @category Components
 */
export default function SocietyHeader({ theme }: SocietyHeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: `var(--header-bg-${theme})`,
        borderColor: `var(--border-${theme})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center"
            style={{
              backgroundImage: `linear-gradient(to bottom right, var(--accent-1-${theme}), var(--accent-2-${theme}))`,
            }}
          >
            <span className="text-white font-bold text-lg">IE</span>
          </div>
          <span className="font-semibold text-lg hidden sm:inline" style={{ color: `var(--text-primary-${theme})` }}>
            IEMS
          </span>
        </div>

        {/* Right side - Navigation */}
        <div className="flex items-center gap-3">
          <ThemedOutlineButton linkHref="/coming-soon" theme={theme}>
            Dashboard
          </ThemedOutlineButton>

          <ThemedOutlineButton linkHref="/coming-soon" theme={theme}>
            <User size={18} className="mr-2" />
            <span className="hidden sm:inline">My Profile</span>
          </ThemedOutlineButton>

          <ThemedOutlineButton linkHref="/coming-soon" size="icon" theme={theme}>
            <Bell size={20} aria-hidden="true" />
            <span className="sr-only">Bell</span>
          </ThemedOutlineButton>

          <ThemedOutlineButton linkHref="/landing-page" theme={theme}>
            <LogOut size={18} className="mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </ThemedOutlineButton>
        </div>
      </div>
    </header>
  )
}

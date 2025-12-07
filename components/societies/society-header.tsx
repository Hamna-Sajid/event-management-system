"use client"

import { Bell, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { getAuth, signOut } from "firebase/auth"
import { app } from "../../firebase"
import { useRouter } from "next/navigation"

/**
 * @component ThemedOutlineButton
 * 
 * A themed button with an outline style that can function as a link or a button.
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - The content to render inside the button.
 * @param {() => void} [props.onClick] - Optional click handler.
 * @param {string} [props.linkHref] - Optional URL. If provided, the button acts as a link.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.CSSProperties} [props.buttonStyle] - Inline styles.
 * @param {"default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"} [props.size] - The button size.
 * @param {string} props.theme - The theme to apply.
 * 
 * @remarks
 * This button's colors for text, background, and border are determined by CSS variables
 * derived from the `theme` prop. It also features dynamic hover and active styles.
 * 
 * @example
 * ```tsx
 * // As a link
 * <ThemedOutlineButton linkHref="/profile" theme="default">Profile</ThemedOutlineButton>
 * 
 * // As a button
 * <ThemedOutlineButton onClick={() => console.log('Clicked!')} theme="default">Click Me</ThemedOutlineButton>
 * ```
 */
const ThemedOutlineButton = ({ children, onClick, linkHref, className = "", buttonStyle = {}, size, theme }: { children: React.ReactNode, onClick?: () => void, linkHref?: string, className?: string, buttonStyle?: React.CSSProperties, size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg", theme: string }) => {
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
    size: size,
    variant: "outline" as const, // Ensure variant is outline
  }

  if (linkHref) {
    return (
      <Button {...commonProps} asChild>
        <Link href={linkHref}>{children}</Link>
      </Button>
    )
  }

  return (
    <Button {...commonProps} onClick={onClick}>
      {children}
    </Button>
  )
}

/**
 * Props for the {@link SocietyHeader} component.
 */
interface SocietyHeaderProps {
  /** The theme to apply to the header, used for styling. */
  theme: string
}

/**
 * @component SocietyHeader
 * 
 * A sticky header component for society pages, featuring navigation and logout functionality.
 * 
 * @remarks
 * This component displays the society's logo and name, along with navigation buttons for
 * "Dashboard" and "My Profile", a notification bell, and a "Logout" button. The header
 * uses a glass morphism effect (backdrop blur) and is themed using CSS variables.
 * 
 * The logout button handles Firebase authentication sign-out and redirects the user to the
 * home page.
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
 */
export default function SocietyHeader({ theme }: SocietyHeaderProps) {
  const router = useRouter()
  const auth = getAuth(app)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error("Error signing out: ", error)
      // Optionally, show a toast or message to the user
    }
  }

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

          <ThemedOutlineButton onClick={handleLogout} theme={theme}>
            <LogOut size={18} className="mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </ThemedOutlineButton>
        </div>
      </div>
    </header>
  )
}

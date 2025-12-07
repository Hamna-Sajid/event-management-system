"use client"

import { ProfileMenu } from "@/components/profile-menu"

/**
 * @component SocietyHeader
 * 
 * A sticky header component for society pages, featuring navigation and profile menu.
 * 
 * @remarks
 * This component displays the society's logo and name, along with a navigation button for
 * "Dashboard" and the ProfileMenu component for user account management. The header
 * uses a glass morphism effect (backdrop blur) and is themed using CSS variables.
 * 
 * The ProfileMenu component handles authentication state, role-based navigation, and logout.
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

/**
 * Props for the {@link SocietyHeader} component.
 */
interface SocietyHeaderProps {
  /** The theme to apply to the header, used for styling. */
  theme: string
}
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
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}

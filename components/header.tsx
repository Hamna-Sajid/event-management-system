"use client"

import { Search, LogIn, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

/**
 * @component Header
 * 
 * Navigation header with authentication controls
 * 
 * @remarks
 * This component provides the main navigation header with:
 * - IEMS logo with brand colors
 * - Search button (desktop only)
 * - Login button with navigation
 * - Sign Up button with navigation
 * - Sticky positioning at top of viewport
 * - Backdrop blur effect with semi-transparent background
 * 
 * Features:
 * - Client-side navigation using Next.js router
 * - Responsive design (hides text on mobile, shows icons)
 * - Glass morphism styling
 * - Brand identity with gradient logo
 * 
 * Navigation behavior:
 * - Login button → /signin
 * - Sign Up button → /signup
 * - Search button → (placeholder, no action yet)
 * 
 * @example
 * ```tsx
 * import Header from '@/components/header'
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <Header />
 *         {children}
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 * 
 * @category Components
 */
export default function Header() {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[rgba(17,2,5,0.8)] border-b border-[rgba(255,255,255,0.1)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d02243] to-[#84162b] flex items-center justify-center">
            <span className="text-white font-bold text-lg">IE</span>
          </div>
          <span className="text-white font-semibold text-lg hidden sm:inline">IEMS</span>
        </div>

        {/* Right side - Search, Login, Sign Up */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg glass glass-hover hidden sm:flex items-center justify-center">
            <Search size={20} className="text-[rgba(255,255,255,0.7)]" />
          </button>

          <Button
            variant="ghost"
            className="text-[rgba(255,255,255,0.8)] hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
            onClick={() => router.push('/signin')}
          >
            <LogIn size={18} className="mr-2" />
            <span className="hidden sm:inline">Login</span>
          </Button>

          <Button 
            className="bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold"
            onClick={() => router.push('/signup')}
          >
            <UserPlus size={18} className="mr-2" />
            <span className="hidden sm:inline">Sign Up</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

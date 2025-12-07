"use client"

import { Search, LogIn, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"
import { auth } from "@/firebase"
import { ProfileMenu } from "./profile-menu"

/**
 * @component Header
 * 
 * Navigation header with authentication controls
 * 
 * @remarks
 * This component provides the main navigation header with:
 * - IEMS logo with brand colors
 * - Search button (desktop only)
 * - Login/Sign Up buttons for guests
 * - Profile menu for authenticated users
 * - Sticky positioning at top of viewport
 * - Backdrop blur effect with semi-transparent background
 * 
 * Features:
 * - Client-side navigation using Next.js router
 * - Responsive design (hides text on mobile, shows icons)
 * - Glass morphism styling
 * - Brand identity with gradient logo
 * - Profile dropdown menu with role-based navigation
 * 
 * Navigation behavior:
 * - Login button → /signin
 * - Sign Up button → /signup
 * - Profile menu shows: Dashboard, Calendar, Logout
 * - Dashboard links vary by role (Admin → /admin, Society Head → /societies/{id}, User → /dashboard)
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
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })

    return () => unsubscribe()
  }, [])

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-gradient-to-b from-black/40 to-transparent border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-electric-blue to-magenta flex items-center justify-center">
            <span className="text-white font-bold text-lg">IE</span>
          </div>
          <span className="text-white font-semibold text-lg hidden sm:inline">IEMS</span>
        </div>

        {/* Right side - Search, Profile Menu or Login/Sign Up */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/5 border border-white/10 hover:border-white/20 transition opacity-50 cursor-not-allowed" title="Coming soon">
            <Search className="w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search events..."
              className="bg-transparent text-white text-sm placeholder-white/40 focus:outline-none w-32"
              disabled
            />
          </div>

          {currentUser ? (
            <ProfileMenu />
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-white hover:bg-accent"
                onClick={() => router.push('/signin')}
              >
                <LogIn size={18} className="mr-2" />
                <span className="hidden sm:inline">Login</span>
              </Button>

              <Button 
                className="glow-button"
                onClick={() => router.push('/signup')}
              >
                <UserPlus size={18} className="mr-2" />
                <span className="hidden sm:inline">Sign Up</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

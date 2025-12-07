/**
 * @component ProfileMenu
 * 
 * User profile dropdown menu with role-based navigation options
 * 
 * @remarks
 * This component provides authenticated user navigation and account management:
 * - Displays user avatar button in header
 * - Shows dropdown menu with contextual options based on user role
 * - Integrates with Firebase authentication
 * - Fetches and displays user privilege level
 * - Provides logout functionality
 * 
 * Role-based menu items:
 * - **All users**: Profile, Calendar, Logout
 * - **Society Heads**: Additionally shows "My Society" link
 * - **Admins**: Additionally shows "Dashboard" link
 * 
 * Features:
 * - Click outside to close dropdown
 * - Smooth transitions and animations
 * - Glassmorphism styling
 * - Real-time auth state synchronization
 * - Displays user email and role label
 * 
 * @example
 * Basic usage in header:
 * ```tsx
 * import { ProfileMenu } from '@/components/profile-menu'
 * 
 * export default function Header() {
 *   return (
 *     <header>
 *       <nav>
 *         <ProfileMenu />
 *       </nav>
 *     </header>
 *   )
 * }
 * ```
 * 
 * @example
 * The component handles all auth state internally:
 * ```tsx
 * // No props needed - auth state managed internally
 * <ProfileMenu />
 * ```
 */

"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, firestore } from "@/firebase"
import { getUserPrivilege, UserPrivilege } from "@/lib/privileges"
import { User, LogOut, LayoutDashboard, Users, LucideIcon, Calendar } from "lucide-react"

/**
 * Configuration for a single menu item.
 */
interface MenuItemConfig {
  /** Lucide icon component to display */
  icon: LucideIcon
  /** Display text for the menu item */
  label: string
  /** Optional navigation path (use path OR onClick, not both) */
  path?: string
  /** Optional click handler (use path OR onClick, not both) */
  onClick?: () => void | Promise<void>
  /** If false, menu item will not be rendered */
  show?: boolean
}

/**
 * Props for individual menu item component.
 */
interface ProfileMenuItemProps {
  icon: LucideIcon
  label: string
  onClick: () => void
}

/**
 * Individual menu item button within the profile dropdown
 * 
 * @remarks
 * Internal component used by ProfileMenu to render each menu option.
 * Features consistent styling and hover effects for all menu items.
 */
function ProfileMenuItem({ icon: Icon, label, onClick }: ProfileMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-[rgba(0, 255, 106, 0.05)] rounded-lg transition-colors cursor-pointer"
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  )
}

/**
 * User profile dropdown menu with role-based navigation options
 * 
 * @remarks
 * This component provides authenticated user navigation and account management:
 * - Displays user avatar button in header
 * - Shows dropdown menu with contextual options based on user role
 * - Integrates with Firebase authentication
 * - Fetches and displays user privilege level
 * - Provides logout functionality
 * 
 * Role-based menu items:
 * - **All users**: Profile, Calendar, Logout
 * - **Society Heads**: Additionally shows "My Society" link
 * - **Admins**: Additionally shows "Dashboard" link
 * 
 * Features:
 * - Click outside to close dropdown
 * - Smooth transitions and animations
 * - Glassmorphism styling
 * - Real-time auth state synchronization
 * - Displays user email and role label
 * 
 * @example
 * Used in header/navigation:
 * ```tsx
 * <header>
 *   <nav>
 *     {currentUser ? (
 *       <ProfileMenu />
 *     ) : (
 *       <SignInButton />
 *     )}
 *   </nav>
 * </header>
 * ```
 * 
 * @example
 * Automatically handles authentication:
 * ```tsx
 * // No props needed - manages auth state internally
 * <ProfileMenu />
 * ```
 */
export function ProfileMenu() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [userPrivilege, setUserPrivilege] = useState<number>(UserPrivilege.NORMAL_USER)
  const [societyId, setSocietyId] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        const privilege = await getUserPrivilege(user.uid)
        setUserPrivilege(privilege)

        if (privilege === UserPrivilege.SOCIETY_HEAD) {
          const userDoc = await getDoc(doc(firestore, "users", user.uid))
          if (userDoc.exists()) {
            setSocietyId(userDoc.data().societyId || null)
          }
        }
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showMenu])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setShowMenu(false)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    setShowMenu(false)
  }

  const getRoleLabel = () => {
    if (userPrivilege === UserPrivilege.ADMIN) return "Administrator"
    if (userPrivilege === UserPrivilege.SOCIETY_HEAD) return "Society Head"
    return "User"
  }

  if (!currentUser) return null

  const menuItems: MenuItemConfig[] = [
    {
      icon: User,
      label: "Profile",
      path: `/profiles/${currentUser.uid}`,
      show: true
    },
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin",
      show: userPrivilege === UserPrivilege.ADMIN
    },
    {
      icon: Users,
      label: "My Society",
      path: `/societies/${societyId}`,
      show: userPrivilege === UserPrivilege.SOCIETY_HEAD && !!societyId
    },
    {
      icon: Calendar,
      label: "Calendar",
      path: "/calendar",
      show: true
    },
    {
      icon: LogOut,
      label: "Logout",
      onClick: handleLogout,
      show: true
    }
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d02243] to-[#aa1c37] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
        aria-label="Profile menu"
      >
        <User size={20} className="text-white" />
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-64 glass rounded-xl shadow-2xl overflow-hidden z-50" style={{ opacity: 1 }}>
          <div className="p-4 border-b border-[rgba(40, 243, 0, 0.1)]">
            <p className="text-white text-sm font-medium truncate">
              {currentUser.email}
            </p>
            <p className="text-[rgba(255,255,255,0.6)] text-xs mt-1">
              {getRoleLabel()}
            </p>
          </div>

          <div className="p-2">
            {menuItems
              .filter(item => item.show)
              .map((item, index) => (
                <ProfileMenuItem
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick()
                    } else if (item.path) {
                      handleNavigation(item.path)
                    }
                  }}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

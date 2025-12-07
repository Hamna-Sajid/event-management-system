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
import { createPortal } from "react-dom"
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
      className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent/20 rounded-lg transition-colors cursor-pointer"
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

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

  // Update dropdown position when menu opens
  useEffect(() => {
    if (showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      })
    }
  }, [showMenu])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
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

  const dropdownContent = showMenu && currentUser ? (
    <div 
      ref={menuRef}
      className="fixed w-64 rounded-xl shadow-2xl overflow-hidden z-[9999] glass"
      style={{ 
        top: `${dropdownPosition.top}px`,
        right: `${dropdownPosition.right}px`
      }}
    >
      <div className="p-4 border-b border-border">
        <p className="text-foreground text-sm font-medium truncate">
          {currentUser.email}
        </p>
        <p className="text-muted-foreground text-xs mt-1">
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
  ) : null

  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setShowMenu(!showMenu)}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-magenta flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
          aria-label="Profile menu"
        >
          <User size={20} className="text-white" />
        </button>
      </div>
      
      {typeof window !== 'undefined' && createPortal(dropdownContent, document.body)}
    </>
  )
}

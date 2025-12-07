/**
 * @component EventHeader
 * 
 * Sticky navigation header for event detail pages
 * 
 * @remarks
 * This component provides the main navigation and action bar for event pages:
 * - Sticky positioning at top of viewport
 * - Back navigation to home page
 * - Favorite/unfavorite toggle button
 * - Share functionality
 * - Authentication-aware UI (login/signup or profile menu)
 * 
 * Design features:
 * - Glassmorphism backdrop blur effect
 * - Responsive layout (hides text on mobile for some buttons)
 * - Interactive icons with hover states
 * - Integrates with Firebase authentication
 * 
 * @example
 * With authenticated user:
 * ```tsx
 * const [isFavorited, setIsFavorited] = useState(false)
 * const [currentUser, setCurrentUser] = useState<User | null>(null)
 * 
 * <EventHeader
 *   isFavorited={isFavorited}
 *   onToggleFavorite={() => setIsFavorited(!isFavorited)}
 *   onShare={() => navigator.share({ url: window.location.href })}
 *   currentUser={currentUser}
 * />
 * ```
 * 
 * @example
 * With unauthenticated user:
 * ```tsx
 * <EventHeader
 *   isFavorited={false}
 *   onToggleFavorite={() => showToast('Please sign in to favorite events', 'error')}
 *   onShare={handleShare}
 *   currentUser={null}
 * />
 * ```
 */

import { ArrowLeft, Share2, Heart, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileMenu } from "@/components/profile-menu"
import Link from "next/link"
import { User } from "firebase/auth"

/**
 * Props for the EventHeader component.
 */
interface EventHeaderProps {
  isFavorited: boolean
  onToggleFavorite: () => void
  onShare: () => void
  currentUser: User | null
}

/**
 * Sticky navigation header for event detail pages
 * 
 * @remarks
 * This component provides the main navigation and action bar for event pages:
 * - Sticky positioning at top of viewport
 * - Back navigation to home page
 * - Favorite/unfavorite toggle button
 * - Share functionality
 * - Authentication-aware UI (login/signup or profile menu)
 * 
 * Design features:
 * - Glassmorphism backdrop blur effect
 * - Responsive layout (hides text on mobile for some buttons)
 * - Interactive icons with hover states
 * - Integrates with Firebase authentication
 * 
 * @example
 * With authenticated user:
 * ```tsx
 * const [isFavorited, setIsFavorited] = useState(false)
 * const [currentUser, setCurrentUser] = useState<User | null>(null)
 * 
 * <EventHeader
 *   isFavorited={isFavorited}
 *   onToggleFavorite={() => setIsFavorited(!isFavorited)}
 *   onShare={() => navigator.share({ url: window.location.href })}
 *   currentUser={currentUser}
 * />
 * ```
 * 
 * @example
 * With unauthenticated user:
 * ```tsx
 * <EventHeader
 *   isFavorited={false}
 *   onToggleFavorite={() => showToast('Please sign in to favorite events', 'error')}
 *   onShare={handleShare}
 *   currentUser={null}
 * />
 * ```
 */
export function EventHeader({ 
  isFavorited, 
  onToggleFavorite, 
  onShare,
  currentUser 
}: EventHeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleFavorite}
            className="p-2 rounded-lg glass glass-hover flex items-center justify-center cursor-pointer"
          >
            <Heart
              size={20}
              className={isFavorited ? "fill-primary text-primary" : "text-muted-foreground"}
            />
          </button>
          
          <button 
            onClick={onShare}
            className="p-2 rounded-lg glass glass-hover flex items-center justify-center cursor-pointer"
          >
            <Share2 size={20} className="text-muted-foreground" />
          </button>
          
          {currentUser ? (
            <ProfileMenu />
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-white hover:bg-accent"
                onClick={() => window.location.href = '/signin'}
              >
                <LogIn size={18} className="mr-2" />
                <span className="hidden sm:inline">Login</span>
              </Button>
              <Button 
                className="glow-button"
                onClick={() => window.location.href = '/signup'}
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

---
outline: [2, 4]
---

# Components

React components for the application

### CallToAction

**File**: `components\call-to-action.tsx`

Call-to-action section encouraging users to join the waitlist

This component displays a prominent CTA section with:
- Eye-catching gradient icon (Sparkles)
- Compelling headline and description
- Primary action button linking to signup
- Trust indicators (free, no credit card, early access)
- Glass morphism styling with hover effects
Design features:
- Centered layout with max-width constraint
- Responsive padding (mobile to desktop)
- Gradient background on icon
- Brand colors (#d02243 primary red)

#### Example

```tsx
import CallToAction from '@/components/call-to-action'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <CallToAction />
      <Footer />
    </>
  )
}
```

### DeleteConfirmModal

**File**: `components\events\delete-confirm-modal.tsx`

Confirmation dialog for destructive delete operations

This component displays a modal dialog to confirm deletion of items:
- Warning icon with red accent color
- Item name and type display
- Destructive action confirmation
- Cannot be dismissed by clicking backdrop
Design features:
- Centered layout with glassmorphism styling
- Red color scheme for destructive action warning
- Dual-action buttons (delete/cancel)
- Prevents accidental clicks outside modal

#### Example

With custom item type:
```tsx
<DeleteConfirmModal
  isOpen={deleteModalOpen}
  onClose={closeModal}
  onConfirm={deleteDocument}
  itemName="Resume.pdf"
  itemType="document"
/>
```

### EditableIcon

**File**: `components\events\editable-icon.tsx`

Small edit button icon for inline editing functionality

This component displays a pencil icon button for triggering edit mode:
- Compact 6x6 circular button
- Glassmorphism styling with hover effects
- Red accent color matching app theme
- Includes accessible title attribute
Commonly used inline next to editable content like event titles,
descriptions, or other user-editable fields.

#### Example

With state management:
```tsx
const [isEditing, setIsEditing] = useState(false)

<div>
  {isEditing ? (
    <input value={text} onChange={e => setText(e.target.value)} />
  ) : (
    <>
      <span>{text}</span>
      <EditableIcon onClick={() => setIsEditing(true)} />
    </>
  )}
</div>
```

### EventHeader

**File**: `components\events\event-header.tsx`

Sticky navigation header for event detail pages

This component provides the main navigation and action bar for event pages:
- Sticky positioning at top of viewport
- Back navigation to home page
- Favorite/unfavorite toggle button
- Share functionality
- Authentication-aware UI (login/signup or profile menu)
Design features:
- Glassmorphism backdrop blur effect
- Responsive layout (hides text on mobile for some buttons)
- Interactive icons with hover states
- Integrates with Firebase authentication

#### Example

With unauthenticated user:
```tsx
<EventHeader
  isFavorited={false}
  onToggleFavorite={() => showToast('Please sign in to favorite events', 'error')}
  onShare={handleShare}
  currentUser={null}
/>
```

### ImageUploadModal

**File**: `components\events\image-upload-modal.tsx`

Modal dialog for uploading images with drag-and-drop support

This component provides a user-friendly image upload interface:
- Drag-and-drop functionality for easy file selection
- Traditional file browser option
- Visual feedback during upload (loading spinner)
- Drag state indication with color changes
- File size limit display and enforcement
Features:
- Drag-over visual feedback (red border and background)
- Async upload handling with loading state
- Accept only image file types
- Configurable title and max file size
- Small modal size optimized for upload UI

#### Example

With custom settings:
```tsx
<ImageUploadModal
  isOpen={uploadModalOpen}
  onClose={closeUploadModal}
  onUpload={handleImageUpload}
  title="Upload Event Poster"
  maxSizeKB={1024}
/>
```

### Footer

**File**: `components\footer.tsx`

Simplified footer with copyright notice

This component displays a minimalist footer containing only:
- Copyright text (© 2025 IBA Event Management System)
- Centered layout
- Responsive flexbox (column on mobile, row on desktop)
- Subtle top border with transparency
Design approach:
- Reduced from full footer with social links and quick links
- Maintains brand presence without clutter
- Consistent with overall minimalist design
- Semi-transparent text for subtlety

#### Example

```tsx
import Footer from '@/components/footer'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <CallToAction />
      <Footer />
    </>
  )
}
```

### Header

**File**: `components\header.tsx`

Navigation header with authentication controls

This component provides the main navigation header with:
- IEMS logo with brand colors
- Search button (desktop only)
- Login/Sign Up buttons for guests
- Profile menu for authenticated users
- Sticky positioning at top of viewport
- Backdrop blur effect with semi-transparent background
Features:
- Client-side navigation using Next.js router
- Responsive design (hides text on mobile, shows icons)
- Glass morphism styling
- Brand identity with gradient logo
- Profile dropdown menu with role-based navigation
Navigation behavior:
- Login button → /signin
- Sign Up button → /signup
- Profile menu shows: Dashboard, Calendar, Logout
- Dashboard links vary by role (Admin → /admin, Society Head → /societies/{id}, User → /dashboard)

#### Example

```tsx
import Header from '@/components/header'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
```

### Hero

**File**: `components\hero.tsx`

Hero section component displaying dynamic platform statistics and call-to-action buttons.

This is the main landing page hero section that:
- Fetches real-time statistics from Firestore on component mount
- Displays event count, society count, and user count
- Provides primary CTA (Join Waitlist) and secondary CTA (Sign In)
- Uses glassmorphism design for the statistics card
Statistics are fetched in parallel using `Promise.all` for optimal performance.
If fetch fails, statistics default to 0 (handled in the stats functions).

#### Example

Usage in a page:
```tsx
import Hero from '@/components/hero'

export default function LandingPage() {
  return (
    <>
      <Header />
      <Hero />
      <Footer />
    </>
  )
}
```

### ProfileMenu

**File**: `components\profile-menu.tsx`

User profile dropdown menu with role-based navigation options

This component provides authenticated user navigation and account management:
- Displays user avatar button in header
- Shows dropdown menu with contextual options based on user role
- Integrates with Firebase authentication
- Fetches and displays user privilege level
- Provides logout functionality
Role-based menu items:
- **All users**: Profile, Calendar, Logout
- **Society Heads**: Additionally shows "My Society" link
- **Admins**: Additionally shows "Dashboard" link
Features:
- Click outside to close dropdown
- Smooth transitions and animations
- Glassmorphism styling
- Real-time auth state synchronization
- Displays user email and role label

#### Example

The component handles all auth state internally:
```tsx
// No props needed - auth state managed internally
<ProfileMenu />
```


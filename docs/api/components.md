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

### LoadingScreen

**File**: `components\loading-screen.tsx`

Reusable loading screen with animated blobs and spinner

Full-screen loading overlay with:
- Animated gradient blobs matching hero design
- Rotating spinner with gradient colors
- "Loading..." text with bouncing dots

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

### EditEventModal

**File**: `components\societies\edit-event-modal.tsx`

Modal dialog for editing existing event details

This component provides a form for editing event information:
- Event title, date, time, location
- Event description
- Event status (Upcoming, Ongoing, Completed)
- Metrics preserved during edit (views, likes, wishlists, shares)
Features:
- Themed styling based on society theme
- Form validation and submission
- Modal overlay with backdrop
- Cancel and save actions
- Auto-populates with current event data

#### Example

Basic usage:
```tsx
const [isModalOpen, setIsModalOpen] = useState(false)
const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

const handleEditSubmit = (updatedEvent: Event) => {
  // Update event in database
  updateEvent(updatedEvent)
  setIsModalOpen(false)
}

<EditEventModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSubmit={handleEditSubmit}
  event={selectedEvent}
  theme="blue"
/>
```

### SocietyHeader

**File**: `components\societies\society-header.tsx`

A sticky header component for society pages, featuring navigation and profile menu.

This component displays the society's logo and name, along with a navigation button for
"Dashboard" and the ProfileMenu component for user account management. The header
uses a glass morphism effect (backdrop blur) and is themed using CSS variables.
The ProfileMenu component handles authentication state, role-based navigation, and logout.

#### Example

```tsx
import SocietyHeader from '@/components/society-header'

export default function SocietyPage() {
  return (
    <div>
      <SocietyHeader theme="default" />
      // ... rest of the page
    </div>
  )
}
```

## SocietyHero

### SocietyHero

**File**: `components\societies\society-hero.tsx`

Hero section for society pages with themed styling and management controls

This component displays the society's hero section with:
- Animated gradient background based on society theme
- Society name with dynamic text styling
- Action buttons (Follow, Share, Settings)
- Management view toggle for society heads
- Responsive layout with glassmorphism effects
Features:
- Theme-aware styling with custom CSS variables
- Hover and active states for interactive elements
- ThemedButton sub-component for consistent button styling
- Conditional rendering based on management permissions

#### Example

Management view:
```tsx
<SocietyHero
  societyName="Arts Society"
  theme="purple"
  societyId="arts-soc-001"
  isManagementView={true}
/>
```

### ThemedButton

**File**: `components\societies\society-hero.tsx`

A themed button that can function as a link or a standard button, with dynamic hover/active styles.

This component's background color changes on hover and active states. It's styled using CSS
variables derived from the `theme` prop. It's a local helper component within `SocietyHero`.

#### Example

```tsx
// As a disabled button
<ThemedButton theme="default" disabled={true}>Follow</ThemedButton>
```

### SocietyHero

**File**: `components\societies\society-hero.tsx`

Displays a hero section for a society page, including the society's logo,
name, and primary actions.

This component adapts its content based on the `isManagementView` prop.
- In management view, it shows an "Edit Profile" button and a settings icon
  that currently navigates to a "coming soon" page.
- In the public view, it displays a disabled "Follow Society" button.
The society logo is generated from the first letter of the society's name.

#### Example

```tsx
import SocietyHero from '@/components/society-hero'

export default function SocietyPage() {
  return (
    <div>
      <SocietyHero
        societyName="Tech Club"
        theme="default"
        isManagementView={true}
        societyId="tech-club-123"
      />
      // ... rest of the page
    </div>
  )
}
```

## SocietyTabs

### SocietyTabs

**File**: `components\societies\society-tabs.tsx`

Tabbed interface for displaying society information, events, and team members

This component provides a comprehensive tabbed interface for society pages:
- **About Tab**: Society description, head information, social media links
- **Events Tab**: Grid of society events with filtering and search
- **Team Tab**: Display of society team members and roles
Features:
- Three-tab navigation (About, Events, Team)
- Event management (create, edit, delete) for authorized users
- Search and filter functionality for events
- Social media integration (Facebook, LinkedIn)
- Responsive grid layouts
- EditEventModal integration for event modifications

#### Example

Management view:
```tsx
<SocietyTabs
  societyId="arts-soc-001"
  isManagementView={true}
  theme="purple"
/>
```

### SocietyTabs

**File**: `components\societies\society-tabs.tsx`

Displays a tabbed interface for a society page, allowing users to navigate
between different sections like Overview, Manage Events, Members, and About Us.

This component dynamically renders content based on the active tab and
`isManagementView` prop.
- **Overview**: Shows society's mission, social links, key statistics, and upcoming events.
- **Manage Events**: (Only in management view) Provides an interface to search, create,
  edit, and delete events.
- **Members**: Lists the society's members with their roles and contact info.
- **About Us**: Displays detailed information about the society.
The initial active tab is "Manage Events" if `isManagementView` is true, otherwise it's "Overview".

#### Example

```tsx
import SocietyTabs from '@/components/society-tabs'
// Assume societyData, events, members, handleDeleteEvent, handleEditEvent are defined

export default function SocietyPage() {
  return (
    <div>
      <SocietyTabs
        theme="default"
        isManagementView={true}
        societyData={societyData}
        events={events}
        members={members}
        handleDeleteEvent={handleDeleteEvent}
        handleEditEvent={handleEditEvent}
      />
    </div>
  )
}
```

### ThemedButton

**File**: `components\societies\society-tabs.tsx`

A customizable button component that applies dynamic hover/active styles based on a theme.
It can function as a link or a standard button.

If `linkHref` is provided, the button acts as a Next.js Link.
Otherwise, it acts as a standard button with an `onClick` handler.
Styles change on hover and active states using CSS variables derived from the `theme` prop.

#### Example

```tsx
// As a link
<ThemedButton linkHref="/dashboard" theme="default">Go to Dashboard</ThemedButton>

// As a button with an action
<ThemedButton onClick={() => alert('Clicked!')} theme="default" size="lg">Click Me</ThemedButton>
```

### ManageEventsTab

**File**: `components\societies\society-tabs.tsx`

Displays an interface for managing a society's events, including search, filter,
create, edit, and delete functionalities. This tab is primarily for authorized users.

- Allows searching events by title or date.
- Filters events by status (Published, Draft, Concluded, All).
- Provides buttons to create new events, and edit/view/delete existing events.
- Uses `EditEventModal` for event editing.

### OverviewTab

**File**: `components\societies\society-tabs.tsx`

Displays an overview of the society, including its mission, social media links,
key statistics, and a preview of upcoming events.

- The mission section shows the `societyData.description`.
- "Connect With Us" section displays social media links (Instagram, Facebook, LinkedIn)
  and contact email from `societyData.socialLinks` and `societyData.contactEmail`.
- Statistics include active members, events hosted, and founded year.
- "Upcoming Events" section displays up to 3 upcoming events, with links to their detail pages.

### MembersTab

**File**: `components\societies\society-tabs.tsx`

Displays a list of members for the society, typically showing society heads.

Each member card shows their name, role, and email, with an avatar displaying
the first letter of their name.

### AboutUsTab

**File**: `components\societies\society-tabs.tsx`

Displays detailed information about the society, including its description and contact information.

- Shows the society's `description` under "About Our Society".
- Displays the `contactEmail` under "Contact Information".


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
- Login button with navigation
- Sign Up button with navigation
- Sticky positioning at top of viewport
- Backdrop blur effect with semi-transparent background
Features:
- Client-side navigation using Next.js router
- Responsive design (hides text on mobile, shows icons)
- Glass morphism styling
- Brand identity with gradient logo
Navigation behavior:
- Login button → /signin
- Sign Up button → /signup
- Search button → (placeholder, no action yet)

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

## ThemedOutlineButton

### ThemedOutlineButton

**File**: `components\society-header.tsx`

A themed button with an outline style that can function as a link or a button.

This button's colors for text, background, and border are determined by CSS variables
derived from the `theme` prop. It also features dynamic hover and active styles.

#### Example

```tsx
// As a link
<ThemedOutlineButton linkHref="/profile" theme="default">Profile</ThemedOutlineButton>

// As a button
<ThemedOutlineButton onClick={() => console.log('Clicked!')} theme="default">Click Me</ThemedOutlineButton>
```

### SocietyHeader

**File**: `components\society-header.tsx`

A sticky header component for society pages, featuring navigation and logout functionality.

This component displays the society's logo and name, along with navigation buttons for
"Dashboard" and "My Profile", a notification bell, and a "Logout" button. The header
uses a glass morphism effect (backdrop blur) and is themed using CSS variables.
The logout button handles Firebase authentication sign-out and redirects the user to the
home page.

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

## society-hero.tsx

### ThemedButton

**File**: `components\society-hero.tsx`

A themed button that can function as a link or a standard button, with dynamic hover/active styles.

This component's background color changes on hover and active states. It's styled using CSS
variables derived from the `theme` prop. It's a local helper component within `SocietyHero`.

#### Example

```tsx
// As a disabled button
<ThemedButton theme="default" disabled={true}>Follow</ThemedButton>
```

### SocietyHero

**File**: `components\society-hero.tsx`

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

## society-tabs.tsx

### SocietyTabs

**File**: `components\society-tabs.tsx`

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

**File**: `components\society-tabs.tsx`

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

**File**: `components\society-tabs.tsx`

Displays an interface for managing a society's events, including search, filter,
create, edit, and delete functionalities. This tab is primarily for authorized users.

- Allows searching events by title or date.
- Filters events by status (Published, Draft, Concluded, All).
- Provides buttons to create new events, and edit/view/delete existing events.
- Uses `EditEventModal` for event editing.

### OverviewTab

**File**: `components\society-tabs.tsx`

Displays an overview of the society, including its mission, social media links,
key statistics, and a preview of upcoming events.

- The mission section shows the `societyData.description`.
- "Connect With Us" section displays social media links (Instagram, Facebook, LinkedIn)
  and contact email from `societyData.socialLinks` and `societyData.contactEmail`.
- Statistics include active members, events hosted, and founded year.
- "Upcoming Events" section displays up to 3 upcoming events, with links to their detail pages.

### MembersTab

**File**: `components\society-tabs.tsx`

Displays a list of members for the society, typically showing society heads.

Each member card shows their name, role, and email, with an avatar displaying
the first letter of their name.

### AboutUsTab

**File**: `components\society-tabs.tsx`

Displays detailed information about the society, including its description and contact information.

- Shows the society's `description` under "About Our Society".
- Displays the `contactEmail` under "Contact Information".


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


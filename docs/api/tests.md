---
outline: [2, 4]
---

# Test Suites

Comprehensive test documentation for all components and utility functions

### AdminDashboard

**File**: `app\admin\page.test.tsx`

Test suite for Admin Dashboard page

Comprehensive tests for the admin dashboard covering:
- Authentication and authorization (admin privilege level 2 required)
- Society management (create, list, unique names, ID generation)
- Society head assignment (email validation, verification requirements)
- Role management (prevent duplicate roles, multiple society heads)
- Redirect flows (signin, waitlist, admin)
- Form validation and error handling

#### Test Coverage

- **Authentication Tests**: Redirects for unauthenticated users and non-admins
- **Dashboard Loading**: Displays dashboard for admin users (privilege >= 2)
- **Society Creation**: Unique names, ID generation from name, duplicate prevention
- **Email Validation**: Only @khi.iba.edu.pk domain allowed for society heads
- **Verification Requirements**: Society heads must have verified email
- **Role Constraints**: Prevents duplicate roles and multiple society head assignments
- **Error Handling**: Form validation, Firestore errors, network failures

#### Edge Cases

- Unauthenticated user redirects to signin
- Non-admin (privilege < 2) redirects to waitlist
- Duplicate society names prevented
- Society ID generated from name (lowercase, hyphens)
- Invalid email domain rejected
- Unverified email prevents society head assignment
- User cannot be head of multiple societies
- Duplicate role assignments in same society prevented

#### Expected Values

**Authentication:**
- Unauthenticated: redirect to /signin
- Privilege < 2: redirect to /waitlist
- Privilege >= 2: dashboard loads

**Society Creation:**
- Unique names required
- Society ID: lowercase name with hyphens (e.g., "Tech Society" → "tech-society")
- Firestore document created with name and ID

**Society Head Assignment:**
- Email domain: @khi.iba.edu.pk only
- Email must be verified
- User can only be head of one society
- No duplicate roles in same society

**UI Elements:**
- Dashboard header visible for admin
- Society creation form rendered
- Society list displayed
- Role assignment interface available

### ForgotPassword

**File**: `app\forgot-password\page.test.tsx`

Test suite for Forgot Password page

Comprehensive tests for the password reset functionality covering:
- UI rendering (heading, description, icons, form elements)
- Form validation (email required, email format)
- Firebase integration (sendPasswordResetEmail)
- User feedback (success messages, error messages, loading states)
- Error handling (user not found, invalid email, network errors)
- Navigation (back to sign in link)
- Styling (glassmorphic design)

#### Test Coverage

- **UI Structure Tests**: Heading, description, icons, email input, buttons, links
- **Form Validation**: Required fields, email format validation
- **Firebase Integration**: sendPasswordResetEmail called with correct email
- **Success Flow**: Success message, email input cleared, button re-enabled
- **Loading States**: Button disabled, loading indicator shown during submission
- **Error Handling**: User not found, invalid email, network errors, generic errors
- **Navigation**: Back to sign in link works correctly
- **Styling**: Glassmorphic card styling applied

#### Edge Cases

- Empty email submission prevented
- Invalid email format rejected
- User not found error displayed
- Network errors handled gracefully
- Button disabled during submission
- Email input cleared on success
- Multiple rapid submissions prevented

#### Expected Values

**UI Elements:**
- Heading: "Reset Password"
- Email input: type="email", required, placeholder present
- Button: "Send Reset Link"
- Back link: href="/signin"
- Icons: Mail and ArrowLeft rendered

**Form Behavior:**
- Valid email: calls sendPasswordResetEmail
- Success: shows "Password reset email sent", clears input
- Loading: button disabled, shows "Sending..."

**Error Messages:**
- "auth/user-not-found": "No user found with this email"
- "auth/invalid-email": "Invalid email address"
- "auth/network-request-failed": "Network error"
- Generic: "Failed to send reset email"

**Email Domain:**
- Accepts any valid email format
- No domain restrictions for password reset

### SocietyPage

**File**: `app\societies\[id]\page.test.tsx`

Test suite for the main society page located at `app/societies/[id]/page.tsx`.

This suite tests the behavior of the SocietyPage component, focusing on data fetching,
rendering logic, role-based access control, and event management handlers.
Mocks are used for:
- Firebase services (`firestore`, `auth`) to simulate database interactions and user authentication.
- Next.js navigation (`useParams`, `useRouter`) to control URL parameters and routing.
- Child components (`SocietyHeader`, `SocietyHero`, `SocietyTabs`) to isolate the page component.
- Library functions (`getUserPrivilege`) to simulate user permission checks.

#### Test Coverage

- **Rendering**: Covers initial loading state, error states (no ID, society not found), and successful data rendering.
- **Authorization**: Ensures the `isManagementView` prop is correctly passed based on user privilege (Admin/Society Head).
- **Redirects**: Verifies that unauthorized users (normal users or unauthenticated visitors) are redirected away from the page.
- **Event Handlers**: Confirms that `handleDeleteEvent` and `handleEditEvent` correctly call the appropriate Firestore functions with the right parameters.

#### Edge Cases

- URL does not contain a society ID.
- The requested society ID does not exist in Firestore.
- A user is not logged in when viewing the page.
- A logged-in user does not have Admin or Society Head privileges.

#### Expected Values

**Authorization & Redirects:**
- User Privilege >= 2 (Admin): `isManagementView` is true, no redirect.
- User is a Society Head: `isManagementView` is true, no redirect.
- User Privilege < 2 (Normal User): Redirect to `/coming-soon`.
- No authenticated user: Redirect to `/coming-soon`.

**Event Deletion:**
- `handleDeleteEvent('event-id')` calls `deleteDoc` with the event's path and `updateDoc` to remove the ID from the society's event list.

**Event Editing:**
- `handleEditEvent({...})` calls `updateDoc` with the event's path and ensures the `status` field is lowercased.

### VerifyEmail

**File**: `app\verify-email\page.test.tsx`

Test suite for Email Verification page

Comprehensive tests for the email verification flow covering:
- Authentication checks (redirect to signup if not signed in)
- Verification status display (email, instructions, verification state)
- Resend verification email functionality
- Privilege-based routing (waitlist for users, admin for admins)
- Firestore updates (emailVerified field, timestamp)
- Error handling (unverified state, network errors)
- User experience (loading states, success messages)

#### Test Coverage

- **Authentication Tests**: Redirect to signup if not signed in
- **Verification Display**: Shows user email, instructions, verification status
- **Resend Functionality**: Sends new verification email on button click
- **Check Verification**: Reloads user, checks emailVerified status
- **Privilege Routing**: Redirects based on privilege level (0/1 → waitlist, 2 → admin)
- **Firestore Updates**: Updates emailVerified and timestamp on verification
- **Error Handling**: Displays errors for unverified state, network failures
- **Already Verified**: Redirects if user revisits page after verification

#### Edge Cases

- Not signed in: redirect to /signup
- Unverified email: shows verification page with resend option
- Already verified user: immediate redirect based on privilege
- Privilege 0 (normal user): redirect to /waitlist
- Privilege 1 (society head): redirect to /waitlist
- Privilege 2 (admin): redirect to /admin
- Network error during resend: error message displayed
- Firestore update fails: error handled gracefully

#### Expected Values

**Authentication:**
- Not signed in: redirect to /signup
- Signed in: verification page loads

**Email Display:**
- User email shown: e.g., "test@example.com"
- Instructions: "A verification link has been sent"
- Resend button: "Resend Verification Email"
- Check button: "I've Verified My Email"

**Verification Flow:**
- Resend: calls sendEmailVerification
- Check: reloads user, checks emailVerified
- Success: updates Firestore with emailVerified=true and timestamp

**Routing:**
- Verified + privilege 0: redirect to /waitlist
- Verified + privilege 1: redirect to /waitlist
- Verified + privilege 2: redirect to /admin
- Already verified on page load: immediate redirect

**Error Messages:**
- Unverified: "Your email is not verified yet"
- Resend error: "Failed to send verification email"
- Update error: Firestore errors handled

**Firestore Updates:**
- Field: emailVerified = true
- Field: emailVerifiedAt = ISO timestamp
- Document: users/{userId}

### CallToAction

**File**: `components\call-to-action.test.tsx`

Test suite for Call-to-Action component

Tests for the promotional call-to-action section covering:
- Semantic HTML structure (section element)
- Heading display for context (h2 heading)
- Primary CTA button rendering and functionality
- Navigation link to signup page
- Descriptive paragraph content
- Button accessibility and meaningful content
- Semantic heading hierarchy

#### Test Coverage

- **Structure Tests**: Validates section element and semantic HTML
- **Content Tests**: Ensures heading and paragraphs render
- **Interactive Tests**: Verifies button and link functionality
- **Accessibility Tests**: Confirms button has meaningful content and is enabled
- **SEO Tests**: Checks proper heading hierarchy for screen readers

#### Edge Cases

- Multiple paragraphs for trust indicators
- Button must have non-empty text content
- At least one heading for accessibility

#### Expected Values

- 1 section element
- 1 h2 heading
- 1 enabled button
- Link href: /signup
- At least 1 paragraph
- Button text length > 0
- At least 1 heading for screen readers

### DeleteConfirmModal

**File**: `components\events\delete-confirm-modal.test.tsx`

Test suite for DeleteConfirmModal component

Comprehensive tests covering:
- Modal rendering and visibility
- Confirmation and cancellation actions
- Backdrop click prevention
- Display of item name and type

#### Test Coverage

- **Rendering**: Modal displays correctly with all elements
- **User Actions**: Confirm and cancel button functionality
- **Props**: Item name and type customization

#### Edge Cases

- Modal closed by default when isOpen=false
- Cannot close modal by clicking backdrop
- Default item type is "item"

### EditableIcon

**File**: `components\events\editable-icon.test.tsx`

Test suite for EditableIcon component

Comprehensive tests covering:
- Icon rendering
- Click event handling
- Accessibility attributes

#### Test Coverage

- **Rendering**: Icon displays correctly
- **Interaction**: Click handler is called
- **Accessibility**: Title attribute is present

#### Edge Cases

- Multiple clicks trigger onClick multiple times
- Icon is accessible via keyboard

### EventHeader

**File**: `components\events\event-header.test.tsx`

Test suite for EventHeader component

Comprehensive tests covering:
- Header rendering with authentication states
- Favorite toggle functionality
- Share button interaction
- Navigation elements
- ProfileMenu integration

#### Test Coverage

- **Authentication**: Renders correctly for authenticated and unauthenticated users
- **Favorite Button**: Toggle state and callback
- **Navigation**: Back button and authentication buttons
- **Profile Menu**: Shows for authenticated users

#### Edge Cases

- User is null (unauthenticated)
- User is authenticated
- Favorite state changes

### ImageUploadModal

**File**: `components\events\image-upload-modal.test.tsx`

Test suite for ImageUploadModal component

Comprehensive tests covering:
- Modal rendering and visibility
- File drag-and-drop functionality
- File input selection
- Upload progress states
- File size display

#### Test Coverage

- **Rendering**: Modal displays with upload UI
- **File Selection**: Browse button and file input
- **Drag and Drop**: Drag states and file drop
- **Upload States**: Loading state during upload

#### Edge Cases

- Modal closed by default when isOpen=false
- Upload progress disables interactions
- Custom title and maxSizeKB props

### Footer

**File**: `components\footer.test.tsx`

Test suite for Footer component

Tests for the minimalist footer section covering:
- Semantic HTML structure (footer element)
- Copyright text display with current year

#### Test Coverage

- **Structure Tests**: Validates footer element exists
- **Content Tests**: Ensures copyright text with year 2025 renders

#### Edge Cases

- Copyright text must include year 2025
- Text must be in a paragraph element

#### Expected Values

- 1 footer element
- 1 paragraph containing "2025"
- Copyright text: "© 2025 IBA Event Management System"

### Header

**File**: `components\header.test.tsx`

Test suite for Header navigation component

Comprehensive tests for the site header/navigation bar covering:
- Semantic HTML structure (header element)
- Brand logo rendering and navigation
- Search button functionality (disabled state)
- Login button rendering and navigation
- Sign up button rendering and navigation
- Profile menu for authenticated users
- Navigation behavior with Next.js router
- Button states and accessibility
- Firebase authentication integration

#### Test Coverage

- **Structure Tests**: Validates header element exists
- **Content Tests**: Ensures logo and buttons render
- **Navigation Tests**: Verifies router.push calls for login/signup/home
- **Interactive Tests**: Confirms button clicks trigger navigation
- **Accessibility Tests**: Checks action buttons are enabled, search is disabled
- **Authentication Tests**: Validates login/signup vs ProfileMenu display

#### Edge Cases

- Disabled search button with "Coming soon" tooltip
- Authenticated vs unauthenticated UI states
- Multiple buttons with different states
- User interaction with userEvent for realistic testing
- Mocked Firebase auth and Next.js router
- Text matching with case-insensitive search

#### Expected Values

- 1 header element
- At least 3 buttons (search + login + sign up) when not authenticated
- Login button navigates to: /signin
- Sign up button navigates to: /signup
- Logo navigates to: /
- Search button is disabled
- ProfileMenu shown when user is authenticated
- Login/signup buttons hidden when authenticated

### Hero

**File**: `components\hero.test.tsx`

Test suite for Hero component

Comprehensive tests for the Hero section component covering:
- Semantic HTML structure (section element)
- Heading hierarchy (h1 main heading)
- Badge rendering for promotional content
- Description paragraph display
- Dynamic statistics fetching and display
- Call-to-action buttons (Join Waitlist, Already have account)
- Navigation links (signup, signin)
- Button accessibility and enabled states
- Promotional content sections

#### Test Coverage

- **Structure Tests**: Validates semantic HTML and component structure
- **Content Tests**: Ensures all required text elements render
- **Statistics Tests**: Verifies async data fetching displays correctly
- **Interactive Tests**: Confirms buttons and links are functional
- **Accessibility Tests**: Checks heading hierarchy and button states

#### Edge Cases

- Async state updates with waitFor to prevent act() warnings
- Multiple buttons rendered (primary and secondary CTAs)
- Statistics loaded from mocked Firestore (50 events, 25 societies, 1000 users)

#### Expected Values

- Total Events: 50
- Total Societies: 25
- Total Users: 1000
- Minimum 2 buttons (Join Waitlist + Already have account)
- Links: /signup and /signin
- All buttons enabled by default

### ProfileMenu

**File**: `components\profile-menu.test.tsx`

Test suite for ProfileMenu component

Comprehensive tests covering:
- Authentication state handling
- Menu rendering and visibility
- Role-based menu items (Normal User, Society Head, Admin)
- Navigation functionality
- Logout functionality
- Click-outside to close behavior

#### Test Coverage

- **Authentication**: Renders only for authenticated users
- **Role-Based Display**: Different menu items based on user privilege
- **Navigation**: Profile, Dashboard, Society, Calendar links
- **Logout**: Sign out functionality

#### Edge Cases

- User is null (should not render)
- Normal user (basic menu items)
- Society Head (shows My Society link)
- Admin (shows Dashboard link)
- Menu closes when clicking outside

### EditEventModal

**File**: `components\societies\edit-event-modal.test.tsx`

Test suite for EditEventModal component

Tests for the event editing modal dialog:
- Form rendering with initial event data
- Input field updates and changes
- Form submission with updated data
- Modal visibility and close behavior
- Status dropdown selection

#### Test Coverage

- **Rendering Tests**: Initial values displayed correctly
- **Input Tests**: Title, date, time, location, description changes
- **Status Tests**: Dropdown selection updates
- **Submission Tests**: Form data passed to onSubmit handler

### SocietyHeader

**File**: `components\societies\society-header.test.tsx`

Test suite for SocietyHeader component

Tests for the society page header navigation:
- Header rendering with logo and branding
- Navigation links functionality
- ProfileMenu integration

#### Test Coverage

- **Rendering Tests**: Logo, branding, navigation links
- **Integration Tests**: ProfileMenu component rendering
- **Navigation Tests**: Dashboard link

#### Edge Cases

- ProfileMenu handles auth internally (tested in profile-menu.test.tsx)

### SocietyHero

**File**: `components\societies\society-hero.test.tsx`

Test suite for SocietyHero component

Tests for the society hero section:
- Hero rendering with society information
- Theme-based styling and visual elements
- Action buttons (Follow, Share, Settings)
- Management view conditional rendering
- Responsive behavior

#### Test Coverage

- **Rendering Tests**: Society name, theme application, buttons
- **Management View**: Settings button visibility for authorized users
- **Interaction Tests**: Button clicks, navigation

#### Edge Cases

- Management view vs public view rendering
- Different theme applications

### SocietyTabs

**File**: `components\societies\society-tabs.test.tsx`

Test suite for SocietyTabs component

Tests for the society tabbed interface:
- Tab navigation (About, Events, Team)
- About tab: Society info, heads, social links
- Events tab: Event list, search, filter, management
- Team tab: Team members display
- Management permissions and controls

#### Test Coverage

- **Tab Navigation**: Switching between About/Events/Team tabs
- **About Tab**: Description, heads info, social links
- **Events Tab**: Event grid, search functionality, filters
- **Management Features**: Create/edit/delete events (authorized users)

#### Edge Cases

- Empty event lists
- Management view vs public view
- Search with no results

### Event Formatters

**File**: `lib\events\formatters.test.ts`

Test suite for event formatting utilities

Comprehensive tests covering:
- Date formatting (single dates)
- Time formatting
- Venue formatting with various inputs
- Date range formatting (single-day and multi-day)

#### Test Coverage

- **formatDate**: Converts date strings to readable format
- **formatTime**: Time string handling
- **formatVenue**: Venue details assembly with fallbacks
- **formatDateRange**: Smart date range formatting

#### Edge Cases

- Missing venue details (fallback to TBA)
- Same start and end dates (single date display)
- Partial venue information

#### Expected Values

**formatDate:**
- '2024-01-15': 'January 15, 2024'

**formatVenue:**
- Complete details: 'Building, Room'
- Missing details: 'TBA' or fallback value

**formatDateRange:**
- Same dates: Single date display
- Different dates: 'Date1 - Date2'

### Event Validation

**File**: `lib\events\validation.test.ts`

Test suite for event file validation utilities

Comprehensive tests covering:
- Image file validation (type and size)
- Document file validation (type and size)
- File size formatting
- Validation constants

#### Test Coverage

- **validateImageFile**: Type and size checks for images
- **validateDocumentFile**: Type and size checks for documents
- **formatFileSize**: Byte to human-readable conversion
- **Constants**: MAX_IMAGE_SIZE, MAX_DOCUMENT_SIZE, ALLOWED_TYPES

#### Edge Cases

- Files at exact size limits
- Files exceeding size limits
- Invalid file types
- Various file sizes (bytes, KB, MB)

#### Expected Values

**Image Validation:**
- Valid types: JPEG, PNG, GIF, WebP
- Max size: 512KB

**Document Validation:**
- Valid types: PDF, DOC, DOCX, PPT, PPTX
- Max size: 10MB

**File Size Formatting:**
- 500 bytes: "500 B"
- 2048 bytes: "2.0 KB"
- 5242880 bytes: "5.0 MB"

### Privileges

**File**: `lib\privileges.test.ts`

Test suite for user privilege management system

Comprehensive tests for role-based access control covering:
- UserPrivilege enum (NORMAL_USER: 0, SOCIETY_HEAD: 1, ADMIN: 2)
- getUserPrivilege: Fetch user's privilege level from Firestore
- updateUserPrivilege: Update user's privilege with timestamp
- isNormalUser: Check if user has normal user privileges
- isSocietyHead: Check if user is a society head
- isAdmin: Check if user has admin privileges
- canManageSociety: Check if user can manage societies (head or admin)
- getPrivilegeName: Get human-readable privilege name

#### Test Coverage

- **Enum Tests**: Validates privilege level values (0, 1, 2)
- **getUserPrivilege**: Document existence, missing fields, errors, all privilege levels
- **updateUserPrivilege**: Updates with timestamps, downgrades, error handling
- **Role Checkers**: isNormalUser, isSocietyHead, isAdmin, canManageSociety
- **Utility Tests**: getPrivilegeName for all levels and invalid inputs

#### Edge Cases

- Missing user document returns 0 (normal user)
- Missing privilege field defaults to 0
- Firestore errors return 0 with console.error
- Timestamp included in all privilege updates
- Update failures throw errors
- Invalid privilege levels return "Unknown"
- NaN and Infinity handled in getPrivilegeName

#### Expected Values

**UserPrivilege Enum:**
- NORMAL_USER: 0
- SOCIETY_HEAD: 1
- ADMIN: 2

**getUserPrivilege:**
- Existing user with privilege: returns privilege level (0, 1, or 2)
- Non-existent user: returns 0
- Missing privilege field: returns 0
- Error: returns 0 (with console.error)

**updateUserPrivilege:**
- Updates privilege field to new level
- Includes privilegeUpdatedAt timestamp (ISO string)
- Timestamp between before and after update time
- Throws error on Firestore failure

**Role Checkers:**
- isNormalUser: true only for privilege 0
- isSocietyHead: true only for privilege 1
- isAdmin: true only for privilege 2
- canManageSociety: true for privilege >= 1 (society head or admin)

**getPrivilegeName:**
- 0 → "Normal User"
- 1 → "Society Head"
- 2 → "Admin"
- Invalid (3, -1, 999, NaN, Infinity) → "Unknown"

### Society Types

**File**: `lib\societies\types.test.ts`

Test suite for society and event type definitions

These are structural tests to document the expected shape of data
and catch accidental interface changes that could break components.

#### Test Coverage

- **Type Validation**: Ensures objects conform to Society, Member, Event interfaces
- **Required Fields**: Validates all required properties are present
- **Optional Fields**: Tests nullable and optional fields (heads can be null)
- **Nested Objects**: Validates structure of heads, socialLinks, metrics

### Stats

**File**: `lib\stats.test.ts`

Test suite for statistics utility functions

Comprehensive tests for Firestore statistics functions covering:
- getTotalSocieties: Fetch count of all societies
- getTotalUsers: Fetch count of all registered users
- getTotalEvents: Fetch count of all events
- Error handling and fallback to 0
- Edge cases (zero values, large numbers, undefined counts)

#### Test Coverage

- **Success Cases**: Validates correct Firestore collection queries and count retrieval
- **Error Handling**: Ensures functions return 0 on errors with console logging
- **Edge Cases**: Tests zero values, large numbers, missing data, undefined counts
- **Integration Tests**: Verifies correct collection names for all functions

#### Edge Cases

- Firestore errors return 0 instead of throwing
- Missing count field in snapshot returns undefined
- Zero count handled correctly (not treated as error)
- Large numbers (999999) processed correctly
- Console.error called on failures

#### Expected Values

**getTotalSocieties:**
- Success: 25 societies
- Error: 0 (with console.error)
- Missing count: undefined
- Collection: 'societies'

**getTotalUsers:**
- Success: 1000 users
- Error: 0 (with console.error)
- Zero users: 0 (valid)
- Collection: 'users'

**getTotalEvents:**
- Success: 50 events
- Error: 0 (with console.error)
- Large count: 999999
- Collection: 'events'


# Pull Request: Unified Event Detail Page with Role-Based Access Control

## Summary
This PR implements a comprehensive unified event detail page at `/events/[id]` that provides different views and capabilities based on user roles. The page features dynamic data fetching from Firebase, role-based editing permissions, view count tracking, and complete CRUD operations for events, modules, and speakers.

## Type of Change
- [x] New feature (feat)
- [ ] Bug fix (fix)
- [ ] Documentation update (docs)
- [ ] Code refactor (refactor)
- [ ] Performance improvement (perf)
- [ ] Tests (test)
- [ ] Chore/tooling (chore)

## Features Implemented

### 1. Core Event Detail Page
- Dynamic routing with Next.js App Router at `/events/[id]`
- Real-time data fetching from Firebase Firestore (events, subEvents, speakers collections)
- Tabbed navigation system (Description, Modules, Speakers, Contact)
- Responsive UI with glassmorphism effects and modern design
- Loading states and error handling

### 2. Role-Based Access Control
- **Unauthenticated Users**: View-only access to all event information
- **Normal Users (UserPrivilege.NORMAL)**: View-only access with view count tracking
- **Society Heads (UserPrivilege.SOCIETY_HEAD)**: Full edit access for their society's events
- **Admins (UserPrivilege.ADMIN)**: Full edit access for all events
- Conditional rendering of edit icons and action buttons based on `canEdit` permission

### 3. View Count Tracking
- Automatically increments view count when logged-in non-members view events
- Uses `eventEngagement` collection with composite keys (`eventId_userId`)
- Only tracks views for users who cannot edit the event
- Prevents duplicate view counting per user

### 4. Content Management
- **Inline Editing**: Click pencil icons to edit event fields (title, description, venue, times, registration link)
- **Modal-Based Editing**: Clean UI for editing complex fields
- **Real-time Updates**: All changes immediately saved to Firestore
- **Contact Section**: Edit address and map link for venue details

### 5. Module Management (SubEvents)
- Add new modules with title, description, start/end times, venue, documents array, and speaker assignments
- Inline editing of all module fields with individual save buttons
- Delete modules with proper cleanup (removes from parent event's `subEventIds` array)
- Module detail modal for viewing complete information
- Automatic Firestore persistence for all operations

### 6. Speaker Management
- Add new speakers with name, bio, profile image, and social links
- Delete speakers from events (updates speaker's `eventIds` array)
- Display speaker cards with profile images and bio
- Proper relationship management between speakers and events

### 7. Data Handling
- Mixed Timestamp support: Handles both Firestore Timestamp objects and string dates
- Conditional rendering: `data.field?.toDate ? data.field.toDate().toLocaleDateString() : data.field || ""`
- Proper null/undefined checks throughout the component
- Type-safe operations with TypeScript interfaces

## Technical Details

### Files Added/Modified
- `app/events/[id]/page.tsx` - Main event detail page component (1600+ lines)
- `app/events/[id]/page.test.tsx` - Comprehensive test suite (900+ lines)
- `firebase.ts` - Added auth and storage exports
- `jest.setup.ts` - Added React act() warning suppression

### Key Dependencies
- Firebase Firestore (doc, getDoc, getDocs, query, where, updateDoc, addDoc, setDoc, Timestamp, arrayUnion)
- Firebase Storage (ref, uploadBytes, getDownloadURL)
- Firebase Auth (onAuthStateChanged, getAuth)
- Next.js App Router (useParams, useRouter, dynamic routing)
- React hooks (useState, useEffect)

### Database Collections Used
- `events` - Main event data
- `subEvents` - Event modules/sessions
- `speakers` - Speaker profiles
- `eventEngagement` - View count tracking

## Bug Fixes
- Fixed Timestamp conversion errors with mixed data types
- Removed placeholder "coming soon" alerts from working delete operations
- Properly handled Firestore Timestamp vs string date formats
- Fixed speaker deletion to update relationships correctly

## Testing Checklist
- [x] Tests have been added for new code (32 comprehensive test cases)
- [x] All tests pass locally (`npm test`)
- [x] Code has been linted (`npm run lint`)
- [x] Build succeeds (`npm run build`)

## Test Coverage
All 32 tests passing consistently:
```
PASS app/events/[id]/page.test.tsx
Test Suites: 1 passed, 1 total
Tests: 32 passed, 32 total
```

### Test Categories:
- Loading State (1 test)
- Error Handling (2 tests)
- Data Fetching (4 tests)
- Role-Based Access Control (5 tests)
- View Count Tracking (3 tests)
- Tab Navigation (1 test)
- Edit Modal (2 tests)
- Image Upload (1 test)
- Add Module (2 tests)
- Add Speaker (2 tests)
- Delete Operations (3 tests)
- Venue Details (2 tests)
- Event Status (2 tests)
- Tags Display (2 tests)

## Related Issues
<!-- Reference any related issues (e.g., Closes #123) -->

## Screenshots (if applicable)
<!-- Add screenshots for UI changes showing view-only mode, edit mode, modals, and image upload -->

## Additional Notes
- React act() warnings have been suppressed in test setup for cleaner output
- All CRUD operations are properly persisted to Firestore
- Role-based permissions are enforced at the component level

---
outline: [2, 4]
---

# Library Functions

Utility functions for privileges, statistics, and more

## Event Formatters

### formatDate

**File**: `lib\events\formatters.ts`

Formats a date string into a human-readable format

#### Returns

Formats a date string into a human-readable format

#### Example

```ts
formatDate('2024-01-15')
// Returns: "January 15, 2024"
```

### formatTime

**File**: `lib\events\formatters.ts`

Formats a time string for display

Currently returns the time string unchanged. Future enhancements
could include 12/24 hour format conversion or localization.

#### Returns

Formats a time string for display

#### Example

```ts
formatTime('14:30')
// Returns: "14:30"
```

### formatVenue

**File**: `lib\events\formatters.ts`

Formats venue information into a readable string

Combines building and room information when both are available.
Falls back to provided fallbackVenue or 'TBA' if venue details are incomplete.

#### Returns

Formats venue information into a readable string

#### Example

No venue information:
```ts
formatVenue(undefined)
// Returns: "TBA"
```

### formatDateRange

**File**: `lib\events\formatters.ts`

Formats a date range for display, handling single-day events

Smart formatting that:
- Shows single date if start and end are the same
- Shows date range with hyphen if dates differ
- Uses formatDate() for consistent formatting

#### Returns

Formats a date range for display, handling single-day events

#### Example

Multi-day event:
```ts
formatDateRange('2024-01-15', '2024-01-17')
// Returns: "January 15, 2024 - January 17, 2024"
```

## Event Validation

### validateImageFile

**File**: `lib\events\validation.ts`

Validates an image file for type and size constraints

Validation checks:
1. File type must be in ALLOWED_IMAGE_TYPES (JPEG, PNG, GIF, WebP)
2. File size must not exceed MAX_IMAGE_SIZE_KB (512KB)
Returns an object with:
- `valid`: boolean indicating if file passed validation
- `error`: string with user-friendly error message (only if invalid)

#### Returns

Validates an image file for type and size constraints

#### Example

File too large:
```ts
const largeFile = new File([new ArrayBuffer(600 * 1024)], 'large.jpg', { type: 'image/jpeg' })
const result = validateImageFile(largeFile)
// result: { valid: false, error: 'Image size must be less than 512KB' }
```

### validateDocumentFile

**File**: `lib\events\validation.ts`

Validates a document file for type and size constraints

Validation checks:
1. File type must be in ALLOWED_DOCUMENT_TYPES (PDF, DOC, DOCX, PPT, PPTX)
2. File size must not exceed MAX_DOCUMENT_SIZE_MB (10MB)
Returns an object with:
- `valid`: boolean indicating if file passed validation
- `error`: string with user-friendly error message (only if invalid)

#### Returns

Validates a document file for type and size constraints

#### Example

File too large:
```ts
const largeFile = new File([new ArrayBuffer(15 * 1024 * 1024)], 'huge.pdf', { type: 'application/pdf' })
const result = validateDocumentFile(largeFile)
// result: { valid: false, error: 'Document size must be less than 10MB' }
```

### formatFileSize

**File**: `lib\events\validation.ts`

Converts file size in bytes to human-readable format

Formatting rules:
- Less than 1024 bytes: Shows as "X B"
- Less than 1MB: Shows as "X.X KB"
- 1MB or greater: Shows as "X.X MB"
Values are rounded to 1 decimal place for KB and MB.

#### Returns

Converts file size in bytes to human-readable format

#### Example

Megabytes:
```ts
formatFileSize(5242880)
// Returns: "5.0 MB"

formatFileSize(10485760)
// Returns: "10.0 MB"
```

## Privileges

### getUserPrivilege

**File**: `lib\privileges.ts`

Retrieves a user's privilege level from Firestore.

#### Returns

Retrieves a user's privilege level from Firestore.
         Returns 0 (Normal User) if the user document doesn't exist or on error.

#### Example

```tsx
const privilege = await getUserPrivilege(user.uid);
if (privilege === UserPrivilege.ADMIN) {
  router.push('/admin');
}
```

### updateUserPrivilege

**File**: `lib\privileges.ts`

Updates a user's privilege level in Firestore.

This function should only be called by:
- Admins managing user roles
- System processes during society head assignment
The function automatically records a timestamp of when the privilege was updated.

#### Example

Promoting a user to society head:
```ts
try {
  await updateUserPrivilege(userId, UserPrivilege.SOCIETY_HEAD);
  console.log('User promoted to Society Head');
} catch (error) {
  console.error('Failed to update privilege:', error);
}
```

### isNormalUser

**File**: `lib\privileges.ts`

Checks if a user has normal user privileges.

#### Returns

Checks if a user has normal user privileges.

#### Example

```ts
if (await isNormalUser(userId)) {
  // Show limited features
}
```

### isSocietyHead

**File**: `lib\privileges.ts`

Checks if a user is a society head.

This returns false for admins. Use {@link canManageSociety} to check for
society management permissions regardless of exact level.

#### Returns

Checks if a user is a society head.

#### Example

```ts
if (await isSocietyHead(userId)) {
  // Show society management features
}
```

### isAdmin

**File**: `lib\privileges.ts`

Checks if a user is an administrator.

#### Returns

Checks if a user is an administrator.

#### Example

```ts
if (await isAdmin(userId)) {
  // Show admin dashboard
}
```

### canManageSociety

**File**: `lib\privileges.ts`

Checks if a user can manage societies (society head or admin).

This is useful for checking permissions without caring about the exact role.
Both society heads and admins can manage societies.

#### Returns

Checks if a user can manage societies (society head or admin).

#### Example

```ts
if (await canManageSociety(userId)) {
  // Allow event creation
}
```

### getPrivilegeName

**File**: `lib\privileges.ts`

Converts a numeric privilege level to its human-readable name.

#### Returns

Converts a numeric privilege level to its human-readable name.

#### Example

```tsx
const roleName = getPrivilegeName(user.privilege);
// Returns: "Normal User", "Society Head", or "Admin"
```

## Stats

### getTotalSocieties

**File**: `lib\stats.ts`

Fetches the total number of societies registered in the system.

#### Returns

Fetches the total number of societies registered in the system.
         Returns 0 if an error occurs during the fetch operation.

#### Example

Using with React state:
```tsx
const [societyCount, setSocietyCount] = useState(0);

useEffect(() => {
  getTotalSocieties().then(setSocietyCount);
}, []);
```

### getTotalUsers

**File**: `lib\stats.ts`

Fetches the total number of registered users in the system.

#### Returns

Fetches the total number of registered users in the system.
         Returns 0 if an error occurs during the fetch operation.

#### Example

Fetching user count for dashboard statistics:
```tsx
const userCount = await getTotalUsers();
setStats(prev => ({ ...prev, users: userCount }));
```

### getTotalEvents

**File**: `lib\stats.ts`

Fetches the total number of events created in the system.

#### Returns

Fetches the total number of events created in the system.
         Returns 0 if an error occurs during the fetch operation.

#### Example

Using all statistics functions together:
```tsx
const [stats, setStats] = useState({ events: 0, societies: 0, users: 0 });

useEffect(() => {
  async function fetchAllStats() {
    const [events, societies, users] = await Promise.all([
      getTotalEvents(),
      getTotalSocieties(),
      getTotalUsers(),
    ]);
    setStats({ events, societies, users });
  }
  fetchAllStats();
}, []);
```


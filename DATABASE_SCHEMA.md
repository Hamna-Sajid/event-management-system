# Database Schema Documentation

## Overview
This document describes the Firebase Firestore database schema for the IBA Event Management System.

## Collections

### 1. Users Collection (`users/{uid}`)

Stores information about all registered users in the system.

#### Fields:
- `email` (string): User's email address (@khi.iba.edu.pk for students)
- `fullName` (string): User's full name
- `privilege` (number): User's privilege level
  - `0`: Normal user (default)
  - `1`: Society head (CEO/CFO/COO)
  - `2`: Admin
- `emailVerified` (boolean): Whether the user's email has been verified
- `createdAt` (timestamp): Account creation timestamp

#### Additional Fields for Society Heads (privilege = 1):
- `societyId` (string): ID of the society they belong to
- `societyRole` (string): Their role in the society (`"CEO"`, `"CFO"`, or `"COO"`)

#### Validation Rules:
- **Email Domain**: Must end with `@khi.iba.edu.pk` for IBA Karachi students
- **Email Verification**: Users must verify their email (`emailVerified = true`) before being assigned as society heads
- **Single Society Head**: A user with `privilege = 1` can only be a head of one society at a time
- **Unique Roles**: Each role (CEO/CFO/COO) can only be assigned to one person per society

#### Example Document:
```json
{
  "email": "student@khi.iba.edu.pk",
  "fullName": "John Doe",
  "privilege": 1,
  "emailVerified": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "societyId": "dramatics-society",
  "societyRole": "CEO"
}
```

---

### 2. Societies Collection (`societies/{society-id}`)

Stores information about all societies registered in the system.

#### Fields:
- `name` (string): Society name
- `dateCreated` (string): ISO timestamp of when the society was created
- `heads` (object): Object containing society head UIDs
  - `CEO` (string | null): User ID of the CEO, or `null` if vacant
  - `CFO` (string | null): User ID of the CFO, or `null` if vacant
  - `COO` (string | null): User ID of the COO, or `null` if vacant
- `maxHeads` (number): Maximum number of heads allowed (default: 3)
- `description` (string): Society description
- `contactEmail` (string): Society contact email
- `socialLinks` (object): Social media links
  - `facebook` (string): Facebook page URL
  - `instagram` (string): Instagram profile URL
  - `linkedin` (string): LinkedIn page URL
- `events` (array): Array of event IDs associated with this society
- `createdBy` (string): Email of the admin who created the society

#### Example Document:
```json
{
  "name": "Dramatics Society",
  "dateCreated": "2024-01-15T10:30:00Z",
  "heads": {
    "CEO": "user123",
    "CFO": "user456",
    "COO": null
  },
  "maxHeads": 3,
  "description": "The official dramatics society of IBA",
  "contactEmail": "dramatics@khi.iba.edu.pk",
  "socialLinks": {
    "facebook": "https://facebook.com/ibadramatics",
    "instagram": "https://instagram.com/ibadramatics",
    "linkedin": ""
  },
  "events": [],
  "createdBy": "admin@khi.iba.edu.pk"
}
```

---

## Schema Design Principles

### 1. Data Normalization
The schema is designed to minimize data redundancy:
- **Society heads** are stored as UIDs in the `societies` collection
- Full user information (name, email) is stored only in the `users` collection
- When displaying heads, the system fetches user details using the stored UIDs

### 2. Benefits of Current Design
- **Single Source of Truth**: User information exists in only one place
- **Easy Updates**: Changing a user's name only requires updating the `users` collection
- **Referential Integrity**: Uses UIDs as foreign keys to maintain relationships
- **Scalability**: Reduces document size in the `societies` collection

### 3. Trade-offs
- **Read Performance**: Requires additional reads to fetch user details when displaying heads
- **Complexity**: Needs to join data from multiple collections in the application layer
- **Cache Management**: Application maintains a cache (`headDetails`) to reduce Firestore reads

---

## Business Rules & Constraints

### Society Management
1. **Unique Society Names**: No two societies can have the same name
   - Society IDs are generated from names (lowercase with hyphens)
   - System checks for existing society before creation

2. **Society Head Constraints**:
   - Each society has exactly 3 head positions: CEO, CFO, COO
   - Each position can only be filled by one person
   - A person can only be a head of ONE society at a time
   - Only verified users (`emailVerified = true`) can be assigned as heads

### User Privilege Levels
- **Level 0 (Normal User)**: Default state, can browse events and register
- **Level 1 (Society Head)**: Can manage their society's events (not yet implemented)
- **Level 2 (Admin)**: Can create societies, assign heads, manage all events

### Email Verification
- All users must verify their email before being assigned as society heads
- Email verification flow redirects users based on privilege:
  - `privilege < 2`: Redirects to `/waitlist`
  - `privilege >= 2`: Redirects to `/admin`

---

## Access Patterns

### Admin Dashboard Operations

#### Creating a Society:
1. Generate society ID from society name (lowercase, hyphens for spaces)
2. **Check for duplicate society names**: Verify society ID doesn't already exist
3. Admin creates a new society document with all heads set to `null`
4. Society document is created in `societies/{society-id}`

#### Assigning a Society Head:
1. Validate email domain (@khi.iba.edu.pk) - must be IBA Karachi email
2. Find user by email in `users` collection
3. **Check email verification**: User must have `emailVerified = true`
4. **Check single-society constraint**: User must not already be a head (`privilege = 1` with existing `societyId`)
5. Check if role is vacant (`heads[role] === null`)
6. **Check duplicate in same society**: User must not already be assigned to a different role in the same society
7. Update `users/{uid}`:
   - Set `privilege = 1`
   - Set `societyRole = "CEO"/"CFO"/"COO"`
   - Set `societyId = {society-id}`
8. Update `societies/{society-id}`:
   - Set `heads[role] = {uid}`

#### Removing a Society Head:
1. Get user ID from `societies/{society-id}/heads[role]`
2. Update `users/{uid}`:
   - Set `privilege = 0`
   - Remove `societyRole`
   - Remove `societyId`
3. Update `societies/{society-id}`:
   - Set `heads[role] = null`

#### Loading Dashboard:
1. Fetch all societies from `societies` collection
2. Collect all unique head UIDs from all societies
3. Batch fetch user details for all heads from `users` collection
4. Cache user details in application state for quick access

---

## Error Handling & User Feedback

### Toast Notifications
The system uses a toast notification system (slide-in from top-right) for user feedback:

#### Success Messages (Green):
- Successfully assigned society head with name and role confirmation

#### Error Messages (Red):
- **Duplicate Society**: "A society with the name '{name}' already exists. Please choose a different name."
- **Failed Creation**: "Failed to create society. Please try again."
- **Failed Head Removal**: "Failed to remove head. Please try again."
- **Invalid Email Domain**: "Only IBA Karachi email addresses (@khi.iba.edu.pk) are allowed."
- **Role Taken**: "{Role} role is already assigned. Please choose a different role."
- **User Not Found**: "User not found. They must sign up first with their @khi.iba.edu.pk email address."
- **Multi-Society Head**: "This user is already a {role} of {societyName}. A user can only be a head of one society at a time."
- **Already Head in Society**: "This user is already a head in this society."
- **Email Not Verified**: "This user has not verified their email address yet. They must verify their email before being assigned as a society head."
- **Failed Assignment**: "Failed to assign society head. Please try again."

---

## Future Enhancements

### Potential Improvements:
1. **Denormalization for Performance**: Store essential head info (name, email) in societies collection alongside UIDs
2. **Indexes**: Create composite indexes for common queries
3. **Events Collection**: Add a separate collection for events with references to societies
4. **Audit Logs**: Track all changes to societies and user privileges
5. **Role Hierarchy**: Implement more granular permissions beyond CEO/CFO/COO

### Migration Considerations:
When updating from the old schema (array-based heads) to the new schema:
1. Read existing societies documents
2. Transform `heads: [{id, name, email, role}]` to `heads: {CEO: uid, CFO: uid, COO: uid}`
3. Ensure all referenced users exist in `users` collection
4. Update documents in batched writes

# Database Schema Documentation

## Overview
This document describes the Firebase Firestore database schema for the IBA Event Management System.

## Collections

### 1. Users Collection (`users/{uid}`)

Stores information about all registered users in the system.

#### Fields:
- `email` (string): User's email address (@khi.iba.edu.pk for students)
- `fullName` (string): User's full name
- `mobileNumber` (string): User's mobile phone number
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
  "mobileNumber": "+92 300 1234567",
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
- `logo` (string): URL to logo in Firebase Storage
- `memberCount` (number): Number of members
- `updatedAt` (timestamp): Last update timestamp

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
  "createdBy": "admin@khi.iba.edu.pk",
  "logo": "https://storage.googleapis.com/...",
  "memberCount": 150,
  "updatedAt": "2024-01-20T14:30:00Z"
}
```

---

### 3. Events Collection (`events/{event-id}`)

Stores all events created by societies.

#### Fields:
- `societyId` (string): Reference to society document ID
- `societyName` (string): Denormalized society name for quick access
- `title` (string): Event title
- `description` (string): Event description
- `eventType` (string): Type of event
  - Options: `"competition"`, `"seminar"`, `"workshop"`, `"networking"`, `"conference"`, `"other"`
- `coverImage` (string): URL to cover image in Firebase Storage
- `galleryImages` (array): Array of URLs to gallery images
- `startDate` (timestamp): Event start date
- `startTime` (string): Start time (format: "HH:MM AM/PM")
- `endDate` (timestamp): Event end date
- `endTime` (string): End time (format: "HH:MM AM/PM")
- `venue` (string): Event venue name
- `venueDetails` (object): Detailed venue information
  - `building` (string): Building name
  - `room` (string): Room number
  - `address` (string): Full address
  - `mapLink` (string): Google Maps link
- `registrationLink` (string): External registration URL
- `registrationDeadline` (timestamp): Registration deadline
- `hasSubEvents` (boolean): Whether event has sub-events/modules
- `subEventIds` (array): Array of sub-event document IDs
- `status` (string): Event status
  - Options: `"draft"`, `"published"`, `"ongoing"`, `"completed"`, `"cancelled"`
- `isPublished` (boolean): Publication status
- `publishedAt` (timestamp): Publication timestamp
- `metrics` (object): Engagement metrics
  - `views` (number): Total views
  - `likes` (number): Total likes
  - `wishlists` (number): Total wishlists
  - `shares` (number): Total shares
- `tags` (array): Tags for search/filtering
- `searchKeywords` (array): Generated keywords for search
- `createdAt` (timestamp): Event creation timestamp
- `updatedAt` (timestamp): Last update timestamp
- `createdBy` (string): User ID who created the event

#### Example Document:
```json
{
  "societyId": "dramatics-society",
  "societyName": "Dramatics Society",
  "title": "Annual Theater Workshop",
  "description": "A comprehensive workshop on theater arts",
  "eventType": "workshop",
  "coverImage": "https://storage.googleapis.com/events/abc123/cover.jpg",
  "galleryImages": [],
  "startDate": "2024-03-15T10:00:00Z",
  "startTime": "10:00 AM",
  "endDate": "2024-03-15T16:00:00Z",
  "endTime": "04:00 PM",
  "venue": "Main Auditorium",
  "venueDetails": {
    "building": "Academic Block",
    "room": "Auditorium",
    "address": "IBA Main Campus, Karachi",
    "mapLink": "https://maps.google.com/..."
  },
  "registrationLink": "https://forms.google.com/...",
  "registrationDeadline": "2024-03-10T23:59:59Z",
  "hasSubEvents": true,
  "subEventIds": ["sub1", "sub2"],
  "status": "published",
  "isPublished": true,
  "publishedAt": "2024-02-15T10:00:00Z",
  "metrics": {
    "views": 150,
    "likes": 45,
    "wishlists": 30,
    "shares": 12
  },
  "tags": ["theater", "arts", "workshop"],
  "searchKeywords": ["theater", "drama", "acting", "workshop"],
  "createdAt": "2024-02-01T09:00:00Z",
  "updatedAt": "2024-02-15T10:00:00Z",
  "createdBy": "user123"
}
```

---

### 4. Sub-Events Collection (`subEvents/{subevent-id}`)

Stores sub-events or modules within a main event (workshops, competition rounds, etc.).

#### Fields:
- `parentEventId` (string): Reference to parent event document ID
- `societyId` (string): Reference to society document ID
- `title` (string): Sub-event title
- `description` (string): Sub-event description
- `coverImage` (string): Optional cover image URL
- `date` (timestamp): Sub-event date
- `time` (string): Start time (format: "HH:MM AM/PM")
- `duration` (string): Duration (e.g., "2 hours")
- `venue` (string): Venue (can override parent event venue)
- `registrationLink` (string): Optional separate registration
- `price` (string): Price information (e.g., "Free", "PKR 500")
- `documents` (array): Array of document objects
  - Each document object contains:
    - `id` (string): Document ID
    - `name` (string): File name
    - `url` (string): URL to file in Firebase Storage
    - `fileType` (string): File type (`"pdf"`, `"doc"`, `"ppt"`, `"other"`)
    - `size` (number): File size in bytes
    - `uploadedAt` (timestamp): Upload timestamp
- `speakerIds` (array): Array of speaker document IDs
- `order` (number): Display order within parent event
- `createdAt` (timestamp): Creation timestamp
- `updatedAt` (timestamp): Last update timestamp

#### Example Document:
```json
{
  "parentEventId": "event123",
  "societyId": "dramatics-society",
  "title": "Acting Fundamentals",
  "description": "Introduction to basic acting techniques",
  "coverImage": "https://storage.googleapis.com/...",
  "date": "2024-03-15T10:00:00Z",
  "time": "10:00 AM",
  "duration": "2 hours",
  "venue": "Room 101",
  "registrationLink": "",
  "price": "Free",
  "documents": [
    {
      "id": "doc1",
      "name": "Acting_Basics.pdf",
      "url": "https://storage.googleapis.com/...",
      "fileType": "pdf",
      "size": 2048576,
      "uploadedAt": "2024-02-20T14:30:00Z"
    }
  ],
  "speakerIds": ["speaker1"],
  "order": 1,
  "createdAt": "2024-02-01T09:00:00Z",
  "updatedAt": "2024-02-20T14:30:00Z"
}
```

---

### 5. Speakers Collection (`speakers/{speaker-id}`)

Stores speakers/facilitators for events and sub-events.

#### Fields:
- `name` (string): Speaker's full name
- `title` (string): Professional title (e.g., "CEO, Tech Corp")
- `bio` (string): Speaker biography
- `profileImage` (string): URL to profile image in Firebase Storage
- `email` (string): Contact email
- `linkedin` (string): LinkedIn profile URL
- `twitter` (string): Twitter profile URL
- `eventIds` (array): Array of event IDs where this speaker appears
- `subEventIds` (array): Array of sub-event IDs where this speaker appears
- `createdAt` (timestamp): Creation timestamp
- `updatedAt` (timestamp): Last update timestamp

#### Example Document:
```json
{
  "name": "Dr. John Smith",
  "title": "Professor of Theater Arts",
  "bio": "Dr. Smith has 20 years of experience in theater...",
  "profileImage": "https://storage.googleapis.com/...",
  "email": "john.smith@example.com",
  "linkedin": "https://linkedin.com/in/johnsmith",
  "twitter": "https://twitter.com/johnsmith",
  "eventIds": ["event123"],
  "subEventIds": ["sub1", "sub2"],
  "createdAt": "2024-02-01T09:00:00Z",
  "updatedAt": "2024-02-01T09:00:00Z"
}
```

---

### 6. Event Engagement Collection (`eventEngagement/{engagement-id}`)

Tracks detailed engagement metrics for each user-event interaction.

#### Document ID Format:
- Composite key: `{eventId}_{userId}`

#### Fields:
- `eventId` (string): Reference to event document ID
- `userId` (string): Reference to user document ID
- `hasViewed` (boolean): Whether user has viewed the event
- `viewedAt` (timestamp): First view timestamp
- `viewCount` (number): Number of times viewed
- `hasLiked` (boolean): Whether user has liked the event
- `likedAt` (timestamp): Like timestamp
- `hasWishlisted` (boolean): Whether user has wishlisted the event
- `wishlistedAt` (timestamp): Wishlist timestamp
- `hasShared` (boolean): Whether user has shared the event
- `sharedAt` (timestamp): Share timestamp
- `createdAt` (timestamp): First interaction timestamp
- `updatedAt` (timestamp): Last interaction timestamp

#### Example Document:
```json
{
  "eventId": "event123",
  "userId": "user456",
  "hasViewed": true,
  "viewedAt": "2024-02-15T10:00:00Z",
  "viewCount": 3,
  "hasLiked": true,
  "likedAt": "2024-02-15T10:05:00Z",
  "hasWishlisted": true,
  "wishlistedAt": "2024-02-15T10:10:00Z",
  "hasShared": false,
  "sharedAt": null,
  "createdAt": "2024-02-15T10:00:00Z",
  "updatedAt": "2024-02-16T14:30:00Z"
}
```

---

### 7. Event Analytics Collection (`eventAnalytics/{event-id}`)

Aggregated analytics per event (updated via Cloud Functions).

#### Document ID:
- Same as the event ID for easy lookup

#### Fields:
- `eventId` (string): Reference to event document ID
- `dailyViews` (array): Array of daily view objects
  - Each object contains:
    - `date` (string): Date in format "YYYY-MM-DD"
    - `count` (number): View count for that day
- `viewerRoles` (object): Breakdown by user role
  - `student` (number): Views by students
  - `society_admin` (number): Views by society admins
  - `guest` (number): Views by non-logged-in users
- `topTags` (array): Most used tags
- `shareCount` (number): Total share count
- `lastCalculatedAt` (timestamp): Last calculation timestamp

#### Example Document:
```json
{
  "eventId": "event123",
  "dailyViews": [
    {"date": "2024-02-15", "count": 45},
    {"date": "2024-02-16", "count": 67}
  ],
  "viewerRoles": {
    "student": 100,
    "society_admin": 15,
    "guest": 35
  },
  "topTags": ["theater", "arts", "workshop"],
  "shareCount": 12,
  "lastCalculatedAt": "2024-02-16T23:59:59Z"
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

### Event Management
1. **Single Event Per Day Per Society**: A society cannot have multiple events on the same day
   - Before creating an event, check for existing events by the same society with overlapping `startDate`
   - Query: `events` where `societyId == {society-id}` AND `startDate` (day) equals the new event's `startDate` (day)
   - If an event exists for that society on that day, reject the creation

2. **Event Creation Order**: Events must be created in a specific sequence
   - **Step 1**: Create the main event document in `events` collection
   - **Step 2**: Upload cover image and gallery images to Firebase Storage (if provided)
   - **Step 3**: Create sub-event documents in `subEvents` collection (if applicable)
   - **Step 4**: Create speaker documents in `speakers` collection (if applicable)
   - **Step 5**: Update main event with `subEventIds` array
   - **Step 6**: Update speakers with `eventIds` and `subEventIds` arrays

3. **Referential Integrity**: Sub-events and speakers cannot exist without their parent event
   - All sub-events must have a valid `parentEventId` that references an existing event
   - All speakers must be associated with at least one event or sub-event
   - Orphaned sub-events or speakers should be prevented or cleaned up

4. **Cascade Delete Operations**: When deleting an event, all related data must be cleaned up
   - **Delete Event Flow**:
     1. Fetch all sub-events where `parentEventId == {event-id}`
     2. For each sub-event:
        - Delete associated documents from Storage: `/subEvents/{subEventId}/documents/*`
        - Delete cover image from Storage: `/subEvents/{subEventId}/cover/*`
        - Delete sub-event document from Firestore
     3. Delete event's cover image from Storage: `/events/{eventId}/cover/*`
     4. Delete event's gallery images from Storage: `/events/{eventId}/gallery/*`
     5. Delete all `eventEngagement` documents where `eventId == {event-id}`
     6. Delete `eventAnalytics` document with ID `{event-id}`
     7. Update speakers: Remove `{event-id}` from `eventIds` arrays
     8. Update speakers: Remove all sub-event IDs from `subEventIds` arrays
     9. Delete speakers that have empty `eventIds` and `subEventIds` arrays (orphaned speakers)
     10. Update society document: Remove `{event-id}` from `events` array
     11. Finally, delete the main event document

5. **Storage Cleanup Rules**:
   - When updating `coverImage`: Delete old image from Storage before uploading new one
   - When updating `galleryImages`: Delete removed images from Storage
   - When deleting a sub-event: Delete all associated documents and images from Storage
   - When deleting a speaker: Delete profile image from Storage

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

### Event Management Operations

#### Creating an Event:
1. **Validate Single Event Per Day**:
   ```typescript
   const eventDate = new Date(startDate).toDateString()
   const existingEventsQuery = query(
     collection(firestore, "events"),
     where("societyId", "==", societyId),
     where("startDate", ">=", startOfDay),
     where("startDate", "<", endOfDay)
   )
   const existingEvents = await getDocs(existingEventsQuery)
   if (!existingEvents.empty) {
     throw new Error("Society already has an event scheduled on this date")
   }
   ```

2. **Create Main Event**: Add event document with `hasSubEvents: false` and empty `subEventIds: []`

3. **Upload Media** (optional): Upload cover image and gallery images to Storage

4. **Create Sub-Events** (if applicable):
   - For each sub-event, set `parentEventId` to the main event's ID
   - Upload sub-event cover images and documents to Storage
   - Add sub-event documents to Firestore

5. **Create Speakers** (if applicable):
   - Upload speaker profile images to Storage
   - Add speaker documents with empty `eventIds` and `subEventIds`

6. **Update References**:
   - Update main event: Set `hasSubEvents: true` and populate `subEventIds` array
   - Update speakers: Add event ID to `eventIds` and sub-event IDs to `subEventIds`
   - Update society: Add event ID to `events` array

#### Deleting an Event:
1. **Fetch Related Data**: Get all sub-events and engagement records

2. **Delete Sub-Events**:
   ```typescript
   const subEventsQuery = query(
     collection(firestore, "subEvents"),
     where("parentEventId", "==", eventId)
   )
   const subEventsSnapshot = await getDocs(subEventsQuery)
   for (const subEventDoc of subEventsSnapshot.docs) {
     const subEvent = subEventDoc.data()
     // Delete documents from Storage
     for (const doc of subEvent.documents) {
       await deleteObject(ref(storage, doc.url))
     }
     // Delete cover image
     if (subEvent.coverImage) {
       await deleteObject(ref(storage, subEvent.coverImage))
     }
     // Delete Firestore document
     await deleteDoc(doc(firestore, "subEvents", subEventDoc.id))
   }
   ```

3. **Delete Event Media from Storage**:
   - Delete cover image: `/events/{eventId}/cover/*`
   - Delete gallery images: `/events/{eventId}/gallery/*`

4. **Delete Engagement Data**:
   ```typescript
   const engagementQuery = query(
     collection(firestore, "eventEngagement"),
     where("eventId", "==", eventId)
   )
   const engagementSnapshot = await getDocs(engagementQuery)
   const deleteBatch = writeBatch(firestore)
   engagementSnapshot.docs.forEach((doc) => {
     deleteBatch.delete(doc.ref)
   })
   await deleteBatch.commit()
   ```

5. **Delete Analytics**: Delete document from `eventAnalytics` collection

6. **Update Speakers**: Remove event and sub-event references, delete orphaned speakers

7. **Update Society**: Remove event ID from society's `events` array

8. **Delete Main Event**: Finally delete the event document from Firestore

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

## Firebase Storage Structure

### Folder Organization

```
/societies/{societyId}/
  /logo/
    logo.jpg
  /cover/
    cover.jpg

/events/{eventId}/
  /cover/
    cover.jpg
  /gallery/
    image1.jpg
    image2.jpg
    ...

/subEvents/{subEventId}/
  /cover/
    cover.jpg
  /documents/
    document1.pdf
    slides.pptx
    ...

/speakers/{speakerId}/
  profile.jpg

/temp/
  {userId}/
    temp_upload.jpg  // Temporary uploads before event creation
```

### Storage Guidelines (TENTATIVE):
- **Image Size Limit**: Maximum 5MB per image
- **Document Size Limit**: Maximum 10MB per document
- **Supported Image Formats**: JPG, PNG, WebP
- **Supported Document Formats**: PDF, DOC, DOCX, PPT, PPTX

---

## Firestore Indexes Required

For optimal query performance, create these composite indexes:

### Events Collection:
- `societyId` (Ascending) + `startDate` (Ascending)
- `status` (Ascending) + `startDate` (Ascending)
- `eventType` (Ascending) + `startDate` (Ascending)
- `tags` (Array) + `startDate` (Ascending)

### Event Engagement Collection:
- `eventId` (Ascending) + `hasLiked` (Ascending)
- `eventId` (Ascending) + `hasWishlisted` (Ascending)
- `userId` (Ascending) + `hasWishlisted` (Ascending)

### Sub-Events Collection:
- `parentEventId` (Ascending) + `order` (Ascending)

---

## Future Enhancements

### Potential Improvements:
1. **Denormalization for Performance**: Store essential head info (name, email) in societies collection alongside UIDs
2. **Advanced Search**: Integrate Algolia or Typesense for full-text search across events
3. **Event Recommendations**: ML-based recommendation system using user preferences and engagement history
4. **Audit Logs**: Track all changes to societies, user privileges, and events
5. **Role Hierarchy**: Implement more granular permissions beyond CEO/CFO/COO
6. **Real-time Notifications**: Push notifications for event updates, reminders, and new events
7. **Analytics Dashboard**: Comprehensive analytics for society admins to track event performance
8. **Calendar Integration**: iCal/Google Calendar export for wishlisted events
9. **Social Features**: Comments, ratings, and reviews for past events
10. **Waitlist System**: Automatic waitlist management for events with capacity limits

### Migration Considerations:
When updating from the old schema (array-based heads) to the new schema:
1. Read existing societies documents
2. Transform `heads: [{id, name, email, role}]` to `heads: {CEO: uid, CFO: uid, COO: uid}`
3. Ensure all referenced users exist in `users` collection
4. Update documents in batched writes

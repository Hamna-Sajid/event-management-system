---
outline: [2, 4]
---

# Interfaces

TypeScript interfaces and type definitions

## Society Types

### Society

**File**: `lib\societies\types.ts`

Represents the structure of a society document in Firestore

Societies are student organizations that manage events and teams.
Each society has a leadership structure (CEO, CFO, COO) and
maintains social media presence and contact information.

### Member

**File**: `lib\societies\types.ts`

Represents a member of a society, typically a head

Members are users with leadership roles within a society.
This interface is used for displaying team information
on society pages.

### Event

**File**: `lib\societies\types.ts`

Represents the structure of an event, including its content and metadata

Events are activities organized by societies. Each event includes
basic information (title, date, time, location) and engagement
metrics (views, likes, wishlists, shares).

### EventContent

**File**: `lib\societies\types.ts`

Represents the core data of an event document in Firestore, excluding the ID

This interface is used when creating or updating events in Firestore.
It excludes the `id` field since Firestore auto-generates document IDs.
Use this type for event creation payloads or update operations.


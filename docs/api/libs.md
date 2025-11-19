---
outline: [2, 4]
---

# Library Functions

Utility functions for privileges, statistics, and more

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


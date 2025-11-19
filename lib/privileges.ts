import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { firestore } from '../firebase'

/**
 * @library Privileges
 * 
 * 
 * User privilege management utilities for role-based access control.
 * 
 * @remarks
 * The system uses a hierarchical privilege model with three levels:
 * - Level 0 (Normal User): Can browse and register for events
 * - Level 1 (Society Head): Can manage their society's events
 * - Level 2 (Admin): Full system access
 * 
 * @packageDocumentation
 */

/**
 * User privilege levels defining role-based access control in the system.
 * 
 * @remarks
 * Privileges are hierarchical - higher levels inherit permissions from lower levels.
 * 
 * @example
 * ```ts
 * if (privilege >= UserPrivilege.SOCIETY_HEAD) {
 *   // Can manage events
 * }
 * ```
 */
export enum UserPrivilege {
  /** Normal user - can view and register for events */
  NORMAL_USER = 0,
  /** Society head - can create and manage their society's events */
  SOCIETY_HEAD = 1,
  /** Administrator - full system access, can manage all societies and events */
  ADMIN = 2,
}

/**
 * @function getUserPrivilege
 * Retrieves a user's privilege level from Firestore.
 * 
 * @param userId - The user's unique identifier (UID from Firebase Auth)
 * @returns Promise resolving to the user's privilege level (0, 1, or 2).
 *          Returns 0 (Normal User) if the user document doesn't exist or on error.
 * 
 * @throws Never throws - errors are caught, logged, and 0 is returned
 * 
 * @example
 * ```tsx
 * const privilege = await getUserPrivilege(user.uid);
 * if (privilege === UserPrivilege.ADMIN) {
 *   router.push('/admin');
 * }
 * ```
 * 
 * @category Privileges
 */
export async function getUserPrivilege(userId: string): Promise<number> {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', userId))
    if (userDoc.exists()) {
      return userDoc.data()?.privilege ?? 0
    }
    return 0 // Default to normal user if document doesn't exist
  } catch (error) {
    console.error('Error getting user privilege:', error)
    return 0
  }
}

/**
 * @function updateUserPrivilege
 * Updates a user's privilege level in Firestore.
 * 
 * @param userId - The user's unique identifier (UID)
 * @param privilege - The new privilege level to assign
 * 
 * @throws {Error} If the Firestore update fails
 * 
 * @remarks
 * This function should only be called by:
 * - Admins managing user roles
 * - System processes during society head assignment
 * 
 * The function automatically records a timestamp of when the privilege was updated.
 * 
 * @example
 * Promoting a user to society head:
 * ```ts
 * try {
 *   await updateUserPrivilege(userId, UserPrivilege.SOCIETY_HEAD);
 *   console.log('User promoted to Society Head');
 * } catch (error) {
 *   console.error('Failed to update privilege:', error);
 * }
 * ```
 * 
 * @category Privileges
 */
export async function updateUserPrivilege(
  userId: string,
  privilege: UserPrivilege
): Promise<void> {
  try {
    await updateDoc(doc(firestore, 'users', userId), {
      privilege,
      privilegeUpdatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error updating user privilege:', error)
    throw error
  }
}

/**
 * @function isNormalUser
 * Checks if a user has normal user privileges.
 * 
 * @param userId - The user's unique identifier
 * @returns Promise resolving to true if the user is a normal user (privilege level 0)
 * 
 * @example
 * ```ts
 * if (await isNormalUser(userId)) {
 *   // Show limited features
 * }
 * ```
 * 
 * @category Privileges
 */
export async function isNormalUser(userId: string): Promise<boolean> {
  const privilege = await getUserPrivilege(userId)
  return privilege === UserPrivilege.NORMAL_USER
}

/**
 * @function isSocietyHead
 * Checks if a user is a society head.
 * 
 * @param userId - The user's unique identifier
 * @returns Promise resolving to true if the user is exactly a society head (privilege level 1)
 * 
 * @remarks
 * This returns false for admins. Use {@link canManageSociety} to check for
 * society management permissions regardless of exact level.
 * 
 * @example
 * ```ts
 * if (await isSocietyHead(userId)) {
 *   // Show society management features
 * }
 * ```
 * 
 * @category Privileges
 */
export async function isSocietyHead(userId: string): Promise<boolean> {
  const privilege = await getUserPrivilege(userId)
  return privilege === UserPrivilege.SOCIETY_HEAD
}

/**
 * @function isAdmin
 * Checks if a user is an administrator.
 * 
 * @param userId - The user's unique identifier
 * @returns Promise resolving to true if the user is an admin (privilege level 2)
 * 
 * @example
 * ```ts
 * if (await isAdmin(userId)) {
 *   // Show admin dashboard
 * }
 * ```
 * 
 * @category Privileges
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const privilege = await getUserPrivilege(userId)
  return privilege === UserPrivilege.ADMIN
}

/**
 * @function canManageSociety
 * Checks if a user can manage societies (society head or admin).
 * 
 * @param userId - The user's unique identifier
 * @returns Promise resolving to true if the user has privilege level >= 1
 * 
 * @remarks
 * This is useful for checking permissions without caring about the exact role.
 * Both society heads and admins can manage societies.
 * 
 * @example
 * ```ts
 * if (await canManageSociety(userId)) {
 *   // Allow event creation
 * }
 * ```
 * 
 * @category Privileges
 */
export async function canManageSociety(userId: string): Promise<boolean> {
  const privilege = await getUserPrivilege(userId)
  return privilege >= UserPrivilege.SOCIETY_HEAD
}

/**
 * @function getPrivilegeName
 * Converts a numeric privilege level to its human-readable name.
 * 
 * @param privilege - The numeric privilege level (0, 1, or 2)
 * @returns The name of the privilege level as a string
 * 
 * @example
 * ```tsx
 * const roleName = getPrivilegeName(user.privilege);
 * // Returns: "Normal User", "Society Head", or "Admin"
 * ```
 * 
 * @category Privileges
 */
export function getPrivilegeName(privilege: number): string {
  switch (privilege) {
    case UserPrivilege.NORMAL_USER:
      return 'Normal User'
    case UserPrivilege.SOCIETY_HEAD:
      return 'Society Head'
    case UserPrivilege.ADMIN:
      return 'Admin'
    default:
      return 'Unknown'
  }
}

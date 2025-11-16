import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { firestore } from '../firebase'

/**
 * User Privilege Levels
 * 0 - Normal User: Can view and register for events
 * 1 - Society Head: Can create and manage their society's events
 * 2 - Admin: Full system access, can manage all societies and events
 */
export enum UserPrivilege {
  NORMAL_USER = 0,
  SOCIETY_HEAD = 1,
  ADMIN = 2,
}

/**
 * Get user's privilege level from Firestore
 * @param userId - The user's UID
 * @returns The privilege level (0, 1, or 2)
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
 * Update user's privilege level
 * Note: This should only be called by admins or during society head assignment
 * @param userId - The user's UID
 * @param privilege - The new privilege level (0, 1, or 2)
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
 * Check if user is a normal user
 */
export async function isNormalUser(userId: string): Promise<boolean> {
  const privilege = await getUserPrivilege(userId)
  return privilege === UserPrivilege.NORMAL_USER
}

/**
 * Check if user is a society head
 */
export async function isSocietyHead(userId: string): Promise<boolean> {
  const privilege = await getUserPrivilege(userId)
  return privilege === UserPrivilege.SOCIETY_HEAD
}

/**
 * Check if user is an admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const privilege = await getUserPrivilege(userId)
  return privilege === UserPrivilege.ADMIN
}

/**
 * Check if user has at least society head privileges (society head or admin)
 */
export async function canManageSociety(userId: string): Promise<boolean> {
  const privilege = await getUserPrivilege(userId)
  return privilege >= UserPrivilege.SOCIETY_HEAD
}

/**
 * Get privilege level name as string
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

// firebaseFunctions.ts
// Import the firestore instance from your existing firebase config
import { firestore } from './firebase'; // Adjust path as needed
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';

// Type Definitions
export interface User {
  user_id: string;
  login: string;
  password: string;
  usertype: string;
  email: string;
  user_privilege_id: string;
}

export interface UserPrivilege {
  user_privilege_id: string;
  privilege: string;
}

export interface Interest {
  interest_id: string;
  interest_name: string;
}

export interface Society {
  society_id: string;
  name: string;
  founded_year: number;
  about_us: string;
}

export interface Member {
  user_id: string;
  society_id: string;
  active: boolean;
  position: string;
  member_privilege_id: string;
}

export interface MemberPrivilege {
  member_privilege_id: string;
  privilege: string;
}

export interface Following {
  user_id: string;
  society_id: string;
  followed_since: Date;
}

export interface Event {
  event_id: string;
  event_name: string;
  date: Date;
  date_end: Date;
  views: number;
  event_type: string;
  sign_up_cost: number;
  description: string;
  registration: string;
  tags: string;
  venue: string;
  attendance: number;
  contact: string;
  society_id: string;
  parent_event_id?: string;
}

export interface SignedUp {
  user_id: string;
  event_id: string;
  sign_up_date: Date;
}

export interface EventFeedback {
  feedback_id: string;
  satisfaction: number;
  quality: number;
  organization: number;
  what_liked: string;
  improvement: string;
  comments: string;
  churn: boolean;
  event_id: string;
  user_id: string;
}

export interface Speaker {
  speaker_id: string;
  name: string;
  contact: string;
  description: string;
}

export interface SocietySummary {
  society: Society;
  memberCount: number;
  followerCount: number;
  eventCount: number;
}

// ============= EVENT FUNCTIONS =============

/**
 * Get top N events ordered by views
 */
export async function getTopEvents(n: number): Promise<Event[]> {
  const eventsRef = collection(firestore, 'events');
  const q = query(eventsRef, orderBy('views', 'desc'), limit(n));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    date: doc.data().date?.toDate(),
    date_end: doc.data().date_end?.toDate()
  } as Event));
}

/**
 * Get event by ID
 */
export async function getEventById(eventId: string): Promise<Event | null> {
  const eventRef = doc(firestore, 'events', eventId);
  const eventSnap = await getDoc(eventRef);
  
  if (!eventSnap.exists()) return null;
  
  const data = eventSnap.data();
  return {
    ...data,
    date: data.date?.toDate(),
    date_end: data.date_end?.toDate()
  } as Event;
}

/**
 * Get all events organized by a specific society
 */
export async function getEventsBySociety(societyId: string): Promise<Event[]> {
  const eventsRef = collection(firestore, 'events');
  const q = query(eventsRef, where('society_id', '==', societyId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    date: doc.data().date?.toDate(),
    date_end: doc.data().date_end?.toDate()
  } as Event));
}

// ============= USER FUNCTIONS =============

/**
 * Get total user count
 */
export async function getUserCount(): Promise<number> {
  const usersRef = collection(firestore, 'users');
  const querySnapshot = await getDocs(usersRef);
  return querySnapshot.size;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const userRef = doc(firestore, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return null;
  
  return userSnap.data() as User;
}

// ============= SOCIETY FUNCTIONS =============

/**
 * Get society summary with aggregate statistics
 */
export async function getSocietySummary(societyId: string): Promise<SocietySummary | null> {
  const societyRef = doc(firestore, 'societies', societyId);
  const societySnap = await getDoc(societyRef);
  
  if (!societySnap.exists()) return null;
  
  // Get member count
  const membersRef = collection(firestore, 'members');
  const membersQuery = query(membersRef, where('society_id', '==', societyId));
  const membersSnap = await getDocs(membersQuery);
  
  // Get follower count
  const followingRef = collection(firestore, 'following');
  const followingQuery = query(followingRef, where('society_id', '==', societyId));
  const followingSnap = await getDocs(followingQuery);
  
  // Get event count
  const eventsRef = collection(firestore, 'events');
  const eventsQuery = query(eventsRef, where('society_id', '==', societyId));
  const eventsSnap = await getDocs(eventsQuery);
  
  return {
    society: societySnap.data() as Society,
    memberCount: membersSnap.size,
    followerCount: followingSnap.size,
    eventCount: eventsSnap.size
  };
}

// ============= MEMBER FUNCTIONS =============

/**
 * Get all members of a society
 */
export async function getMembersOfSociety(societyId: string): Promise<Member[]> {
  const membersRef = collection(firestore, 'members');
  const q = query(membersRef, where('society_id', '==', societyId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => doc.data() as Member);
}

/**
 * Get members of a society filtered by privilege
 */
export async function getMembersByPrivilege(
  societyId: string, 
  privilegeId: string
): Promise<Member[]> {
  const membersRef = collection(firestore, 'members');
  const q = query(
    membersRef, 
    where('society_id', '==', societyId),
    where('member_privilege_id', '==', privilegeId)
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => doc.data() as Member);
}

/**
 * Add a new member to a society
 */
export async function addMember(
  societyId: string, 
  userId: string, 
  privilegeId: string
): Promise<void> {
  const memberRef = doc(firestore, 'members', `${userId}_${societyId}`);
  await setDoc(memberRef, {
    user_id: userId,
    society_id: societyId,
    active: true,
    position: '',
    member_privilege_id: privilegeId
  });
}

/**
 * Update a member's privilege level
 */
export async function setMemberPrivilege(
  userId: string,
  societyId: string,
  privilegeId: string
): Promise<void> {
  const memberRef = doc(firestore, 'members', `${userId}_${societyId}`);
  await updateDoc(memberRef, {
    member_privilege_id: privilegeId
  });
}

// ============= STATS FUNCTIONS =============

/**
 * Get count of hosted events (optionally filtered by society)
 */
export async function getHostedEventsCount(societyId?: string): Promise<number> {
  const eventsRef = collection(firestore, 'events');
  
  if (societyId) {
    const q = query(eventsRef, where('society_id', '==', societyId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } else {
    const querySnapshot = await getDocs(eventsRef);
    return querySnapshot.size;
  }
}

/**
 * Calculate overall satisfaction from all event feedback
 */
export async function getOverallSatisfaction(): Promise<number> {
  const feedbackRef = collection(firestore, 'event_feedback');
  const querySnapshot = await getDocs(feedbackRef);
  
  if (querySnapshot.empty) return 0;
  
  let totalSatisfaction = 0;
  querySnapshot.forEach(doc => {
    totalSatisfaction += doc.data().satisfaction || 0;
  });
  
  return totalSatisfaction / querySnapshot.size;
}
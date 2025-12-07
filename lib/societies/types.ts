/**
 * @library Society Types
 * 
 * Shared TypeScript interfaces for society and event data structures
 * 
 * @remarks
 * This library provides type definitions for:
 * - Society documents and their structure
 * - Society members and roles
 * - Events associated with societies
 * - Event content for Firestore operations
 * 
 * These types ensure consistency across society pages, components,
 * and API interactions with Firestore.
 */

/**
 * @interface Society
 * 
 * Represents the structure of a society document in Firestore
 * 
 * @remarks
 * Societies are student organizations that manage events and teams.
 * Each society has a leadership structure (CEO, CFO, COO) and
 * maintains social media presence and contact information.
 */
export interface Society {
  /** The name of the society */
  name: string;
  /** The date the society was created (ISO string) */
  dateCreated: string;
  /**
   * A map of head roles (CEO, CFO, COO) to user UIDs.
   * Can be null if the position is vacant.
   */
  heads: {
    CEO: string | null;
    CFO: string | null;
    COO: string | null;
  };
  /** The maximum number of heads the society can have */
  maxHeads: number;
  /** A brief description of the society */
  description: string;
  /** The official contact email for the society */
  contactEmail: string;
  /** A map of social media profile links */
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  /** An array of event IDs associated with the society */
  events: string[];
  /** The UID of the user who created the society */
  createdBy: string;
}

/**
 * @interface Member
 * 
 * Represents a member of a society, typically a head
 * 
 * @remarks
 * Members are users with leadership roles within a society.
 * This interface is used for displaying team information
 * on society pages.
 */
export interface Member {
  /** The user's unique ID */
  id: string;
  /** The full name of the member */
  name: string;
  /** The role of the member within the society (CEO, CFO, COO) */
  role: string;
  /** The email address of the member */
  email: string;
}

/**
 * @interface Event
 * 
 * Represents the structure of an event, including its content and metadata
 * 
 * @remarks
 * Events are activities organized by societies. Each event includes
 * basic information (title, date, time, location) and engagement
 * metrics (views, likes, wishlists, shares).
 */
export interface Event {
  /** The unique identifier for the event */
  id: string;
  /** The title of the event */
  title: string;
  /** The date of the event (ISO string or formatted) */
  date: string;
  /** The time of the event */
  time: string;
  /** The location of the event */
  location: string;
  /** A detailed description of the event */
  description: string;
  /** The current status of the event (e.g., 'Published', 'Draft', 'Completed') */
  status: string;
  /** Engagement metrics for the event */
  metrics: {
    /** Number of views */
    views: number;
    /** Number of likes */
    likes: number;
    /** Number of times added to wishlist */
    wishlists: number;
    /** Number of shares */
    shares: number;
  };
}

/**
 * @interface EventContent
 * 
 * Represents the core data of an event document in Firestore, excluding the ID
 * 
 * @remarks
 * This interface is used when creating or updating events in Firestore.
 * It excludes the `id` field since Firestore auto-generates document IDs.
 * Use this type for event creation payloads or update operations.
 */
export interface EventContent {
  /** The title of the event */
  title: string;
  /** The date of the event (ISO string or formatted) */
  date: string;
  /** The time of the event */
  time: string;
  /** The location of the event */
  location: string;
  /** A detailed description of the event */
  description: string;
  /** The current status of the event (e.g., 'Published', 'Draft', 'Completed') */
  status: string;
  /** Engagement metrics for the event */
  metrics: {
    /** Number of views */
    views: number;
    /** Number of likes */
    likes: number;
    /** Number of times added to wishlist */
    wishlists: number;
    /** Number of shares */
    shares: number;
  };
}

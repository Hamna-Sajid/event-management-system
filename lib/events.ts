import { doc, setDoc, getFirestore, getDoc, updateDoc, arrayUnion, deleteDoc, arrayRemove } from "firebase/firestore";
import { app } from "../firebase";

const firestore = getFirestore(app);

/**
 * Creates a new event in Firestore
 * @param eventData - Event data to create
 * @returns The ID of the newly created event
 */
export async function createEvent(eventData: {
  title: string;
  description: string;
  eventType: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  venue: string;
  venueDetails?: {
    building?: string;
    room?: string;
    address?: string;
    mapLink?: string;
  };
  coverImage?: string;
  galleryImages?: string[];
  registrationLink?: string;
  registrationDeadline?: Date;
  tags?: string[];
  societyId: string;
  societyName: string;
  createdBy: string;
  status: string;
  isPublished: boolean;
}): Promise<string> {
  try {
    // Generate a unique event ID using timestamp and random string
    const eventId = `event_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    // Get society name if not provided
    let societyName = eventData.societyName;
    if (!societyName) {
      const societyDoc = await getDoc(doc(firestore, "societies", eventData.societyId));
      if (societyDoc.exists()) {
        societyName = societyDoc.data().name;
      } else {
        societyName = "Unknown Society";
      }
    }

    // Prepare event data for Firestore according to database schema
    const eventDoc = {
      id: eventId,
      societyId: eventData.societyId,
      societyName: societyName,
      title: eventData.title,
      description: eventData.description,
      eventType: eventData.eventType,
      coverImage: eventData.coverImage || "",
      galleryImages: eventData.galleryImages || [],
      startDate: eventData.startDate,
      startTime: eventData.startTime,
      endDate: eventData.endDate,
      endTime: eventData.endTime,
      venue: eventData.venue,
      venueDetails: eventData.venueDetails || {
        building: "",
        room: "",
        address: "",
        mapLink: ""
      },
      registrationLink: eventData.registrationLink || "",
      hasSubEvents: false, // Will be updated if sub-events are added
      subEventIds: [], // Will be populated if sub-events are added
      status: eventData.status,
      isPublished: eventData.isPublished,
      publishedAt: eventData.isPublished ? new Date() : null,
      metrics: {
        views: 0,
        likes: 0,
        wishlists: 0,
        shares: 0
      },
      tags: eventData.tags || [],
      searchKeywords: generateSearchKeywords(eventData.title, eventData.description, eventData.tags || []),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: eventData.createdBy
    };

    if (eventData.registrationDeadline !== undefined) {
      eventDoc.registrationDeadline = eventData.registrationDeadline;
    }

    // Save to Firestore
    await setDoc(doc(firestore, "events", eventId), eventDoc);

    // Update the society's events array to include this new event ID
    try {
      await updateDoc(doc(firestore, "societies", eventData.societyId), {
        events: arrayUnion(eventId),
        updatedAt: new Date()
      });
    } catch (societyError) {
      // If updating the society fails, delete the event we just created to maintain data consistency
      try {
        await deleteDoc(doc(firestore, "events", eventId));
      } catch (rollbackError) {
        console.error("Error rolling back event creation after society update failed:", rollbackError);
      }
      console.error("Error updating society with new event:", societyError);
      throw societyError;
    }

    return eventId;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

/**
 * Creates a new sub-event in Firestore
 * @param subEventData - Sub-event data to create
 * @returns The ID of the newly created sub-event
 */
export async function createSubEvent(subEventData: {
  parentEventId: string;
  title: string;
  description: string;
  coverImage?: string;
  date: Date;
  time: string;
  duration?: string;
  venue?: string;
  registrationLink?: string;
  price?: string;
  documents?: Array<{
    id: string;
    name: string;
    url: string;
    fileType: string;
    size: number;
    uploadedAt: Date;
  }>;
  speakerIds?: string[];
  order: number;
  societyId: string;
  createdBy: string;
}): Promise<string> {
  try {
    // Generate a unique sub-event ID using timestamp and random string
    const subEventId = `subevent_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    // Prepare sub-event data for Firestore according to database schema
    const subEventDoc = {
      id: subEventId,
      parentEventId: subEventData.parentEventId,
      societyId: subEventData.societyId,
      title: subEventData.title,
      description: subEventData.description,
      coverImage: subEventData.coverImage || "",
      date: subEventData.date,
      time: subEventData.time,
      duration: subEventData.duration || "",
      venue: subEventData.venue || subEventData.societyId, // Default to society name if no venue specified
      registrationLink: subEventData.registrationLink || "",
      price: subEventData.price || "",
      documents: subEventData.documents || [],
      speakerIds: subEventData.speakerIds || [],
      order: subEventData.order,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: subEventData.createdBy
    };

    // Save to Firestore
    await setDoc(doc(firestore, "subEvents", subEventId), subEventDoc);

    // Update the parent event's subEventIds array to include this new sub-event ID
    try {
      await updateDoc(doc(firestore, "events", subEventData.parentEventId), {
        subEventIds: arrayUnion(subEventId),
        hasSubEvents: true,
        updatedAt: new Date()
      });
    } catch (eventError) {
      // If updating the parent event fails, delete the sub-event we just created to maintain data consistency
      try {
        await deleteDoc(doc(firestore, "subEvents", subEventId));
      } catch (rollbackError) {
        console.error("Error rolling back sub-event creation after parent event update failed:", rollbackError);
      }
      console.error("Error updating parent event with new sub-event:", eventError);
      throw eventError;
    }

    return subEventId;
  } catch (error) {
    console.error("Error creating sub-event:", error);
    throw error;
  }
}

/**
 * Generates search keywords from title, description, and tags
 * @param title - Event title
 * @param description - Event description
 * @param tags - Event tags
 * @returns Array of search keywords
 */
function generateSearchKeywords(title: string, description: string, tags: string[]): string[] {
  // Combine all text and split into words, then filter and deduplicate
  const text = `${title} ${description} ${tags.join(' ')}`.toLowerCase();
  const words = text.split(/\s+/).filter(word => word.length > 2);
  const uniqueWords = Array.from(new Set(words));
  return uniqueWords;
}

/**
 * Removes an event ID from a society's events array
 * @param eventId - The ID of the event to remove
 * @param societyId - The ID of the society to update
 */
export async function removeEventFromSociety(eventId: string, societyId: string): Promise<void> {
  try {
    await updateDoc(doc(firestore, "societies", societyId), {
      events: arrayRemove(eventId),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error removing event from society:", error);
    throw error;
  }
}
import { firestore } from "@/firebase"
import { collection, getCountFromServer } from "firebase/firestore"

/**
 * Fetches the total number of societies from Firestore
 * @returns Promise<number> - Total count of societies
 */
export async function getTotalSocieties(): Promise<number> {
  try {
    const societiesCollection = collection(firestore, "societies")
    const snapshot = await getCountFromServer(societiesCollection)
    return snapshot.data().count
  } catch (error) {
    console.error("Error fetching total societies:", error)
    return 0
  }
}

/**
 * Fetches the total number of users from Firestore
 * @returns Promise<number> - Total count of users
 */
export async function getTotalUsers(): Promise<number> {
  try {
    const usersCollection = collection(firestore, "users")
    const snapshot = await getCountFromServer(usersCollection)
    return snapshot.data().count
  } catch (error) {
    console.error("Error fetching total users:", error)
    return 0
  }
}

/**
 * Fetches the total number of events from Firestore
 * @returns Promise<number> - Total count of events
 */
export async function getTotalEvents(): Promise<number> {
  try {
    const eventsCollection = collection(firestore, "events")
    const snapshot = await getCountFromServer(eventsCollection)
    return snapshot.data().count
  } catch (error) {
    console.error("Error fetching total events:", error)
    return 0
  }
}

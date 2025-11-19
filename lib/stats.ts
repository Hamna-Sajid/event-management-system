import { firestore } from "@/firebase"
import { collection, getCountFromServer } from "firebase/firestore"

/**
 * @library Stats   
 * 
 * Statistics utilities for fetching aggregate counts from Firestore collections.
 * 
 * @remarks
 * All functions use Firestore's `getCountFromServer()` for efficient counting
 * without downloading documents. Error handling returns 0 on failure to ensure
 * graceful degradation in the UI.
 * 
 * @packageDocumentation
 */

/**
 * @function getTotalSocieties
 * Fetches the total number of societies registered in the system.
 * 
 * @returns Promise resolving to the count of societies in the database.
 *          Returns 0 if an error occurs during the fetch operation.
 * 
 * @throws Never throws - errors are caught, logged to console, and 0 is returned
 * 
 * @example
 * Basic usage in a component:
 * ```tsx
 * const count = await getTotalSocieties();
 * console.log(`Total societies: ${count}`);
 * ```
 * 
 * @example
 * Using with React state:
 * ```tsx
 * const [societyCount, setSocietyCount] = useState(0);
 * 
 * useEffect(() => {
 *   getTotalSocieties().then(setSocietyCount);
 * }, []);
 * ```
 * 
 * @category Statistics
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
 * @function getTotalUsers
 * Fetches the total number of registered users in the system.
 * 
 * @returns Promise resolving to the count of users in the database.
 *          Returns 0 if an error occurs during the fetch operation.
 * 
 * @throws Never throws - errors are caught, logged to console, and 0 is returned
 * 
 * @example
 * Fetching user count for dashboard statistics:
 * ```tsx
 * const userCount = await getTotalUsers();
 * setStats(prev => ({ ...prev, users: userCount }));
 * ```
 * 
 * @category Statistics
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
 * @function getTotalEvents
 * Fetches the total number of events created in the system.
 * 
 * @returns Promise resolving to the count of events in the database.
 *          Returns 0 if an error occurs during the fetch operation.
 * 
 * @throws Never throws - errors are caught, logged to console, and 0 is returned
 * 
 * @example
 * Using all statistics functions together:
 * ```tsx
 * const [stats, setStats] = useState({ events: 0, societies: 0, users: 0 });
 * 
 * useEffect(() => {
 *   async function fetchAllStats() {
 *     const [events, societies, users] = await Promise.all([
 *       getTotalEvents(),
 *       getTotalSocieties(),
 *       getTotalUsers(),
 *     ]);
 *     setStats({ events, societies, users });
 *   }
 *   fetchAllStats();
 * }, []);
 * ```
 * 
 * @category Statistics
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

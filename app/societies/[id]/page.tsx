"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from "next/navigation"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, collection, getDocs, query, where, updateDoc, arrayRemove, deleteDoc } from "firebase/firestore"
import { app, firestore } from "../../../firebase"
import { getUserPrivilege, UserPrivilege } from "@/lib/privileges"
import { Society, Member, Event, EventContent } from "@/lib/societies/types"

import SocietyHeader from "@/components/societies/society-header"
import SocietyHero from "@/components/societies/society-hero"
import SocietyTabs from "@/components/societies/society-tabs"
import LoadingScreen from "@/components/loading-screen"

export default function SocietyPage() {
  const params = useParams()
  const router = useRouter()
  const societyId = params.id as string
  const [societyData, setSocietyData] = useState<Society | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const auth = getAuth(app)
  const [isManagementView, setIsManagementView] = useState(false)

  // Effect for fetching society data
  useEffect(() => {
    if (!societyId) {
      setError("No society ID provided.")
      setIsLoading(false)
      return
    }

    const fetchSocietyData = async () => {
      setIsLoading(true)
      try {
        const societyDocRef = doc(firestore, 'societies', societyId)
        const societyDoc = await getDoc(societyDocRef)
        
        if (societyDoc.exists()) {
          const societyInfo = societyDoc.data() as Society
          setSocietyData(societyInfo)

          // Fetch members (heads)
          const headUIDs = Object.values(societyInfo.heads).filter(uid => uid)
          if (headUIDs.length > 0) {
            const membersQuery = query(collection(firestore, 'users'), where('__name__', 'in', headUIDs))
            const membersSnapshot = await getDocs(membersQuery)
            const membersData = membersSnapshot.docs.map(d => ({
              id: d.id,
              name: d.data().fullName,
              role: d.data().societyRole,
              email: d.data().email
            }))
            setMembers(membersData)
          }

          // Fetch events
          const eventIDs = societyInfo.events || []
          if (eventIDs.length > 0) {
            const eventsQuery = query(collection(firestore, 'events'), where('__name__', 'in', eventIDs))
            const eventsSnapshot = await getDocs(eventsQuery)
            const eventsData = eventsSnapshot.docs.map(d => {
              const eventContent = d.data() as EventContent;
              return { 
                id: d.id, 
                ...eventContent,
                status: eventContent.status ? eventContent.status.toLowerCase() : eventContent.status
              };
            });
            setEvents(eventsData as Event[])
          }
        } else {
          setError("Society not found.")
        }
      } catch (err) {
        setError("Failed to fetch data. Please ensure you have the correct collections in Firestore.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSocietyData()
  }, [societyId])

  // Effect for checking management view
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && societyData) {
        const headUIDs = Object.values(societyData.heads).filter(uid => uid)
        const isHead = headUIDs.includes(user.uid)
        
        const privilege = await getUserPrivilege(user.uid)
        const isAdmin = privilege >= UserPrivilege.ADMIN

        if (isHead || isAdmin) {
          setIsManagementView(true)
        } else {
          router.push('/coming-soon')
        }
      } else if (societyData) { // If there's society data but no user
        router.push('/coming-soon')
      }
    })

    return () => unsubscribe()
  }, [auth, societyData, router])


  /**
   * @function handleDeleteEvent
   * 
   * Deletes an event from the system.
   * 
   * @param {string} eventId - The ID of the event to delete.
   * 
   * @remarks
   * This function performs three main actions:
   * 1. Deletes the event document from the 'events' collection in Firestore.
   * 2. Removes the event's ID from the 'events' array in the society's document.
   * 3. Updates the local state to remove the event from the UI instantly.
   */
  const handleDeleteEvent = async (eventId: string) => {
    if (!societyId) return

    try {
      // Delete from events collection
      await deleteDoc(doc(firestore, 'events', eventId))
      
      // Remove event id from society's events array
      const societyDocRef = doc(firestore, 'societies', societyId)
      await updateDoc(societyDocRef, {
        events: arrayRemove(eventId)
      })

      // Update local state
      setEvents(prev => prev.filter(event => event.id !== eventId))
    } catch (err) {
      console.error("Error deleting event:", err)
    }
  }


  /**
   * @function handleEditEvent
   * 
   * Updates an existing event with new data.
   * 
   * @param {Event} eventData - The complete event object, including its ID and updated fields.
   * 
   * @remarks
   * This function updates the corresponding event document in the 'events' collection in Firestore.
   * It ensures the 'status' field is converted to lowercase before updating.
   * After a successful database update, it updates the local state to reflect the changes in the UI.
   */
  const handleEditEvent = async (eventData: Event) => {
    try {
      const { id, ...dataToUpdate } = eventData;
      // Convert status to lowercase
      if (dataToUpdate.status) {
        dataToUpdate.status = dataToUpdate.status.toLowerCase();
      }
      const eventDocRef = doc(firestore, 'events', id)
      await updateDoc(eventDocRef, dataToUpdate)
      setEvents(prev => prev.map(e => e.id === id ? eventData : e))
    } catch (err) {
      console.error("Error updating event:", err)
    }
  }

  const themeStyles = `
    :root {
      --bg-default: oklch(0.08 0 0);
      --bg-secondary-default: oklch(0.15 0.05 328);
      --header-bg-default: oklch(0.08 0 0 / 0.8);
      --glass-default: oklch(0.55 0.3 264 / 0.1);
      --border-default: oklch(0.55 0.3 264 / 0.2);
      --accent-1-default: oklch(0.55 0.3 264);
      --accent-2-default: oklch(0.5 0.3 328);
      --text-primary-default: #ffffff;
      --text-secondary-default: #b0b0b0;
    }
    body {
      background-color: var(--bg-default);
    }
  `

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error) {
    return null
  }

  return (
    <>
      <style>{themeStyles}</style>
      
      <SocietyHeader theme="default" />
      
      <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "var(--bg-default)" }}>
        {/* Animated Background Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-gradient-to-r from-electric-blue/30 to-cyan-500/30 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-[60%] right-[10%] w-80 h-80 bg-gradient-to-r from-magenta/30 to-pink-500/30 rounded-full blur-3xl animate-blob animation-delay-3000"></div>
          <div className="absolute bottom-[15%] left-[15%] w-72 h-72 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 rounded-full blur-3xl animate-blob animation-delay-5000"></div>
          <div className="absolute top-[30%] right-[25%] w-64 h-64 bg-gradient-to-r from-cyan-500/25 to-electric-blue/25 rounded-full blur-3xl animate-blob animation-delay-7000"></div>
        </div>

        <div className="relative z-10">
          {societyData && (
            <>
              <SocietyHero 
                societyName={societyData.name} 
                theme="default" 
                isManagementView={isManagementView}
                societyId={societyId}
              />
              <SocietyTabs
                theme="default"
                isManagementView={isManagementView}
                societyData={societyData}
                events={events}
                members={members}
                handleDeleteEvent={handleDeleteEvent}
                handleEditEvent={handleEditEvent}
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}

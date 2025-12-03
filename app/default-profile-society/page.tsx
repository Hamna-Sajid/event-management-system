"use client"

import { useState, useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, collection, getDocs, query, where, addDoc, updateDoc, arrayUnion, deleteDoc, arrayRemove } from "firebase/firestore"
import { app, firestore } from "../../firebase"

import SocietyHeader from "@/components/society-header"
import SocietyHero from "@/components/society-hero"
import SocietyTabs from "@/components/society-tabs"

// Define interfaces for our data structures
interface Society {
  name: string;
  dateCreated: string;
  heads: {
    CEO: string | null;
    CFO: string | null;
    COO: string | null;
  };
  maxHeads: number;
  description: string;
  contactEmail: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  events: string[];
  createdBy: string;
}

interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface Event {

  id: string;

  title: string;

  date: string;

  time: string;

  location: string;

  description: string;

  status: string;

  metrics: {

    views: number;

    likes: number;

    wishlists: number;

    shares: number;

  };

}



interface EventContent {

  title: string;

  date: string;

  time: string;

  location:string;

  description: string;

  status: string;

  metrics: {

    views: number;

    likes: number;

    wishlists: number;

    shares: number;

  };

}





export default function DefaultProfileSociety() {

  const [societyId, setSocietyId] = useState<string | null>(null)

  const [societyData, setSocietyData] = useState<Society | null>(null)

  const [events, setEvents] = useState<Event[]>([])

  const [members, setMembers] = useState<Member[]>([])

  const [isLoading, setIsLoading] = useState(true)

  const [error, setError] = useState("")



  const auth = getAuth(app)



  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (user) {

        try {

          const userDocRef = doc(firestore, 'users', user.uid)

          const userDoc = await getDoc(userDocRef)

          const userData = userDoc.data()

          

          if (userData && userData.societyId) {

            const id = userData.societyId

            setSocietyId(id)

            const societyDocRef = doc(firestore, 'societies', id)

            const societyDoc = await getDoc(societyDocRef)

            

            if (societyDoc.exists()) {

              const societyInfo = societyDoc.data()

              setSocietyData(societyInfo as Society)



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

                const eventsData = eventsSnapshot.docs.map(d => ({ id: d.id, ...d.data() as EventContent })) // Cast here as EventContent

                setEvents(eventsData as Event[]) // Cast to Event[]

              }

            } else {

              setError("Society not found.")

            }

          } else {

            setError("No society associated with this user.")

          }

        } catch (err) {

          setError("Failed to fetch data. Please ensure you have created an 'events' collection in Firestore.")

          console.error(err)

        } finally {

          setIsLoading(false)

        }

      } else {

        setError("Please sign in to view this page.")

        setIsLoading(false)

      }

    })



    return () => unsubscribe()

  }, [auth])



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



  const handleEditEvent = async (eventData: Event) => {

    try {

      const eventDocRef = doc(firestore, 'events', eventData.id)

      const { id, ...dataToUpdate } = eventData;

      await updateDoc(eventDocRef, dataToUpdate)

      setEvents(prev => prev.map(e => e.id === eventData.id ? eventData : e))

    } catch (err) {

      console.error("Error updating event:", err)

    }

  }



  const themeStyles = `

    :root {

      --bg-default: #110205;

      --bg-secondary-default: #2b070e;

      --header-bg-default: rgba(17, 2, 5, 0.8);

      --glass-default: rgba(212, 34, 67, 0.1);

      --border-default: rgba(212, 34, 67, 0.2);

      --accent-1-default: #d02243;

      --accent-2-default: #aa1c37;

      --text-primary-default: #ffffff;

      --text-secondary-default: #b0b0b0;

    }

  `



  if (isLoading) {

    return <div className="min-h-screen bg-[#110205] flex items-center justify-center text-white">Loading...</div>

  }



  if (error) {

    return <div className="min-h-screen bg-[#110205] flex items-center justify-center text-red-400 p-8 text-center">{error}</div>

  }



  return (

    <div style={{ backgroundColor: "var(--bg-default)" }}>

      <style>{themeStyles}</style>

      <SocietyHeader theme="default" />

      {societyData && (

        <>

          <SocietyHero 

            societyName={societyData.name} 

            theme="default" 

            isManagementView={true} 

          />

          <SocietyTabs

            theme="default"

            isManagementView={true}

            societyData={societyData}

            events={events}

            members={members}

            handleDeleteEvent={handleDeleteEvent}

            handleEditEvent={handleEditEvent}

          />        </>
      )}
    </div>
  )
}

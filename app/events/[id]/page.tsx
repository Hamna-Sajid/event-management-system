"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { firestore } from "@/firebase"

export default function EventDetailsPage() {
  const params = useParams()
  const eventId = params.id as string
  const [eventData, setEventData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const eventDoc = await getDoc(doc(firestore, "events", eventId))
        
        if (eventDoc.exists()) {
          const data = eventDoc.data()
          // Convert Firestore Timestamps to readable format
          const eventDetails = {
            id: eventDoc.id,
            ...data,
            startDate: data.startDate?.toDate().toISOString(),
            endDate: data.endDate?.toDate().toISOString(),
            createdAt: data.createdAt?.toDate().toISOString(),
            updatedAt: data.updatedAt?.toDate().toISOString(),
          }
          setEventData(eventDetails)
        } else {
          setError("Event not found")
        }
      } catch (err) {
        console.error("Error fetching event:", err)
        setError("Failed to load event details")
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

  if (loading) {
    return (
      <div style={{ padding: "20px", fontFamily: "monospace" }}>
        <h1>Loading event...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: "20px", fontFamily: "monospace" }}>
        <h1>Error: {error}</h1>
        <p>Event ID: {eventId}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: "20px", fontFamily: "monospace", backgroundColor: "white", color: "black", minHeight: "100vh" }}>
      <h1>Event Details - JSON Dump</h1>
      <p><strong>Event ID:</strong> {eventId}</p>
      <hr style={{ margin: "20px 0" }} />
      <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px" }}>
        {JSON.stringify(eventData, null, 2)}
      </pre>
    </div>
  )
}

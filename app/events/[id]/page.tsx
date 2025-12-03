"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { doc, getDoc, collection, getDocs, query, where, updateDoc, addDoc, setDoc, Timestamp, arrayUnion } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { firestore, auth, storage } from "@/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import { getUserPrivilege, UserPrivilege } from "@/lib/privileges"
import { MapPin, Calendar, Clock, DollarSign, Users, ArrowLeft, Share2, Heart, X, Download, Pencil, Plus, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface EventData {
  id: string
  societyId: string
  societyName: string
  title: string
  description: string
  eventType: string
  coverImage: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  venue: string
  venueDetails?: {
    building?: string
    room?: string
    address?: string
    mapLink?: string
  }
  registrationLink?: string
  registrationDeadline?: string
  hasSubEvents: boolean
  subEventIds?: string[]
  status: string
  isPublished: boolean
  metrics?: {
    views: number
    likes: number
    wishlists: number
    shares: number
  }
  tags?: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface SubEvent {
  id: string
  title: string
  description: string
  coverImage?: string
  date: string
  time: string
  duration?: string
  venue?: string
  price: string
  documents: Array<{
    id: string
    name: string
    url: string
    fileType: string
    size: number
  }>
  speakerIds?: string[]
  order: number
}

interface Speaker {
  id: string
  name: string
  title: string
  bio?: string
  profileImage?: string
  email?: string
  linkedin?: string
  twitter?: string
}

function EditableIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center w-6 h-6 rounded-full glass glass-hover ml-2"
      title="Edit"
    >
      <Pencil size={14} className="text-[#d02243]" />
    </button>
  )
}

function EditModal({
  isOpen,
  title,
  value,
  onChange,
  onSave,
  onClose,
  type = "text",
}: {
  isOpen: boolean
  title: string
  value: string
  onChange: (val: string) => void
  onSave: () => void
  onClose: () => void
  type?: "text" | "textarea" | "date" | "time"
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Edit {title}</h3>
          <button onClick={onClose} className="text-[rgba(255,255,255,0.6)] hover:text-white">
            <X size={24} />
          </button>
        </div>

        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-3 text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243] min-h-32"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-3 text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243]"
          />
        )}

        <div className="flex gap-3 mt-6">
          <Button onClick={onSave} className="flex-1 bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold">
            Save
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
}: {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File) => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  if (!isOpen) return null

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true)
      await onUpload(file)
      setIsUploading(false)
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      await onUpload(file)
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Upload Cover Image</h3>
          <button onClick={onClose} className="text-[rgba(255,255,255,0.6)] hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging
            ? 'border-[#d02243] bg-[rgba(208,34,67,0.1)]'
            : 'border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)]'
            }`}
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d02243] mx-auto mb-4"></div>
              <p className="text-white font-semibold">Uploading image...</p>
            </>
          ) : (
            <>
              <Upload size={48} className="mx-auto mb-4 text-[rgba(255,255,255,0.5)]" />
              <p className="text-white font-semibold mb-2">Drag and drop an image here</p>
              <p className="text-[rgba(255,255,255,0.6)] text-sm mb-4">or</p>
              <label className="inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={isUploading}
                />
                <span className="px-6 py-3 bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold rounded-lg cursor-pointer inline-block">
                  Browse Files
                </span>
              </label>
            </>
          )}
        </div>

        <Button
          onClick={onClose}
          variant="outline"
          className="w-full mt-6 border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] bg-transparent"
          disabled={isUploading}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

function ModuleDetailModal({
  isOpen,
  module,
  onClose,
}: {
  isOpen: boolean
  module: SubEvent | null
  onClose: () => void
}) {
  if (!isOpen || !module) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)] bg-[rgba(17,2,5,0.9)]">
          <h2 className="text-2xl font-bold text-white">{module.title}</h2>
          <button onClick={onClose} className="text-[rgba(255,255,255,0.6)] hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {module.coverImage && (
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image src={module.coverImage || "/placeholder.png"} alt={module.title} fill className="object-cover" />
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Details</h3>
            <div className="flex flex-col gap-3 text-[rgba(255,255,255,0.8)]">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-[#d02243]" />
                <span>{module.time} {module.duration && `(${module.duration})`}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-[#d02243]" />
                <span className="font-semibold">{module.price}</span>
              </div>
              {module.venue && (
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#d02243]" />
                  <span>{module.venue}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
            <p className="text-[rgba(255,255,255,0.8)] leading-relaxed">{module.description}</p>
          </div>

          {module.documents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Attached Documents</h3>
              <div className="space-y-2">
                {module.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 glass rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                  >
                    <Download size={18} className="text-[#d02243]" />
                    <span className="text-[rgba(255,255,255,0.8)] font-medium">{doc.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string

  const [eventData, setEventData] = useState<EventData | null>(null)
  const [subEvents, setSubEvents] = useState<SubEvent[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userPrivilege, setUserPrivilege] = useState<number>(0)
  const [userSocietyId, setUserSocietyId] = useState<string | null>(null)
  const [canEdit, setCanEdit] = useState(false)

  const [activeTab, setActiveTab] = useState("description")
  const [isRegistered, setIsRegistered] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [selectedModule, setSelectedModule] = useState<SubEvent | null>(null)

  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showAddModuleModal, setShowAddModuleModal] = useState(false)
  const [showAddSpeakerModal, setShowAddSpeakerModal] = useState(false)
  const [newModuleData, setNewModuleData] = useState({
    title: "",
    description: "",
    time: "",
    date: "",
    duration: "",
    venue: "",
    price: "Free",
  })
  const [newSpeakerData, setNewSpeakerData] = useState({
    name: "",
    title: "",
    bio: "",
    email: "",
    linkedin: "",
  })

  const tabs = ["Description", "Modules", "Speakers", "Contact"]

  // Check user authentication and privileges
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        const privilege = await getUserPrivilege(user.uid)
        setUserPrivilege(privilege)

        // Get user's societyId if they're a society head
        if (privilege === UserPrivilege.SOCIETY_HEAD) {
          const userDoc = await getDoc(doc(firestore, "users", user.uid))
          if (userDoc.exists()) {
            setUserSocietyId(userDoc.data().societyId || null)
          }
        }
      }
    })

    return () => unsubscribe()
  }, [])

  // Check if user can edit this event
  useEffect(() => {
    if (eventData && currentUser) {
      // Admin can edit everything
      if (userPrivilege === UserPrivilege.ADMIN) {
        setCanEdit(true)
      }
      // Society head can edit only their society's events
      else if (
        userPrivilege === UserPrivilege.SOCIETY_HEAD &&
        userSocietyId &&
        userSocietyId === eventData.societyId
      ) {
        setCanEdit(true)
      } else {
        setCanEdit(false)
      }
    } else {
      setCanEdit(false)
    }
  }, [eventData, currentUser, userPrivilege, userSocietyId])

  // Increment view count for logged-in non-society-member users
  useEffect(() => {
    const incrementViewCount = async () => {
      if (!currentUser || !eventData || !eventId) return

      // Don't increment if user can edit (society member viewing their own event)
      if (canEdit) return

      try {
        // Create or update eventEngagement document
        const engagementId = `${eventId}_${currentUser.uid}`
        const engagementRef = doc(firestore, "eventEngagement", engagementId)
        const engagementDoc = await getDoc(engagementRef)

        if (engagementDoc.exists()) {
          // Update existing engagement record
          const currentViewCount = engagementDoc.data().viewCount || 0
          await updateDoc(engagementRef, {
            viewCount: currentViewCount + 1,
            hasViewed: true,
            viewedAt: engagementDoc.data().viewedAt || Timestamp.now(),
            updatedAt: Timestamp.now(),
          })
        } else {
          // Create new engagement record with composite key as document ID
          await setDoc(engagementRef, {
            eventId: eventId,
            userId: currentUser.uid,
            hasViewed: true,
            viewedAt: Timestamp.now(),
            viewCount: 1,
            hasLiked: false,
            likedAt: null,
            hasWishlisted: false,
            wishlistedAt: null,
            hasShared: false,
            sharedAt: null,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          })
        }

        // Update the event's metrics.views count
        const eventRef = doc(firestore, "events", eventId)
        const currentViews = eventData.metrics?.views || 0
        await updateDoc(eventRef, {
          "metrics.views": currentViews + 1,
          updatedAt: Timestamp.now(),
        })
      } catch (error) {
        console.error("Error incrementing view count:", error)
      }
    }

    incrementViewCount()
  }, [currentUser, eventData, canEdit, eventId])

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true)

        // Fetch main event data
        const eventDoc = await getDoc(doc(firestore, "events", eventId))

        if (!eventDoc.exists()) {
          setError("Event not found")
          setLoading(false)
          return
        }

        const data = eventDoc.data()
        const eventDetails: EventData = {
          id: eventDoc.id,
          societyId: data.societyId || "",
          societyName: data.societyName || "",
          title: data.title || "",
          description: data.description || "",
          eventType: data.eventType || "",
          coverImage: data.coverImage || "/placeholder.png",
          startDate: data.startDate?.toDate ? data.startDate.toDate().toLocaleDateString() : data.startDate || "",
          startTime: data.startTime || "",
          endDate: data.endDate?.toDate ? data.endDate.toDate().toLocaleDateString() : data.endDate || "",
          endTime: data.endTime || "",
          venue: data.venue || "",
          venueDetails: data.venueDetails,
          registrationLink: data.registrationLink || "",
          registrationDeadline: data.registrationDeadline?.toDate ? data.registrationDeadline.toDate().toISOString() : data.registrationDeadline || "",
          hasSubEvents: data.hasSubEvents || false,
          subEventIds: data.subEventIds || [],
          status: data.status || "draft",
          isPublished: data.isPublished || false,
          metrics: data.metrics,
          tags: data.tags || [],
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || "",
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || "",
          createdBy: data.createdBy || "",
        }
        setEventData(eventDetails)

        // Fetch sub-events if they exist
        if (eventDetails.hasSubEvents && eventDetails.subEventIds && eventDetails.subEventIds.length > 0) {
          const subEventsQuery = query(
            collection(firestore, "subEvents"),
            where("parentEventId", "==", eventId)
          )
          const subEventsSnapshot = await getDocs(subEventsQuery)
          const subEventsData = subEventsSnapshot.docs
            .map(doc => {
              const data = doc.data()
              return {
                id: doc.id,
                ...data,
                date: data.date?.toDate ? data.date.toDate().toLocaleDateString() : data.date || "",
              } as SubEvent
            })
            .sort((a, b) => (a.order || 0) - (b.order || 0))
          setSubEvents(subEventsData)

          // Collect all unique speaker IDs from sub-events
          const speakerIds = new Set<string>()
          subEventsData.forEach(subEvent => {
            if (subEvent.speakerIds) {
              subEvent.speakerIds.forEach(id => speakerIds.add(id))
            }
          })

          // Fetch speakers if we have speaker IDs
          if (speakerIds.size > 0) {
            const speakersData: Speaker[] = []
            for (const speakerId of speakerIds) {
              const speakerDoc = await getDoc(doc(firestore, "speakers", speakerId))
              if (speakerDoc.exists()) {
                speakersData.push({
                  id: speakerDoc.id,
                  ...speakerDoc.data(),
                } as Speaker)
              }
            }
            setSpeakers(speakersData)
          }
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching event data:", err)
        setError("Failed to load event details")
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEventData()
    }
  }, [eventId])

  const openEditModal = (field: string, currentValue: string) => {
    setEditingField(field)
    setEditValue(currentValue)
  }

  const saveEditField = async () => {
    if (!eventData) return

    try {
      const eventRef = doc(firestore, "events", eventId)
      const updateData: Record<string, string> = {}

      // Update local state and prepare Firestore update
      switch (editingField) {
        case "title":
          setEventData({ ...eventData, title: editValue })
          updateData.title = editValue
          break
        case "description":
          setEventData({ ...eventData, description: editValue })
          updateData.description = editValue
          break
        case "venue":
          setEventData({ ...eventData, venue: editValue })
          updateData.venue = editValue
          break
        case "startTime":
          setEventData({ ...eventData, startTime: editValue })
          updateData.startTime = editValue
          break
        case "endTime":
          setEventData({ ...eventData, endTime: editValue })
          updateData.endTime = editValue
          break
        case "registrationLink":
          setEventData({ ...eventData, registrationLink: editValue })
          updateData.registrationLink = editValue
          break
        case "address":
          if (eventData.venueDetails) {
            setEventData({
              ...eventData,
              venueDetails: { ...eventData.venueDetails, address: editValue }
            })
            updateData["venueDetails.address"] = editValue
          }
          break
        case "mapLink":
          if (eventData.venueDetails) {
            setEventData({
              ...eventData,
              venueDetails: { ...eventData.venueDetails, mapLink: editValue }
            })
            updateData["venueDetails.mapLink"] = editValue
          }
          break
      }

      // Save to Firestore
      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = new Date().toISOString()
        await updateDoc(eventRef, updateData)
        console.log(`Successfully saved ${editingField}:`, editValue)
      }

      setEditingField(null)
    } catch (error) {
      console.error("Error saving field:", error)
      alert("Failed to save changes. Please try again.")
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true)

      // Create a unique filename with timestamp
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const fileName = `cover_${timestamp}.${fileExtension}`

      // Upload to Firebase Storage
      const storageRef = ref(storage, `events/${eventId}/${fileName}`)
      await uploadBytes(storageRef, file)

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef)

      // Update Firestore document
      await updateDoc(doc(firestore, "events", eventId), {
        coverImage: downloadURL,
        updatedAt: Timestamp.now(),
      })

      // Update local state
      if (eventData) {
        setEventData({ ...eventData, coverImage: downloadURL })
      }

      setUploadingImage(false)
      setShowImageUpload(false)
      alert("Image uploaded successfully!")
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
      setUploadingImage(false)
    }
  }

  const updateSubEvent = (id: string, field: string, value: string) => {
    setSubEvents(
      subEvents.map((m) =>
        m.id === id
          ? {
            ...m,
            [field]: value,
          }
          : m,
      ),
    )
    // TODO: Save to Firestore
  }

  const deleteSubEvent = async (id: string) => {
    if (confirm("Are you sure you want to delete this module?")) {
      try {
        // Delete from Firestore
        await updateDoc(doc(firestore, "subEvents", id), {
          updatedAt: Timestamp.now(),
        })
        // Note: Soft delete by marking as deleted, or use deleteDoc for hard delete
        // For hard delete: await deleteDoc(doc(firestore, "subEvents", id))

        // Update local state
        setSubEvents(subEvents.filter((m) => m.id !== id))

        // Remove from parent event's subEventIds
        if (eventData) {
          const updatedSubEventIds = eventData.subEventIds?.filter(subId => subId !== id) || []
          await updateDoc(doc(firestore, "events", eventId), {
            subEventIds: updatedSubEventIds,
            hasSubEvents: updatedSubEventIds.length > 0,
            updatedAt: Timestamp.now(),
          })
        }
      } catch (error) {
        console.error("Error deleting module:", error)
        alert("Failed to delete module. Please try again.")
      }
    }
  }

  const deleteSpeaker = async (id: string) => {
    if (confirm("Are you sure you want to remove this speaker?")) {
      try {
        // Note: This removes the speaker from the local view
        // In production, you might want to update the speaker's eventIds array
        // instead of deleting the speaker document entirely

        // Update local state
        setSpeakers(speakers.filter((s) => s.id !== id))

        // Remove this event from the speaker's eventIds
        const speakerDoc = await getDoc(doc(firestore, "speakers", id))
        if (speakerDoc.exists()) {
          const currentEventIds = speakerDoc.data().eventIds || []
          const updatedEventIds = currentEventIds.filter((eid: string) => eid !== eventId)

          await updateDoc(doc(firestore, "speakers", id), {
            eventIds: updatedEventIds,
            updatedAt: Timestamp.now(),
          })
        }
      } catch (error) {
        console.error("Error removing speaker:", error)
        alert("Failed to remove speaker. Please try again.")
      }
    }
  }

  const handleAddModule = async () => {
    if (!newModuleData.title || !newModuleData.time) {
      alert("Please fill in at least the title and time fields.")
      return
    }

    try {
      // Create the module data for Firestore
      const moduleData = {
        parentEventId: eventId,
        societyId: eventData?.societyId || "",
        title: newModuleData.title,
        description: newModuleData.description,
        coverImage: "", // Default empty, can be added later
        date: newModuleData.date || eventData?.startDate || "",
        time: newModuleData.time,
        duration: newModuleData.duration,
        venue: newModuleData.venue || eventData?.venue || "",
        registrationLink: "",
        price: newModuleData.price,
        documents: [],
        speakerIds: [],
        order: subEvents.length + 1,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      // Add to Firestore
      const docRef = await addDoc(collection(firestore, "subEvents"), moduleData)

      // Update local state with the new module including the generated ID
      const newModule: SubEvent = {
        id: docRef.id,
        title: newModuleData.title,
        description: newModuleData.description,
        time: newModuleData.time,
        date: newModuleData.date || eventData?.startDate || "",
        duration: newModuleData.duration,
        venue: newModuleData.venue || eventData?.venue || "",
        price: newModuleData.price,
        documents: [],
        order: subEvents.length + 1,
      }

      setSubEvents([...subEvents, newModule])

      // Update the parent event to include this subEvent ID
      if (eventData) {
        await updateDoc(doc(firestore, "events", eventId), {
          subEventIds: arrayUnion(docRef.id),
          hasSubEvents: true,
          updatedAt: Timestamp.now(),
        })
      }

      setShowAddModuleModal(false)
      setNewModuleData({
        title: "",
        description: "",
        time: "",
        date: "",
        duration: "",
        venue: "",
        price: "Free",
      })

      alert("Module added successfully!")
    } catch (error) {
      console.error("Error adding module:", error)
      alert("Failed to add module. Please try again.")
    }
  }

  const handleAddSpeaker = async () => {
    if (!newSpeakerData.name || !newSpeakerData.title) {
      alert("Please fill in at least the name and title fields.")
      return
    }

    try {
      // Create the speaker data for Firestore
      const speakerData = {
        name: newSpeakerData.name,
        title: newSpeakerData.title,
        bio: newSpeakerData.bio,
        profileImage: "/placeholder.png", // Default placeholder image
        email: newSpeakerData.email,
        linkedin: newSpeakerData.linkedin,
        twitter: "",
        eventIds: [eventId],
        subEventIds: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      // Add to Firestore
      const docRef = await addDoc(collection(firestore, "speakers"), speakerData)

      // Update local state with the new speaker including the generated ID
      const newSpeaker: Speaker = {
        id: docRef.id,
        name: newSpeakerData.name,
        title: newSpeakerData.title,
        bio: newSpeakerData.bio,
        email: newSpeakerData.email,
        linkedin: newSpeakerData.linkedin,
      }

      setSpeakers([...speakers, newSpeaker])

      setShowAddSpeakerModal(false)
      setNewSpeakerData({
        name: "",
        title: "",
        bio: "",
        email: "",
        linkedin: "",
      })

      alert("Speaker added successfully!")
    } catch (error) {
      console.error("Error adding speaker:", error)
      alert("Failed to add speaker. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#110205] flex items-center justify-center">
        <div className="text-white text-xl">Loading event...</div>
      </div>
    )
  }

  if (error || !eventData) {
    return (
      <div className="min-h-screen bg-[#110205] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl mb-4">Error: {error || "Event not found"}</h1>
          <Link href="/dashboard" className="text-[#d02243] hover:text-[#aa1c37]">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Format venue details
  const venueDisplay = eventData.venueDetails?.building && eventData.venueDetails?.room
    ? `${eventData.venueDetails.building}, ${eventData.venueDetails.room}`
    : eventData.venue

  return (
    <div className="min-h-screen bg-[#110205]">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(17,2,5,0.8)] border-b border-[rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[rgba(255,255,255,0.7)] hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="p-2 rounded-lg glass glass-hover flex items-center justify-center"
            >
              <Heart
                size={20}
                className={isFavorited ? "fill-[#d02243] text-[#d02243]" : "text-[rgba(255,255,255,0.7)]"}
              />
            </button>
            <button className="p-2 rounded-lg glass glass-hover flex items-center justify-center">
              <Share2 size={20} className="text-[rgba(255,255,255,0.7)]" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden group">
        <Image
          src={eventData.coverImage || "/placeholder.png"}
          alt={eventData.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#110205] via-[rgba(17,2,5,0.6)] to-transparent"></div>
        <div className="absolute inset-0 backdrop-blur-sm border border-[rgba(255,255,255,0.1)]"></div>

        {canEdit && (
          <button
            onClick={() => setShowImageUpload(true)}
            className="absolute top-6 right-6 glass glass-hover rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil size={20} className="text-[#d02243]" />
          </button>
        )}

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
          <div className="max-w-7xl mx-auto w-full">
            <p className="text-[#d02243] font-semibold mb-3">{eventData.societyName}</p>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl sm:text-5xl font-bold text-white max-w-3xl">{eventData.title}</h1>
              {canEdit && <EditableIcon onClick={() => openEditModal("title", eventData.title)} />}
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 backdrop-blur-md bg-[rgba(17,2,5,0.8)] border-b border-[rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6 flex gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className="py-4 px-2 font-semibold border-b-2 transition-all whitespace-nowrap"
              style={{
                color: activeTab === tab.toLowerCase() ? "#d02243" : "rgba(255,255,255,0.7)",
                borderColor: activeTab === tab.toLowerCase() ? "#d02243" : "transparent",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Tab Content */}
          <div className="lg:col-span-2">
            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-bold text-white">About This Event</h2>
                    {canEdit && <EditableIcon onClick={() => openEditModal("description", eventData.description)} />}
                  </div>
                  <div className="prose prose-invert max-w-none">
                    {eventData.description.split("\n\n").map((paragraph, idx) => (
                      <p key={idx} className="text-[rgba(255,255,255,0.8)] leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {eventData.tags && eventData.tags.length > 0 && (
                  <div className="glass rounded-2xl p-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Event Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {eventData.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-[rgba(208,34,67,0.2)] text-[#d02243] rounded-full text-sm font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "modules" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Event Modules</h2>
                  {canEdit && (
                    <Button
                      onClick={() => setShowAddModuleModal(true)}
                      className="bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Add New Module
                    </Button>
                  )}
                </div>
                {subEvents.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {subEvents.map((module) => (
                      canEdit ? (
                        // Editable module card for society heads
                        <div key={module.id} className="glass rounded-lg overflow-hidden p-6 space-y-4">
                          {/* Module Image */}
                          <div className="relative h-40 rounded-lg overflow-hidden bg-[rgba(255,255,255,0.05)] flex items-center justify-center group">
                            {module.coverImage && module.coverImage !== "/placeholder.png" ? (
                              <Image
                                src={module.coverImage}
                                alt={module.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Upload size={32} className="text-[rgba(255,255,255,0.3)]" />
                            )}
                            <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Pencil size={20} className="text-white" />
                            </button>
                          </div>

                          {/* Module Title */}
                          <div>
                            <label className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2 block">
                              Title
                            </label>
                            <input
                              type="text"
                              value={module.title}
                              onChange={(e) => updateSubEvent(module.id, "title", e.target.value)}
                              className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-2 text-white text-sm focus:outline-none focus:border-[#d02243]"
                            />
                          </div>

                          {/* Module Date & Time */}
                          <div>
                            <label className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2 block">
                              Date & Time
                            </label>
                            <input
                              type="text"
                              value={module.time}
                              onChange={(e) => updateSubEvent(module.id, "time", e.target.value)}
                              className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-2 text-white text-sm focus:outline-none focus:border-[#d02243]"
                            />
                          </div>

                          {/* Module Price */}
                          <div>
                            <label className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2 block">
                              Price/Fee
                            </label>
                            <input
                              type="text"
                              value={module.price}
                              onChange={(e) => updateSubEvent(module.id, "price", e.target.value)}
                              className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-2 text-white text-sm focus:outline-none focus:border-[#d02243]"
                            />
                          </div>

                          {/* Module Description */}
                          <div>
                            <label className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2 block">
                              Description
                            </label>
                            <textarea
                              value={module.description}
                              onChange={(e) => updateSubEvent(module.id, "description", e.target.value)}
                              className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-2 text-white text-sm focus:outline-none focus:border-[#d02243] min-h-24"
                            />
                          </div>

                          {/* Attached Documents */}
                          {module.documents && module.documents.length > 0 && (
                            <div>
                              <label className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2 block">
                                Attached Documents
                              </label>
                              <div className="space-y-2">
                                {module.documents.map((doc) => (
                                  <div
                                    key={doc.id}
                                    className="flex items-center gap-2 p-2 bg-[rgba(255,255,255,0.05)] rounded-lg"
                                  >
                                    <Download size={14} className="text-[#d02243]" />
                                    <span className="text-xs text-[rgba(255,255,255,0.7)] flex-1 truncate">{doc.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Module Actions */}
                          <div className="flex gap-2 pt-4 border-t border-[rgba(255,255,255,0.1)]">
                            <Button className="flex-1 bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold text-sm">
                              Save
                            </Button>
                            <button
                              onClick={() => deleteSubEvent(module.id)}
                              className="p-2 rounded-lg glass glass-hover text-[#d02243] hover:text-[#aa1c37]"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View-only module card for normal users
                        <button
                          key={module.id}
                          onClick={() => setSelectedModule(module)}
                          className="glass rounded-lg overflow-hidden hover:bg-[rgba(255,255,255,0.1)] transition-all text-left group"
                        >
                          {module.coverImage && (
                            <div className="relative h-40 overflow-hidden">
                              <Image
                                src={module.coverImage || "/placeholder.png"}
                                alt={module.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h3 className="font-semibold text-white mb-2 group-hover:text-[#d02243] transition-colors">
                              {module.title}
                            </h3>
                            <div className="space-y-2 text-sm text-[rgba(255,255,255,0.7)]">
                              <div className="flex items-center gap-2">
                                <Clock size={14} className="text-[#d02243]" />
                                <span>{module.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign size={14} className="text-[#d02243]" />
                                <span className="font-semibold text-white">{module.price}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="glass rounded-lg p-8 text-center">
                    <p className="text-[rgba(255,255,255,0.7)]">
                      {canEdit ? "Click 'Add New Module' to create your first module." : "No modules available for this event."}
                    </p>
                  </div>
                )}\n              </div>
            )}

            {/* Speakers Tab */}
            {activeTab === "speakers" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Featured Speakers</h2>
                  {canEdit && (
                    <Button
                      onClick={() => setShowAddSpeakerModal(true)}
                      className="bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Add Speaker
                    </Button>
                  )}
                </div>
                {speakers.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {speakers.map((speaker) => (
                      <div key={speaker.id} className="glass rounded-lg p-6 flex gap-4 relative group">
                        <Image
                          src={speaker.profileImage || "/placeholder.png"}
                          alt={speaker.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{speaker.name}</h4>
                          <p className="text-sm text-[rgba(255,255,255,0.7)]">{speaker.title}</p>
                          {speaker.bio && (
                            <p className="text-xs text-[rgba(255,255,255,0.6)] mt-2 line-clamp-2">{speaker.bio}</p>
                          )}
                        </div>
                        {canEdit && (
                          <button
                            onClick={() => deleteSpeaker(speaker.id)}
                            className="absolute top-2 right-2 p-2 rounded-lg glass glass-hover text-[#d02243] hover:text-[#aa1c37] opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass rounded-lg p-8 text-center">
                    <p className="text-[rgba(255,255,255,0.7)]">No speakers information available.</p>
                  </div>
                )}
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                <div className="glass rounded-lg p-8 space-y-6">
                  <div>
                    <p className="text-sm text-[rgba(255,255,255,0.6)] mb-2">Society</p>
                    <p className="text-[#d02243] font-semibold text-lg">{eventData.societyName}</p>
                  </div>
                  {eventData.venueDetails?.address && (
                    <div>
                      <p className="text-sm text-[rgba(255,255,255,0.6)] mb-2">Address</p>
                      <div className="flex items-center justify-between">
                        <p className="text-white font-semibold flex-1">{eventData.venueDetails.address}</p>
                        {canEdit && <EditableIcon onClick={() => openEditModal("address", eventData.venueDetails?.address || "")} />}
                      </div>
                    </div>
                  )}
                  {eventData.venueDetails?.mapLink && (
                    <div>
                      <p className="text-sm text-[rgba(255,255,255,0.6)] mb-2">Map Link</p>
                      <div className="flex items-center justify-between">
                        <a
                          href={eventData.venueDetails.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#d02243] hover:text-[#aa1c37] font-semibold text-sm flex items-center gap-2 flex-1"
                        >
                          <MapPin size={16} />
                          View on Map
                        </a>
                        {canEdit && <EditableIcon onClick={() => openEditModal("mapLink", eventData.venueDetails?.mapLink || "")} />}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-8 sticky top-40 space-y-6">
              <div>
                <p className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2">Venue</p>
                <div className="flex items-start gap-3 justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <MapPin size={20} className="text-[#d02243] flex-shrink-0 mt-1" />
                    <p className="text-white font-semibold">{venueDisplay}</p>
                  </div>
                  {canEdit && <EditableIcon onClick={() => openEditModal("venue", eventData.venue)} />}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2">Date & Time</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Calendar size={20} className="text-[#d02243]" />
                      <p className="text-white font-semibold">{eventData.startDate}</p>
                    </div>
                    {canEdit && <EditableIcon onClick={() => openEditModal("date", eventData.startDate)} />}
                  </div>
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Clock size={20} className="text-[#d02243]" />
                      <p className="text-white font-semibold">
                        {eventData.startTime} - {eventData.endTime}
                      </p>
                    </div>
                    {canEdit && <EditableIcon onClick={() => openEditModal("startTime", eventData.startTime)} />}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2">Event Type</p>
                <div className="flex items-center gap-3">
                  <p className="text-white font-semibold capitalize">{eventData.eventType}</p>
                </div>
              </div>

              {canEdit && eventData.registrationLink && (
                <div>
                  <p className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2">Registration</p>
                  <div className="flex items-start gap-3 justify-between">
                    <a
                      href={eventData.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#d02243] hover:text-[#aa1c37] font-semibold text-sm truncate flex-1"
                    >
                      {eventData.registrationLink}
                    </a>
                    <EditableIcon onClick={() => openEditModal("registrationLink", eventData.registrationLink || "")} />
                  </div>
                </div>
              )}

              {eventData.metrics && (
                <div>
                  <p className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2">Engagement</p>
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-[#d02243]" />
                    <p className="text-white font-semibold">{eventData.metrics.views || 0} views</p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[rgba(255,255,255,0.1)]">
                {eventData.status === "published" && !isRegistered && eventData.registrationLink && (
                  <a
                    href={eventData.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block"
                  >
                    <Button className="w-full bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold py-6 text-lg">
                      Register Now
                    </Button>
                  </a>
                )}
                {isRegistered && (
                  <Button
                    variant="outline"
                    className="w-full border-[#d02243] text-[#d02243] hover:bg-[rgba(208,34,67,0.1)] font-semibold py-6 text-lg bg-transparent"
                  >
                    Manage Registration
                  </Button>
                )}
                {eventData.status === "completed" && (
                  <Button className="w-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-white font-semibold py-6 text-lg">
                    View Feedback
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModuleDetailModal
        isOpen={selectedModule !== null}
        module={selectedModule}
        onClose={() => setSelectedModule(null)}
      />

      <EditModal
        isOpen={editingField !== null}
        title={editingField || ""}
        value={editValue}
        onChange={setEditValue}
        onSave={saveEditField}
        onClose={() => setEditingField(null)}
        type={editingField === "description" ? "textarea" : editingField === "date" ? "date" : editingField === "startTime" || editingField === "endTime" ? "time" : "text"}
      />

      <ImageUploadModal
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onUpload={handleImageUpload}
      />

      {/* Add Module Modal */}
      {showAddModuleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Add New Module</h3>
              <button onClick={() => setShowAddModuleModal(false)} className="text-[rgba(255,255,255,0.6)] hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-[rgba(255,255,255,0.8)] mb-2 block">
                  Title <span className="text-[#d02243]">*</span>
                </label>
                <input
                  type="text"
                  value={newModuleData.title}
                  onChange={(e) => setNewModuleData({ ...newModuleData, title: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-3 text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243]"
                  placeholder="e.g., Opening Keynote"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[rgba(255,255,255,0.8)] mb-2 block">
                  Description
                </label>
                <textarea
                  value={newModuleData.description}
                  onChange={(e) => setNewModuleData({ ...newModuleData, description: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-3 text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243] min-h-24"
                  placeholder="Describe what this module covers..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[rgba(255,255,255,0.8)] mb-2 block">
                    Time <span className="text-[#d02243]">*</span>
                  </label>
                  <input
                    type="text"
                    value={newModuleData.time}
                    onChange={(e) => setNewModuleData({ ...newModuleData, time: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-3 text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243]"
                    placeholder="e.g., 2:00 PM - 3:00 PM"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[rgba(255,255,255,0.8)] mb-2 block">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newModuleData.duration}
                    onChange={(e) => setNewModuleData({ ...newModuleData, duration: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-3 text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243]"
                    placeholder="e.g., 1 hour"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-[rgba(255,255,255,0.8)] mb-2 block">
                  Venue
                </label>
                <input
                  type="text"
                  value={newModuleData.venue}
                  onChange={(e) => setNewModuleData({ ...newModuleData, venue: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-3 text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243]"
                  placeholder="Leave empty to use event venue"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[rgba(255,255,255,0.8)] mb-2 block">
                  Price
                </label>
                <input
                  type="text"
                  value={newModuleData.price}
                  onChange={(e) => setNewModuleData({ ...newModuleData, price: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-3 text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243]"
                  placeholder="e.g., Free or PKR 500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleAddModule} className="flex-1 bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold">
                Add Module
              </Button>
              <Button
                onClick={() => setShowAddModuleModal(false)}
                variant="outline"
                className="flex-1 border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Speaker Modal */}
      {showAddSpeakerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Add New Speaker</h3>
              <button onClick={() => setShowAddSpeakerModal(false)} className="text-[rgba(255,255,255,0.6)] hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-[rgba(255,255,255,0.8)] mb-2 block">
                  Name <span className="text-[#d02243]">*</span>
                </label>
                <input
                  type="text"
                  value={newSpeakerData.name}
                  onChange={(e) => setNewSpeakerData({ ...newSpeakerData, name: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-3 text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243]"
                  placeholder="e.g., Dr. Sarah Chen"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[rgba(255,255,255,0.8)] mb-2 block">
                  Title/Position <span className="text-[#d02243]">*</span>
                </label>
                <input
                  type="text"
                  value={newSpeakerData.title}
                  onChange={(e) => setNewSpeakerData({ ...newSpeakerData, title: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-3 text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243]"
                  placeholder="e.g., AI Research Lead, Tech Corp"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[rgba(255,255,255,0.8)] mb-2 block">
                  Bio
                </label>
                <textarea
                  value={newSpeakerData.bio}
                  onChange={(e) => setNewSpeakerData({ ...newSpeakerData, bio: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-3 text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243] min-h-24"
                  placeholder="Brief biography of the speaker..."
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[rgba(255,255,255,0.8)] mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  value={newSpeakerData.email}
                  onChange={(e) => setNewSpeakerData({ ...newSpeakerData, email: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-3 text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243]"
                  placeholder="speaker@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[rgba(255,255,255,0.8)] mb-2 block">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={newSpeakerData.linkedin}
                  onChange={(e) => setNewSpeakerData({ ...newSpeakerData, linkedin: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-3 text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243]"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleAddSpeaker} className="flex-1 bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold">
                Add Speaker
              </Button>
              <Button
                onClick={() => setShowAddSpeakerModal(false)}
                variant="outline"
                className="flex-1 border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

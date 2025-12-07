"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { doc, getDoc, collection, getDocs, query, where, updateDoc, addDoc, setDoc, Timestamp, arrayUnion } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { firestore, auth, storage } from "@/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import { getUserPrivilege, UserPrivilege } from "@/lib/privileges"
import { MapPin, Calendar, Clock, DollarSign, Users, Download, Pencil, Plus, Trash2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { showToast } from "@/components/ui/toast"
import { EventHeader } from "@/components/events/event-header"
import { DeleteConfirmModal } from "@/components/events/delete-confirm-modal"
import { ImageUploadModal } from "@/components/events/image-upload-modal"
import LoadingScreen from "@/components/loading-screen"
import { EditableIcon } from "@/components/events/editable-icon"
import { validateImageFile, validateDocumentFile } from "@/lib/events/validation"
import { formatVenue } from "@/lib/events/formatters"
import Image from "next/image"


interface EventData {
  id: string
  societyId: string
  societyName: string
  title: string
  description: string
  eventType: string
  coverImage: string
  galleryImages?: string[]
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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Edit {title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            <X size={24} />
          </button>
        </div>

        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-input border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring min-h-32"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-input border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring"
          />
        )}

        <div className="flex gap-3 mt-6">
          <Button onClick={onSave} className="flex-1 glow-button">
            Save
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-accent bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

function ModuleDetailModal({
  isOpen,
  module,
  onClose,
  canEdit,
  onUpdate,
  onImageUpload,
  onDocumentUpload,
}: {
  isOpen: boolean
  module: SubEvent | null
  onClose: () => void
  canEdit: boolean
  onUpdate: (module: SubEvent) => void
  onImageUpload: (id: string, file: File) => void
  onDocumentUpload: (id: string, file: File) => void
}) {
  const [editedModule, setEditedModule] = useState<SubEvent | null>(module)

  useEffect(() => {
    setEditedModule(module)
  }, [module])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !module || !editedModule) return null

  const handleSave = () => {
    onUpdate(editedModule)
    onClose()
  }

  const handleBackdropClick = () => {
    if (!canEdit) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
      <div className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between p-6 border-border bg-card/50">
          <h2 className="text-2xl font-bold text-white">{canEdit ? 'Edit Module' : module.title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Cover Image */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
              Cover Image
            </label>
            <div className="relative h-64 rounded-lg overflow-hidden bg-card flex items-center justify-center group">
              {module.coverImage && module.coverImage !== "/placeholder.png" ? (
                <Image src={module.coverImage} alt={module.title} fill className="object-cover" />
              ) : (
                <Upload size={48} className="text-muted-foreground" />
              )}
              {canEdit && (
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                  <Upload size={32} className="text-white mb-2" />
                  <p className="text-white text-sm">Click to upload</p>
                  <p className="text-muted-foreground text-xs mt-1">Max: 512KB</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        onImageUpload(module.id, e.target.files[0])
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Title</label>
            {canEdit ? (
              <input
                type="text"
                value={editedModule.title}
                onChange={(e) => setEditedModule({ ...editedModule, title: e.target.value })}
                className="w-full bg-input border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-ring"
              />
            ) : (
              <p className="text-white font-semibold text-lg">{module.title}</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Time</label>
            {canEdit ? (
              <input
                type="text"
                value={editedModule.time}
                onChange={(e) => setEditedModule({ ...editedModule, time: e.target.value })}
                className="w-full bg-input border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-ring"
                placeholder="e.g., 10:00 AM - 12:00 PM"
              />
            ) : (
              <div className="flex items-center gap-2 text-white">
                <Clock size={18} className="text-primary" />
                <span>{module.time} {module.duration && `(${module.duration})`}</span>
              </div>
            )}
          </div>

          {/* Duration */}
          {(canEdit || module.duration) && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Duration</label>
              {canEdit ? (
                <input
                  type="text"
                  value={editedModule.duration || ''}
                  onChange={(e) => setEditedModule({ ...editedModule, duration: e.target.value })}
                  className="w-full bg-input border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-ring"
                  placeholder="e.g., 2 hours"
                />
              ) : (
                <p className="text-white">{module.duration}</p>
              )}
            </div>
          )}

          {/* Price */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Price</label>
            {canEdit ? (
              <input
                type="text"
                value={editedModule.price}
                onChange={(e) => setEditedModule({ ...editedModule, price: e.target.value })}
                className="w-full bg-input border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-ring"
              />
            ) : (
              <div className="flex items-center gap-2 text-white font-semibold">
                <DollarSign size={18} className="text-primary" />
                <span>{module.price}</span>
              </div>
            )}
          </div>

          {/* Venue */}
          {(canEdit || module.venue) && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Venue</label>
              {canEdit ? (
                <input
                  type="text"
                  value={editedModule.venue || ''}
                  onChange={(e) => setEditedModule({ ...editedModule, venue: e.target.value })}
                  className="w-full bg-input border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-ring"
                  placeholder="Enter venue"
                />
              ) : (
                <div className="flex items-center gap-2 text-white">
                  <MapPin size={18} className="text-primary" />
                  <span>{module.venue}</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Description</label>
            {canEdit ? (
              <textarea
                value={editedModule.description}
                onChange={(e) => setEditedModule({ ...editedModule, description: e.target.value })}
                className="w-full bg-input border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-ring min-h-32"
                placeholder="Module description..."
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">{module.description}</p>
            )}
          </div>

          {/* Documents */}
          {(module.documents.length > 0 || canEdit) && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
                Attached Document {module.documents.length > 0 && `(1/1)`}
              </label>
              <div className="space-y-2">
                {module.documents.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={module.documents[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 glass rounded-lg hover:bg-accent transition-colors flex-1"
                    >
                      <Download size={18} className="text-primary" />
                      <span className="text-muted-foreground font-medium flex-1">{module.documents[0].name}</span>
                    </a>
                    {canEdit && (
                      <button
                        onClick={async () => {
                          try {
                            await updateDoc(doc(firestore, "subEvents", module.id), {
                              documents: [],
                              updatedAt: Timestamp.now(),
                            })
                            // Update the local module state
                            if (editedModule) {
                              setEditedModule({ ...editedModule, documents: [] })
                            }
                            showToast("Document removed successfully!", "success")
                          } catch (error) {
                            console.error("Error removing document:", error)
                            showToast("Failed to remove document. Please try again.", "error")
                          }
                        }}
                        className="p-3 glass rounded-lg hover:bg-accent transition-colors text-destructive hover:text-destructive/80 cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ) : null}
                {canEdit && module.documents.length === 0 && (
                  <label className="flex items-center gap-3 p-3 glass rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <Upload size={18} className="text-primary" />
                    <span className="text-muted-foreground flex-1">Upload Document</span>
                    <span className="text-muted-foreground/70 text-xs">Max: 10MB</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          onDocumentUpload(module.id, e.target.files[0])
                        }
                      }}
                    />
                  </label>
                )}
                {canEdit && module.documents.length > 0 && (
                  <label className="flex items-center gap-3 p-3 glass rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <Upload size={18} className="text-primary" />
                    <span className="text-muted-foreground flex-1">Replace Document</span>
                    <span className="text-muted-foreground/70 text-xs">Max: 10MB</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          onDocumentUpload(module.id, e.target.files[0])
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {canEdit && (
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                onClick={handleSave}
                className="flex-1 glow-button"
              >
                Save Changes
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="border-border text-foreground hover:bg-accent bg-transparent"
              >
                Cancel
              </Button>
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
  const [isFavorited, setIsFavorited] = useState(false)
  const [selectedModule, setSelectedModule] = useState<SubEvent | null>(null)
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    type: 'speaker' | 'module' | null
    id: string | null
    name: string
  }>({
    isOpen: false,
    type: null,
    id: null,
    name: ''
  })

  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showAddModuleModal, setShowAddModuleModal] = useState(false)
  const [showAddSpeakerModal, setShowAddSpeakerModal] = useState(false)
  const [editingTags, setEditingTags] = useState(false)
  const [newTag, setNewTag] = useState("")
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

  // Manage body scroll for modals
  useEffect(() => {
    const hasModal = selectedSpeaker !== null || selectedModule !== null || 
                     showAddModuleModal || showAddSpeakerModal || 
                     deleteConfirmation.isOpen || showImageUpload || editingField !== null
    
    if (hasModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedSpeaker, selectedModule, showAddModuleModal, showAddSpeakerModal, 
      deleteConfirmation.isOpen, showImageUpload, editingField])

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
      // Only society heads of THIS society can edit
      if (
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

          // Fetch speakers directly associated with this event
          const speakersQuery = query(
            collection(firestore, "speakers"),
            where("eventIds", "array-contains", eventId)
          )
          const speakersSnapshot = await getDocs(speakersQuery)
          const speakersData: Speaker[] = []
          speakersSnapshot.forEach((doc) => {
            speakersData.push({
              id: doc.id,
              ...doc.data(),
            } as Speaker)
          })
          setSpeakers(speakersData)
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
      showToast("Failed to save changes. Please try again.", "error")
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      // Validate file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        showToast(validation.error!, "error")
        return
      }

      // Create a unique filename with timestamp
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const fileName = `cover_${timestamp}.${fileExtension}`

      // Upload to Firebase Storage
      const storageRef = ref(storage, `events/${eventId}/cover/${fileName}`)
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

      setShowImageUpload(false)
      showToast("Cover image uploaded successfully!", "success")
    } catch (error) {
      console.error("Error uploading image:", error)
      showToast("Failed to upload image. Please try again.", "error")
    }
  }

  const handleGalleryImageUpload = async (file: File) => {
    try {
      // Validate file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        showToast(validation.error!, "error")
        return
      }

      // Create a unique filename with timestamp
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const fileName = `gallery_${timestamp}.${fileExtension}`

      // Upload to Firebase Storage
      const storageRef = ref(storage, `events/${eventId}/gallery/${fileName}`)
      await uploadBytes(storageRef, file)

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef)

      // Update Firestore document - add to galleryImages array
      await updateDoc(doc(firestore, "events", eventId), {
        galleryImages: arrayUnion(downloadURL),
        updatedAt: Timestamp.now(),
      })

      // Update local state
      if (eventData) {
        const updatedGalleryImages = [...(eventData.galleryImages || []), downloadURL]
        setEventData({ ...eventData, galleryImages: updatedGalleryImages })
      }

      showToast("Gallery image added successfully!", "success")
    } catch (error) {
      console.error("Error uploading gallery image:", error)
      showToast("Failed to upload gallery image. Please try again.", "error")
    }
  }

  const handleSubEventImageUpload = async (subEventId: string, file: File) => {
    try {
      // Validate file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        showToast(validation.error!, "error")
        return
      }

      // Create a unique filename with timestamp
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const fileName = `cover_${timestamp}.${fileExtension}`

      // Upload to Firebase Storage
      const storageRef = ref(storage, `subEvents/${subEventId}/cover/${fileName}`)
      await uploadBytes(storageRef, file)

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef)

      // Update Firestore document
      await updateDoc(doc(firestore, "subEvents", subEventId), {
        coverImage: downloadURL,
        updatedAt: Timestamp.now(),
      })

      // Update local state
      setSubEvents(subEvents.map(se => 
        se.id === subEventId ? { ...se, coverImage: downloadURL } : se
      ))

      showToast("Sub-event cover image uploaded successfully!", "success")
    } catch (error) {
      console.error("Error uploading sub-event image:", error)
      showToast("Failed to upload sub-event image. Please try again.", "error")
    }
  }

  const handleSubEventDocumentUpload = async (subEventId: string, file: File) => {
    try {
      // Validate file
      const validation = validateDocumentFile(file)
      if (!validation.valid) {
        showToast(validation.error!, "error")
        return
      }

      // Create a unique filename with timestamp
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const fileName = `${timestamp}_${sanitizedFileName}`

      // Upload to Firebase Storage
      const storageRef = ref(storage, `subEvents/${subEventId}/documents/${fileName}`)
      await uploadBytes(storageRef, file)

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef)

      // Create document object
      const documentData = {
        id: `doc_${timestamp}`,
        name: file.name,
        url: downloadURL,
        fileType: fileExtension || 'other',
        size: file.size,
        uploadedAt: Timestamp.now(),
      }

      // Update Firestore document - replace the documents array with single document
      await updateDoc(doc(firestore, "subEvents", subEventId), {
        documents: [documentData],
        updatedAt: Timestamp.now(),
      })

      // Update local state
      setSubEvents(subEvents.map(se => {
        if (se.id === subEventId) {
          return { ...se, documents: [documentData] }
        }
        return se
      }))

      showToast("Document uploaded successfully!", "success")
    } catch (error) {
      console.error("Error uploading document:", error)
      showToast("Failed to upload document. Please try again.", "error")
    }
  }

  const handleSpeakerImageUpload = async (speakerId: string, file: File) => {
    try {
      // Validate file size (512KB limit)
      if (file.size > 512 * 1024) {
        showToast("Image size must be less than 512KB", "error")
        return
      }

      // Create a unique filename with timestamp
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const fileName = `profile_${timestamp}.${fileExtension}`

      // Upload to Firebase Storage
      const storageRef = ref(storage, `speakers/${speakerId}/${fileName}`)
      await uploadBytes(storageRef, file)

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef)

      // Update Firestore document
      await updateDoc(doc(firestore, "speakers", speakerId), {
        profileImage: downloadURL,
        updatedAt: Timestamp.now(),
      })

      // Update local state
      setSpeakers(speakers.map(speaker => 
        speaker.id === speakerId ? { ...speaker, profileImage: downloadURL } : speaker
      ))

      showToast("Speaker profile image uploaded successfully!", "success")
    } catch (error) {
      console.error("Error uploading speaker image:", error)
      showToast("Failed to upload speaker image. Please try again.", "error")
    }
  }

  const updateSubEvent = async (updatedModule: SubEvent) => {
    try {
      await updateDoc(doc(firestore, "subEvents", updatedModule.id), {
        title: updatedModule.title,
        time: updatedModule.time,
        duration: updatedModule.duration,
        price: updatedModule.price,
        venue: updatedModule.venue,
        description: updatedModule.description,
        updatedAt: Timestamp.now(),
      })

      setSubEvents(subEvents.map(se => 
        se.id === updatedModule.id ? updatedModule : se
      ))

      showToast("Module updated successfully!", "success")
    } catch (error) {
      console.error("Error updating sub-event:", error)
      showToast("Failed to update module. Please try again.", "error")
    }
  }

  const deleteSubEvent = async (id: string, name: string) => {
    setDeleteConfirmation({
      isOpen: true,
      type: 'module',
      id,
      name
    })
  }

  const confirmDelete = async () => {
    const { type, id } = deleteConfirmation
    if (!id) return

    try {
      if (type === 'module') {
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
        showToast("Module deleted successfully!", "success")
      } else if (type === 'speaker') {
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
        showToast("Speaker removed successfully!", "success")
      }
    } catch (error) {
      console.error("Error deleting:", error)
      showToast(`Failed to delete ${type}. Please try again.`, "error")
    } finally {
      setDeleteConfirmation({ isOpen: false, type: null, id: null, name: '' })
    }
  }

  const deleteSpeaker = async (id: string, name: string) => {
    setDeleteConfirmation({
      isOpen: true,
      type: 'speaker',
      id,
      name
    })
  }

  const handleAddModule = async () => {
    if (!newModuleData.title || !newModuleData.time) {
      showToast("Please fill in at least the title and time fields.", "error")
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

      showToast("Module added successfully!", "success")
    } catch (error) {
      console.error("Error adding module:", error)
      showToast("Failed to add module. Please try again.", "error")
    }
  }

  const handleAddSpeaker = async () => {
    if (!newSpeakerData.name || !newSpeakerData.title) {
      showToast("Please fill in at least the name and title fields.", "error")
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

      showToast("Speaker added successfully!", "success")
    } catch (error) {
      console.error("Error adding speaker:", error)
      showToast("Failed to add speaker. Please try again.", "error")
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (error || !eventData) {
    return null
  }

  // Format venue details
  const venueDisplay = formatVenue(eventData.venueDetails, eventData.venue)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: eventData.title,
        text: eventData.description,
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href)
        showToast("Link copied to clipboard!", "success")
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showToast("Link copied to clipboard!", "success")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <EventHeader
        isFavorited={isFavorited}
        onToggleFavorite={() => setIsFavorited(!isFavorited)}
        onShare={handleShare}
        currentUser={currentUser}
      />

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden group">
        <Image
          src={eventData.coverImage || "/placeholder.png"}
          alt={eventData.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        <div className="absolute inset-0 backdrop-blur-sm border border-border"></div>

        {canEdit && (
          <button
            onClick={() => setShowImageUpload(true)}
            className="absolute top-6 right-6 glass glass-hover rounded-full p-3 z-10 group-hover:scale-110 transition-transform cursor-pointer"
            title="Change cover image"
          >
            <Upload size={20} className="text-primary" />
          </button>
        )}

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
          <div className="max-w-7xl mx-auto w-full">
            <p className="text-primary font-semibold mb-3">{eventData.societyName}</p>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl sm:text-5xl font-bold text-white max-w-3xl">{eventData.title}</h1>
              {canEdit && <EditableIcon onClick={() => openEditModal("title", eventData.title)} />}
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 flex gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className="py-4 px-2 font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer"
              style={{
                color: activeTab === tab.toLowerCase() ? "oklch(0.55 0.3 264)" : "var(--muted-foreground)",
                borderColor: activeTab === tab.toLowerCase() ? "oklch(0.55 0.3 264)" : "transparent",
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
                      <p key={idx} className="text-muted-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {(eventData.tags && eventData.tags.length > 0) || canEdit ? (
                  <div className="glass rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-semibold text-white">Event Tags</h3>
                      {canEdit && !editingTags && (
                        <EditableIcon onClick={() => setEditingTags(true)} />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {eventData.tags && eventData.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-semibold flex items-center gap-2"
                        >
                          {tag}
                          {editingTags && (
                            <button
                              onClick={async () => {
                                const updatedTags = (eventData.tags || []).filter((_, i) => i !== idx)
                                await updateDoc(doc(firestore, "events", eventId), {
                                  tags: updatedTags,
                                  updatedAt: Timestamp.now(),
                                })
                                setEventData({ ...eventData, tags: updatedTags })
                                showToast("Tag removed successfully!", "success")
                              }}
                              className="hover:text-secondary transition-colors cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </span>
                      ))}
                      {eventData.tags?.length === 0 && !editingTags && (
                        <p className="text-muted-foreground text-sm">No tags added yet</p>
                      )}
                    </div>
                    {editingTags && (
                      <div className="mt-4 space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && newTag.trim()) {
                                const updatedTags = [...(eventData.tags || []), newTag.trim()]
                                updateDoc(doc(firestore, "events", eventId), {
                                  tags: updatedTags,
                                  updatedAt: Timestamp.now(),
                                }).then(() => {
                                  setEventData({ ...eventData, tags: updatedTags })
                                  setNewTag("")
                                  showToast("Tag added successfully!", "success")
                                }).catch(() => {
                                  showToast("Failed to add tag. Please try again.", "error")
                                })
                              }
                            }}
                            placeholder="Enter tag name..."
                            className="flex-1 bg-input border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring"
                          />
                          <Button
                            onClick={async () => {
                              if (newTag.trim()) {
                                const updatedTags = [...(eventData.tags || []), newTag.trim()]
                                await updateDoc(doc(firestore, "events", eventId), {
                                  tags: updatedTags,
                                  updatedAt: Timestamp.now(),
                                })
                                setEventData({ ...eventData, tags: updatedTags })
                                setNewTag("")
                                showToast("Tag added successfully!", "success")
                              }
                            }}
                            className="glow-button"
                          >
                            <Plus size={18} />
                          </Button>
                        </div>
                        <Button
                          onClick={() => {
                            setEditingTags(false)
                            setNewTag("")
                          }}
                          variant="outline"
                          className="w-full border-border text-foreground hover:bg-accent bg-transparent"
                        >
                          Done Editing
                        </Button>
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Gallery Section */}
                {(canEdit || (eventData.galleryImages && eventData.galleryImages.length > 0)) && (
                  <div className="glass rounded-2xl p-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Event Gallery</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {eventData.galleryImages && eventData.galleryImages.map((imageUrl: string, idx: number) => (
                        <div key={idx} className="relative h-40 rounded-lg overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={`Gallery image ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {canEdit && (
                        <label className="relative h-40 rounded-lg border-2 border-dashed border-border hover:border-primary bg-card hover:bg-card/80 flex items-center justify-center cursor-pointer transition-all group">
                          <div className="text-center">
                            <Upload size={32} className="text-muted-foreground group-hover:text-primary mx-auto mb-2 transition-colors" />
                            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors block mb-1">
                              Add Image
                            </span>
                            <span className="text-[10px] text-muted-foreground/70">Max: 512KB</span>
                          </div>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleGalleryImageUpload(e.target.files[0])
                              }
                            }}
                          />
                        </label>
                      )}
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
                      className="glow-button text-white font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <Plus size={18} />
                      Add New Module
                    </Button>
                  )}
                </div>
                {subEvents.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {subEvents.map((module) => (
                      <div
                        key={module.id}
                        onClick={() => setSelectedModule(module)}
                        className="glass rounded-lg overflow-hidden hover:bg-accent transition-all cursor-pointer group"
                      >
                        {/* Module Image */}
                        {module.coverImage && module.coverImage !== "/placeholder.png" ? (
                          <div className="relative h-40 overflow-hidden">
                            <Image
                              src={module.coverImage}
                              alt={module.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        ) : (
                          <div className="h-40 bg-card flex items-center justify-center">
                            <Upload size={32} className="text-muted-foreground" />
                          </div>
                        )}
                        
                        <div className="p-4">
                          <h3 className="font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                            {module.title}
                          </h3>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-primary" />
                              <span>{module.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign size={14} className="text-primary" />
                              <span className="font-semibold text-white">{module.price}</span>
                            </div>
                          </div>
                        </div>

                        {canEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteSubEvent(module.id, module.title)
                            }}
                            className="absolute top-2 right-2 p-2 rounded-lg glass glass-hover text-[#d02243] hover:text-[#aa1c37] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">
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
                      className="glow-button text-white font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <Plus size={18} />
                      Add Speaker
                    </Button>
                  )}
                </div>
                {speakers.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {speakers.map((speaker) => (
                      <div
                        key={speaker.id}
                        onClick={() => setSelectedSpeaker(speaker)}
                        className="glass rounded-lg p-6 flex gap-4 relative group hover:bg-accent transition-all cursor-pointer"
                      >
                        <div className="relative w-20 h-20">
                          <Image
                            src={speaker.profileImage || "/placeholder.png"}
                            alt={speaker.name}
                            fill
                            className="rounded-full object-cover"
                          />
                          {canEdit && (
                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Pencil size={16} className="text-white" />
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                  e.stopPropagation()
                                  if (e.target.files && e.target.files[0]) {
                                    handleSpeakerImageUpload(speaker.id, e.target.files[0])
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{speaker.name}</h4>
                          <p className="text-sm text-muted-foreground">{speaker.title}</p>
                        </div>
                        {canEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteSpeaker(speaker.id, speaker.name)
                            }}
                            className="absolute top-2 right-2 p-2 rounded-lg glass glass-hover text-destructive hover:text-destructive/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">No speakers information available.</p>
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
                    <p className="text-sm text-muted-foreground mb-2">Society</p>
                    <p className="text-primary font-semibold text-lg">{eventData.societyName}</p>
                  </div>
                  {eventData.venueDetails?.address && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Address</p>
                      <div className="flex items-center justify-between">
                        <p className="text-white font-semibold flex-1">{eventData.venueDetails.address}</p>
                        {canEdit && <EditableIcon onClick={() => openEditModal("address", eventData.venueDetails?.address || "")} />}
                      </div>
                    </div>
                  )}
                  {eventData.venueDetails?.mapLink && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Map Link</p>
                      <div className="flex items-center justify-between">
                        <a
                          href={eventData.venueDetails.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-secondary font-semibold text-sm flex items-center gap-2 flex-1 cursor-pointer"
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
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Venue</p>
                <div className="flex items-start gap-3 justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <MapPin size={20} className="text-primary flex-shrink-0 mt-1" />
                    <p className="text-white font-semibold">{venueDisplay}</p>
                  </div>
                  {canEdit && <EditableIcon onClick={() => openEditModal("venue", venueDisplay)} />}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Date & Time</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Calendar size={20} className="text-primary" />
                      <p className="text-white font-semibold">{eventData.startDate}</p>
                    </div>
                    {canEdit && <EditableIcon onClick={() => openEditModal("date", eventData.startDate)} />}
                  </div>
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Clock size={20} className="text-primary" />
                      <p className="text-white font-semibold">
                        {eventData.startTime} - {eventData.endTime}
                      </p>
                    </div>
                    {canEdit && <EditableIcon onClick={() => openEditModal("startTime", eventData.startTime)} />}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Event Type</p>
                <div className="flex items-center gap-3">
                  <p className="text-white font-semibold capitalize">{eventData.eventType}</p>
                </div>
              </div>

              {canEdit && eventData.registrationLink && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Registration</p>
                  <div className="flex items-start gap-3 justify-between">
                    <a
                      href={eventData.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary font-semibold text-sm truncate flex-1"
                    >
                      {eventData.registrationLink}
                    </a>
                    <EditableIcon onClick={() => openEditModal("registrationLink", eventData.registrationLink || "")} />
                  </div>
                </div>
              )}

              {eventData.metrics && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Engagement</p>
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-primary" />
                    <p className="text-white font-semibold">{eventData.metrics.views || 0} views</p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                {eventData.status === "published" && eventData.registrationLink && (
                  <a
                    href={eventData.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block"
                  >
                    <Button className="w-full glow-button text-white font-semibold py-6 text-lg cursor-pointer">
                      Register Now
                    </Button>
                  </a>
                )}
                {eventData.status === "completed" && (
                  <Button className="w-full bg-accent hover:bg-accent/80 text-white font-semibold py-6 text-lg cursor-pointer">
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
        canEdit={canEdit}
        onUpdate={updateSubEvent}
        onImageUpload={handleSubEventImageUpload}
        onDocumentUpload={handleSubEventDocumentUpload}
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

      {/* Speaker Detail Modal */}
      {selectedSpeaker && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !canEdit && setSelectedSpeaker(null)}
        >
          <div className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Speaker Information</h3>
              <button onClick={() => setSelectedSpeaker(null)} className="text-muted-foreground hover:text-white cursor-pointer">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Image */}
              <div className="flex justify-center">
                <div className="relative w-32 h-32">
                  <Image
                    src={selectedSpeaker.profileImage || "/placeholder.png"}
                    alt={selectedSpeaker.name}
                    fill
                    className="rounded-full object-cover"
                  />
                  {canEdit && (
                    <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer rounded-full">
                      <Upload size={24} className="text-white mb-1" />
                      <p className="text-white text-[10px]">Max: 512KB</p>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleSpeakerImageUpload(selectedSpeaker.id, e.target.files[0])
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Name</label>
                {canEdit ? (
                  <input
                    type="text"
                    value={selectedSpeaker.name}
                    onChange={(e) => setSelectedSpeaker({ ...selectedSpeaker, name: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg p-3 text-white focus:outline-none focus:border-ring"
                  />
                ) : (
                  <p className="text-white font-semibold text-lg">{selectedSpeaker.name}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Title/Position</label>
                {canEdit ? (
                  <input
                    type="text"
                    value={selectedSpeaker.title}
                    onChange={(e) => setSelectedSpeaker({ ...selectedSpeaker, title: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg p-3 text-white focus:outline-none focus:border-ring"
                  />
                ) : (
                  <p className="text-white">{selectedSpeaker.title}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Biography</label>
                {canEdit ? (
                  <textarea
                    value={selectedSpeaker.bio || ""}
                    onChange={(e) => setSelectedSpeaker({ ...selectedSpeaker, bio: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg p-3 text-white focus:outline-none focus:border-ring min-h-32"
                    placeholder="Add speaker biography..."
                  />
                ) : (
                  <p className="text-muted-foreground">{selectedSpeaker.bio || "No biography available."}</p>
                )}
              </div>

              {/* Email */}
              {(canEdit || selectedSpeaker.email) && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Email</label>
                  {canEdit ? (
                    <input
                      type="email"
                      value={selectedSpeaker.email || ""}
                      onChange={(e) => setSelectedSpeaker({ ...selectedSpeaker, email: e.target.value })}
                      className="w-full bg-input border border-border rounded-lg p-3 text-white focus:outline-none focus:border-ring"
                      placeholder="speaker@example.com"
                    />
                  ) : (
                    <a href={`mailto:${selectedSpeaker.email}`} className="text-primary hover:text-secondary">{selectedSpeaker.email}</a>
                  )}
                </div>
              )}

              {/* LinkedIn */}
              {(canEdit || selectedSpeaker.linkedin) && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">LinkedIn</label>
                  {canEdit ? (
                    <input
                      type="url"
                      value={selectedSpeaker.linkedin || ""}
                      onChange={(e) => setSelectedSpeaker({ ...selectedSpeaker, linkedin: e.target.value })}
                      className="w-full bg-input border border-border rounded-lg p-3 text-white focus:outline-none focus:border-ring"
                      placeholder="https://linkedin.com/in/username"
                    />
                  ) : (
                    <a href={selectedSpeaker.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary">{selectedSpeaker.linkedin}</a>
                  )}
                </div>
              )}

              {/* Actions */}
              {canEdit && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button
                    onClick={async () => {
                      try {
                        await updateDoc(doc(firestore, "speakers", selectedSpeaker.id), {
                          name: selectedSpeaker.name,
                          title: selectedSpeaker.title,
                          bio: selectedSpeaker.bio || "",
                          email: selectedSpeaker.email || "",
                          linkedin: selectedSpeaker.linkedin || "",
                          updatedAt: Timestamp.now(),
                        })
                        setSpeakers(speakers.map(s => s.id === selectedSpeaker.id ? selectedSpeaker : s))
                        showToast("Speaker information updated successfully!", "success")
                        setSelectedSpeaker(null)
                      } catch (error) {
                        console.error("Error updating speaker:", error)
                        showToast("Failed to update speaker information.", "error")
                      }
                    }}
                    className="flex-1 glow-button text-white font-semibold"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setSelectedSpeaker(null)}
                    variant="outline"
                    className="border-border text-white hover:bg-accent bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Module Modal */}
      {showAddModuleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Add New Module</h3>
              <button onClick={() => setShowAddModuleModal(false)} className="text-muted-foreground hover:text-white cursor-pointer">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Title <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={newModuleData.title}
                  onChange={(e) => setNewModuleData({ ...newModuleData, title: e.target.value })}
                  className="w-full bg-input border border-border rounded-lg p-3 text-white placeholder-muted-foreground focus:outline-none focus:border-ring"
                  placeholder="e.g., Opening Keynote"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Description
                </label>
                <textarea
                  value={newModuleData.description}
                  onChange={(e) => setNewModuleData({ ...newModuleData, description: e.target.value })}
                  className="w-full bg-input border border-border rounded-lg p-3 text-white placeholder-muted-foreground focus:outline-none focus:border-ring min-h-24"
                  placeholder="Describe what this module covers..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    Time <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={newModuleData.time}
                    onChange={(e) => setNewModuleData({ ...newModuleData, time: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg p-3 text-white placeholder-muted-foreground focus:outline-none focus:border-ring"
                    placeholder="e.g., 2:00 PM - 3:00 PM"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newModuleData.duration}
                    onChange={(e) => setNewModuleData({ ...newModuleData, duration: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg p-3 text-white placeholder-muted-foreground focus:outline-none focus:border-ring"
                    placeholder="e.g., 1 hour"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Venue
                </label>
                <input
                  type="text"
                  value={newModuleData.venue}
                  onChange={(e) => setNewModuleData({ ...newModuleData, venue: e.target.value })}
                  className="w-full bg-input border border-border rounded-lg p-3 text-white placeholder-muted-foreground focus:outline-none focus:border-ring"
                  placeholder="Leave empty to use event venue"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Price
                </label>
                <input
                  type="text"
                  value={newModuleData.price}
                  onChange={(e) => setNewModuleData({ ...newModuleData, price: e.target.value })}
                  className="w-full bg-input border border-border rounded-lg p-3 text-white placeholder-muted-foreground focus:outline-none focus:border-ring"
                  placeholder="e.g., Free or PKR 500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleAddModule} className="flex-1 glow-button text-white font-semibold">
                Add Module
              </Button>
              <Button
                onClick={() => setShowAddModuleModal(false)}
                variant="outline"
                className="flex-1 border-border text-white hover:bg-accent bg-transparent"
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
          <div className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Add New Speaker</h3>
              <button onClick={() => setShowAddSpeakerModal(false)} className="text-muted-foreground hover:text-white cursor-pointer">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={newSpeakerData.name}
                  onChange={(e) => setNewSpeakerData({ ...newSpeakerData, name: e.target.value })}
                  className="w-full bg-input border border-border rounded-lg p-3 text-white placeholder-muted-foreground focus:outline-none focus:border-ring"
                  placeholder="e.g., Dr. Sarah Chen"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Title/Position <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={newSpeakerData.title}
                  onChange={(e) => setNewSpeakerData({ ...newSpeakerData, title: e.target.value })}
                  className="w-full bg-input border border-border rounded-lg p-3 text-white placeholder-muted-foreground focus:outline-none focus:border-ring"
                  placeholder="e.g., AI Research Lead, Tech Corp"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Bio
                </label>
                <textarea
                  value={newSpeakerData.bio}
                  onChange={(e) => setNewSpeakerData({ ...newSpeakerData, bio: e.target.value })}
                  className="w-full bg-input border border-border rounded-lg p-3 text-white placeholder-muted-foreground focus:outline-none focus:border-ring min-h-24"
                  placeholder="Brief biography of the speaker..."
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  value={newSpeakerData.email}
                  onChange={(e) => setNewSpeakerData({ ...newSpeakerData, email: e.target.value })}
                  className="w-full bg-input border border-border rounded-lg p-3 text-white placeholder-muted-foreground focus:outline-none focus:border-ring"
                  placeholder="speaker@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={newSpeakerData.linkedin}
                  onChange={(e) => setNewSpeakerData({ ...newSpeakerData, linkedin: e.target.value })}
                  className="w-full bg-input border border-border rounded-lg p-3 text-white placeholder-muted-foreground focus:outline-none focus:border-ring"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleAddSpeaker} className="flex-1 glow-button text-white font-semibold">
                Add Speaker
              </Button>
              <Button
                onClick={() => setShowAddSpeakerModal(false)}
                variant="outline"
                className="flex-1 border-border text-white hover:bg-accent bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Module Detail Modal */}
      <ModuleDetailModal
        isOpen={selectedModule !== null}
        module={selectedModule}
        onClose={() => setSelectedModule(null)}
        canEdit={canEdit}
        onUpdate={updateSubEvent}
        onImageUpload={handleSubEventImageUpload}
        onDocumentUpload={handleSubEventDocumentUpload}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, type: null, id: null, name: '' })}
        onConfirm={confirmDelete}
        itemName={deleteConfirmation.name}
        itemType={deleteConfirmation.type || 'item'}
      />

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onUpload={handleImageUpload}
        title="Upload Cover Image"
      />
    </div>
  )
}

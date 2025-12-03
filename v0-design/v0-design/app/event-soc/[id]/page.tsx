"use client"

import { useState } from "react"
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Users,
  ArrowLeft,
  Pencil,
  Plus,
  Trash2,
  X,
  Upload,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

// Mock event data - in a real app, this would come from a database
const eventData = {
  id: 1,
  title: "Tech Innovation Summit 2025",
  society: "Tech Society",
  image: "/conference-hall-with-modern-setup.jpg",
  date: "December 15, 2025",
  startTime: "2:00 PM",
  endTime: "6:00 PM",
  venue: "Main Auditorium, IBA Campus",
  price: "Free",
  registrationLink: "https://register.techsociety.org/summit2025",
  attendees: 342,
  status: "upcoming",
  description: `Join us for the most anticipated tech event of the year! The Tech Innovation Summit 2025 brings together industry leaders, innovators, and tech enthusiasts to explore the latest advancements in artificial intelligence, cloud computing, and digital transformation.

This comprehensive summit features keynote presentations from renowned tech pioneers, interactive workshops, networking sessions, and live demonstrations of cutting-edge technologies. Whether you're a student, professional, or entrepreneur, this event offers invaluable insights into the future of technology.

Attendees will have the opportunity to:
- Learn from industry experts and thought leaders
- Network with like-minded professionals and innovators
- Explore emerging technologies and their real-world applications
- Participate in hands-on workshops and demonstrations
- Discover career opportunities with leading tech companies

The summit is designed to inspire, educate, and connect the tech community. Don't miss this opportunity to be part of the conversation shaping the future of technology.`,
  modules: [
    {
      id: 1,
      title: "Opening Keynote: AI Revolution",
      time: "2:00 PM - 3:00 PM",
      price: "Free",
      image: "/conference-hall-with-modern-setup.jpg",
      description:
        "Join Dr. Sarah Chen as she explores the latest breakthroughs in artificial intelligence and their real-world applications. This keynote will cover machine learning, neural networks, and the future of AI in business.",
      documents: [{ id: 1, name: "AI_Keynote_Slides.pdf", url: "#" }],
    },
    {
      id: 2,
      title: "Workshop: Cloud Computing Basics",
      time: "3:15 PM - 4:15 PM",
      price: "PKR 500",
      image: "/networking-event-with-professionals.jpg",
      description:
        "Hands-on workshop covering cloud computing fundamentals. Learn about AWS, Azure, and Google Cloud platforms. Perfect for beginners looking to understand cloud infrastructure.",
      documents: [
        { id: 1, name: "Cloud_Workshop_Guide.pdf", url: "#" },
        { id: 2, name: "Setup_Instructions.pdf", url: "#" },
      ],
    },
  ],
  speakers: [
    { id: 1, name: "Dr. Sarah Chen", title: "AI Research Lead, Tech Corp", image: "/professional-woman.png" },
    { id: 2, name: "James Wilson", title: "Cloud Architect, Cloud Systems Inc", image: "/professional-man.png" },
    { id: 3, name: "Priya Sharma", title: "Innovation Director, StartUp Hub", image: "/professional-woman-2.png" },
  ],
  contact: {
    email: "events@techsociety.org",
    phone: "+1 (555) 123-4567",
    website: "www.techsociety.org",
  },
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

export default function SocietyEventManagementPage() {
  const [activeTab, setActiveTab] = useState("description")
  const [hasChanges, setHasChanges] = useState(false)

  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const [title, setTitle] = useState(eventData.title)
  const [description, setDescription] = useState(eventData.description)
  const [venue, setVenue] = useState(eventData.venue)
  const [date, setDate] = useState(eventData.date)
  const [startTime, setStartTime] = useState(eventData.startTime)
  const [endTime, setEndTime] = useState(eventData.endTime)
  const [price, setPrice] = useState(eventData.price)
  const [registrationLink, setRegistrationLink] = useState(eventData.registrationLink)

  const [modules, setModules] = useState(eventData.modules)
  const [speakers, setSpeakers] = useState(eventData.speakers)
  const [contact, setContact] = useState(eventData.contact)

  const tabs = ["Description", "Modules", "Speakers", "Contact"]

  const openEditModal = (field: string, currentValue: string) => {
    setEditingField(field)
    setEditValue(currentValue)
  }

  const saveEditField = () => {
    setHasChanges(true)
    switch (editingField) {
      case "title":
        setTitle(editValue)
        break
      case "description":
        setDescription(editValue)
        break
      case "venue":
        setVenue(editValue)
        break
      case "date":
        setDate(editValue)
        break
      case "startTime":
        setStartTime(editValue)
        break
      case "endTime":
        setEndTime(editValue)
        break
      case "price":
        setPrice(editValue)
        break
      case "registrationLink":
        setRegistrationLink(editValue)
        break
      case "email":
        setContact({ ...contact, email: editValue })
        break
      case "phone":
        setContact({ ...contact, phone: editValue })
        break
      case "website":
        setContact({ ...contact, website: editValue })
        break
    }
    setEditingField(null)
  }

  const addModule = () => {
    const newModule = {
      id: Math.max(...modules.map((m) => m.id), 0) + 1,
      title: "New Module",
      time: "TBD",
      price: "Free",
      image: "/placeholder.svg",
      description: "Module description",
      documents: [],
    }
    setModules([...modules, newModule])
    setHasChanges(true)
  }

  const updateModule = (id: number, field: string, value: string) => {
    setModules(
      modules.map((m) =>
        m.id === id
          ? {
              ...m,
              [field]: value,
            }
          : m,
      ),
    )
    setHasChanges(true)
  }

  const deleteModule = (id: number) => {
    setModules(modules.filter((m) => m.id !== id))
    setHasChanges(true)
  }

  const addDocumentToModule = (moduleId: number) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              documents: [
                ...m.documents,
                {
                  id: Math.max(...m.documents.map((d) => d.id), 0) + 1,
                  name: "New_Document.pdf",
                  url: "#",
                },
              ],
            }
          : m,
      ),
    )
    setHasChanges(true)
  }

  const deleteDocumentFromModule = (moduleId: number, docId: number) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              documents: m.documents.filter((d) => d.id !== docId),
            }
          : m,
      ),
    )
    setHasChanges(true)
  }

  const addSpeaker = () => {
    const newSpeaker = {
      id: Math.max(...speakers.map((s) => s.id), 0) + 1,
      name: "New Speaker",
      title: "Title",
      image: "/placeholder.svg",
    }
    setSpeakers([...speakers, newSpeaker])
    setHasChanges(true)
  }

  const deleteSpeaker = (id: number) => {
    setSpeakers(speakers.filter((s) => s.id !== id))
    setHasChanges(true)
  }

  return (
    <div className="min-h-screen bg-[#110205]">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(17,2,5,0.8)] border-b border-[rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/default-profile-society"
            className="flex items-center gap-2 text-[rgba(255,255,255,0.7)] hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </Link>
          {hasChanges && (
            <Button className="bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold">Save Changes</Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden group">
        <Image src={eventData.image || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#110205] via-[rgba(17,2,5,0.6)] to-transparent"></div>
        <div className="absolute inset-0 backdrop-blur-sm border border-[rgba(255,255,255,0.1)]"></div>

        <button className="absolute top-6 right-6 glass glass-hover rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Pencil size={20} className="text-[#d02243]" />
        </button>

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
          <div className="max-w-7xl mx-auto w-full">
            <p className="text-[#d02243] font-semibold mb-3">{eventData.society}</p>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl sm:text-5xl font-bold text-white max-w-3xl">{title}</h1>
              <EditableIcon onClick={() => openEditModal("title", title)} />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
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
                    <EditableIcon onClick={() => openEditModal("description", description)} />
                  </div>
                  <div className="prose prose-invert max-w-none">
                    {description.split("\n\n").map((paragraph, idx) => (
                      <p key={idx} className="text-[rgba(255,255,255,0.8)] leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "modules" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Event Modules</h2>
                  <Button
                    onClick={addModule}
                    className="bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add New Module
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {modules.map((module) => (
                    <div key={module.id} className="glass rounded-lg overflow-hidden p-6 space-y-4">
                      {/* Module Image */}
                      <div className="relative h-40 rounded-lg overflow-hidden bg-[rgba(255,255,255,0.05)] flex items-center justify-center group">
                        {module.image && module.image !== "/placeholder.svg" ? (
                          <Image
                            src={module.image || "/placeholder.svg"}
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
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) => updateModule(module.id, "title", e.target.value)}
                            className="flex-1 bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-2 text-white text-sm focus:outline-none focus:border-[#d02243]"
                          />
                        </div>
                      </div>

                      {/* Module Date & Time */}
                      <div>
                        <label className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2 block">
                          Date & Time
                        </label>
                        <input
                          type="text"
                          value={module.time}
                          onChange={(e) => updateModule(module.id, "time", e.target.value)}
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
                          onChange={(e) => updateModule(module.id, "price", e.target.value)}
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
                          onChange={(e) => updateModule(module.id, "description", e.target.value)}
                          className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg p-2 text-white text-sm focus:outline-none focus:border-[#d02243] min-h-24"
                        />
                      </div>

                      {/* Attached Documents */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase">
                            Attached Documents
                          </label>
                          <button
                            onClick={() => addDocumentToModule(module.id)}
                            className="text-[#d02243] hover:text-[#aa1c37] text-xs font-semibold flex items-center gap-1"
                          >
                            <Plus size={14} />
                            Add
                          </button>
                        </div>
                        <div className="space-y-2">
                          {module.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center gap-2 p-2 bg-[rgba(255,255,255,0.05)] rounded-lg"
                            >
                              <Download size={14} className="text-[#d02243]" />
                              <span className="text-xs text-[rgba(255,255,255,0.7)] flex-1 truncate">{doc.name}</span>
                              <button
                                onClick={() => deleteDocumentFromModule(module.id, doc.id)}
                                className="text-[rgba(255,255,255,0.5)] hover:text-[#d02243]"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Module Actions */}
                      <div className="flex gap-2 pt-4 border-t border-[rgba(255,255,255,0.1)]">
                        <Button className="flex-1 bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold text-sm">
                          Save
                        </Button>
                        <button
                          onClick={() => deleteModule(module.id)}
                          className="p-2 rounded-lg glass glass-hover text-[#d02243] hover:text-[#aa1c37]"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers Tab */}
            {activeTab === "speakers" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Featured Speakers</h2>
                  <Button
                    onClick={addSpeaker}
                    className="bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add Speaker
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {speakers.map((speaker) => (
                    <div key={speaker.id} className="glass rounded-lg p-6 flex gap-4 relative group">
                      <Image
                        src={speaker.image || "/placeholder.svg"}
                        alt={speaker.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{speaker.name}</h4>
                        <p className="text-sm text-[rgba(255,255,255,0.7)]">{speaker.title}</p>
                      </div>
                      <button
                        onClick={() => deleteSpeaker(speaker.id)}
                        className="absolute top-2 right-2 p-2 rounded-lg glass glass-hover text-[#d02243] hover:text-[#aa1c37] opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                <div className="glass rounded-lg p-8 space-y-6">
                  <div>
                    <p className="text-sm text-[rgba(255,255,255,0.6)] mb-2">Email</p>
                    <div className="flex items-center justify-between">
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-[#d02243] hover:text-[#aa1c37] font-semibold text-lg"
                      >
                        {contact.email}
                      </a>
                      <EditableIcon onClick={() => openEditModal("email", contact.email)} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[rgba(255,255,255,0.6)] mb-2">Phone</p>
                    <div className="flex items-center justify-between">
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-[#d02243] hover:text-[#aa1c37] font-semibold text-lg"
                      >
                        {contact.phone}
                      </a>
                      <EditableIcon onClick={() => openEditModal("phone", contact.phone)} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[rgba(255,255,255,0.6)] mb-2">Website</p>
                    <div className="flex items-center justify-between">
                      <a
                        href={`https://${contact.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#d02243] hover:text-[#aa1c37] font-semibold text-lg"
                      >
                        {contact.website}
                      </a>
                      <EditableIcon onClick={() => openEditModal("website", contact.website)} />
                    </div>
                  </div>
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
                    <p className="text-white font-semibold">{venue}</p>
                  </div>
                  <EditableIcon onClick={() => openEditModal("venue", venue)} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2">Date & Time</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Calendar size={20} className="text-[#d02243]" />
                      <p className="text-white font-semibold">{date}</p>
                    </div>
                    <EditableIcon onClick={() => openEditModal("date", date)} />
                  </div>
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Clock size={20} className="text-[#d02243]" />
                      <p className="text-white font-semibold">
                        {startTime} - {endTime}
                      </p>
                    </div>
                    <EditableIcon onClick={() => openEditModal("startTime", startTime)} />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2">Price</p>
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <DollarSign size={20} className="text-[#d02243]" />
                    <p className="text-white font-semibold">{price}</p>
                  </div>
                  <EditableIcon onClick={() => openEditModal("price", price)} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2">Registration</p>
                <div className="flex items-start gap-3 justify-between">
                  <a
                    href={registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#d02243] hover:text-[#aa1c37] font-semibold text-sm truncate flex-1"
                  >
                    {registrationLink}
                  </a>
                  <EditableIcon onClick={() => openEditModal("registrationLink", registrationLink)} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2">Attendees</p>
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-[#d02243]" />
                  <p className="text-white font-semibold">{eventData.attendees} people registered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditModal
        isOpen={editingField !== null}
        title={editingField || ""}
        value={editValue}
        onChange={setEditValue}
        onSave={saveEditField}
        onClose={() => setEditingField(null)}
        type={
          editingField === "description"
            ? "textarea"
            : editingField === "date"
              ? "date"
              : editingField === "startTime" || editingField === "endTime"
                ? "time"
                : "text"
        }
      />
    </div>
  )
}

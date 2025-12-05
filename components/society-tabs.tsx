"use client"

import { useState, useEffect } from "react"
import { MapPin, Calendar, Share2, Mail, Edit2, Eye, Trash2, Plus, Search, Facebook, Linkedin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import EditEventModal from "./edit-event-modal"

// Define interfaces locally as per current project convention
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

interface SocietyTabsProps {
  theme: string
  isManagementView?: boolean
  societyData: Society
  events: Event[]
  members: Member[]
  handleDeleteEvent: (eventId: string) => Promise<void>
  handleEditEvent: (eventData: Event) => Promise<void>
}

const tabs = ["Overview", "Manage Events", "Members", "About Us"]

/**
 * @component SocietyTabs
 * 
 * @param {object} props
 * @param {string} props.theme - The theme to apply to the tabs section.
 * @param {boolean} [props.isManagementView] - Optional flag to show management controls.
 * @param {Society} props.societyData - The data for the society.
 * @param {Event[]} props.events - An array of events for the society.
 * @param {Member[]} props.members - An array of members in the society.
 * @param {(eventId: string) => Promise<void>} props.handleDeleteEvent - Function to handle event deletion.
 * @param {(eventData: Event) => Promise<void>} props.handleEditEvent - Function to handle event editing.
 * 
 * @remarks
 * This component displays a set of tabs for a society page, including:
 * - Overview: A summary of the society's mission, social links, stats, and upcoming events.
 * - Manage Events: A table of events with search, create, edit, and delete functionality (for management view).
 * - Members: A list of society members with their roles and contact information.
 * - About Us: Detailed information about the society.
 * 
 * The active tab is set to "Manage Events" by default for management view, and "Overview" otherwise.
 * 
 * @example
 * ```tsx
 * import SocietyTabs from '@/components/society-tabs'
 * 
 * export default function SocietyPage() {
 *   // ... fetch societyData, events, members
 *   const handleDeleteEvent = async (eventId) => { ... }
 *   const handleEditEvent = async (eventData) => { ... }
 * 
 *   return (
 *     <div>
 *       <SocietyTabs
 *         theme="default"
 *         isManagementView={true}
 *         societyData={societyData}
 *         events={events}
 *         members={members}
 *         handleDeleteEvent={handleDeleteEvent}
 *         handleEditEvent={handleEditEvent}
 *       />
 *     </div>
 *   )
 * }
 * ```
 * 
 * @category Components
 */
export default function SocietyTabs({ theme, isManagementView = false, societyData, events, members, handleDeleteEvent, handleEditEvent }: SocietyTabsProps) {
  const [activeTab, setActiveTab] = useState(isManagementView ? "Manage Events" : "Overview")

  return (
    <div style={{ backgroundColor: `var(--bg-${theme})`, minHeight: "100vh" }}>
      <div
        className="border-b sticky top-16 z-40 backdrop-blur-md"
        style={{
          backgroundColor: `var(--header-bg-${theme})`,
          borderColor: `var(--border-${theme})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="py-4 px-2 font-semibold border-b-2 transition-all"
              style={{
                color: activeTab === tab ? `var(--accent-1-${theme})` : `var(--text-secondary-${theme})`,
                borderColor: activeTab === tab ? `var(--accent-1-${theme})` : "transparent",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12" style={{ backgroundColor: `var(--bg-${theme})` }}>
        {activeTab === "Overview" && <OverviewTab theme={theme} societyData={societyData} events={events} members={members} />}
        {activeTab === "Manage Events" && <ManageEventsTab theme={theme} initialEvents={events} handleDeleteEvent={handleDeleteEvent} handleEditEvent={handleEditEvent} />}
        {activeTab === "Members" && <MembersTab theme={theme} members={members} />}
        {activeTab === "About Us" && <AboutUsTab theme={theme} societyData={societyData} />}
      </div>
    </div>
  )
}

// Helper component for buttons with dynamic hover/active styles
const ThemedButton = ({ children, onClick, linkHref, className = "", buttonStyle = {}, size, theme }: { children: React.ReactNode, onClick?: () => void, linkHref?: string, className?: string, buttonStyle?: React.CSSProperties, size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg", theme: string }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const baseStyle: React.CSSProperties = {
    backgroundColor: `var(--accent-1-${theme})`,
    color: "white",
    ...buttonStyle
  }

  const hoverStyle: React.CSSProperties = {
    backgroundColor: `var(--accent-2-${theme})`,
  }

  const activeStyle: React.CSSProperties = {
    backgroundColor: `var(--accent-1-${theme})`, // Or a darker shade
  }

  const currentStyle = {
    ...baseStyle,
    ...(isHovered && hoverStyle),
    ...(isActive && activeStyle),
  }

  const commonProps = {
    className: `font-semibold flex items-center gap-2 transition-all ${className}`,
    style: currentStyle,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onMouseDown: () => setIsActive(true),
    onMouseUp: () => setIsActive(false),
    onClick: onClick,
    size: size,
  }

  if (linkHref) {
    return (
      <Link href={linkHref}>
        <Button {...commonProps}>{children}</Button>
      </Link>
    )
  }

  return <Button {...commonProps}>{children}</Button>
}

function ManageEventsTab({ theme, initialEvents, handleDeleteEvent, handleEditEvent }: { theme: string, initialEvents: Event[], handleDeleteEvent: (eventId: string) => Promise<void>, handleEditEvent: (eventData: Event) => Promise<void> }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [events, setEvents] = useState(initialEvents)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null) // Cast to Event | null

  useEffect(() => {
    setEvents(initialEvents)
  }, [initialEvents])

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event)
    setIsEditModalOpen(true)
  }

  const handleEditModalSubmit = async (eventData: Event) => {
    await handleEditEvent(eventData)
    setIsEditModalOpen(false)
    setSelectedEvent(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "#10b981"
      case "Draft": return "#6b7280"
      case "Concluded": return "#8b5cf6"
      default: return `var(--accent-1-${theme})`
    }
  }

  const filteredEvents = events.filter(
    (event) => event.title.toLowerCase().includes(searchQuery.toLowerCase()) || new Date(event.date).toLocaleDateString().includes(searchQuery),
  )

  return (
    <>
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditModalSubmit}
        event={selectedEvent!}
        theme={theme}
      />
      <div className="space-y-6">
        <div className="flex gap-4 items-center">
          <ThemedButton linkHref="/create-event" theme={theme}>
            <Plus size={20} />
            Create New Event
          </ThemedButton>
          <div className="flex-1 flex items-center gap-3 px-4 py-2 rounded-lg" style={{ backgroundColor: `var(--glass-${theme})`, backdropFilter: "blur(10px)", border: `1px solid var(--border-${theme})` }}>
            <Search size={18} style={{ color: `var(--text-secondary-${theme})` }} />
            <input
              type="text"
              placeholder="Search events by title or date (e.g., DD-MM-YYYY)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none"
              style={{ color: `var(--text-primary-${theme})` }}
            />
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: `var(--glass-${theme})`, backdropFilter: "blur(10px)", border: `1px solid var(--border-${theme})` }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid var(--border-${theme})`, backgroundColor: `rgba(212, 34, 67, 0.05)` }}>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: `var(--text-primary-${theme})` }}>Event Title</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: `var(--text-primary-${theme})` }}>Date & Time</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: `var(--text-primary-${theme})` }}>Status</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: `var(--text-primary-${theme})` }}>Views</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: `var(--text-primary-${theme})` }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, idx) => (
                  <tr key={event.id} style={{ borderBottom: `1px solid var(--border-${theme})`, backgroundColor: idx % 2 === 0 ? "transparent" : `rgba(212, 34, 67, 0.02)` }}>
                    <td className="px-6 py-4" style={{ color: `var(--text-primary-${theme})` }}><div className="font-semibold">{event.title}</div></td>
                    <td className="px-6 py-4" style={{ color: `var(--text-secondary-${theme})` }}>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${getStatusColor(event.status)}20`, color: getStatusColor(event.status), border: `1px solid ${getStatusColor(event.status)}40` }}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4" style={{ color: `var(--text-secondary-${theme})` }}>
                      {event.metrics?.views || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditClick(event)} className="p-2 rounded-lg transition-all hover:opacity-80" style={{ backgroundColor: `var(--glass-${theme})`, color: `var(--accent-1-${theme})`, border: `1px solid var(--border-${theme})` }} title="Edit Event"><Edit2 size={16} /></button>
                        <Link href={`/events/${event.id}`}>
                          <button className="p-2 rounded-lg transition-all hover:opacity-80" style={{ backgroundColor: `var(--glass-${theme})`, color: `var(--accent-1-${theme})`, border: `1px solid var(--border-${theme})` }} title="View Event"><Eye size={16} /></button>
                        </Link>
                        <button onClick={() => handleDeleteEvent(event.id)} className="p-2 rounded-lg transition-all hover:opacity-80" style={{ backgroundColor: `rgba(239, 68, 68, 0.1)`, color: "#ef4444", border: `1px solid rgba(239, 68, 68, 0.3)` }} title="Delete Event"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredEvents.length === 0 && <div className="px-6 py-12 text-center" style={{ color: `var(--text-secondary-${theme})` }}><p>No events found. Create your first event to get started!</p></div>}
        </div>
      </div>
    </>
  )
}

function OverviewTab({ theme, societyData, events, members }: { theme: string, societyData: Society, events: Event[], members: Member[] }) {
  console.log("OverviewTab events:", events) // Added console.log
  const stats = [
    { label: "Active Members", value: members.length },
    { label: "Events Hosted", value: events.length },
    { label: "Founded Year", value: societyData.dateCreated ? new Date(societyData.dateCreated).getFullYear() : 'N/A' },
  ]
  
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 rounded-2xl" style={{ backgroundColor: `var(--glass-${theme})`, backdropFilter: "blur(10px)", border: `1px solid var(--border-${theme})`, color: `var(--text-primary-${theme})` }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: `var(--accent-1-${theme})` }}>Our Mission</h3>
          <p style={{ color: `var(--text-secondary-${theme})` }} className="leading-relaxed">{societyData.description}</p>
        </div>
        <div className="p-8 rounded-2xl" style={{ backgroundColor: `var(--glass-${theme})`, backdropFilter: "blur(10px)", border: `1px solid var(--border-${theme})`, color: `var(--text-primary-${theme})` }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: `var(--accent-1-${theme})` }}>Connect With Us</h3>
          <div className="space-y-3">
            {societyData.socialLinks?.instagram && <a href={societyData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition" style={{ color: `var(--accent-1-${theme})` }}><Share2 size={18} /> Instagram</a>}
            {societyData.socialLinks?.facebook && <a href={societyData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition" style={{ color: `var(--accent-1-${theme})` }}><Facebook size={18} /> Facebook</a>}
            {societyData.socialLinks?.linkedin && <a href={societyData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition" style={{ color: `var(--accent-1-${theme})` }}><Linkedin size={18} /> LinkedIn</a>}
            {societyData.contactEmail && <a href={`mailto:${societyData.contactEmail}`} className="flex items-center gap-2 hover:opacity-80 transition" style={{ color: `var(--accent-1-${theme})` }}><Mail size={18} /> Email</a>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-6 rounded-xl text-center" style={{ backgroundColor: `var(--glass-${theme})`, backdropFilter: "blur(10px)", border: `1px solid var(--border-${theme})`, color: `var(--text-primary-${theme})` }}>
            <div className="text-3xl font-bold mb-2" style={{ color: `var(--accent-1-${theme})` }}>{stat.value}</div>
            <div style={{ color: `var(--text-secondary-${theme})` }} className="text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6" style={{ color: `var(--text-primary-${theme})` }}>Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.slice(0, 3).map((event) => (
            <Link href={`/events/${event.id}`} key={event.id}>
              <div className="p-6 rounded-2xl h-full" style={{ backgroundColor: `var(--glass-${theme})`, backdropFilter: "blur(10px)", border: `1px solid var(--border-${theme})`, color: `var(--text-primary-${theme})` }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: `var(--accent-1-${theme})` }}>{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2" style={{ color: `var(--text-secondary-${theme})` }}><Calendar size={16} />{new Date(event.date).toLocaleDateString()}</div>
                  <div className="flex items-center gap-2" style={{ color: `var(--text-secondary-${theme})` }}><MapPin size={16} />{event.location || 'TBD'}</div>
                </div>
                <p style={{ color: `var(--text-secondary-${theme})` }} className="mb-4 leading-relaxed line-clamp-2">{event.description}</p>
                <Button className="w-full font-semibold" style={{ backgroundColor: `var(--accent-1-${theme})`, color: "white" }}>View Event</Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function MembersTab({ theme, members }: { theme: string, members: Member[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member, idx) => (
        <div key={idx} className="p-6 rounded-xl" style={{ backgroundColor: `var(--glass-${theme})`, backdropFilter: "blur(10px)", border: `1px solid var(--border-${theme})`, color: `var(--text-primary-${theme})` }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: `var(--accent-1-${theme})`, color: "white" }}>
              {member.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold">{member.name}</div>
              <div style={{ color: `var(--accent-1-${theme})` }} className="text-sm font-medium">{member.role}</div>
            </div>
          </div>
          <a href={`mailto:${member.email}`} style={{ color: `var(--text-secondary-${theme})` }} className="text-sm hover:opacity-80 transition">{member.email}</a>
        </div>
      ))}
    </div>
  )
}

function AboutUsTab({ theme, societyData }: { theme: string, societyData: Society }) {
  return (
    <div className="p-8 rounded-2xl" style={{ backgroundColor: `var(--glass-${theme})`, backdropFilter: "blur(10px)", border: `1px solid var(--border-${theme})`, color: `var(--text-primary-${theme})` }}>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h3 className="text-2xl font-bold mb-3" style={{ color: `var(--accent-1-${theme})` }}>About Our Society</h3>
          <p style={{ color: `var(--text-secondary-${theme})` }} className="leading-relaxed">{societyData.description}</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-3" style={{ color: `var(--accent-1-${theme})` }}>Contact Information</h3>
          <div style={{ color: `var(--text-secondary-${theme})` }} className="space-y-2">
            {societyData.contactEmail && <p>Email: {societyData.contactEmail}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

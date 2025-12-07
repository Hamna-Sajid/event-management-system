/**
 * @component SocietyTabs
 * 
 * Tabbed interface for displaying society information, events, and team members
 * 
 * @remarks
 * This component provides a comprehensive tabbed interface for society pages:
 * - **About Tab**: Society description, head information, social media links
 * - **Events Tab**: Grid of society events with filtering and search
 * - **Team Tab**: Display of society team members and roles
 * 
 * Features:
 * - Three-tab navigation (About, Events, Team)
 * - Event management (create, edit, delete) for authorized users
 * - Search and filter functionality for events
 * - Social media integration (Facebook, LinkedIn)
 * - Responsive grid layouts
 * - EditEventModal integration for event modifications
 * 
 * @example
 * Basic usage:
 * ```tsx
 * <SocietyTabs
 *   societyId="computing-soc-001"
 *   isManagementView={false}
 *   theme="blue"
 * />
 * ```
 * 
 * @example
 * Management view:
 * ```tsx
 * <SocietyTabs
 *   societyId="arts-soc-001"
 *   isManagementView={true}
 *   theme="purple"
 * />
 * ```
 */

"use client"

import { useState, useEffect } from "react"
import { MapPin, Calendar, Share2, Mail, Edit2, Eye, Trash2, Plus, Search, Facebook, Linkedin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import EditEventModal from "./edit-event-modal"
import { Society, Member, Event } from "@/lib/societies/types"

/**
 * Props for the {@link SocietyTabs} component.
 */
interface SocietyTabsProps {
  /** The theme to apply to the tabs section (e.g., "default"). */
  theme: string
  /** Optional flag to enable/disable management controls and set initial active tab. */
  isManagementView?: boolean
  /** The data object for the current society. */
  societyData: Society
  /** An array of event objects belonging to the society. */
  events: Event[]
  /** An array of member objects associated with the society. */
  members: Member[]
  /** Callback function to handle event deletion. */
  handleDeleteEvent: (eventId: string) => Promise<void>
  /** Callback function to handle event editing. */
  handleEditEvent: (eventData: Event) => Promise<void>
}

const tabs = ["Overview", "Manage Events", "Members", "About Us"]

/**
 * @component SocietyTabs
 * 
 * Displays a tabbed interface for a society page, allowing users to navigate
 * between different sections like Overview, Manage Events, Members, and About Us.
 * 
 * @remarks
 * This component dynamically renders content based on the active tab and
 * `isManagementView` prop.
 * - **Overview**: Shows society's mission, social links, key statistics, and upcoming events.
 * - **Manage Events**: (Only in management view) Provides an interface to search, create,
 *   edit, and delete events.
 * - **Members**: Lists the society's members with their roles and contact info.
 * - **About Us**: Displays detailed information about the society.
 * 
 * The initial active tab is "Manage Events" if `isManagementView` is true, otherwise it's "Overview".
 * 
 * @example
 * ```tsx
 * import SocietyTabs from '@/components/society-tabs'
 * // Assume societyData, events, members, handleDeleteEvent, handleEditEvent are defined
 * 
 * export default function SocietyPage() {
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
 */
export default function SocietyTabs({ theme, isManagementView = false, societyData, events, members, handleDeleteEvent, handleEditEvent }: SocietyTabsProps) {
  const [activeTab, setActiveTab] = useState(isManagementView ? "Manage Events" : "Overview")

  return (
    <div style={{ minHeight: "100vh" }}>
      <div
        className="border-b sticky top-16 z-40 backdrop-blur-md"
        style={{
          backgroundColor: 'transparent',
          borderColor: `var(--border-${theme})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="py-4 px-2 font-semibold border-b-2 transition-all cursor-pointer"
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

      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === "Overview" && <OverviewTab theme={theme} societyData={societyData} events={events} members={members} />}
        {activeTab === "Manage Events" && <ManageEventsTab theme={theme} initialEvents={events} handleDeleteEvent={handleDeleteEvent} handleEditEvent={handleEditEvent} />}
        {activeTab === "Members" && <MembersTab theme={theme} members={members} />}
        {activeTab === "About Us" && <AboutUsTab theme={theme} societyData={societyData} />}
      </div>
    </div>
  )
}

/**
 * @component ThemedButton
 * 
 * A customizable button component that applies dynamic hover/active styles based on a theme.
 * It can function as a link or a standard button.
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - The content to be rendered inside the button.
 * @param {() => void} [props.onClick] - Optional click handler for the button.
 * @param {string} [props.linkHref] - Optional URL for the button to act as a link.
 * @param {string} [props.className] - Optional additional CSS classes.
 * @param {React.CSSProperties} [props.buttonStyle] - Optional inline styles for the button.
 * @param {"default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"} [props.size] - Optional size of the button.
 * @param {string} props.theme - The theme to apply (e.g., "default").
 * 
 * @remarks
 * If `linkHref` is provided, the button acts as a Next.js Link.
 * Otherwise, it acts as a standard button with an `onClick` handler.
 * Styles change on hover and active states using CSS variables derived from the `theme` prop.
 * 
 * @example
 * ```tsx
 * // As a link
 * <ThemedButton linkHref="/dashboard" theme="default">Go to Dashboard</ThemedButton>
 * 
 * // As a button with an action
 * <ThemedButton onClick={() => alert('Clicked!')} theme="default" size="lg">Click Me</ThemedButton>
 * ```
 */
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

/**
 * @component ManageEventsTab
 * 
 * Displays an interface for managing a society's events, including search, filter,
 * create, edit, and delete functionalities. This tab is primarily for authorized users.
 * 
 * @param {object} props
 * @param {string} props.theme - The theme to apply for styling.
 * @param {Event[]} props.initialEvents - The initial list of events to display.
 * @param {(eventId: string) => Promise<void>} props.handleDeleteEvent - Callback to delete an event.
 * @param {(eventData: Event) => Promise<void>} props.handleEditEvent - Callback to edit an event.
 * 
 * @remarks
 * - Allows searching events by title or date.
 * - Filters events by status (Published, Draft, Concluded, All).
 * - Provides buttons to create new events, and edit/view/delete existing events.
 * - Uses `EditEventModal` for event editing.
 */
function ManageEventsTab({ theme, initialEvents, handleDeleteEvent, handleEditEvent }: { theme: string, initialEvents: Event[], handleDeleteEvent: (eventId: string) => Promise<void>, handleEditEvent: (eventData: Event) => Promise<void> }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [events, setEvents] = useState(initialEvents)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedStatus, setSelectedStatus] = useState("All") // New state for status filter

  const statusOptions = [
    { value: "All", label: "All Statuses" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "concluded",label: "Concluded" },
  ];

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
    switch (status.toLowerCase()) {
      case "published": return "#10b981"
      case "draft": return "#6b7280"
      case "concluded": return "#8b5cf6"
      default: return `var(--accent-1-${theme})`
    }
  }

  const filteredEvents = events.filter(
    (event) => {
      const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            formattedDate.includes(searchQuery);
      const matchesStatus = selectedStatus === "All" || event.status.toLowerCase() === selectedStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    }
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

          {/* New Select component for status filter */}
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions}
            placeholder="Filter by Status"
            className="w-[180px]"
          />

          <div className="flex-1 flex items-center gap-3 px-4 py-2 rounded-lg" style={{ backgroundColor: `var(--glass-${theme})`, backdropFilter: "blur(10px)", border: `1px solid var(--border-${theme})` }}>
            <Search size={18} style={{ color: `var(--text-secondary-${theme})` }} />
            <input
              type="text"
              placeholder="Search events by title or date (e.g., MM-DD-YYYY)..."
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
                <tr style={{ borderBottom: `1px solid var(--border-${theme})`, backgroundColor: `hsl(var(--primary) / 0.05)` }}>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: `var(--text-primary-${theme})` }}>Event Title</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: `var(--text-primary-${theme})` }}>Date & Time</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: `var(--text-primary-${theme})` }}>Status</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: `var(--text-primary-${theme})` }}>Views</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: `var(--text-primary-${theme})` }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, idx) => (
                  <tr key={event.id} style={{ borderBottom: `1px solid var(--border-${theme})`, backgroundColor: idx % 2 === 0 ? "transparent" : `hsl(var(--primary) / 0.02)` }}>
                    <td className="px-6 py-4" style={{ verticalAlign: "middle", color: `var(--text-primary-${theme})` }}><div className="font-semibold">{event.title}</div></td>
                    <td className="px-6 py-4" style={{ verticalAlign: "middle", color: `var(--text-secondary-${theme})` }}>
                      <div className="flex items-center gap-2 flex-nowrap">
                        <Calendar size={16} />
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ verticalAlign: "middle" }}>
                      <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${getStatusColor(event.status)}20`, color: getStatusColor(event.status), border: `1px solid ${getStatusColor(event.status)}40` }}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4" style={{ verticalAlign: "middle", color: `var(--text-secondary-${theme})` }}>
                      {event.metrics?.views || 0}
                    </td>
                    <td className="px-6 py-4" style={{ verticalAlign: "middle" }}>
                      <div className="flex items-center gap-2 flex-nowrap">
                        <button onClick={() => handleEditClick(event)} className="p-2 rounded-lg transition-all hover:opacity-80" style={{ backgroundColor: `var(--glass-${theme})`, color: `var(--accent-1-${theme})`, border: `1px solid var(--border-${theme})` }} title="Edit Event"><Edit2 size={16} /></button>
                        <Link href={`/events/${event.id}`}>
                          <button className="p-2 rounded-lg transition-all hover:opacity-80" style={{ backgroundColor: `var(--glass-${theme})`, color: `var(--accent-1-${theme})`, border: `1px solid var(--border-${theme})` }} title="View Event"><Eye size={16} /></button>
                        </Link>
                        <button onClick={() => handleDeleteEvent(event.id)} className="p-2 rounded-lg transition-all hover:opacity-80 bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20" title="Delete Event"><Trash2 size={16} /></button>
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

/**
 * @component OverviewTab
 * 
 * Displays an overview of the society, including its mission, social media links,
 * key statistics, and a preview of upcoming events.
 * 
 * @param {object} props
 * @param {string} props.theme - The theme to apply for styling.
 * @param {Society} props.societyData - The data object for the current society.
 * @param {Event[]} props.events - An array of events for the society.
 * @param {Member[]} props.members - An array of members in the society.
 * 
 * @remarks
 * - The mission section shows the `societyData.description`.
 * - "Connect With Us" section displays social media links (Instagram, Facebook, LinkedIn)
 *   and contact email from `societyData.socialLinks` and `societyData.contactEmail`.
 * - Statistics include active members, events hosted, and founded year.
 * - "Upcoming Events" section displays up to 3 upcoming events, with links to their detail pages.
 */
function OverviewTab({ theme, societyData, events, members }: { theme: string, societyData: Society, events: Event[], members: Member[] }) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event) => (
            <Link href={`/events/${event.id}`} key={event.id}>
              <div className="glass rounded-lg overflow-hidden hover:bg-accent transition-all cursor-pointer group h-full">
                {/* Event Cover Image */}
                {event.coverImage && event.coverImage !== "/placeholder.png" ? (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-card flex items-center justify-center">
                    <Calendar size={32} style={{ color: `var(--text-secondary-${theme})` }} />
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors" style={{ color: `var(--text-primary-${theme})` }}>
                    {event.title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2" style={{ color: `var(--text-secondary-${theme})` }}>
                      <Calendar size={16} />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2" style={{ color: `var(--text-secondary-${theme})` }}>
                      <MapPin size={16} />
                      {event.location || 'TBD'}
                    </div>
                  </div>
                  <p style={{ color: `var(--text-secondary-${theme})` }} className="leading-relaxed line-clamp-2 mb-4">
                    {event.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * @component MembersTab
 * 
 * Displays a list of members for the society, typically showing society heads.
 * 
 * @param {object} props
 * @param {string} props.theme - The theme to apply for styling.
 * @param {Member[]} props.members - An array of member objects to display.
 * 
 * @remarks
 * Each member card shows their name, role, and email, with an avatar displaying
 * the first letter of their name.
 */
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

/**
 * @component AboutUsTab
 * 
 * Displays detailed information about the society, including its description and contact information.
 * 
 * @param {object} props
 * @param {string} props.theme - The theme to apply for styling.
 * @param {Society} props.societyData - The data object for the current society.
 * 
 * @remarks
 * - Shows the society's `description` under "About Our Society".
 * - Displays the `contactEmail` under "Contact Information".
 */
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

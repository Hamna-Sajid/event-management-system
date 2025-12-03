"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Calendar, Users, Share2, Mail, Phone, Edit2, Eye, Trash2, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SocietyTabsProps {
  theme: string
  children: React.ReactNode
  isManagementView?: boolean
}

const tabs = ["Overview", "Manage Events", "Members", "About Us"]

export default function SocietyTabs({ theme, children, isManagementView = false }: SocietyTabsProps) {
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
        {activeTab === "Overview" && <OverviewTab theme={theme} />}
        {activeTab === "Manage Events" && <ManageEventsTab theme={theme} />}
        {activeTab === "Members" && <MembersTab theme={theme} />}
        {activeTab === "About Us" && <AboutUsTab theme={theme} />}
      </div>
    </div>
  )
}

function ManageEventsTab({ theme }: { theme: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Tech Workshop: AI & Machine Learning",
      date: "Nov 15, 2024",
      time: "2:00 PM",
      status: "Published",
      registrations: 45,
    },
    {
      id: 2,
      title: "Networking Mixer",
      date: "Nov 22, 2024",
      time: "6:00 PM",
      status: "Draft",
      registrations: 0,
    },
    {
      id: 3,
      title: "Annual Gala Dinner",
      date: "Dec 5, 2024",
      time: "7:00 PM",
      status: "Published",
      registrations: 120,
    },
    {
      id: 4,
      title: "Spring Conference",
      date: "May 10, 2024",
      time: "10:00 AM",
      status: "Concluded",
      registrations: 200,
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "#10b981"
      case "Draft":
        return "#6b7280"
      case "Concluded":
        return "#8b5cf6"
      default:
        return `var(--accent-1-${theme})`
    }
  }

  const filteredEvents = events.filter(
    (event) => event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.date.includes(searchQuery),
  )

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Button
          className="font-semibold flex items-center gap-2"
          style={{
            backgroundColor: `var(--accent-1-${theme})`,
            color: "white",
          }}
        >
          <Plus size={20} />
          Create New Event
        </Button>

        <div
          className="flex-1 flex items-center gap-3 px-4 py-2 rounded-lg"
          style={{
            backgroundColor: `var(--glass-${theme})`,
            backdropFilter: "blur(10px)",
            border: `1px solid var(--border-${theme})`,
          }}
        >
          <Search size={18} style={{ color: `var(--text-secondary-${theme})` }} />
          <input
            type="text"
            placeholder="Search events by title or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{ color: `var(--text-primary-${theme})` }}
          />
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: `var(--glass-${theme})`,
          backdropFilter: "blur(10px)",
          border: `1px solid var(--border-${theme})`,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid var(--border-${theme})`,
                  backgroundColor: `rgba(212, 34, 67, 0.05)`,
                }}
              >
                <th className="px-6 py-4 text-left font-semibold" style={{ color: `var(--text-primary-${theme})` }}>
                  Event Title
                </th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: `var(--text-primary-${theme})` }}>
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: `var(--text-primary-${theme})` }}>
                  Status
                </th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: `var(--text-primary-${theme})` }}>
                  Registrations
                </th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: `var(--text-primary-${theme})` }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event, idx) => (
                <tr
                  key={event.id}
                  style={{
                    borderBottom: `1px solid var(--border-${theme})`,
                    backgroundColor: idx % 2 === 0 ? "transparent" : `rgba(212, 34, 67, 0.02)`,
                  }}
                >
                  <td className="px-6 py-4" style={{ color: `var(--text-primary-${theme})` }}>
                    <div className="font-semibold">{event.title}</div>
                  </td>
                  <td className="px-6 py-4" style={{ color: `var(--text-secondary-${theme})` }}>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {event.date} at {event.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${getStatusColor(event.status)}20`,
                        color: getStatusColor(event.status),
                        border: `1px solid ${getStatusColor(event.status)}40`,
                      }}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4" style={{ color: `var(--text-secondary-${theme})` }}>
                    {event.registrations} registered
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg transition-all hover:opacity-80"
                        style={{
                          backgroundColor: `var(--glass-${theme})`,
                          color: `var(--accent-1-${theme})`,
                          border: `1px solid var(--border-${theme})`,
                        }}
                        title="Edit Event"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="p-2 rounded-lg transition-all hover:opacity-80"
                        style={{
                          backgroundColor: `var(--glass-${theme})`,
                          color: `var(--accent-1-${theme})`,
                          border: `1px solid var(--border-${theme})`,
                        }}
                        title="View Registrations"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-2 rounded-lg transition-all hover:opacity-80"
                        style={{
                          backgroundColor: `rgba(239, 68, 68, 0.1)`,
                          color: "#ef4444",
                          border: `1px solid rgba(239, 68, 68, 0.3)`,
                        }}
                        title="Delete Event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEvents.length === 0 && (
          <div className="px-6 py-12 text-center" style={{ color: `var(--text-secondary-${theme})` }}>
            <p>No events found. Create your first event to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

function OverviewTab({ theme }: { theme: string }) {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mission Statement */}
        <div
          className="lg:col-span-2 p-8 rounded-2xl"
          style={{
            backgroundColor: `var(--glass-${theme})`,
            backdropFilter: "blur(10px)",
            border: `1px solid var(--border-${theme})`,
            color: `var(--text-primary-${theme})`,
          }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: `var(--accent-1-${theme})` }}>
            Our Mission
          </h3>
          <p style={{ color: `var(--text-secondary-${theme})` }} className="leading-relaxed">
            We are dedicated to fostering innovation, collaboration, and professional growth among our members. Through
            regular events, workshops, and networking sessions, we create meaningful experiences that inspire and
            empower our community to achieve their goals and stay connected with the latest industry trends.
          </p>
        </div>

        {/* Social Media Links */}
        <div
          className="p-8 rounded-2xl"
          style={{
            backgroundColor: `var(--glass-${theme})`,
            backdropFilter: "blur(10px)",
            border: `1px solid var(--border-${theme})`,
            color: `var(--text-primary-${theme})`,
          }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: `var(--accent-1-${theme})` }}>
            Connect With Us
          </h3>
          <div className="space-y-3">
            <a
              href="#"
              className="flex items-center gap-2 hover:opacity-80 transition"
              style={{ color: `var(--accent-1-${theme})` }}
            >
              <Share2 size={18} /> Instagram
            </a>
            <a
              href="#"
              className="flex items-center gap-2 hover:opacity-80 transition"
              style={{ color: `var(--accent-1-${theme})` }}
            >
              <Mail size={18} /> Email
            </a>
            <a
              href="#"
              className="flex items-center gap-2 hover:opacity-80 transition"
              style={{ color: `var(--accent-1-${theme})` }}
            >
              <Phone size={18} /> Contact
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Members", value: "200" },
          { label: "Events Hosted", value: "50" },
          { label: "Founded Year", value: "2024" },
          { label: "Avg. Attendance", value: "85%" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-6 rounded-xl text-center"
            style={{
              backgroundColor: `var(--glass-${theme})`,
              backdropFilter: "blur(10px)",
              border: `1px solid var(--border-${theme})`,
              color: `var(--text-primary-${theme})`,
            }}
          >
            <div className="text-3xl font-bold mb-2" style={{ color: `var(--accent-1-${theme})` }}>
              {stat.value}
            </div>
            <div style={{ color: `var(--text-secondary-${theme})` }} className="text-sm">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6" style={{ color: `var(--text-primary-${theme})` }}>
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Tech Workshop: AI & Machine Learning",
              date: "Nov 15, 2024",
              time: "2:00 PM - 5:00 PM",
              description: "Join us for an in-depth workshop on the latest AI technologies and practical applications.",
              attendees: 45,
            },
            {
              title: "Networking Mixer",
              date: "Nov 22, 2024",
              time: "6:00 PM - 8:00 PM",
              description: "Connect with industry professionals and fellow members in a relaxed, informal setting.",
              attendees: 80,
            },
            {
              title: "Annual Gala Dinner",
              date: "Dec 5, 2024",
              time: "7:00 PM - 10:00 PM",
              description: "Celebrate our achievements and network with distinguished guests and sponsors.",
              attendees: 150,
            },
          ].map((event, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: `var(--glass-${theme})`,
                backdropFilter: "blur(10px)",
                border: `1px solid var(--border-${theme})`,
                color: `var(--text-primary-${theme})`,
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: `var(--accent-1-${theme})` }}>
                {event.title}
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2" style={{ color: `var(--text-secondary-${theme})` }}>
                  <Calendar size={16} />
                  {event.date}
                </div>
                <div className="flex items-center gap-2" style={{ color: `var(--text-secondary-${theme})` }}>
                  <MapPin size={16} />
                  {event.time}
                </div>
                <div className="flex items-center gap-2" style={{ color: `var(--text-secondary-${theme})` }}>
                  <Users size={16} />
                  {event.attendees} expected attendees
                </div>
              </div>
              <p style={{ color: `var(--text-secondary-${theme})` }} className="mb-4 leading-relaxed">
                {event.description}
              </p>
              <Button
                className="w-full font-semibold"
                style={{
                  backgroundColor: `var(--accent-1-${theme})`,
                  color: "white",
                }}
              >
                Register Now
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6" style={{ color: `var(--text-primary-${theme})` }}>
          Recent History
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Annual Gala 2024", date: "Oct 20, 2024", feedback: "View Feedback" },
            { title: "Summer Retreat", date: "Aug 15, 2024", feedback: "View Feedback" },
            { title: "Spring Conference", date: "May 10, 2024", feedback: "View Feedback" },
            { title: "Winter Celebration", date: "Dec 22, 2023", feedback: "View Feedback" },
            { title: "Quarterly Meetup", date: "Sep 5, 2023", feedback: "View Feedback" },
            { title: "Launch Event", date: "Jan 15, 2023", feedback: "View Feedback" },
          ].map((event, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg"
              style={{
                backgroundColor: `var(--glass-${theme})`,
                backdropFilter: "blur(10px)",
                border: `1px solid var(--border-${theme})`,
                color: `var(--text-primary-${theme})`,
              }}
            >
              <h4 className="font-semibold mb-2">{event.title}</h4>
              <p style={{ color: `var(--text-secondary-${theme})` }} className="text-sm mb-3">
                {event.date}
              </p>
              <a
                href="#"
                className="text-sm font-semibold hover:opacity-80 transition"
                style={{ color: `var(--accent-1-${theme})` }}
              >
                {event.feedback}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MembersTab({ theme }: { theme: string }) {
  const members = [
    { role: "Head", name: "Ahmed Khan", email: "ahmed@iems.com" },
    { role: "Co-Head", name: "Fatima Ali", email: "fatima@iems.com" },
    { role: "Treasurer", name: "Hassan Malik", email: "hassan@iems.com" },
    { role: "Secretary", name: "Zainab Hassan", email: "zainab@iems.com" },
    { role: "Event Manager", name: "Ali Raza", email: "ali@iems.com" },
    { role: "Marketing Lead", name: "Sara Khan", email: "sara@iems.com" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member, idx) => (
        <div
          key={idx}
          className="p-6 rounded-xl"
          style={{
            backgroundColor: `var(--glass-${theme})`,
            backdropFilter: "blur(10px)",
            border: `1px solid var(--border-${theme})`,
            color: `var(--text-primary-${theme})`,
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
              style={{
                backgroundColor: `var(--accent-1-${theme})`,
                color: "white",
              }}
            >
              {member.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold">{member.name}</div>
              <div style={{ color: `var(--accent-1-${theme})` }} className="text-sm font-medium">
                {member.role}
              </div>
            </div>
          </div>
          <a
            href={`mailto:${member.email}`}
            style={{ color: `var(--text-secondary-${theme})` }}
            className="text-sm hover:opacity-80 transition"
          >
            {member.email}
          </a>
        </div>
      ))}
    </div>
  )
}

function AboutUsTab({ theme }: { theme: string }) {
  return (
    <div
      className="p-8 rounded-2xl"
      style={{
        backgroundColor: `var(--glass-${theme})`,
        backdropFilter: "blur(10px)",
        border: `1px solid var(--border-${theme})`,
        color: `var(--text-primary-${theme})`,
      }}
    >
      <div className="space-y-6 max-w-3xl">
        <div>
          <h3 className="text-2xl font-bold mb-3" style={{ color: `var(--accent-1-${theme})` }}>
            About Our Society
          </h3>
          <p style={{ color: `var(--text-secondary-${theme})` }} className="leading-relaxed">
            Founded in 2024, our society has grown to become a vibrant community of professionals, students, and
            enthusiasts dedicated to fostering innovation and collaboration. We believe in the power of collective
            knowledge and the importance of building meaningful connections within our industry.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-3" style={{ color: `var(--accent-1-${theme})` }}>
            Our Values
          </h3>
          <ul style={{ color: `var(--text-secondary-${theme})` }} className="space-y-2 leading-relaxed">
            <li>• Innovation: We embrace new ideas and technologies</li>
            <li>• Collaboration: We believe in the strength of teamwork</li>
            <li>• Excellence: We strive for the highest standards</li>
            <li>• Community: We foster meaningful connections</li>
            <li>• Growth: We support continuous learning and development</li>
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-3" style={{ color: `var(--accent-1-${theme})` }}>
            Contact Information
          </h3>
          <div style={{ color: `var(--text-secondary-${theme})` }} className="space-y-2">
            <p>Email: contact@iems.com</p>
            <p>Phone: +92 (0) 123-456-7890</p>
            <p>Location: IBA, Karachi, Pakistan</p>
            <p>Office Hours: Monday - Friday, 9:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  )
}

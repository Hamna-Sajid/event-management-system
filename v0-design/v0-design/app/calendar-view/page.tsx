"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  venue: string
  society: string
  isRegistered: boolean
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Tech Summit 2025",
    date: "2025-11-05",
    time: "2:00 PM",
    venue: "Main Auditorium",
    society: "Tech Club",
    isRegistered: true,
  },
  {
    id: "2",
    title: "Career Fair",
    date: "2025-11-08",
    time: "10:00 AM",
    venue: "Multipurpose Hall",
    society: "Career Club",
    isRegistered: false,
  },
  {
    id: "3",
    title: "Web Dev Workshop",
    date: "2025-11-15",
    time: "3:30 PM",
    venue: "Lab 2",
    society: "Tech Club",
    isRegistered: true,
  },
  {
    id: "4",
    title: "Networking Event",
    date: "2025-11-22",
    time: "5:00 PM",
    venue: "Cafeteria",
    society: "Business Club",
    isRegistered: false,
  },
  {
    id: "5",
    title: "Design Workshop",
    date: "2025-11-08",
    time: "4:00 PM",
    venue: "Design Lab",
    society: "Design Club",
    isRegistered: true,
  },
  {
    id: "6",
    title: "Photography Contest",
    date: "2025-11-12",
    time: "1:00 PM",
    venue: "Open Ground",
    society: "Photography Club",
    isRegistered: true,
  },
  {
    id: "7",
    title: "Sports Day",
    date: "2025-11-20",
    time: "9:00 AM",
    venue: "Sports Field",
    society: "Sports Club",
    isRegistered: false,
  },
]

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1))
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSociety, setSelectedSociety] = useState<string>("all")
  const [selectedEventType, setSelectedEventType] = useState<string>("all")

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSociety = selectedSociety === "all" || event.society === selectedSociety
    const matchesRegistration =
      selectedEventType === "all" ||
      (selectedEventType === "registered" && event.isRegistered) ||
      (selectedEventType === "general" && !event.isRegistered)
    return matchesSociety && matchesRegistration
  })

  const registeredEvents = mockEvents.filter((event) => event.isRegistered)
  const searchedRegisteredEvents = registeredEvents.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const eventsMap = filteredEvents.reduce(
    (map, event) => {
      const dateKey = event.date
      if (!map[dateKey]) map[dateKey] = []
      map[dateKey].push(event)
      return map
    },
    {} as Record<string, CalendarEvent[]>,
  )

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)

  const calendarDays = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1),
  )

  while (calendarDays.length < 42) {
    calendarDays.push(null)
  }

  const truncateTitle = (title: string, maxLength = 13) => {
    return title.length > maxLength ? title.slice(0, maxLength) + "..." : title
  }

  const uniqueSocieties = Array.from(new Set(mockEvents.map((e) => e.society)))

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#110205] via-[#1a0509] to-[#110205]">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(17,2,5,0.8)] border-b border-[rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d02243] to-[#84162b] flex items-center justify-center">
              <span className="text-white font-bold text-lg">IE</span>
            </div>
            <span className="text-white font-semibold text-lg hidden sm:inline">Calendar</span>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-[rgba(255,255,255,0.8)] hover:text-white">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content - Two Column Workspace */}
      <div className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-180px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 h-full">
          {/* Left Column: My Registered Events */}
          <div className="glass rounded-2xl p-6 flex flex-col overflow-hidden">
            <h2 className="text-lg font-bold text-white mb-4">My Registered Events</h2>

            <div className="relative mb-4">
              <Search size={18} className="absolute left-3 top-3 text-[rgba(255,255,255,0.5)]" />
              <input
                type="text"
                placeholder="Search your events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:bg-[rgba(255,255,255,0.12)] focus:border-[#d02243] transition-all"
              />
            </div>

            {/* Events List - Scrollable */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {searchedRegisteredEvents.length > 0 ? (
                searchedRegisteredEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full text-left p-3 rounded-lg bg-[rgba(208,34,67,0.1)] border border-[rgba(208,34,67,0.3)] hover:bg-[rgba(208,34,67,0.2)] hover:border-[#d02243] transition-all group"
                  >
                    <p className="font-semibold text-white group-hover:text-[#d02243] transition-colors text-sm">
                      {event.title}
                    </p>
                    <p className="text-xs text-[rgba(255,255,255,0.5)] mt-1">
                      {event.date} • {event.time}
                    </p>
                    <p className="text-xs text-[rgba(255,255,255,0.6)] mt-1">{event.society}</p>
                  </button>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-[rgba(255,255,255,0.5)] text-sm">
                  {searchQuery ? "No events match your search" : "No registered events yet"}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Calendar */}
          <div className="glass rounded-2xl p-6 flex flex-col overflow-hidden">
            {/* Filter Bar & Month Navigation */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[rgba(255,255,255,0.1)]">
              <select
                value={selectedSociety}
                onChange={(e) => setSelectedSociety(e.target.value)}
                className="px-3 py-1.5 bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg text-xs text-white focus:outline-none focus:bg-[rgba(255,255,255,0.12)] focus:border-[#d02243] transition-all"
              >
                <option value="all">All Societies</option>
                {uniqueSocieties.map((society) => (
                  <option key={society} value={society}>
                    {society}
                  </option>
                ))}
              </select>

              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="px-3 py-1.5 bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-lg text-xs text-white focus:outline-none focus:bg-[rgba(255,255,255,0.12)] focus:border-[#d02243] transition-all"
              >
                <option value="all">All Events</option>
                <option value="registered">Registered</option>
                <option value="general">General</option>
              </select>

              <div className="flex-1" />

              <button
                onClick={previousMonth}
                className="p-1.5 rounded-lg transition-all hover:bg-[rgba(208,34,67,0.2)]"
              >
                <ChevronLeft size={18} className="text-[rgba(255,255,255,0.7)]" />
              </button>

              <span className="text-sm font-semibold text-white min-w-[120px] text-center">{monthName}</span>

              <button onClick={nextMonth} className="p-1.5 rounded-lg transition-all hover:bg-[rgba(208,34,67,0.2)]">
                <ChevronRight size={18} className="text-[rgba(255,255,255,0.7)]" />
              </button>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-[rgba(255,255,255,0.5)] font-semibold text-xs py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 flex-1">
                {calendarDays.map((day, index) => {
                  const dateKey =
                    day && day < 10
                      ? `2025-${String(currentDate.getMonth() + 1).padStart(2, "0")}-0${day}`
                      : day
                        ? `2025-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${day}`
                        : null

                  const dayEvents = dateKey ? eventsMap[dateKey] || [] : []
                  const hasRegisteredEvent = dayEvents.some((e) => e.isRegistered)

                  return (
                    <div
                      key={index}
                      className={`rounded-lg p-2 flex flex-col transition-all border ${
                        day
                          ? `bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)] hover:border-[rgba(208,34,67,0.4)] ${hasRegisteredEvent ? "ring-1 ring-[#d02243] bg-[rgba(208,34,67,0.08)]" : ""}`
                          : "bg-transparent border-transparent"
                      }`}
                    >
                      {day && (
                        <>
                          {/* Day number */}
                          <span className="text-xs font-bold text-white mb-1">{day}</span>

                          <div className="flex-1 flex flex-col gap-0.5 min-w-0 overflow-hidden">
                            {dayEvents.slice(0, 3).map((event) => (
                              <button
                                key={event.id}
                                onClick={() => setSelectedEvent(event)}
                                className={`text-left group cursor-pointer transition-colors text-xs truncate leading-tight hover:text-[#d02243] ${
                                  event.isRegistered ? "text-[#d02243] font-medium" : "text-[rgba(255,255,255,0.65)]"
                                }`}
                                title={event.title}
                              >
                                {event.isRegistered && <span className="inline">• </span>}
                                {truncateTitle(event.title, 13)}
                              </button>
                            ))}
                            {dayEvents.length > 3 && (
                              <button
                                onClick={() => setSelectedEvent(dayEvents[0])}
                                className="text-xs text-[rgba(208,34,67,0.8)] hover:text-[#d02243] transition-colors"
                              >
                                +{dayEvents.length - 3} more
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="glass rounded-2xl p-6 md:p-8 max-w-md w-full backdrop-blur-xl border border-[rgba(255,255,255,0.15)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white flex-1">{selectedEvent.title}</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg flex items-center justify-center flex-shrink-0 ml-2 hover:bg-[rgba(255,255,255,0.1)] transition-all"
              >
                <X size={18} className="text-[rgba(255,255,255,0.7)]" />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <p className="text-xs text-[rgba(255,255,255,0.5)] uppercase tracking-wide font-semibold">Society</p>
                <p className="text-white font-medium mt-1.5">{selectedEvent.society}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[rgba(255,255,255,0.5)] uppercase tracking-wide font-semibold">Date</p>
                  <p className="text-white font-medium mt-1.5">{selectedEvent.date}</p>
                </div>
                <div>
                  <p className="text-xs text-[rgba(255,255,255,0.5)] uppercase tracking-wide font-semibold">Time</p>
                  <p className="text-white font-medium mt-1.5">{selectedEvent.time}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-[rgba(255,255,255,0.5)] uppercase tracking-wide font-semibold">Venue</p>
                <p className="text-white font-medium mt-1.5">{selectedEvent.venue}</p>
              </div>
            </div>

            <Link href={`/event/${selectedEvent.id}`}>
              <Button className="w-full bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold transition-all">
                View Event Details
              </Button>
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}

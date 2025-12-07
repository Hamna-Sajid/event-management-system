"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X, Heart, Eye, Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import LoadingScreen from "@/components/loading-screen"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { firestore } from "@/firebase"

interface CalendarEvent {
  id: string
  title: string
  date: string // ISO format date string (YYYY-MM-DD)
  time: string
  venue: string
  society: string
  societyId: string
  eventType: string
  coverImage?: string
  description: string
  registrationLink: string
  metrics: {
    views: number
    likes: number
    wishlists: number
  }
  isWishlisted?: boolean // Client-side tracking for current user
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedSociety, setSelectedSociety] = useState<string>("all")
  const [selectedEventType, setSelectedEventType] = useState<string>("all")
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]) // All events from DB
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Fetch ALL events from Firestore once on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)

        // Query all published events (no date filter)
        const eventsQuery = query(
          collection(firestore, "events"),
          where("status", "==", "published"),
          orderBy("startDate", "asc")
        )

        const querySnapshot = await getDocs(eventsQuery)
        const fetchedEvents: CalendarEvent[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data()
          const startDate = data.startDate?.toDate()

          if (startDate) {
            fetchedEvents.push({
              id: doc.id,
              title: data.title || "Untitled Event",
              date: startDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
              time: data.startTime || "TBD",
              venue: data.venue || "TBD",
              society: data.societyName || "Unknown Society",
              societyId: data.societyId || "",
              eventType: data.eventType || "other",
              coverImage: data.coverImage,
              description: data.description || "",
              registrationLink: data.registrationLink || "",
              metrics: data.metrics || { views: 0, likes: 0, wishlists: 0 },
              isWishlisted: false, // TODO: Check user's wishlist from eventEngagement collection
            })
          }
        })

        setAllEvents(fetchedEvents)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError("Failed to load events. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, []) // Only fetch once on mount

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  // Filter events for current month view
  const currentMonthEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getFullYear() === currentDate.getFullYear()
    )
  })

  // Apply society and event type filters
  const filteredEvents = currentMonthEvents.filter((event) => {
    const matchesSociety = selectedSociety === "all" || event.society === selectedSociety
    const matchesEventType = selectedEventType === "all" || event.eventType === selectedEventType
    return matchesSociety && matchesEventType
  })

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
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
      setIsTransitioning(false)
    }, 200)
  }

  const nextMonth = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
      setIsTransitioning(false)
    }, 200)
  }

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)

  // Build calendar days including previous and next month days
  const calendarDays: Array<{ day: number; isCurrentMonth: boolean; date: string }> = []

  // Get previous month's trailing days
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
  const daysInPrevMonth = getDaysInMonth(prevMonth)
  
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const date = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    calendarDays.push({ day, isCurrentMonth: false, date })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`
    calendarDays.push({ day: i, isCurrentMonth: true, date })
  }

  // Next month's leading days
  const remainingDays = 42 - calendarDays.length
  const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
  
  for (let i = 1; i <= remainingDays; i++) {
    const date = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`
    calendarDays.push({ day: i, isCurrentMonth: false, date })
  }

  const truncateTitle = (title: string, maxLength = 13) => {
    return title.length > maxLength ? title.slice(0, maxLength) + "..." : title
  }

  // Get all unique societies and event types from ALL events (not just current month)
  const uniqueSocieties = Array.from(new Set(allEvents.map((e) => e.society))).sort()
  const uniqueEventTypes = Array.from(new Set(allEvents.map((e) => e.eventType))).sort()

  // Count events per society for current filters
  const societyEventCounts = uniqueSocieties.reduce(
    (acc, society) => {
      acc[society] = currentMonthEvents.filter(
        (e) => e.society === society && (selectedEventType === "all" || e.eventType === selectedEventType)
      ).length
      return acc
    },
    {} as Record<string, number>
  )

  // Count events per event type for current filters
  const eventTypeEventCounts = uniqueEventTypes.reduce(
    (acc, type) => {
      acc[type] = currentMonthEvents.filter(
        (e) => e.eventType === type && (selectedSociety === "all" || e.society === selectedSociety)
      ).length
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-electric-blue to-magenta flex items-center justify-center">
              <span className="text-white font-bold text-lg">IE</span>
            </div>
            <span className="text-white font-semibold text-lg hidden sm:inline">Calendar</span>
          </div>
          <Link href="/signin">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content - Centered Calendar */}
      <div className="max-w-7xl mx-auto px-6 py-8 min-h-[calc(100vh-180px)] flex items-center justify-center">
        {loading ? (
          <LoadingScreen />
        ) : error ? null : (
          <div className="w-full" style={{ maxWidth: "48rem" }}>
            {/* Interactive Calendar */}
            <div className="glass rounded-2xl p-4 flex flex-col overflow-hidden">
              {/* Filter Bar & Month Navigation */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <Select
                  value={selectedSociety}
                  onChange={setSelectedSociety}
                  options={[
                    {
                      value: "all",
                      label: `All Societies (${currentMonthEvents.filter((e) => selectedEventType === "all" || e.eventType === selectedEventType).length})`,
                    },
                    ...uniqueSocieties.map((society) => ({
                      value: society,
                      label: `${society} (${societyEventCounts[society] || 0})`,
                    })),
                  ]}
                  placeholder="All Societies"
                  className="w-64 text-xs"
                />

                <Select
                  value={selectedEventType}
                  onChange={setSelectedEventType}
                  options={[
                    {
                      value: "all",
                      label: `All Types (${currentMonthEvents.filter((e) => selectedSociety === "all" || e.society === selectedSociety).length})`,
                    },
                    ...uniqueEventTypes.map((type) => ({
                      value: type,
                      label: `${type.charAt(0).toUpperCase() + type.slice(1)} (${eventTypeEventCounts[type] || 0})`,
                    })),
                  ]}
                  placeholder="All Event Types"
                  className="w-64 text-xs"
                />

                <div className="flex-1" />

                <button
                  onClick={previousMonth}
                  className="p-1.5 rounded-lg transition-all hover:bg-primary/20"
                >
                  <ChevronLeft size={18} className="text-muted-foreground" />
                </button>

                <span className="text-sm font-semibold text-white min-w-[120px] text-center">{monthName}</span>

                <button onClick={nextMonth} className="p-1.5 rounded-lg transition-all hover:bg-primary/20">
                  <ChevronRight size={18} className="text-muted-foreground" />
                </button>
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-muted-foreground font-semibold text-xs py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid - With fade transition */}
                <div 
                  className={`grid grid-cols-7 gap-1 transition-opacity duration-200 ${
                    isTransitioning ? "opacity-0" : "opacity-100"
                  }`}
                  style={{
                    gridTemplateRows: "repeat(6, 60px)"
                  }}
                >
                  {calendarDays.map((dayInfo, index) => {
                    const dayEvents = eventsMap[dayInfo.date] || []
                    const hasWishlistedEvent = dayEvents.some((e) => e.isWishlisted)

                    return (
                      <div
                        key={index}
                        className={`rounded-lg p-1.5 flex flex-col transition-all border min-h-0 ${
                          dayInfo.isCurrentMonth
                            ? `bg-card/40 border-border hover:border-primary/40 ${hasWishlistedEvent ? "ring-1 ring-primary bg-primary/10" : ""}`
                            : "bg-card/10 border-border/30 cursor-default"
                        }`}
                      >
                        {/* Day number */}
                        <span 
                          className={`text-xs font-bold mb-1 flex-shrink-0 ${
                            dayInfo.isCurrentMonth 
                              ? "text-white" 
                              : "text-muted-foreground/50"
                          }`}
                        >
                          {dayInfo.day}
                        </span>

                        {/* Events for this day - Only show for current month */}
                        {dayInfo.isCurrentMonth && (
                          <div className="flex-1 flex flex-col gap-0.5 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
                            {dayEvents.slice(0, 3).map((event) => (
                              <button
                                key={event.id}
                                onClick={() => setSelectedEvent(event)}
                                className={`text-left group cursor-pointer transition-colors text-xs truncate leading-tight hover:text-primary flex-shrink-0 ${
                                  event.isWishlisted
                                    ? "text-primary font-medium"
                                    : "text-muted-foreground"
                                }`}
                                title={event.title}
                              >
                                {event.isWishlisted && <span className="inline">• </span>}
                                {truncateTitle(event.title, 13)}
                              </button>
                            ))}
                            {dayEvents.length > 3 && (
                              <button
                                onClick={() => setSelectedEvent(dayEvents[0])}
                                className="text-xs text-primary/80 hover:text-primary transition-colors flex-shrink-0"
                              >
                                +{dayEvents.length - 3} more
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="glass rounded-2xl p-6 md:p-8 max-w-md w-full backdrop-blur-xl border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white flex-1">{selectedEvent.title}</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg flex items-center justify-center flex-shrink-0 ml-2 hover:bg-accent transition-all"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Society</p>
                <p className="text-white font-medium mt-1.5">{selectedEvent.society}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Date</p>
                  <p className="text-white font-medium mt-1.5">{selectedEvent.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Time</p>
                  <p className="text-white font-medium mt-1.5">{selectedEvent.time}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Venue</p>
                <p className="text-white font-medium mt-1.5">{selectedEvent.venue}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                  Engagement
                </p>
                <div className="flex gap-4 mt-1.5">
                  <span className="text-white text-sm flex items-center gap-1">
                    <Heart size={16} className="text-red-400" /> {selectedEvent.metrics.likes}
                  </span>
                  <span className="text-white text-sm flex items-center gap-1">
                    <Eye size={16} className="text-blue-400" /> {selectedEvent.metrics.views}
                  </span>
                  <span className="text-white text-sm flex items-center gap-1">
                    <Star size={16} className="text-yellow-400" /> {selectedEvent.metrics.wishlists}
                  </span>
                </div>
              </div>
            </div>

            <Link href={`/events/${selectedEvent.id}`}>
              <Button className="w-full glow-button text-white font-semibold transition-all">
                View Event Details
              </Button>
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}

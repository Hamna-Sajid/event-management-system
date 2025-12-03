"use client"

import { useState } from "react"
import { Search, ChevronDown, ChevronLeft, ChevronRight, Calendar, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const mockSearchResults = [
  {
    id: 1,
    title: "Tech Innovation Summit 2025",
    date: "Dec 15, 2025",
    time: "2:00 PM - 6:00 PM",
    society: "Tech Society",
    location: "Main Auditorium",
    attendees: 342,
    type: "Seminar",
    cost: "Free",
    image: "/conference-hall-with-modern-setup.jpg",
    summary: "Join us for an exciting summit featuring industry leaders discussing the latest tech innovations.",
  },
  {
    id: 2,
    title: "Business Networking Gala",
    date: "Dec 18, 2025",
    time: "6:00 PM - 9:00 PM",
    society: "Business Club",
    location: "Grand Ballroom",
    attendees: 215,
    type: "Networking",
    cost: "Paid",
    image: "/networking-event-with-professionals.jpg",
    summary: "Connect with professionals and expand your business network at our exclusive gala.",
  },
  {
    id: 3,
    title: "Web Development Workshop",
    date: "Dec 20, 2025",
    time: "10:00 AM - 1:00 PM",
    society: "Dev Community",
    location: "Lab 3",
    attendees: 89,
    type: "Workshop",
    cost: "Free",
    image: "/technology-workshop-with-laptops.jpg",
    summary: "Learn modern web development techniques from experienced developers.",
  },
  {
    id: 4,
    title: "Leadership Masterclass",
    date: "Dec 22, 2025",
    time: "3:00 PM - 5:00 PM",
    society: "Leadership Forum",
    location: "Conference Room A",
    attendees: 156,
    type: "Workshop",
    cost: "Paid",
    image: "/conference-hall-with-modern-setup.jpg",
    summary: "Develop essential leadership skills with industry experts.",
  },
  {
    id: 5,
    title: "Startup Pitch Competition",
    date: "Dec 25, 2025",
    time: "1:00 PM - 4:00 PM",
    society: "Entrepreneurship Club",
    location: "Innovation Hub",
    attendees: 127,
    type: "Competition",
    cost: "Free",
    image: "/conference-hall-with-modern-setup.jpg",
    summary: "Showcase your startup ideas and compete for exciting prizes.",
  },
  {
    id: 6,
    title: "Annual Sports Day",
    date: "Dec 28, 2025",
    time: "8:00 AM - 5:00 PM",
    society: "Sports Committee",
    location: "Sports Complex",
    attendees: 450,
    type: "Social",
    cost: "Free",
    image: "/networking-event-with-professionals.jpg",
    summary: "Participate in various sports activities and celebrate with the community.",
  },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("Tech Talks")
  const [sortBy, setSortBy] = useState("relevance")
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    eventTypes: [],
    societies: [],
    dateRange: "any",
    cost: "any",
  })
  const [expandedFilters, setExpandedFilters] = useState({
    eventType: true,
    society: true,
    date: true,
    cost: true,
  })

  const itemsPerPage = 6
  const totalResults = mockSearchResults.length
  const totalPages = Math.ceil(totalResults / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const displayedResults = mockSearchResults.slice(startIdx, startIdx + itemsPerPage)

  const eventTypes = ["Workshops", "Seminars", "Competitions", "Social", "Networking"]
  const societies = ["Tech Society", "Business Club", "Dev Community", "Leadership Forum", "Sports Committee"]

  const toggleFilter = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }))
  }

  const toggleFilterPanel = (panel) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [panel]: !prev[panel],
    }))
  }

  return (
    <div className="min-h-screen bg-[#110205]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[rgba(17,2,5,0.8)] border-b border-[rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d02243] to-[#84162b] flex items-center justify-center">
              <span className="text-white font-bold text-lg">IE</span>
            </div>
            <span className="text-white font-semibold text-lg hidden sm:inline">IEMS</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg glass glass-hover hidden sm:flex items-center justify-center">
              <Search size={20} className="text-[rgba(255,255,255,0.7)]" />
            </button>
            <Button
              variant="ghost"
              className="text-[rgba(255,255,255,0.8)] hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
            >
              Profile
            </Button>
            <Button className="bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold">Logout</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#d02243]" size={24} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl glass text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:ring-2 focus:ring-[#d02243] focus:ring-offset-2 focus:ring-offset-[#110205]"
            />
          </div>
          <p className="text-[rgba(255,255,255,0.6)] mt-4">
            Showing results for <span className="text-[#d02243] font-semibold">"{searchQuery}"</span>
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Event Type Filter */}
              <div className="glass rounded-2xl p-6">
                <button
                  onClick={() => toggleFilterPanel("eventType")}
                  className="w-full flex items-center justify-between mb-4 hover:text-[#d02243] transition-colors"
                >
                  <h3 className="text-white font-semibold">Event Type</h3>
                  <ChevronDown
                    size={20}
                    className={`text-[#d02243] transition-transform ${expandedFilters.eventType ? "" : "-rotate-90"}`}
                  />
                </button>
                {expandedFilters.eventType && (
                  <div className="space-y-3">
                    {eventTypes.map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.eventTypes.includes(type)}
                          onChange={() => toggleFilter("eventTypes", type)}
                          className="w-4 h-4 rounded accent-[#d02243]"
                        />
                        <span className="text-[rgba(255,255,255,0.8)] group-hover:text-white transition-colors">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Host Society Filter */}
              <div className="glass rounded-2xl p-6">
                <button
                  onClick={() => toggleFilterPanel("society")}
                  className="w-full flex items-center justify-between mb-4 hover:text-[#d02243] transition-colors"
                >
                  <h3 className="text-white font-semibold">Host Society</h3>
                  <ChevronDown
                    size={20}
                    className={`text-[#d02243] transition-transform ${expandedFilters.society ? "" : "-rotate-90"}`}
                  />
                </button>
                {expandedFilters.society && (
                  <div className="space-y-3">
                    {societies.map((society) => (
                      <label key={society} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.societies.includes(society)}
                          onChange={() => toggleFilter("societies", society)}
                          className="w-4 h-4 rounded accent-[#d02243]"
                        />
                        <span className="text-[rgba(255,255,255,0.8)] group-hover:text-white transition-colors">
                          {society}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Range Filter */}
              <div className="glass rounded-2xl p-6">
                <button
                  onClick={() => toggleFilterPanel("date")}
                  className="w-full flex items-center justify-between mb-4 hover:text-[#d02243] transition-colors"
                >
                  <h3 className="text-white font-semibold">Date Range</h3>
                  <ChevronDown
                    size={20}
                    className={`text-[#d02243] transition-transform ${expandedFilters.date ? "" : "-rotate-90"}`}
                  />
                </button>
                {expandedFilters.date && (
                  <div className="space-y-3">
                    {["Any Time", "Today", "This Week", "Next Month"].map((option) => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="dateRange"
                          value={option}
                          checked={filters.dateRange === option}
                          onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: e.target.value }))}
                          className="w-4 h-4 accent-[#d02243]"
                        />
                        <span className="text-[rgba(255,255,255,0.8)] group-hover:text-white transition-colors">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Cost Filter */}
              <div className="glass rounded-2xl p-6">
                <button
                  onClick={() => toggleFilterPanel("cost")}
                  className="w-full flex items-center justify-between mb-4 hover:text-[#d02243] transition-colors"
                >
                  <h3 className="text-white font-semibold">Cost</h3>
                  <ChevronDown
                    size={20}
                    className={`text-[#d02243] transition-transform ${expandedFilters.cost ? "" : "-rotate-90"}`}
                  />
                </button>
                {expandedFilters.cost && (
                  <div className="space-y-3">
                    {["Free Events", "Paid Events", "Any"].map((option) => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="cost"
                          value={option}
                          checked={filters.cost === option}
                          onChange={(e) => setFilters((prev) => ({ ...prev, cost: e.target.value }))}
                          className="w-4 h-4 accent-[#d02243]"
                        />
                        <span className="text-[rgba(255,255,255,0.8)] group-hover:text-white transition-colors">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Apply Filters Button */}
              <Button className="w-full bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold py-3 rounded-xl">
                Apply Filters
              </Button>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[rgba(255,255,255,0.6)]">
                  <span className="text-white font-semibold">{totalResults}</span> Events Found
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg glass text-white bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d02243] appearance-none pr-10"
                >
                  <option value="relevance" className="bg-[#110205]">
                    Relevance
                  </option>
                  <option value="date-asc" className="bg-[#110205]">
                    Date (Ascending)
                  </option>
                  <option value="date-desc" className="bg-[#110205]">
                    Date (Descending)
                  </option>
                  <option value="popularity" className="bg-[#110205]">
                    Popularity
                  </option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#d02243] pointer-events-none"
                />
              </div>
            </div>

            {/* Event Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {displayedResults.map((event) => (
                <div key={event.id} className="glass rounded-2xl overflow-hidden glass-hover group">
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#110205] to-transparent"></div>
                  </div>

                  {/* Event Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-white font-semibold text-lg line-clamp-2 flex-1">{event.title}</h3>
                      <span className="text-xs font-semibold text-[#d02243] bg-[rgba(208,34,67,0.1)] px-3 py-1 rounded-full ml-2 whitespace-nowrap">
                        {event.type}
                      </span>
                    </div>

                    <p className="text-[rgba(255,255,255,0.6)] text-sm mb-4 line-clamp-2">{event.summary}</p>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-[rgba(255,255,255,0.7)]">
                        <Calendar size={16} />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[rgba(255,255,255,0.7)]">
                        <MapPin size={16} />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[rgba(255,255,255,0.7)]">
                        <Users size={16} />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#d02243] text-xs font-semibold mb-1">{event.society}</p>
                        <p className="text-[rgba(255,255,255,0.5)] text-xs">{event.cost}</p>
                      </div>
                      <Button className="bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold">Register</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg glass glass-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} className="text-[#d02243]" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                    currentPage === page
                      ? "bg-[#d02243] text-white"
                      : "glass text-[rgba(255,255,255,0.8)] glass-hover hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg glass glass-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} className="text-[#d02243]" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

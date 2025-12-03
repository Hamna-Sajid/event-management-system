"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Plus, Trash2, ChevronDown } from "lucide-react"

export default function CreateEventPage() {
  const [eventTitle, setEventTitle] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventType, setEventType] = useState("competition")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [venue, setVenue] = useState("")
  const [registrationLink, setRegistrationLink] = useState("")
  const [enableSubEvents, setEnableSubEvents] = useState(false)
  const [subEvents, setSubEvents] = useState<
    Array<{
      id: string
      title: string
      date: string
      time: string
      registrationLink: string
    }>
  >([])

  const addSubEvent = () => {
    const newSubEvent = {
      id: Date.now().toString(),
      title: "",
      date: "",
      time: "",
      registrationLink: "",
    }
    setSubEvents([...subEvents, newSubEvent])
  }

  const removeSubEvent = (id: string) => {
    setSubEvents(subEvents.filter((event) => event.id !== id))
  }

  const updateSubEvent = (id: string, field: string, value: string) => {
    setSubEvents(subEvents.map((event) => (event.id === id ? { ...event, [field]: value } : event)))
  }

  const handlePublish = () => {
    console.log("Publishing event:", {
      eventTitle,
      eventDescription,
      eventType,
      startDate,
      startTime,
      endDate,
      endTime,
      venue,
      registrationLink,
      enableSubEvents,
      subEvents,
    })
    alert("Event published successfully!")
  }

  const handleSaveDraft = () => {
    console.log("Saving draft:", {
      eventTitle,
      eventDescription,
      eventType,
      startDate,
      startTime,
      endDate,
      endTime,
      venue,
      registrationLink,
      enableSubEvents,
      subEvents,
    })
    alert("Event saved as draft!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#110205] via-[#2b070e] to-[#110205]">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create New Event</h1>
          <p className="text-[rgba(255,255,255,0.6)]">Design and manage your event with our intuitive workspace</p>
        </div>

        <div className="space-y-6">
          {/* Panel 1: Core Event Details */}
          <div className="glass rounded-2xl p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white mb-6">Core Event Details</h2>

            <div className="space-y-6">
              {/* Event Title */}
              <div>
                <label className="block text-white font-medium mb-3">Event Title</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Enter event title"
                  className="w-full px-4 py-3 rounded-lg glass bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243] focus:ring-2 focus:ring-[#d02243]/30 transition-all"
                />
              </div>

              {/* Event Description */}
              <div>
                <label className="block text-white font-medium mb-3">Event Description</label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Describe your event in detail..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg glass bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243] focus:ring-2 focus:ring-[#d02243]/30 transition-all resize-none"
                />
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-white font-medium mb-3">Event Type</label>
                <div className="relative">
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg glass bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white focus:outline-none focus:border-[#d02243] focus:ring-2 focus:ring-[#d02243]/30 transition-all appearance-none cursor-pointer"
                  >
                    <option value="competition" className="bg-[#2b070e]">
                      Competition
                    </option>
                    <option value="seminar" className="bg-[#2b070e]">
                      Seminar
                    </option>
                    <option value="workshop" className="bg-[#2b070e]">
                      Workshop
                    </option>
                    <option value="networking" className="bg-[#2b070e]">
                      Networking
                    </option>
                    <option value="conference" className="bg-[#2b070e]">
                      Conference
                    </option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.5)] pointer-events-none"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Logistics & Registration */}
          <div className="glass rounded-2xl p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white mb-6">Logistics & Registration</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label className="block text-white font-medium mb-3">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg glass bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white focus:outline-none focus:border-[#d02243] focus:ring-2 focus:ring-[#d02243]/30 transition-all"
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-white font-medium mb-3">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg glass bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white focus:outline-none focus:border-[#d02243] focus:ring-2 focus:ring-[#d02243]/30 transition-all"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-white font-medium mb-3">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg glass bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white focus:outline-none focus:border-[#d02243] focus:ring-2 focus:ring-[#d02243]/30 transition-all"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-white font-medium mb-3">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg glass bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white focus:outline-none focus:border-[#d02243] focus:ring-2 focus:ring-[#d02243]/30 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Venue/Location */}
              <div>
                <label className="block text-white font-medium mb-3">Venue/Location</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Enter venue or location"
                  className="w-full px-4 py-3 rounded-lg glass bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243] focus:ring-2 focus:ring-[#d02243]/30 transition-all"
                />
              </div>

              {/* Registration Link */}
              <div>
                <label className="block text-white font-medium mb-3">Registration Link (URL)</label>
                <input
                  type="url"
                  value={registrationLink}
                  onChange={(e) => setRegistrationLink(e.target.value)}
                  placeholder="https://example.com/register"
                  className="w-full px-4 py-3 rounded-lg glass bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243] focus:ring-2 focus:ring-[#d02243]/30 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Panel 3: Sub-Event Management */}
          <div className="glass rounded-2xl p-8 backdrop-blur-xl border-2 border-[rgba(208,34,67,0.3)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Sub-Event & Competition Management</h2>

              {/* Toggle Switch */}
              <button
                onClick={() => setEnableSubEvents(!enableSubEvents)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  enableSubEvents ? "bg-[#d02243]" : "bg-[rgba(255,255,255,0.1)]"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    enableSubEvents ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Sub-Events Content - Collapsible */}
            {enableSubEvents && (
              <div className="space-y-4">
                {/* Sub-Event Cards */}
                {subEvents.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {subEvents.map((subEvent) => (
                      <div
                        key={subEvent.id}
                        className="glass rounded-xl p-6 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">Sub-Event</h3>
                          <button
                            onClick={() => removeSubEvent(subEvent.id)}
                            className="p-2 rounded-lg hover:bg-[rgba(208,34,67,0.2)] text-[#d02243] transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Sub-Event Title */}
                          <div className="md:col-span-2">
                            <label className="block text-[rgba(255,255,255,0.8)] text-sm font-medium mb-2">Title</label>
                            <input
                              type="text"
                              value={subEvent.title}
                              onChange={(e) => updateSubEvent(subEvent.id, "title", e.target.value)}
                              placeholder="Sub-event title"
                              className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#d02243] focus:ring-1 focus:ring-[#d02243]/30 transition-all text-sm"
                            />
                          </div>

                          {/* Sub-Event Date */}
                          <div>
                            <label className="block text-[rgba(255,255,255,0.8)] text-sm font-medium mb-2">Date</label>
                            <input
                              type="date"
                              value={subEvent.date}
                              onChange={(e) => updateSubEvent(subEvent.id, "date", e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white focus:outline-none focus:border-[#d02243] focus:ring-1 focus:ring-[#d02243]/30 transition-all text-sm"
                            />
                          </div>

                          {/* Sub-Event Time */}
                          <div>
                            <label className="block text-[rgba(255,255,255,0.8)] text-sm font-medium mb-2">Time</label>
                            <input
                              type="time"
                              value={subEvent.time}
                              onChange={(e) => updateSubEvent(subEvent.id, "time", e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white focus:outline-none focus:border-[#d02243] focus:ring-1 focus:ring-[#d02243]/30 transition-all text-sm"
                            />
                          </div>

                          {/* Sub-Event Registration Link */}
                          <div className="md:col-span-2">
                            <label className="block text-[rgba(255,255,255,0.8)] text-sm font-medium mb-2">
                              Registration Link
                            </label>
                            <input
                              type="url"
                              value={subEvent.registrationLink}
                              onChange={(e) => updateSubEvent(subEvent.id, "registrationLink", e.target.value)}
                              placeholder="https://example.com/register"
                              className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#d02243] focus:ring-1 focus:ring-[#d02243]/30 transition-all text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Sub-Event Button */}
                <button
                  onClick={addSubEvent}
                  className="w-full py-3 rounded-lg border-2 border-dashed border-[#d02243] text-[#d02243] font-semibold hover:bg-[rgba(208,34,67,0.1)] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add New Sub-Event
                </button>
              </div>
            )}

            {!enableSubEvents && (
              <p className="text-[rgba(255,255,255,0.5)] text-center py-8">
                Enable multi-part events to add sub-events and competitions
              </p>
            )}
          </div>

          {/* Final Action Panel */}
          <div className="glass rounded-2xl p-6 backdrop-blur-xl flex gap-4 justify-end">
            <button
              onClick={handleSaveDraft}
              className="px-8 py-3 rounded-lg glass bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] text-white font-semibold hover:bg-[rgba(255,255,255,0.08)] transition-all"
            >
              Save as Draft
            </button>
            <button
              onClick={handlePublish}
              className="px-8 py-3 rounded-lg bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold transition-all shadow-lg shadow-[#d02243]/30"
            >
              Publish Event
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

"use client"

import { Calendar, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const events = [
  {
    id: 1,
    title: "IBA Annual Conference 2025",
    date: "March 15, 2025",
    location: "Karachi Convention Center",
    attendees: 2500,
    image: "/placeholder.png",
  },
  {
    id: 2,
    title: "Business Networking Summit",
    date: "March 22, 2025",
    location: "Lahore Business Hub",
    attendees: 1200,
    image: "/placeholder.png",
  },
  {
    id: 3,
    title: "Tech Innovation Workshop",
    date: "April 5, 2025",
    location: "Islamabad Tech Park",
    attendees: 800,
    image: "/placeholder.png",
  },
]

export default function UpcomingEvents() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Upcoming Events</h2>
          <p className="text-lg text-[rgba(255,255,255,0.6)] max-w-2xl mx-auto">
            Discover and register for the most exciting events happening near you
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="glass rounded-xl overflow-hidden glass-hover group">
              {/* Event Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#110205] to-transparent opacity-60" />
              </div>

              {/* Event Details */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 line-clamp-2">{event.title}</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-[rgba(255,255,255,0.7)]">
                    <Calendar size={16} className="text-[#d02243]" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[rgba(255,255,255,0.7)]">
                    <MapPin size={16} className="text-[#d02243]" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[rgba(255,255,255,0.7)]">
                    <Users size={16} className="text-[#d02243]" />
                    {event.attendees.toLocaleString()} attending
                  </div>
                </div>

                <Button className="w-full bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold">
                  Register Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="border-[#d02243] text-[#d02243] hover:bg-[rgba(208,34,67,0.1)] bg-transparent"
          >
            View All Events
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}

import { ArrowRight } from "lucide-react"

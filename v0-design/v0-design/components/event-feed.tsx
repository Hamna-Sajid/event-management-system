"use client"

import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const upcomingEvents = [
  {
    id: 1,
    title: "Tech Innovation Summit 2025",
    date: "Dec 15, 2025",
    time: "2:00 PM - 6:00 PM",
    society: "Tech Society",
    location: "Main Auditorium",
    attendees: 342,
    image: "/conference-hall-with-modern-setup.jpg",
  },
  {
    id: 2,
    title: "Business Networking Gala",
    date: "Dec 18, 2025",
    time: "6:00 PM - 9:00 PM",
    society: "Business Club",
    location: "Grand Ballroom",
    attendees: 215,
    image: "/networking-event-with-professionals.jpg",
  },
  {
    id: 3,
    title: "Web Development Workshop",
    date: "Dec 20, 2025",
    time: "10:00 AM - 1:00 PM",
    society: "Dev Community",
    location: "Lab 3",
    attendees: 89,
    image: "/technology-workshop-with-laptops.jpg",
  },
  {
    id: 4,
    title: "Leadership Masterclass",
    date: "Dec 22, 2025",
    time: "3:00 PM - 5:00 PM",
    society: "Leadership Forum",
    location: "Conference Room A",
    attendees: 156,
    image: "/conference-hall-with-modern-setup.jpg",
  },
]

const concludedEvents = [
  {
    id: 5,
    title: "Startup Pitch Competition",
    date: "Dec 10, 2025",
    society: "Entrepreneurship Club",
  },
  {
    id: 6,
    title: "Annual Sports Day",
    date: "Dec 8, 2025",
    society: "Sports Committee",
  },
]

export default function EventFeed() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Upcoming Events */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-2">Upcoming Events</h2>
          <p className="text-[rgba(255,255,255,0.6)] mb-8">Featured events happening soon</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="glass rounded-2xl overflow-hidden glass-hover group">
                {/* Event Image */}
                <div className="relative h-40 overflow-hidden">
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
                  <h3 className="text-white font-semibold mb-3 line-clamp-2">{event.title}</h3>

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

                  <p className="text-[#d02243] text-xs font-semibold mb-4">{event.society}</p>

                  <Button className="w-full bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold">Register</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Concluded Events */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Recently Concluded</h2>
          <p className="text-[rgba(255,255,255,0.6)] mb-8">Share your feedback and experiences</p>

          <div className="glass rounded-2xl p-8 glass-hover">
            <div className="space-y-4">
              {concludedEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.1)] last:border-0"
                >
                  <div>
                    <h4 className="text-white font-semibold mb-1">{event.title}</h4>
                    <p className="text-[rgba(255,255,255,0.6)] text-sm">
                      {event.society} • {event.date}
                    </p>
                  </div>
                  <Button variant="ghost" className="text-[#d02243] hover:bg-[rgba(208,34,67,0.1)]">
                    Leave Feedback
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

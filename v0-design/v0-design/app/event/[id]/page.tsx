"use client"

import { useState } from "react"
import { MapPin, Calendar, Clock, DollarSign, Users, ArrowLeft, Share2, Heart, X, Download } from "lucide-react"
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
      documents: [{ name: "AI_Keynote_Slides.pdf", url: "#" }],
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
        { name: "Cloud_Workshop_Guide.pdf", url: "#" },
        { name: "Setup_Instructions.pdf", url: "#" },
      ],
    },
    {
      id: 3,
      title: "Panel Discussion: Future of Tech",
      time: "4:30 PM - 5:30 PM",
      price: "Free",
      image: "/technology-workshop-with-laptops.jpg",
      description:
        "Industry leaders discuss emerging technologies, career paths, and the future of the tech industry. Q&A session included.",
      documents: [],
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

function ModuleDetailModal({
  isOpen,
  module,
  onClose,
}: {
  isOpen: boolean
  module: (typeof eventData.modules)[0] | null
  onClose: () => void
}) {
  if (!isOpen || !module) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)] bg-[rgba(17,2,5,0.9)]">
          <h2 className="text-2xl font-bold text-white">{module.title}</h2>
          <button onClick={onClose} className="text-[rgba(255,255,255,0.6)] hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {module.image && (
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image src={module.image || "/placeholder.svg"} alt={module.title} fill className="object-cover" />
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Details</h3>
            <div className="flex flex-col gap-3 text-[rgba(255,255,255,0.8)]">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-[#d02243]" />
                <span>{module.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-[#d02243]" />
                <span className="font-semibold">{module.price}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
            <p className="text-[rgba(255,255,255,0.8)] leading-relaxed">{module.description}</p>
          </div>

          {module.documents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Attached Documents</h3>
              <div className="space-y-2">
                {module.documents.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    className="flex items-center gap-3 p-3 glass rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                  >
                    <Download size={18} className="text-[#d02243]" />
                    <span className="text-[rgba(255,255,255,0.8)] font-medium">{doc.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EventDetailPage() {
  const [activeTab, setActiveTab] = useState("description")
  const [isRegistered, setIsRegistered] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [selectedModule, setSelectedModule] = useState<(typeof eventData.modules)[0] | null>(null)

  const tabs = ["Description", "Modules", "Speakers", "Contact"]

  return (
    <div className="min-h-screen bg-[#110205]">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(17,2,5,0.8)] border-b border-[rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[rgba(255,255,255,0.7)] hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="p-2 rounded-lg glass glass-hover flex items-center justify-center"
            >
              <Heart
                size={20}
                className={isFavorited ? "fill-[#d02243] text-[#d02243]" : "text-[rgba(255,255,255,0.7)]"}
              />
            </button>
            <button className="p-2 rounded-lg glass glass-hover flex items-center justify-center">
              <Share2 size={20} className="text-[rgba(255,255,255,0.7)]" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <Image
          src={eventData.image || "/placeholder.svg"}
          alt={eventData.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#110205] via-[rgba(17,2,5,0.6)] to-transparent"></div>
        <div className="absolute inset-0 backdrop-blur-sm border border-[rgba(255,255,255,0.1)]"></div>

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
          <div className="max-w-7xl mx-auto w-full">
            <p className="text-[#d02243] font-semibold mb-3">{eventData.society}</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 max-w-3xl">{eventData.title}</h1>
          </div>
        </div>
      </section>

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
                  <h2 className="text-2xl font-bold text-white mb-6">About This Event</h2>
                  <div className="prose prose-invert max-w-none">
                    {eventData.description.split("\n\n").map((paragraph, idx) => (
                      <p key={idx} className="text-[rgba(255,255,255,0.8)] leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-2xl p-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Event Highlights</h3>
                  <ul className="space-y-3 text-[rgba(255,255,255,0.8)]">
                    <li className="flex items-start gap-3">
                      <span className="text-[#d02243] mt-1">•</span>
                      <span>Industry-leading keynote speakers and thought leaders</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d02243] mt-1">•</span>
                      <span>Interactive workshops and hands-on demonstrations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d02243] mt-1">•</span>
                      <span>Networking opportunities with professionals and innovators</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d02243] mt-1">•</span>
                      <span>Career opportunities with leading tech companies</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "modules" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Event Modules</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {eventData.modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => setSelectedModule(module)}
                      className="glass rounded-lg overflow-hidden hover:bg-[rgba(255,255,255,0.1)] transition-all text-left group"
                    >
                      {module.image && (
                        <div className="relative h-40 overflow-hidden">
                          <Image
                            src={module.image || "/placeholder.svg"}
                            alt={module.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-2 group-hover:text-[#d02243] transition-colors">
                          {module.title}
                        </h3>
                        <div className="space-y-2 text-sm text-[rgba(255,255,255,0.7)]">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-[#d02243]" />
                            <span>{module.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign size={14} className="text-[#d02243]" />
                            <span className="font-semibold text-white">{module.price}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers Tab */}
            {activeTab === "speakers" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Featured Speakers</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {eventData.speakers.map((speaker) => (
                    <div key={speaker.id} className="glass rounded-lg p-6 flex gap-4">
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
                    <a
                      href={`mailto:${eventData.contact.email}`}
                      className="text-[#d02243] hover:text-[#aa1c37] font-semibold text-lg"
                    >
                      {eventData.contact.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-[rgba(255,255,255,0.6)] mb-2">Phone</p>
                    <a
                      href={`tel:${eventData.contact.phone}`}
                      className="text-[#d02243] hover:text-[#aa1c37] font-semibold text-lg"
                    >
                      {eventData.contact.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-[rgba(255,255,255,0.6)] mb-2">Website</p>
                    <a
                      href={`https://${eventData.contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#d02243] hover:text-[#aa1c37] font-semibold text-lg"
                    >
                      {eventData.contact.website}
                    </a>
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
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-[#d02243] flex-shrink-0 mt-1" />
                  <p className="text-white font-semibold">{eventData.venue}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2">Date & Time</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-[#d02243]" />
                    <p className="text-white font-semibold">{eventData.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-[#d02243]" />
                    <p className="text-white font-semibold">
                      {eventData.startTime} - {eventData.endTime}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2">Price</p>
                <div className="flex items-center gap-3">
                  <DollarSign size={20} className="text-[#d02243]" />
                  <p className="text-white font-semibold">{eventData.price}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[rgba(255,255,255,0.6)] uppercase mb-2">Attendees</p>
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-[#d02243]" />
                  <p className="text-white font-semibold">{eventData.attendees} people registered</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(255,255,255,0.1)]">
                {eventData.status === "upcoming" && !isRegistered && (
                  <Button
                    onClick={() => setIsRegistered(true)}
                    className="w-full bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold py-6 text-lg"
                  >
                    Register Now
                  </Button>
                )}
                {isRegistered && (
                  <Button
                    variant="outline"
                    className="w-full border-[#d02243] text-[#d02243] hover:bg-[rgba(208,34,67,0.1)] font-semibold py-6 text-lg bg-transparent"
                  >
                    Manage Registration
                  </Button>
                )}
                {eventData.status === "concluded" && (
                  <Button className="w-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-white font-semibold py-6 text-lg">
                    View Feedback
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModuleDetailModal
        isOpen={selectedModule !== null}
        module={selectedModule}
        onClose={() => setSelectedModule(null)}
      />
    </div>
  )
}

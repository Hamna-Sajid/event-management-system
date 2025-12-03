"use client"

import { Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const societies = [
  {
    id: 1,
    name: "Tech Society",
    description: "Innovation and technology enthusiasts",
    members: 1240,
    image: "/technology-workshop-with-laptops.jpg",
    isFollowing: true,
  },
  {
    id: 2,
    name: "Business Club",
    description: "Professional development and networking",
    members: 856,
    image: "/networking-event-with-professionals.jpg",
    isFollowing: false,
  },
  {
    id: 3,
    name: "Dev Community",
    description: "Software development and coding",
    members: 945,
    image: "/conference-hall-with-modern-setup.jpg",
    isFollowing: true,
  },
  {
    id: 4,
    name: "Leadership Forum",
    description: "Building future leaders",
    members: 623,
    image: "/networking-event-with-professionals.jpg",
    isFollowing: false,
  },
]

export default function SocietiesSpotlight() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Societies Spotlight</h2>
        <p className="text-[rgba(255,255,255,0.6)] mb-8">Explore and follow your favorite communities</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {societies.map((society) => (
            <div key={society.id} className="glass rounded-2xl overflow-hidden glass-hover group">
              {/* Society Image */}
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={society.image || "/placeholder.svg"}
                  alt={society.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300 blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#110205] to-transparent"></div>
              </div>

              {/* Society Details */}
              <div className="p-6">
                <h3 className="text-white font-semibold mb-2">{society.name}</h3>
                <p className="text-[rgba(255,255,255,0.6)] text-sm mb-4">{society.description}</p>

                <div className="flex items-center gap-2 text-[rgba(255,255,255,0.7)] text-sm mb-4">
                  <Users size={16} />
                  <span>{society.members.toLocaleString()} members</span>
                </div>

                <Button
                  className={`w-full font-semibold ${
                    society.isFollowing
                      ? "bg-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.15)]"
                      : "bg-[#d02243] hover:bg-[#aa1c37] text-white"
                  }`}
                >
                  {society.isFollowing ? "Following" : "Follow"}
                </Button>

                <Button variant="ghost" className="w-full mt-2 text-[#d02243] hover:bg-[rgba(208,34,67,0.1)]">
                  View Profile
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

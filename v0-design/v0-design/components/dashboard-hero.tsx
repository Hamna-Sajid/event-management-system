"use client"

import { Search } from "lucide-react"

export default function DashboardHero() {
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
          Discover Your Next Event, <span className="text-[#d02243]">Alex</span>
        </h1>

        {/* Central Search Bar - Glassmorphic */}
        <div className="glass rounded-2xl p-2 glass-hover">
          <div className="flex items-center gap-4 px-6 py-4">
            <Search size={24} className="text-[rgba(255,255,255,0.6)]" />
            <input
              type="text"
              placeholder="Search events, societies, or keywords..."
              className="flex-1 bg-transparent text-white placeholder-[rgba(255,255,255,0.5)] outline-none text-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { Calendar, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PersonalizedAccess() {
  return (
    <section className="px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* My Bucket List / Registered Events */}
          <div className="glass rounded-2xl p-8 glass-hover">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[rgba(208,34,67,0.2)] flex items-center justify-center">
                <Calendar size={24} className="text-[#d02243]" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">My Registered Events</h3>
                <p className="text-[rgba(255,255,255,0.6)] text-sm">Events you're attending</p>
              </div>
            </div>
            <div className="mb-6">
              <div className="text-4xl font-bold text-[#d02243] mb-2">8</div>
              <p className="text-[rgba(255,255,255,0.7)]">Upcoming events on your calendar</p>
            </div>
            <Button className="w-full bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold">View My Events</Button>
          </div>

          {/* Recent Updates / Announcements */}
          <div className="glass rounded-2xl p-8 glass-hover">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[rgba(208,34,67,0.2)] flex items-center justify-center">
                <Bell size={24} className="text-[#d02243]" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Latest Announcements</h3>
                <p className="text-[rgba(255,255,255,0.6)] text-sm">From your favorite societies</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <p className="text-[rgba(255,255,255,0.8)]">
                <span className="text-[#d02243] font-semibold">Tech Society:</span> New workshop on AI & ML
              </p>
              <p className="text-[rgba(255,255,255,0.6)] text-sm">2 hours ago</p>
            </div>
            <Button
              variant="outline"
              className="w-full border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] bg-transparent"
            >
              View All Updates
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

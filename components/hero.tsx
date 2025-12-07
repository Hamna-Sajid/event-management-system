"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getTotalEvents, getTotalSocieties, getTotalUsers } from "@/lib/stats"

/**
 * @component Hero
 * 
 * 
 * Hero section component displaying dynamic platform statistics and call-to-action buttons.
 * 
 * @remarks
 * This is the main landing page hero section that:
 * - Fetches real-time statistics from Firestore on component mount
 * - Displays event count, society count, and user count
 * - Provides primary CTA (Join Waitlist) and secondary CTA (Sign In)
 * - Uses glassmorphism design for the statistics card
 * 
 * Statistics are fetched in parallel using `Promise.all` for optimal performance.
 * If fetch fails, statistics default to 0 (handled in the stats functions).
 * 
 * @example
 * Usage in a page:
 * ```tsx
 * import Hero from '@/components/hero'
 * 
 * export default function LandingPage() {
 *   return (
 *     <>
 *       <Header />
 *       <Hero />
 *       <Footer />
 *     </>
 *   )
 * }
 * ```
 * 
 * @category Components
 */
export default function Hero() {
  const [stats, setStats] = useState({
    events: 0,
    societies: 0,
    users: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      const [events, societies, users] = await Promise.all([
        getTotalEvents(),
        getTotalSocieties(),
        getTotalUsers(),
      ])
      setStats({ events, societies, users })
    }
    fetchStats()
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-premium">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-electric-blue rounded-full blur-3xl opacity-30 animate-blob" />
        <div
          className="absolute bottom-10 right-1/4 w-80 h-80 bg-magenta rounded-full blur-3xl opacity-30 animate-blob"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-25 animate-blob"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute bottom-1/3 left-10 w-[28rem] h-[28rem] bg-electric-blue rounded-full blur-3xl opacity-25 animate-blob"
          style={{ animationDelay: "6s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-block mb-8 px-4 py-2 glass rounded-full">
          <span className="text-sm text-foreground/80">✨ Coming Soon to IBA</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
          Your Gateway to{" "}
          <span className="bg-gradient-to-r from-electric-blue to-magenta bg-clip-text text-transparent">IBA Events</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Discover events, connect with societies, and manage your campus experience all in one place. 
          Join the waitlist for early access.
        </p>

        {/* Hero Card with Glassmorphism */}
        <div className="glass glass-hover rounded-2xl p-8 md:p-12 mb-12 max-w-2xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-magenta bg-clip-text text-transparent mb-2">{stats.events}</div>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-magenta bg-clip-text text-transparent mb-2">{stats.societies}</div>
              <p className="text-sm text-muted-foreground">Active Societies</p>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-magenta bg-clip-text text-transparent mb-2">{stats.users}</div>
              <p className="text-sm text-muted-foreground">Users</p>
            </div>
          </div>

          <p className="text-foreground/80 mb-6">
            Be among the first to experience a unified platform for discovering and managing all IBA events.
          </p>

          <Link href="/signup">
            <Button className="w-full glow-button py-6 text-lg">
              Join Waitlist
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signin">
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-magenta w-full sm:w-auto "
            >
              Already have an account?
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

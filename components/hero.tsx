"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-block mb-8 px-4 py-2 glass rounded-full">
          <span className="text-sm text-[rgba(255,255,255,0.8)]">✨ Coming Soon to IBA</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Your Gateway to{" "}
          <span className="bg-gradient-to-r from-[#d02243] to-[#aa1c37] bg-clip-text text-transparent">IBA Events</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-[rgba(255,255,255,0.7)] mb-12 max-w-2xl mx-auto leading-relaxed">
          Discover events, connect with societies, and manage your campus experience all in one place. 
          Join the waitlist for early access.
        </p>

        {/* Hero Card with Glassmorphism */}
        <div className="glass rounded-2xl p-8 md:p-12 mb-12 max-w-2xl mx-auto glass-hover">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <div className="text-3xl font-bold text-[#d02243] mb-2">500+</div>
              <p className="text-sm text-[rgba(255,255,255,0.6)]">Events Annually</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#d02243] mb-2">50+</div>
              <p className="text-sm text-[rgba(255,255,255,0.6)]">Active Societies</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#d02243] mb-2">5K+</div>
              <p className="text-sm text-[rgba(255,255,255,0.6)]">IBA Students</p>
            </div>
          </div>

          <p className="text-[rgba(255,255,255,0.8)] mb-6">
            Be among the first to experience a unified platform for discovering and managing all IBA events.
          </p>

          <Link href="/signup">
            <Button className="w-full bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold py-6 text-lg">
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
              className="border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] bg-transparent w-full sm:w-auto"
            >
              Already have an account?
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

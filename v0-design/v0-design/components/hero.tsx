"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-block mb-8 px-4 py-2 glass rounded-full">
          <span className="text-sm text-[rgba(255,255,255,0.8)]">✨ Discover Premium Event Experiences</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Your Gateway to{" "}
          <span className="bg-gradient-to-r from-[#d02243] to-[#aa1c37] bg-clip-text text-transparent">IBA Events</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-[rgba(255,255,255,0.7)] mb-12 max-w-2xl mx-auto leading-relaxed">
          Experience curated events, networking opportunities, and unforgettable moments. Manage your event journey
          seamlessly with IEMS.
        </p>

        {/* Hero Card with Glassmorphism */}
        <div className="glass rounded-2xl p-8 md:p-12 mb-12 max-w-2xl mx-auto glass-hover">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <div className="text-3xl font-bold text-[#d02243] mb-2">500+</div>
              <p className="text-sm text-[rgba(255,255,255,0.6)]">Events Hosted</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#d02243] mb-2">50K+</div>
              <p className="text-sm text-[rgba(255,255,255,0.6)]">Active Members</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#d02243] mb-2">100%</div>
              <p className="text-sm text-[rgba(255,255,255,0.6)]">Satisfaction</p>
            </div>
          </div>

          <p className="text-[rgba(255,255,255,0.8)] mb-6">
            Join thousands of professionals and enthusiasts discovering exceptional events through our intelligent
            platform.
          </p>

          <Button className="w-full bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold py-6 text-lg">
            Explore Events Now
            <ArrowRight size={20} className="ml-2" />
          </Button>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            className="border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] bg-transparent"
          >
            Learn More
          </Button>
          <Button className="bg-[#d02243] hover:bg-[#aa1c37] text-white">Get Started</Button>
        </div>
      </div>
    </section>
  )
}

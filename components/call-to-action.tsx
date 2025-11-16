"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export default function CallToAction() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-2xl p-12 md:p-16 text-center glass-hover">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#d02243] to-[#84162b] mb-6">
            <Sparkles size={32} className="text-white" />
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to Experience IBA Events?</h2>

          {/* Description */}
          <p className="text-lg text-[rgba(255,255,255,0.7)] mb-8 max-w-2xl mx-auto">
            Join our community of professionals and enthusiasts. Sign up today to get exclusive access to premium
            events, early bird discounts, and networking opportunities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold py-6 text-base">
              Create Account
              <ArrowRight size={20} className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.1)] font-semibold py-6 text-base bg-transparent"
            >
              Browse Events
            </Button>
          </div>

          {/* Trust Badge */}
          <p className="text-sm text-[rgba(255,255,255,0.5)] mt-8">
            ✓ No credit card required • ✓ Free to join • ✓ Instant access
          </p>
        </div>
      </div>
    </section>
  )
}

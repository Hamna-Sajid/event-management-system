"use client"

import Link from "next/link"
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to Transform Your IBA Experience?</h2>

          {/* Description */}
          <p className="text-lg text-[rgba(255,255,255,0.7)] mb-8 max-w-2xl mx-auto">
            Join the waitlist to get early access when we launch. Be the first to discover events, 
            connect with societies, and never miss a campus moment.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold py-6 text-base"
              >
                Join Waitlist Now
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
          </div>

          {/* Trust Badge */}
          <p className="text-sm text-[rgba(255,255,255,0.5)] mt-8">
            ✓ No credit card required • ✓ Free to join • ✓ Early access guaranteed
          </p>
        </div>
      </div>
    </section>
  )
}

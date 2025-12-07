"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-premium flex items-center justify-center relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-magenta/20 rounded-full blur-3xl opacity-30 animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl opacity-25 animate-blob" style={{ animationDelay: "4s" }} />
        <div className="absolute bottom-1/3 left-10 w-[28rem] h-[28rem] bg-electric-blue/15 rounded-full blur-3xl opacity-25 animate-blob" style={{ animationDelay: "6s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-electric-blue via-magenta to-purple-500 bg-clip-text text-transparent">
          Coming Soon
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12">
          This feature is currently under development. Stay tuned for exciting updates!
        </p>
        <Link href="/">
          <Button className="glow-button text-white font-semibold px-8 py-6 text-lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

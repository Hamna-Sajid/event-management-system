"use client"

import { Search, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[rgba(17,2,5,0.8)] border-b border-[rgba(255,255,255,0.1)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d02243] to-[#84162b] flex items-center justify-center">
            <span className="text-white font-bold text-lg">IE</span>
          </div>
          <span className="text-white font-semibold text-lg hidden sm:inline">IEMS</span>
        </div>

        {/* Right side - Search, Login, Sign Up */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg glass glass-hover hidden sm:flex items-center justify-center">
            <Search size={20} className="text-[rgba(255,255,255,0.7)]" />
          </button>

          <Button
            variant="ghost"
            className="text-[rgba(255,255,255,0.8)] hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
          >
            <LogIn size={18} className="mr-2" />
            <span className="hidden sm:inline">Login</span>
          </Button>

          <Button className="bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold">
            <UserPlus size={18} className="mr-2" />
            <span className="hidden sm:inline">Sign Up</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

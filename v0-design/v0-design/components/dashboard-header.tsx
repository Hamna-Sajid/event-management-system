"use client"

import { Bell, LogOut, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardHeader() {
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

        {/* Right side - Navigation */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <a href="/dashboard" className="text-[#d02243] font-semibold text-sm">
              Dashboard
            </a>
            <a href="/profile" className="text-[rgba(255,255,255,0.7)] hover:text-white text-sm transition">
              My Profile
            </a>
          </nav>

          <Link href="/calendar-view">
            <button className="p-2 rounded-lg glass glass-hover flex items-center justify-center hover:bg-[rgba(208,34,67,0.2)]">
              <Calendar size={20} className="text-[#d02243]" />
            </button>
          </Link>

          <button className="p-2 rounded-lg glass glass-hover flex items-center justify-center relative">
            <Bell size={20} className="text-[rgba(255,255,255,0.7)]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#d02243] rounded-full"></span>
          </button>

          <Button
            variant="ghost"
            className="text-[rgba(255,255,255,0.8)] hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
          >
            <LogOut size={18} className="mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

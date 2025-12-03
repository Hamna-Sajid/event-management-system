"use client"

import { Bell, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SocietyHeaderProps {
  theme: string
}

export default function SocietyHeader({ theme }: SocietyHeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: `var(--header-bg-${theme})`,
        borderColor: `var(--border-${theme})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center"
            style={{
              backgroundImage: `linear-gradient(to bottom right, var(--accent-1-${theme}), var(--accent-2-${theme}))`,
            }}
          >
            <span className="text-white font-bold text-lg">IE</span>
          </div>
          <span className="font-semibold text-lg hidden sm:inline" style={{ color: `var(--text-primary-${theme})` }}>
            IEMS
          </span>
        </div>

        {/* Right side - Navigation */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hover:bg-opacity-20" style={{ color: `var(--text-primary-${theme})` }}>
            Dashboard
          </Button>

          <Button variant="ghost" className="hover:bg-opacity-20" style={{ color: `var(--text-primary-${theme})` }}>
            <User size={18} className="mr-2" />
            <span className="hidden sm:inline">My Profile</span>
          </Button>

          <button
            className="p-2 rounded-lg hover:bg-opacity-20"
            style={{
              backgroundColor: `var(--glass-${theme})`,
              color: `var(--text-primary-${theme})`,
            }}
          >
            <Bell size={20} />
          </button>

          <Button variant="ghost" className="hover:bg-opacity-20" style={{ color: `var(--text-primary-${theme})` }}>
            <LogOut size={18} className="mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

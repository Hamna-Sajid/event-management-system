"use client"

import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useRouter } from "next/navigation"

interface SocietyHeroProps {
  societyName: string
  theme: string
  isManagementView?: boolean
}

export default function SocietyHero({ societyName, theme, isManagementView = false }: SocietyHeroProps) {
  const router = useRouter()
  const logo = societyName ? societyName.charAt(0).toUpperCase() : ''

  const handleEditClick = () => {
    router.push('/default-profile-society/edit')
  }

  return (
    <div
      className="relative py-12 px-6 border-b"
      style={{
        backgroundColor: `var(--bg-${theme})`,
        borderColor: `var(--border-${theme})`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          {/* Society Logo */}
          <div
            className="w-32 h-32 rounded-2xl flex-shrink-0 flex items-center justify-center text-4xl font-bold"
            style={{
              backgroundColor: `var(--glass-${theme})`,
              color: `var(--accent-1-${theme})`,
              backdropFilter: "blur(10px)",
              border: `1px solid var(--border-${theme})`,
            }}
          >
            {logo}
          </div>

          {/* Society Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold" style={{ color: `var(--text-primary-${theme})` }}>
                {societyName}
              </h1>
              {isManagementView && (
                <button
                  onClick={handleEditClick}
                  className="p-2 rounded-lg transition-all hover:opacity-80"
                  style={{
                    backgroundColor: `var(--glass-${theme})`,
                    color: `var(--accent-1-${theme})`,
                    border: `1px solid var(--border-${theme})`,
                  }}
                  title="Edit Society Profile"
                >
                  <Settings size={24} />
                </button>
              )}
            </div>
            <p className="mb-6" style={{ color: `var(--text-secondary-${theme})` }}>
              {isManagementView ? "Manage your society and events" : "Join our community and explore amazing events"}
            </p>
            <Button
              onClick={isManagementView ? handleEditClick : undefined}
              disabled={!isManagementView}
              className="font-semibold"
              style={{
                backgroundColor: `var(--accent-1-${theme})`,
                color: "white",
              }}
            >
              {isManagementView ? "Edit Profile" : "Follow Society"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

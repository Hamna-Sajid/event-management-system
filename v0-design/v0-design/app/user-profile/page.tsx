"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Lock, Calendar, Settings, LogOut, Trash2, Check, X, Users } from "lucide-react"

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("account")
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Technology", "Sports"])
  const [interestDropdownOpen, setInterestDropdownOpen] = useState(false)
  const availableInterests = ["Technology", "Sports", "Music", "Food", "Art", "Business", "Science"]

  const [followedSocieties, setFollowedSocieties] = useState<string[]>(["IBA Marketing Club", "Tech Society"])
  const [societyDropdownOpen, setSocietyDropdownOpen] = useState(false)
  const [societySearchInput, setSocietySearchInput] = useState("")
  const availableSocieties = [
    "IBA Marketing Club",
    "Tech Society",
    "Sports Club",
    "Arts & Culture",
    "Entrepreneurship Hub",
    "Photography Club",
  ]

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    eventReminders: true,
  })

  const handleVerifyEmail = () => {
    setVerificationSent(true)
    setTimeout(() => setVerificationSent(false), 3000)
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  const toggleSociety = (society: string) => {
    setFollowedSocieties((prev) => (prev.includes(society) ? prev.filter((s) => s !== society) : [...prev, society]))
  }

  const toggleNotification = (type: string) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const tabs = [
    { id: "account", label: "Account & Security", icon: Lock },
    { id: "preferences", label: "Preferences & Interests", icon: Settings },
    { id: "societies", label: "Societies & Following", icon: Users },
    { id: "integrations", label: "Integrations", icon: Calendar },
    { id: "schedule", label: "My Event Schedule", icon: Calendar },
    { id: "privacy", label: "Data & Privacy", icon: LogOut },
  ]

  return (
    <div className="min-h-screen bg-[#110205]">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="glass rounded-2xl p-4 sticky top-24 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? "bg-[#d02243] text-white"
                        : "text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.08)]"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Content Panel */}
          <div className="flex-1">
            <div className="glass rounded-2xl p-8">
              {/* Account & Security Tab */}
              {activeTab === "account" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Account & Security</h2>
                  </div>

                  {/* User Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">User Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass rounded-lg p-4">
                        <label className="text-sm text-[rgba(255,255,255,0.6)] block mb-2">Full Name</label>
                        <input
                          type="text"
                          defaultValue="Ahmed Hassan"
                          className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#d02243]"
                        />
                      </div>
                      <div className="glass rounded-lg p-4">
                        <label className="text-sm text-[rgba(255,255,255,0.6)] block mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue="ahmed@example.com"
                          className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#d02243]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* IBA Email Verification */}
                  <div className="space-y-4 border-t border-[rgba(255,255,255,0.1)] pt-8">
                    <h3 className="text-lg font-semibold text-white">IBA Email Verification</h3>
                    <p className="text-sm text-[rgba(255,255,255,0.6)]">
                      Verify your IBA email to unlock exclusive IBA-only events and features.
                    </p>
                    <div className="glass rounded-lg p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="email"
                          placeholder="your.name@iba.edu.pk"
                          className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#d02243]"
                        />
                        <button
                          onClick={handleVerifyEmail}
                          className="bg-[#d02243] hover:bg-[#aa1c37] text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          {verificationSent ? (
                            <>
                              <Check size={18} />
                              Sent
                            </>
                          ) : (
                            "Verify Email"
                          )}
                        </button>
                      </div>
                      {emailVerified && (
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <Check size={16} />
                          Email verified successfully
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password Management */}
                  <div className="space-y-4 border-t border-[rgba(255,255,255,0.1)] pt-8">
                    <h3 className="text-lg font-semibold text-white">Password Management</h3>
                    <div className="glass rounded-lg p-4 space-y-4">
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#d02243]"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#d02243]"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#d02243]"
                      />
                      <button className="w-full bg-[#d02243] hover:bg-[#aa1c37] text-white py-2 rounded-lg font-medium transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="space-y-4 border-t border-[rgba(255,255,255,0.1)] pt-8">
                    <h3 className="text-lg font-semibold text-white">Notification Settings</h3>
                    <div className="glass rounded-lg p-4 space-y-4">
                      {Object.entries(notifications).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => toggleNotification(key)}
                            className="w-4 h-4 rounded accent-[#d02243]"
                          />
                          <span className="text-white capitalize">
                            {key === "email" && "Email Notifications"}
                            {key === "push" && "Push Notifications"}
                            {key === "eventReminders" && "Event Reminders"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences & Interests Tab */}
              {activeTab === "preferences" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Preferences & Interests</h2>
                  </div>
                  <div className="glass rounded-lg p-6 space-y-6">
                    <p className="text-sm text-[rgba(255,255,255,0.6)]">
                      Select your interests to get personalized event recommendations.
                    </p>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-white">Select Interests</label>
                      <div className="relative">
                        <button
                          onClick={() => setInterestDropdownOpen(!interestDropdownOpen)}
                          className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-left text-white hover:border-[rgba(255,255,255,0.2)] transition-colors flex items-center justify-between"
                        >
                          <span className="text-[rgba(255,255,255,0.7)]">Choose interests...</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        </button>

                        {interestDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-[#2b070e] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 space-y-2 z-10">
                            {availableInterests.map((interest) => (
                              <button
                                key={interest}
                                onClick={() => toggleInterest(interest)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                  selectedInterests.includes(interest)
                                    ? "bg-[#d02243] text-white"
                                    : "text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.08)]"
                                }`}
                              >
                                {interest}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-4">
                        {selectedInterests.map((interest) => (
                          <div
                            key={interest}
                            className="inline-flex items-center gap-2 bg-[#d02243] text-white px-4 py-2 rounded-full text-sm font-medium"
                          >
                            {interest}
                            <button
                              onClick={() => toggleInterest(interest)}
                              className="hover:opacity-80 transition-opacity"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Societies & Following Tab */}
              {activeTab === "societies" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Societies & Following</h2>
                  </div>
                  <div className="glass rounded-lg p-6 space-y-6">
                    <p className="text-sm text-[rgba(255,255,255,0.6)]">
                      Follow societies to stay updated with their events and announcements.
                    </p>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-white">Find and Follow Society</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search societies..."
                          value={societySearchInput}
                          onChange={(e) => setSocietySearchInput(e.target.value)}
                          onFocus={() => setSocietyDropdownOpen(true)}
                          className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#d02243]"
                        />

                        {societyDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-[#2b070e] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 space-y-2 z-10 max-h-48 overflow-y-auto">
                            {availableSocieties
                              .filter((society) => society.toLowerCase().includes(societySearchInput.toLowerCase()))
                              .map((society) => (
                                <button
                                  key={society}
                                  onClick={() => {
                                    toggleSociety(society)
                                    setSocietySearchInput("")
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                    followedSocieties.includes(society)
                                      ? "bg-[#d02243] text-white"
                                      : "text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.08)]"
                                  }`}
                                >
                                  {society}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-4">
                        {followedSocieties.map((society) => (
                          <div
                            key={society}
                            className="inline-flex items-center gap-2 bg-[#aa1c37] text-white px-4 py-2 rounded-full text-sm font-medium"
                          >
                            {society}
                            <button
                              onClick={() => toggleSociety(society)}
                              className="hover:opacity-80 transition-opacity"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Integrations Tab */}
              {activeTab === "integrations" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Integrations</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="glass rounded-lg p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-white">Google Calendar</h3>
                      <p className="text-sm text-[rgba(255,255,255,0.6)]">Sync your events with Google Calendar</p>
                      <button className="w-full bg-[#d02243] hover:bg-[#aa1c37] text-white py-2 rounded-lg font-medium transition-colors">
                        Connect Google Calendar
                      </button>
                    </div>
                    <div className="glass rounded-lg p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-white">Outlook Calendar</h3>
                      <p className="text-sm text-[rgba(255,255,255,0.6)]">Sync your events with Outlook Calendar</p>
                      <button className="w-full bg-[#d02243] hover:bg-[#aa1c37] text-white py-2 rounded-lg font-medium transition-colors">
                        Connect Outlook Calendar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* My Event Schedule Tab */}
              {activeTab === "schedule" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">My Event Schedule</h2>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="glass rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold">Tech Workshop {i}</h3>
                          <p className="text-sm text-[rgba(255,255,255,0.6)]">March {15 + i}, 2025 • 2:00 PM</p>
                        </div>
                        <button className="text-red-400 hover:text-red-300 font-medium transition-colors">
                          Withdraw
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data & Privacy Tab */}
              {activeTab === "privacy" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Data & Privacy</h2>
                  </div>
                  <div className="glass rounded-lg p-6 border border-red-500/30 space-y-4">
                    <div className="flex items-start gap-3">
                      <Trash2 size={24} className="text-red-500 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Danger Zone</h3>
                        <p className="text-sm text-[rgba(255,255,255,0.6)] mb-4">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

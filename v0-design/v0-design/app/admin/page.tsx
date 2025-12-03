"use client"

import { useState } from "react"
import { LogOut, Plus, Trash2, User, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Head {
  id: string
  name: string
  email: string
}

interface Society {
  id: string
  name: string
  dateCreated: string
  heads: Head[]
  maxHeads: number
}

interface AdminStats {
  totalUsers: number
  totalEvents: number
  totalSocieties: number
  weeklyTraffic: number
}

export default function AdminDashboard() {
  const [societies, setSocieties] = useState<Society[]>([
    {
      id: "1",
      name: "Debating Society",
      dateCreated: "2024-01-15",
      heads: [
        { id: "h1", name: "Ahmed Hassan", email: "ahmed@iba.edu.pk" },
        { id: "h2", name: "Fatima Khan", email: "fatima@iba.edu.pk" },
      ],
      maxHeads: 4,
    },
    {
      id: "2",
      name: "Photography Club",
      dateCreated: "2024-02-20",
      heads: [{ id: "h3", name: "Ali Raza", email: "ali@iba.edu.pk" }],
      maxHeads: 4,
    },
    {
      id: "3",
      name: "Tech Society",
      dateCreated: "2024-03-10",
      heads: [
        { id: "h4", name: "Sara Ahmed", email: "sara@iba.edu.pk" },
        { id: "h5", name: "Hassan Ali", email: "hassan@iba.edu.pk" },
        { id: "h6", name: "Zainab Omar", email: "zainab@iba.edu.pk" },
      ],
      maxHeads: 4,
    },
  ])

  const [stats] = useState<AdminStats>({
    totalUsers: 1247,
    totalEvents: 34,
    totalSocieties: 12,
    weeklyTraffic: 3521,
  })

  const [showAddSocietyModal, setShowAddSocietyModal] = useState(false)
  const [newSocietyName, setNewSocietyName] = useState("")
  const [showManageHeadsModal, setShowManageHeadsModal] = useState(false)
  const [selectedSociety, setSelectedSociety] = useState<Society | null>(null)
  const [newHeadEmail, setNewHeadEmail] = useState("")

  const handleAddSociety = () => {
    if (newSocietyName.trim()) {
      const newSociety: Society = {
        id: Date.now().toString(),
        name: newSocietyName,
        dateCreated: new Date().toISOString().split("T")[0],
        heads: [],
        maxHeads: 4,
      }
      setSocieties([...societies, newSociety])
      setNewSocietyName("")
      setShowAddSocietyModal(false)
    }
  }

  const handleRemoveHead = (societyId: string, headId: string) => {
    setSocieties(
      societies.map((soc) =>
        soc.id === societyId ? { ...soc, heads: soc.heads.filter((h) => h.id !== headId) } : soc,
      ),
    )
  }

  const handleInviteHead = () => {
    if (selectedSociety && newHeadEmail.trim()) {
      const newHead: Head = {
        id: Date.now().toString(),
        name: newHeadEmail.split("@")[0],
        email: newHeadEmail,
      }
      setSocieties(
        societies.map((soc) => (soc.id === selectedSociety.id ? { ...soc, heads: [...soc.heads, newHead] } : soc)),
      )
      setNewHeadEmail("")
    }
  }

  const openManageHeads = (society: Society) => {
    setSelectedSociety(society)
    setShowManageHeadsModal(true)
  }

  return (
    <div className="min-h-screen bg-[#110205]">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(17,2,5,0.95)] border-b border-[rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">IEMS Admin Dashboard</h1>
          <Button
            variant="ghost"
            className="text-[rgba(255,255,255,0.8)] hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Admin Stats Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass rounded-lg p-6">
            <div className="text-[rgba(255,255,255,0.6)] text-sm mb-2">Total Users</div>
            <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
          </div>
          <div className="glass rounded-lg p-6">
            <div className="text-[rgba(255,255,255,0.6)] text-sm mb-2">Active Events</div>
            <div className="text-3xl font-bold text-white">{stats.totalEvents}</div>
          </div>
          <div className="glass rounded-lg p-6">
            <div className="text-[rgba(255,255,255,0.6)] text-sm mb-2">Total Societies</div>
            <div className="text-3xl font-bold text-white">{stats.totalSocieties}</div>
          </div>
          <div className="glass rounded-lg p-6">
            <div className="text-[rgba(255,255,255,0.6)] text-sm mb-2">Weekly Traffic</div>
            <div className="text-3xl font-bold text-white">{stats.weeklyTraffic}</div>
          </div>
        </div>

        {/* Society Management Panel */}
        <div className="glass rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Society Management</h2>
            <Button
              onClick={() => setShowAddSocietyModal(true)}
              className="bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold"
            >
              <Plus size={18} className="mr-2" />
              Add New Society
            </Button>
          </div>

          {/* Societies Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.1)]">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[rgba(255,255,255,0.8)]">
                    Society Name
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[rgba(255,255,255,0.8)]">
                    Date Created
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[rgba(255,255,255,0.8)]">
                    Heads Assigned
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[rgba(255,255,255,0.8)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {societies.map((society) => (
                  <tr
                    key={society.id}
                    className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                  >
                    <td className="py-4 px-4 text-white font-medium">{society.name}</td>
                    <td className="py-4 px-4 text-[rgba(255,255,255,0.7)]">
                      {new Date(society.dateCreated).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          society.heads.length === society.maxHeads
                            ? "bg-[rgba(208,34,67,0.2)] text-[#d02243]"
                            : "bg-[rgba(170,28,55,0.2)] text-[#aa1c37]"
                        }`}
                      >
                        {society.heads.length}/{society.maxHeads}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        onClick={() => openManageHeads(society)}
                        className="bg-[rgba(208,34,67,0.2)] text-[#d02243] hover:bg-[rgba(208,34,67,0.3)] text-sm font-medium"
                      >
                        Manage Heads
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add New Society Modal */}
      {showAddSocietyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Add New Society</h3>
            <input
              type="text"
              placeholder="Society Name"
              value={newSocietyName}
              onChange={(e) => setNewSocietyName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243] focus:bg-[rgba(255,255,255,0.1)] mb-4"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddSocietyModal(false)}
                variant="ghost"
                className="flex-1 text-[rgba(255,255,255,0.8)] hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSociety}
                className="flex-1 bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Heads Modal */}
      {showManageHeadsModal && selectedSociety && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass rounded-lg p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-2">Manage Heads for {selectedSociety.name}</h3>
            <p className="text-[rgba(255,255,255,0.6)] text-sm mb-6">
              Maximum {selectedSociety.maxHeads} head slots available
            </p>

            {/* Current Heads */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[rgba(255,255,255,0.8)] mb-3">Current Heads</h4>
              {selectedSociety.heads.length === 0 ? (
                <p className="text-[rgba(255,255,255,0.5)] text-sm mb-4">No heads assigned yet.</p>
              ) : (
                <div className="space-y-2 mb-4">
                  {selectedSociety.heads.map((head) => (
                    <div
                      key={head.id}
                      className="flex items-center justify-between bg-[rgba(255,255,255,0.05)] rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <User size={16} className="text-[#d02243]" />
                        <div>
                          <p className="text-sm text-white font-medium">{head.name}</p>
                          <p className="text-xs text-[rgba(255,255,255,0.5)]">{head.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveHead(selectedSociety.id, head.id)}
                        className="p-1 hover:bg-[rgba(208,34,67,0.2)] rounded text-[#d02243] transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Head */}
            {selectedSociety.heads.length < selectedSociety.maxHeads && (
              <div className="border-t border-[rgba(255,255,255,0.1)] pt-6">
                <h4 className="text-sm font-semibold text-[rgba(255,255,255,0.8)] mb-3">Invite New Head</h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newHeadEmail}
                    onChange={(e) => setNewHeadEmail(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243] focus:bg-[rgba(255,255,255,0.1)]"
                  />
                  <Button
                    onClick={handleInviteHead}
                    className="bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold"
                  >
                    <Mail size={16} className="mr-2" />
                    Invite
                  </Button>
                </div>
                <p className="text-xs text-[rgba(255,255,255,0.5)]">
                  An email invitation will be sent to the specified user.
                </p>
              </div>
            )}

            {/* Close Button */}
            <div className="border-t border-[rgba(255,255,255,0.1)] pt-6 mt-6">
              <Button
                onClick={() => setShowManageHeadsModal(false)}
                variant="ghost"
                className="w-full text-[rgba(255,255,255,0.8)] hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

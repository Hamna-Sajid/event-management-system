// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { getAuth, onAuthStateChanged } from 'firebase/auth'
// import { doc, getDoc } from 'firebase/firestore'
// import { app, firestore } from '../../firebase'

// export default function AdminDashboard() {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(true)
//   const [isAuthorized, setIsAuthorized] = useState(false)

//   useEffect(() => {
//     const auth = getAuth(app)
    
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (!user) {
//         // Not logged in, redirect to signin
//         router.push('/signin')
//         return
//       }

//       try {
//         // Check user privilege
//         const userDoc = await getDoc(doc(firestore, 'users', user.uid))
//         const userData = userDoc.data()
//         const privilege = userData?.privilege ?? 0

//         if (privilege < 2) {
//           // Not an admin, redirect to waitlist
//           router.push('/waitlist')
//           return
//         }

//         // User is authorized
//         setIsAuthorized(true)
//       } catch (error) {
//         console.error('Error checking authorization:', error)
//         router.push('/signin')
//       } finally {
//         setIsLoading(false)
//       }
//     })

//     return () => unsubscribe()
//   }, [router])

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#110205] flex items-center justify-center">
//         <div className="text-white">Loading...</div>
//       </div>
//     )
//   }

//   if (!isAuthorized) {
//     return null
//   }

//   return (
//     <div className="min-h-screen bg-[#110205] flex items-center justify-center p-4">
//       <div className="glass rounded-2xl p-12 text-center max-w-2xl">
//         <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
//         <p className="text-[rgba(255,255,255,0.7)]">
//           This is the admin page. Dashboard features coming soon.
//         </p>
//       </div>
//     </div>
//   )
// }

// Refer to above for auth

// Refer to below for the page

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { signOutUser } from "../../lib/firebase_functions/auth"
import { doc, getDoc } from "firebase/firestore"
import { app, firestore } from "../../firebase"
import { getDashboardData, getHeadDetails, addSociety, removeHead, inviteHead } from "../../lib/firebase_functions/admin"
import { LogOut, Plus, Trash2, User, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToastContainer, showToast } from "@/components/ui/toast"

export interface Society {
  id: string
  name: string
  dateCreated: string
  heads: {
    CEO: string | null
    CFO: string | null
    COO: string | null
  }
  maxHeads: number
  description: string,
  contactEmail: string,
  socialLinks: {
    facebook: string,
    instagram: string,
    linkedin: string,
  },
  events: any[],
}

export interface AdminStats {
  totalUsers: number
  totalEvents: number
  totalSocieties: number
  weeklyTraffic: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [currentUserEmail, setCurrentUserEmail] = useState("")

  const [societies, setSocieties] = useState<Society[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalSocieties: 0,
    weeklyTraffic: 0,
  })

  const [showAddSocietyModal, setShowAddSocietyModal] = useState(false)
  const [newSocietyName, setNewSocietyName] = useState("")
  const [showManageHeadsModal, setShowManageHeadsModal] = useState(false)
  const [selectedSociety, setSelectedSociety] = useState<Society | null>(null)
  const [newHeadEmail, setNewHeadEmail] = useState("")
  const [newHeadRole, setNewHeadRole] = useState<"CEO" | "CFO" | "COO">("CEO")
  const [isCreatingSociety, setIsCreatingSociety] = useState(false)
  const [isInvitingHead, setIsInvitingHead] = useState(false)
  const [headDetails, setHeadDetails] = useState<{ [userId: string]: { name: string; email: string } }>({})

  // Authentication and Authorization
  useEffect(() => {
    const auth = getAuth(app)

    const loadDashboard = async () => {
      try {
        const { societies, stats, headDetails } = await getDashboardData();
        setSocieties(societies);
        setStats(stats);
        setHeadDetails(headDetails);
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin")
        return
      }

      try {
        const userDoc = await getDoc(doc(firestore, "users", user.uid))
        const userData = userDoc.data()
        const privilege = userData?.privilege ?? 0

        if (privilege < 2) {
          router.push("/waitlist")
          return
        }

        setCurrentUserEmail(user.email || "")
        setIsAuthorized(true)
        await loadDashboard()
      } catch (error) {
        console.error("Error checking authorization:", error)
        router.push("/signin")
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadHeadDetails = async (societiesData: Society[]) => {
    try {
      const headDetailsMap = await getHeadDetails(societiesData);
      setHeadDetails(headDetailsMap)
    } catch (error) {
      console.error("Error loading head details:", error)
    }
  }

  const getHeadCount = (heads: { CEO: string | null; CFO: string | null; COO: string | null }) => {
    return Object.values(heads).filter((id) => id !== null).length
  }

  const handleAddSociety = async () => {
    if (!newSocietyName.trim()) return

    setIsCreatingSociety(true)
    try {
      const newSociety = await addSociety(newSocietyName, currentUserEmail);
      setSocieties([...societies, newSociety]);
      setNewSocietyName("")
      setShowAddSocietyModal(false)
    } catch (error) {
      console.error("Error creating society:", error)
      showToast((error as Error).message, 'error')
    } finally {
      setIsCreatingSociety(false)
    }
  }

  const handleRemoveHead = async (societyId: string, role: "CEO" | "CFO" | "COO") => {
    try {
      const updatedHeads = await removeHead(societyId, role, societies);
      if(updatedHeads) {
        setSocieties(societies.map((soc) => (soc.id === societyId ? { ...soc, heads: updatedHeads } : soc)))
        if (selectedSociety?.id === societyId) {
          setSelectedSociety({ ...selectedSociety, heads: updatedHeads })
        }
      }
    } catch (error) {
      console.error("Error removing head:", error)
      showToast("Failed to remove head. Please try again.", 'error')
    }
  }

  const handleInviteHead = async () => {
    if (!selectedSociety || !newHeadEmail.trim()) return

    setIsInvitingHead(true)
    try {
      const { updatedHeads, headDetails: newHeadDetails, userId } = await inviteHead(selectedSociety, newHeadEmail, newHeadRole, societies);
      
      setSocieties(
        societies.map((soc) => (soc.id === selectedSociety.id ? { ...soc, heads: updatedHeads } : soc)),
      )
      setSelectedSociety({ ...selectedSociety, heads: updatedHeads })

      setHeadDetails({
        ...headDetails,
        [userId]: newHeadDetails,
      })

      setNewHeadEmail("")
      setNewHeadRole("CEO")

      showToast(
        `Successfully assigned ${newHeadDetails.name} as ${newHeadRole} of ${selectedSociety.name}!`,
        'success'
      )
    } catch (error) {
      console.error("Error inviting head:", error)
      showToast((error as Error).message, 'error')
    } finally {
      setIsInvitingHead(false)
    }
  }

  const openManageHeads = async (society: Society) => {
    setSelectedSociety(society)
    setShowManageHeadsModal(true)
    // Refresh head details for this society
    await loadHeadDetails([society])
  }

  const handleLogout = async () => {
    await signOutUser()
    router.push("/signin")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#110205] flex items-center justify-center">
        <div className="glass rounded-lg p-8">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#110205]">
      <ToastContainer />
      {/* Admin Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(17,2,5,0.95)] border-b border-[rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">IEMS Admin Dashboard</h1>
          <Button
            onClick={handleLogout}
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
                          getHeadCount(society.heads) === society.maxHeads
                            ? "bg-[rgba(208,34,67,0.2)] text-[#d02243]"
                            : "bg-[rgba(170,28,55,0.2)] text-[#aa1c37]"
                        }`}
                      >
                        {getHeadCount(society.heads)}/{society.maxHeads}
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
                disabled={isCreatingSociety}
                className="flex-1 bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold disabled:opacity-50"
              >
                {isCreatingSociety ? "Creating..." : "Create"}
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
              {getHeadCount(selectedSociety.heads) === 0 ? (
                <p className="text-[rgba(255,255,255,0.5)] text-sm mb-4">No heads assigned yet.</p>
              ) : (
                <div className="space-y-2 mb-4">
                  {(Object.entries(selectedSociety.heads) as ["CEO" | "CFO" | "COO", string | null][]).map(
                    ([role, headId]) =>
                      headId && (
                        <div
                          key={role}
                          className="flex items-center justify-between bg-[rgba(255,255,255,0.05)] rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <User size={16} className="text-[#d02243]" />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-white font-medium">
                                  {headDetails[headId]?.name || "Loading..."}
                                </p>
                                <span className="px-2 py-0.5 text-xs font-semibold bg-[rgba(208,34,67,0.2)] text-[#d02243] rounded">
                                  {role}
                                </span>
                              </div>
                              <p className="text-xs text-[rgba(255,255,255,0.5)]">
                                {headDetails[headId]?.email || ""}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveHead(selectedSociety.id, role)}
                            className="p-1 hover:bg-[rgba(208,34,67,0.2)] rounded text-[#d02243] transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ),
                  )}
                </div>
              )}
            </div>

            {/* Add New Head */}
            {getHeadCount(selectedSociety.heads) < selectedSociety.maxHeads && (
              <div className="border-t border-[rgba(255,255,255,0.1)] pt-6">
                <h4 className="text-sm font-semibold text-[rgba(255,255,255,0.8)] mb-3">Invite New Head</h4>
                
                {/* Role Selection */}
                <div className="mb-3">
                  <label className="text-xs text-[rgba(255,255,255,0.6)] mb-2 block">Select Role</label>
                  <select
                    value={newHeadRole}
                    onChange={(e) => setNewHeadRole(e.target.value as "CEO" | "CFO" | "COO")}
                    className="w-full px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white focus:outline-none focus:border-[#d02243] focus:bg-[rgba(255,255,255,0.1)]"
                  >
                    <option value="CEO" disabled={selectedSociety.heads.CEO !== null}>
                      CEO (Chief Executive Officer)
                    </option>
                    <option value="CFO" disabled={selectedSociety.heads.CFO !== null}>
                      CFO (Chief Financial Officer)
                    </option>
                    <option value="COO" disabled={selectedSociety.heads.COO !== null}>
                      COO (Chief Operating Officer)
                    </option>
                  </select>
                </div>

                {/* Email Input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="email"
                    placeholder="student@khi.iba.edu.pk"
                    value={newHeadEmail}
                    onChange={(e) => setNewHeadEmail(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.5)] focus:outline-none focus:border-[#d02243] focus:bg-[rgba(255,255,255,0.1)]"
                  />
                  <Button
                    onClick={handleInviteHead}
                    disabled={isInvitingHead || !newHeadEmail.trim()}
                    className="bg-[#d02243] hover:bg-[#aa1c37] text-white font-semibold disabled:opacity-50"
                  >
                    <Mail size={16} className="mr-2" />
                    {isInvitingHead ? "Inviting..." : "Invite"}
                  </Button>
                </div>
                <p className="text-xs text-[rgba(255,255,255,0.5)]">
                  Only IBA Karachi students with @khi.iba.edu.pk email who have already signed up can be assigned as society heads.
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


"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, setDoc, collection, getDocs, updateDoc } from "firebase/firestore"
import { app, firestore } from "../../firebase"
import { Plus, Trash2, User, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { ToastContainer, showToast } from "@/components/ui/toast"
import LoadingScreen from "@/components/loading-screen"
import { ProfileMenu } from "@/components/profile-menu"

interface Society {
  id: string
  name: string
  dateCreated: string
  heads: {
    CEO: string | null
    CFO: string | null
    COO: string | null
  }
  maxHeads: number
}

interface AdminStats {
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

    const loadDashboardData = async () => {
      try {
        // Load societies
        const societiesSnapshot = await getDocs(collection(firestore, "societies"))
        const societiesData: Society[] = []

        societiesSnapshot.forEach((doc) => {
          const data = doc.data()
          societiesData.push({
            id: doc.id,
            name: data.name || "",
            dateCreated: data.dateCreated || "",
            heads: data.heads || { CEO: null, CFO: null, COO: null },
            maxHeads: data.maxHeads || 3,
          })
        })

        setSocieties(societiesData)

        // Load head details
        await loadHeadDetails(societiesData)

        // Load stats
        const usersSnapshot = await getDocs(collection(firestore, "users"))
        setStats({
          totalUsers: usersSnapshot.size,
          totalEvents: 0, // TODO: Implement when events collection exists
          totalSocieties: societiesData.length,
          weeklyTraffic: 0, // TODO: Implement analytics
        })
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
        await loadDashboardData()
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
      const allHeadIds = new Set<string>()

      // Collect all unique head IDs
      societiesData.forEach((society) => {
        Object.values(society.heads).forEach((headId) => {
          if (headId) allHeadIds.add(headId)
        })
      })

      // Fetch user details for all heads
      const headDetailsMap: { [userId: string]: { name: string; email: string } } = {}

      for (const headId of allHeadIds) {
        const userDoc = await getDoc(doc(firestore, "users", headId))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          headDetailsMap[headId] = {
            name: userData.fullName || userData.email?.split("@")[0] || "Unknown",
            email: userData.email || "",
          }
        }
      }

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
      const societyId = newSocietyName.toLowerCase().replace(/\s+/g, "-")

      // Check if society with this ID already exists
      const existingSociety = await getDoc(doc(firestore, "societies", societyId))
      if (existingSociety.exists()) {
        showToast(`A society with the name "${newSocietyName}" already exists. Please choose a different name.`, 'error')
        setIsCreatingSociety(false)
        return
      }

      const newSociety = {
        name: newSocietyName,
        dateCreated: new Date().toISOString(),
        heads: {
          CEO: null,
          CFO: null,
          COO: null,
        },
        maxHeads: 3,
        description: "",
        contactEmail: "",
        socialLinks: {
          facebook: "",
          instagram: "",
          linkedin: "",
        },
        events: [],
        createdBy: currentUserEmail,
      }

      await setDoc(doc(firestore, "societies", societyId), newSociety)

      setSocieties([
        ...societies,
        {
          id: societyId,
          name: newSocietyName,
          dateCreated: new Date().toISOString(),
          heads: {
            CEO: null,
            CFO: null,
            COO: null,
          },
          maxHeads: 3,
        },
      ])

      setNewSocietyName("")
      setShowAddSocietyModal(false)
    } catch (error) {
      console.error("Error creating society:", error)
      showToast("Failed to create society. Please try again.", 'error')
    } finally {
      setIsCreatingSociety(false)
    }
  }

  const handleRemoveHead = async (societyId: string, role: "CEO" | "CFO" | "COO") => {
    try {
      const society = societies.find((s) => s.id === societyId)
      if (!society) return

      const headUserId = society.heads[role]
      if (!headUserId) return

      const updatedHeads = {
        ...society.heads,
        [role]: null,
      }

      // Update Firestore
      await updateDoc(doc(firestore, "societies", societyId), {
        heads: updatedHeads,
      })

      // Update local state
      setSocieties(societies.map((soc) => (soc.id === societyId ? { ...soc, heads: updatedHeads } : soc)))

      // Update selected society if modal is open
      if (selectedSociety?.id === societyId) {
        setSelectedSociety({ ...selectedSociety, heads: updatedHeads })
      }

      // Reset user privilege to 0 (normal user)
      await updateDoc(doc(firestore, "users", headUserId), {
        privilege: 0,
        societyRole: null,
        societyId: null,
      })
    } catch (error) {
      console.error("Error removing head:", error)
      showToast("Failed to remove head. Please try again.", 'error')
    }
  }

  const handleInviteHead = async () => {
    if (!selectedSociety || !newHeadEmail.trim()) return

    // Validate email domain
    if (!newHeadEmail.endsWith("@khi.iba.edu.pk")) {
      showToast("Only IBA Karachi email addresses (@khi.iba.edu.pk) are allowed.", 'error')
      return
    }

    // Check if role is already taken
    if (selectedSociety.heads[newHeadRole]) {
      showToast(`${newHeadRole} role is already assigned. Please choose a different role.`, 'error')
      return
    }

    setIsInvitingHead(true)
    try {
      // Find user by email
      const usersSnapshot = await getDocs(collection(firestore, "users"))
      const userDoc = usersSnapshot.docs.find((doc) => doc.data().email === newHeadEmail)

      if (!userDoc) {
        showToast("User not found. They must sign up first with their @khi.iba.edu.pk email address.", 'error')
        setIsInvitingHead(false)
        return
      }

      const userData = userDoc.data()

      // Check if user email is verified
      if (!userData.emailVerified) {
        showToast("This user has not verified their email address yet. They must verify their email before being assigned as a society head.", 'error')
        setIsInvitingHead(false)
        return
      }

      // Check if user is already a head of another society
      if (userData.privilege === 1 && userData.societyId) {
        const currentSociety = societies.find((s) => s.id === userData.societyId)
        const currentSocietyName = currentSociety?.name || "another society"
        showToast(`This user is already a ${userData.societyRole || "head"} of ${currentSocietyName}. A user can only be a head of one society at a time.`, 'error')
        setIsInvitingHead(false)
        return
      }

      // Check if user is already a head in this society
      const isAlreadyHead = Object.values(selectedSociety.heads).includes(userDoc.id)
      if (isAlreadyHead) {
        showToast("This user is already a head in this society.", 'error')
        setIsInvitingHead(false)
        return
      }

      // Update user privilege to 1 (society head)
      await updateDoc(doc(firestore, "users", userDoc.id), {
        privilege: 1,
        societyRole: newHeadRole,
        societyId: selectedSociety.id,
      })

      const updatedHeads = {
        ...selectedSociety.heads,
        [newHeadRole]: userDoc.id,
      }

      // Update society in Firestore
      await updateDoc(doc(firestore, "societies", selectedSociety.id), {
        heads: updatedHeads,
      })

      // Update local state
      setSocieties(
        societies.map((soc) => (soc.id === selectedSociety.id ? { ...soc, heads: updatedHeads } : soc)),
      )
      setSelectedSociety({ ...selectedSociety, heads: updatedHeads })

      // Update head details cache
      setHeadDetails({
        ...headDetails,
        [userDoc.id]: {
          name: userData.fullName || newHeadEmail.split("@")[0],
          email: newHeadEmail,
        },
      })

      setNewHeadEmail("")
      setNewHeadRole("CEO")

      showToast(
        `Successfully assigned ${userData.fullName || newHeadEmail} as ${newHeadRole} of ${selectedSociety.name}!`,
        'success'
      )
    } catch (error) {
      console.error("Error inviting head:", error)
      showToast("Failed to assign society head. Please try again.", 'error')
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

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <ToastContainer />
      {/* Admin Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/95 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">IEMS Admin Dashboard</h1>
          <ProfileMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Admin Stats Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass rounded-lg p-6">
            <div className="text-muted-foreground text-sm mb-2">Total Users</div>
            <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
          </div>
          <div className="glass rounded-lg p-6">
            <div className="text-muted-foreground text-sm mb-2">Active Events</div>
            <div className="text-3xl font-bold text-white">{stats.totalEvents}</div>
          </div>
          <div className="glass rounded-lg p-6">
            <div className="text-muted-foreground text-sm mb-2">Total Societies</div>
            <div className="text-3xl font-bold text-white">{stats.totalSocieties}</div>
          </div>
          <div className="glass rounded-lg p-6">
            <div className="text-muted-foreground text-sm mb-2">Weekly Traffic</div>
            <div className="text-3xl font-bold text-white">{stats.weeklyTraffic}</div>
          </div>
        </div>

        {/* Society Management Panel */}
        <div className="glass rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Society Management</h2>
            <Button
              onClick={() => setShowAddSocietyModal(true)}
              className="glow-button text-white font-semibold"
            >
              <Plus size={18} className="mr-2" />
              Add New Society
            </Button>
          </div>

          {/* Societies Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">
                    Society Name
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">
                    Date Created
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">
                    Heads Assigned
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {societies.map((society) => (
                  <tr
                    key={society.id}
                    className="border-b border-border/50 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4 text-white font-medium">{society.name}</td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {new Date(society.dateCreated).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          getHeadCount(society.heads) === society.maxHeads
                            ? "bg-primary/20 text-primary"
                            : "bg-primary/10 text-primary/70"
                        }`}
                      >
                        {getHeadCount(society.heads)}/{society.maxHeads}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        onClick={() => openManageHeads(society)}
                        className="bg-primary/20 text-primary hover:bg-primary/30 text-sm font-medium"
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
              className="w-full px-4 py-2 rounded-lg bg-input border border-border text-white placeholder-muted-foreground focus:outline-none focus:border-ring focus:bg-input mb-4"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddSocietyModal(false)}
                variant="ghost"
                className="flex-1 text-muted-foreground hover:text-white hover:bg-accent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSociety}
                disabled={isCreatingSociety}
                className="flex-1 glow-button text-white font-semibold disabled:opacity-50"
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
            <p className="text-muted-foreground text-sm mb-6">
              Maximum {selectedSociety.maxHeads} head slots available
            </p>

            {/* Current Heads */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">Current Heads</h4>
              {getHeadCount(selectedSociety.heads) === 0 ? (
                <p className="text-muted-foreground text-sm mb-4">No heads assigned yet.</p>
              ) : (
                <div className="space-y-2 mb-4">
                  {(Object.entries(selectedSociety.heads) as ["CEO" | "CFO" | "COO", string | null][]).map(
                    ([role, headId]) =>
                      headId && (
                        <div
                          key={role}
                          className="flex items-center justify-between bg-card rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <User size={16} className="text-primary" />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-white font-medium">
                                  {headDetails[headId]?.name || "..."}
                                </p>
                                <span className="px-2 py-0.5 text-xs font-semibold bg-primary/20 text-primary rounded">
                                  {role}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {headDetails[headId]?.email || ""}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveHead(selectedSociety.id, role)}
                            className="p-1 hover:bg-primary/20 rounded text-destructive transition-colors"
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
              <div className="border-t border-border pt-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Invite New Head</h4>
                
                {/* Role Selection */}
                <div className="mb-3">
                  <label className="text-xs text-muted-foreground mb-2 block">Select Role</label>
                  <Select
                    value={newHeadRole}
                    onChange={(value) => setNewHeadRole(value as "CEO" | "CFO" | "COO")}
                    options={[
                      {
                        value: "CEO",
                        label: "CEO (Chief Executive Officer)",
                        disabled: selectedSociety.heads.CEO !== null
                      },
                      {
                        value: "CFO",
                        label: "CFO (Chief Financial Officer)",
                        disabled: selectedSociety.heads.CFO !== null
                      },
                      {
                        value: "COO",
                        label: "COO (Chief Operating Officer)",
                        disabled: selectedSociety.heads.COO !== null
                      }
                    ]}
                    placeholder="Select a role"
                  />
                </div>

                {/* Email Input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="email"
                    placeholder="student@khi.iba.edu.pk"
                    value={newHeadEmail}
                    onChange={(e) => setNewHeadEmail(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg bg-input border border-border text-white placeholder-muted-foreground focus:outline-none focus:border-ring focus:bg-input"
                  />
                  <Button
                    onClick={handleInviteHead}
                    disabled={isInvitingHead || !newHeadEmail.trim()}
                    className="glow-button text-white font-semibold disabled:opacity-50"
                  >
                    <Mail size={16} className="mr-2" />
                    {isInvitingHead ? "Inviting..." : "Invite"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Only IBA Karachi students with @khi.iba.edu.pk email who have already signed up can be assigned as society heads.
                </p>
              </div>
            )}

            {/* Close Button */}
            <div className="border-t border-border pt-6 mt-6">
              <Button
                onClick={() => setShowManageHeadsModal(false)}
                variant="ghost"
                className="w-full text-muted-foreground hover:text-white hover:bg-accent"
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


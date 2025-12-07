"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { firestore, auth } from "@/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProfileMenu } from "@/components/profile-menu"

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin")
        return
      }

      // Users can only view their own profile
      if (user.uid !== userId) {
        setError("You can only view your own profile")
        setLoading(false)
        return
      }

      try {
        const userDoc = await getDoc(doc(firestore, "users", userId))
        
        if (!userDoc.exists()) {
          setError("User not found")
          setLoading(false)
          return
        }

        setUserData({
          id: userDoc.id,
          ...userDoc.data()
        })
        setLoading(false)
      } catch (err) {
        console.error("Error fetching user:", err)
        setError("Failed to load user data")
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [userId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading profile data...</div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-foreground text-2xl mb-4">Error: {error || "User not found"}</h1>
          <Link href="/" className="text-primary hover:text-secondary">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/95 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
          <h1 className="text-white text-xl font-semibold">User Profile</h1>
          <ProfileMenu />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="glass rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            {(userData.fullName as string) || "User Profile"}
          </h2>
          
          <div className="mb-6">
            <p className="text-muted-foreground mb-4">
              This page is under development. Below is the raw user data:
            </p>
          </div>

          {/* JSON Dump */}
          <div className="bg-card rounded-lg p-6 overflow-auto border border-border">
            <pre className="text-foreground text-sm font-mono whitespace-pre-wrap">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-muted-foreground text-sm">
              <strong className="text-white">Note:</strong> The full user profile page will be implemented by the development team. 
              This temporary view shows the raw data structure.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

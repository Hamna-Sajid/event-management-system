"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { firestore, auth } from "@/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SocietyProfilePage() {
  const params = useParams()
  const router = useRouter()
  const societyId = params.id as string
  const [societyData, setSocietyData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin")
        return
      }

      try {
        const societyDoc = await getDoc(doc(firestore, "societies", societyId))
        
        if (!societyDoc.exists()) {
          setError("Society not found")
          setLoading(false)
          return
        }

        setSocietyData({
          id: societyDoc.id,
          ...societyDoc.data()
        })
        setLoading(false)
      } catch (err) {
        console.error("Error fetching society:", err)
        setError("Failed to load society data")
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [societyId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#110205] flex items-center justify-center">
        <div className="text-white text-xl">Loading society data...</div>
      </div>
    )
  }

  if (error || !societyData) {
    return (
      <div className="min-h-screen bg-[#110205] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl mb-4">Error: {error || "Society not found"}</h1>
          <Link href="/" className="text-[#d02243] hover:text-[#aa1c37]">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#110205]">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(17,2,5,0.8)] border-b border-[rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[rgba(255,255,255,0.7)] hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
          <h1 className="text-white text-xl font-semibold">Society Profile</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="glass rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            {(societyData.name as string) || "Society Profile"}
          </h2>
          
          <div className="mb-6">
            <p className="text-[rgba(255,255,255,0.6)] mb-4">
              This page is under development. Below is the raw society data:
            </p>
          </div>

          {/* JSON Dump */}
          <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-6 overflow-auto">
            <pre className="text-[rgba(255,255,255,0.8)] text-sm font-mono whitespace-pre-wrap">
              {JSON.stringify(societyData, null, 2)}
            </pre>
          </div>

          <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.1)]">
            <p className="text-[rgba(255,255,255,0.6)] text-sm">
              <strong className="text-white">Note:</strong> The full society profile page will be implemented by the development team. 
              This temporary view shows the raw data structure.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { app, firestore } from '../../firebase'
import { CheckCircle2, Mail, Bell, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WaitlistThankYou() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth(app)
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/signin')
        return
      }

      try {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(firestore, 'users', user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUserName(userData.fullName || user.email?.split('@')[0] || 'there')
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        setUserName(user.email?.split('@')[0] || 'there')
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass rounded-lg p-8">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Success Card */}
        <div className="glass rounded-xl p-8 md:p-12 space-y-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <CheckCircle2 className="text-white" size={40} />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Hey {userName}!
            </h1>
            <p className="text-lg text-muted-foreground">
              You&apos;re on the Waitlist
            </p>
            <p className="text-sm text-muted-foreground/80">
              Thank you for joining the IBA Event Management System
            </p>
          </div>

          {/* What Happens Next */}
          <div className="space-y-6 text-left">
            <h2 className="text-xl font-semibold text-white text-center">
              What happens next?
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Check Your Email</h3>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ve sent a verification email to confirm your account.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Bell className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Stay Tuned</h3>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll be notified via email when the platform launches.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Early Access</h3>
                  <p className="text-sm text-muted-foreground">
                    As a waitlist member, You&apos;ll get early access to all features.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Badge */}
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Coming Soon:</span> Discover events, 
              manage societies, and connect with the IBA community all in one place.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Link href="/">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto text-muted-foreground/80"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[rgba(255,255,255,0.5)]">
            Questions? Contact us at{' '}
            <a 
              href="mailto:support@iems.edu.pk" 
              className="text-primary hover:text-secondary transition-colors"
            >
              support@iems.edu.pk
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}


'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { app, firestore } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { Eye, EyeOff } from 'lucide-react'

export default function SignIn() {
  const auth = getAuth(app)
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      
      // Get user privilege from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', userCredential.user.uid))
      const userData = userDoc.data()
      const privilege = userData?.privilege ?? 0
      
      // Route based on privilege level
      if (privilege >= 2) {
        // Admin: Route to admin dashboard
        router.push('/admin')
      } else if (privilege === 1) {
        // Society Head: Route to their society page
        const societyId = userData?.societyId
        if (societyId) {
          router.push(`/societies/${societyId}`)
        } else {
          // Fallback if societyId is missing, though it should exist for privilege 1
          router.push('/waitlist') 
        }
      } else {
        // Normal user: Route to waitlist page
        router.push('/waitlist')
      }
    } catch (err) {
      const error = err as { message?: string }
      setError(error.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Central Glassmorphic Card */}
      <div className="w-full max-w-md glass rounded-xl p-8 space-y-8">
        {/* Logo and Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-electric-blue to-magenta flex items-center justify-center">
            <span className="text-white font-bold text-2xl">IE</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your IEMS account</p>
          </div>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-white placeholder-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-all"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:text-secondary transition-colors font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 glow-button disabled:opacity-50 rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-[rgba(255,255,255,0.6)]">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:text-secondary font-semibold transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


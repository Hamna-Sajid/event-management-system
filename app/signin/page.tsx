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
        // Admin: Route to create society
        router.push('/create-society')
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
    <div className="min-h-screen bg-[#110205] flex items-center justify-center p-4">
      {/* Central Glassmorphic Card */}
      <div className="w-full max-w-md glass rounded-xl p-8 space-y-8">
        {/* Logo and Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#d02243] to-[#84162b] flex items-center justify-center">
            <span className="text-white font-bold text-2xl">IE</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-[rgba(255,255,255,0.6)]">Sign in to your IEMS account</p>
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
              className="w-full px-4 py-2.5 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#d02243] focus:ring-1 focus:ring-[#d02243] transition-all"
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
                className="w-full px-4 py-2.5 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#d02243] focus:ring-1 focus:ring-[#d02243] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-[#d02243] hover:text-[#aa1c37] transition-colors font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#d02243] hover:bg-[#aa1c37] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-[rgba(255,255,255,0.6)]">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#d02243] hover:text-[#aa1c37] font-semibold transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


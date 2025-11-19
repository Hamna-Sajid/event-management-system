'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendPasswordResetLink } from '../../lib/firebase_functions/auth'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)
    
    try {
      await sendPasswordResetLink(email);
      setSuccess(true)
      setEmail('')
    } catch (err) {
      const error = err as { code?: string; message?: string }
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address.')
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else {
        setError(error.message || 'An error occurred')
      }
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
            <Mail className="text-white" size={24} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-[rgba(255,255,255,0.6)]">
              Enter your email and we&apos;ll send you a link to reset your password
            </p>
          </div>
        </div>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Success Message */}
          {success && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
              <p className="text-sm text-green-400 font-medium mb-1">
                Password reset email sent!
              </p>
              <p className="text-xs text-green-400/80">
                Check your inbox and follow the instructions to reset your password.
              </p>
            </div>
          )}

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#d02243] focus:ring-1 focus:ring-[#d02243] transition-all"
            />
          </div>

          {/* Send Reset Link Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#d02243] hover:bg-[#aa1c37] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Back to Sign In Link */}
        <div className="text-center">
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 text-[rgba(255,255,255,0.6)] hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

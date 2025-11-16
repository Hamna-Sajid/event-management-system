'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth, onAuthStateChanged, sendEmailVerification } from 'firebase/auth'
import { app } from '../../firebase'
import { Mail, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'

export default function VerifyEmail() {
  const auth = getAuth(app)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // No user logged in, redirect to signup
        router.push('/signup')
      } else {
        setUserEmail(user.email || '')
        setIsVerified(user.emailVerified)
        
        if (user.emailVerified) {
          // Email already verified, redirect to create society
          setTimeout(() => {
            router.push('/create-society')
          }, 2000)
        }
      }
    })

    return () => unsubscribe()
  }, [auth, router])

  const handleResendEmail = async () => {
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const user = auth.currentUser
      if (user) {
        await sendEmailVerification(user)
        setSuccess('Verification email sent! Please check your inbox.')
      }
    } catch (err) {
      const error = err as { code?: string; message?: string }
      if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait a few minutes before trying again.')
      } else {
        setError(error.message || 'An error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckVerification = async () => {
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const user = auth.currentUser
      if (user) {
        await user.reload()
        if (user.emailVerified) {
          setIsVerified(true)
          setSuccess('Email verified successfully! Redirecting...')
          setTimeout(() => {
            router.push('/create-society')
          }, 2000)
        } else {
          setError('Email not verified yet. Please check your inbox and click the verification link.')
        }
      }
    } catch (err) {
      const error = err as { message?: string }
      setError(error.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-[#110205] flex items-center justify-center p-4">
        <div className="w-full max-w-md glass rounded-xl p-8 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <CheckCircle2 className="text-white" size={28} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-2">Email Verified!</h1>
              <p className="text-[rgba(255,255,255,0.6)]">
                Redirecting you to complete your profile...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#110205] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass rounded-xl p-8 space-y-6">
        {/* Logo and Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#d02243] to-[#84162b] flex items-center justify-center">
            <Mail className="text-white" size={24} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
            <p className="text-[rgba(255,255,255,0.6)] text-sm">
              We&apos;ve sent a verification email to
            </p>
            <p className="text-white font-medium mt-1">{userEmail}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-4">
          <ol className="space-y-2 text-sm text-[rgba(255,255,255,0.8)]">
            <li className="flex gap-2">
              <span className="text-[#d02243] font-bold">1.</span>
              <span>Check your email inbox (and spam folder)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#d02243] font-bold">2.</span>
              <span>Click the verification link in the email</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#d02243] font-bold">3.</span>
              <span>Return to this page and click &quot;I&apos;ve Verified My Email&quot;</span>
            </li>
          </ol>
        </div>

        {/* Success Message */}
        {success && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 flex items-start gap-2">
            <CheckCircle2 size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 flex items-start gap-2">
            <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCheckVerification}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#d02243] hover:bg-[#aa1c37] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'Checking...' : "I've Verified My Email"}
          </button>

          <button
            onClick={handleResendEmail}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.15)] disabled:opacity-50 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            {isLoading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-[rgba(255,255,255,0.5)]">
            Didn&apos;t receive the email? Check your spam folder or click resend.
          </p>
        </div>
      </div>
    </div>
  )
}


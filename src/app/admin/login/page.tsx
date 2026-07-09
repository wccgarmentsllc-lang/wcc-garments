'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Eye, EyeOff, Lock, Mail, ShieldAlert } from 'lucide-react'
import { useAdmin } from '@/context/AdminContext'

export default function AdminLoginPage() {
  const router = useRouter()
  // AdminContext is now only used for logout inside the dashboard.
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.success) {
        // HttpOnly cookie is automatically set by the server response
        router.push('/admin')
      } else {
        setError(data.error || 'Invalid credential configuration')
      }
    } catch {
      setError('Administrative portal network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black p-6 overflow-hidden select-none">
      {/* Background Ambient Mesh Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Soft Golden Outer Card Shadow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/30 via-gold/10 to-gold/30 rounded-2xl blur-xl opacity-30" />

        <div className="relative border border-white/10 bg-neutral-950/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl">
          {/* Brand Identity */}
          <div className="text-center">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-gold/80 block mb-2">
              B2B Administration
            </span>
            <h1 className="font-display text-3xl font-extrabold text-white tracking-tight uppercase">
              WCC <span className="text-gold font-medium">Fashions</span>
            </h1>
            <p className="mt-2 text-xs text-neutral-500 font-mono">
              Sign in to WCC administrative interface
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Corporate Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-white/10 bg-white/5 pl-11 pr-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all font-mono rounded-lg"
                  placeholder="Enter corporate email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Security Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-white/10 bg-white/5 pl-11 pr-12 py-3.5 text-sm text-white placeholder-neutral-600 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all font-mono rounded-lg"
                  placeholder=""
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/25 p-3 text-xs text-red-400 font-sans"
              >
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="relative flex w-full items-center justify-center gap-2 bg-gradient-to-r from-gold via-yellow-600 to-gold py-3.5 text-[11px] font-bold uppercase tracking-widest text-black hover:opacity-90 disabled:opacity-50 transition-all duration-300 rounded-lg shadow-lg font-mono"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Verifying Node...</span>
                </>
              ) : (
                <span>Access Dashboard</span>
              )}
            </button>
          </form>

          {/* Fallback Hints */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <span className="font-mono text-[9px] text-neutral-600 block">
              AUTHORIZED ACCESS ONLY • WCC FASHIONS SYSTEM
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

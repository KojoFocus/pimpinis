'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email: 'admin@pimpinis.com',
      password,
    })

    if (error) {
      setError('Wrong password. Try again.')
      setLoading(false)
      return
    }

    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-[#1A1208]">Pimpinis</h1>
          <p className="text-[#8C7B6A] text-sm mt-1 tracking-wide">Admin Access</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-xl border border-black/8 p-8 space-y-5 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-[#1A1208]">
              Password
            </label>
            <input
              type="password"
              autoFocus
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C4873A] bg-white"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C4873A] hover:bg-[#7A4F2D] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 text-sm tracking-wide"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

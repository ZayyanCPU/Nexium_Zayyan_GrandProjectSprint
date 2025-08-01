'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { Mail, Loader2, ChefHat, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export function AuthForm() {
  const { supabase } = useSupabase()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      setMessage('Check your email for the magic link!')
      toast.success('Magic link sent to your email!')
    } catch (error: any) {
      console.error('Error sending magic link:', error)
      toast.error(error.message || 'Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-100 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-gradient rounded-full mb-4">
            <ChefHat className="text-white text-xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome to Recipe Generator
          </h2>
          <p className="text-gray-600">
            Enter your email to receive a magic link and start creating delicious recipes
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="input-field pl-12"
                disabled={loading}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center py-4 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-3" />
                Sending Magic Link...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-3" />
                Send Magic Link
              </>
            )}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Sparkles className="text-green-600 text-sm" />
              </div>
              <p className="text-green-800 font-medium">{message}</p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span>No password required</span>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Just click the link in your email to sign in and start cooking!
          </p>
        </div>
      </div>
    </div>
  )
} 
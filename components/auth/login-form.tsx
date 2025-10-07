'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToast } from '@/components/ui/use-toast'
import { Mail, Lock, Chrome } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      })
    } catch (error: any) {
      console.error('Login error:', error)
      toast({
        title: 'Login failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with Google.',
      })
    } catch (error: any) {
      console.error('Google login error:', error)
      toast({
        title: 'Google login failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          width: '100%',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontWeight: '500',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          transition: 'all var(--transition)'
        }}
        onMouseOver={(e) => !loading && (e.currentTarget.style.background = 'var(--bg)')}
        onMouseOut={(e) => !loading && (e.currentTarget.style.background = 'var(--surface)')}
      >
        {loading ? (
          <div className="loading-spinner" style={{ width: '20px', height: '20px' }} />
        ) : (
          <>
            <Chrome className="w-5 h-5" />
            Continue with Google
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" style={{ borderColor: 'var(--border)' }} />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 text-sm" style={{ background: 'var(--surface)', color: 'var(--text-secondary)' }}>
            Or continue with email
          </span>
        </div>
      </div>

      {/* Email Login Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '2.5rem', height: '48px' }}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '2.5rem', height: '48px' }}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          style={{
            width: '100%',
            height: '48px',
            background: loading || !email || !password ? 'var(--text-secondary)' : 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            fontWeight: '500',
            cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseOver={(e) => {
            if (!loading && email && password) {
              e.currentTarget.style.background = 'var(--primary-600)'
            }
          }}
          onMouseOut={(e) => {
            if (!loading && email && password) {
              e.currentTarget.style.background = 'var(--primary)'
            }
          }}
        >
          {loading ? (
            <div className="loading-spinner" style={{ 
              width: '20px', 
              height: '20px',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              borderTopColor: 'white'
            }} />
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Forgot Password */}
      <div className="text-center">
        <button 
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            cursor: 'pointer',
            textDecoration: 'underline',
            transition: 'color var(--transition)'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          Forgot your password?
        </button>
      </div>
    </div>
  )
}

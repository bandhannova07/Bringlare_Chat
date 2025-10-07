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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
          background: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          color: '#374151',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => !loading && (e.target.style.background = '#f9fafb')}
        onMouseOut={(e) => !loading && (e.target.style.background = 'white')}
      >
        {loading ? (
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #d1d5db',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        ) : (
          <>
            <Chrome style={{ width: '20px', height: '20px' }} />
            Continue with Google
          </>
        )}
      </button>

      {/* Divider */}
      <div style={{ position: 'relative', margin: '1.5rem 0' }}>
        <div style={{
          position: 'absolute',
          inset: '0',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{
            width: '100%',
            borderTop: '1px solid #d1d5db'
          }} />
        </div>
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          fontSize: '0.875rem'
        }}>
          <span style={{
            padding: '0 0.5rem',
            background: 'white',
            color: '#6b7280'
          }}>
            Or continue with email
          </span>
        </div>
      </div>

      {/* Email Login Form */}
      <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Mail style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              width: '20px',
              height: '20px'
            }} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                height: '48px',
                paddingLeft: '40px',
                paddingRight: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              required
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              width: '20px',
              height: '20px'
            }} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                height: '48px',
                paddingLeft: '40px',
                paddingRight: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
            background: loading || !email || !password ? '#9ca3af' : '#075e54',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseOver={(e) => {
            if (!loading && email && password) {
              e.target.style.background = '#128c7e'
            }
          }}
          onMouseOut={(e) => {
            if (!loading && email && password) {
              e.target.style.background = '#075e54'
            }
          }}
        >
          {loading ? (
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Forgot Password */}
      <div style={{ textAlign: 'center' }}>
        <button style={{
          background: 'none',
          border: 'none',
          fontSize: '0.875rem',
          color: '#6b7280',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}
        onMouseOver={(e) => e.target.style.color = '#075e54'}
        onMouseOut={(e) => e.target.style.color = '#6b7280'}
        >
          Forgot your password?
        </button>
      </div>
    </div>
  )
}

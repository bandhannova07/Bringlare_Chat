'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { LoginForm } from './login-form'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [mounted, setMounted] = useState(false)
  const { user, loading } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
        <div className="animate-spin" style={{
          width: '4rem',
          height: '4rem',
          border: '4px solid rgba(255, 255, 255, 0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%'
        }} />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-primary)' }}>
        <div className="w-full max-w-md">
          <div className="card animate-fadeIn" style={{ padding: '2rem' }}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                💬 Bringlare Chat
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Connect with friends and family instantly
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

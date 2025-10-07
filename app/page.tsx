'use client'

import dynamic from 'next/dynamic'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const AuthGuard = dynamic(() => import('@/components/auth/auth-guard').then(mod => ({ default: mod.AuthGuard })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
})

const ChatLayout = dynamic(() => import('@/components/chat/chat-layout').then(mod => ({ default: mod.ChatLayout })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
})

export default function HomePage() {
  return (
    <AuthGuard>
      <ChatLayout />
    </AuthGuard>
  )
}

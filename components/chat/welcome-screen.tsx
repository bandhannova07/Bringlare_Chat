'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Users, Shield, Smartphone } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

export function WelcomeScreen() {
  const { user } = useAuth()

  const features = [
    {
      icon: MessageCircle,
      title: 'Start Messaging',
      description: 'Send messages, photos, videos, and files to your contacts',
    },
    {
      icon: Users,
      title: 'Create Groups',
      description: 'Start group conversations with multiple people',
    },
    {
      icon: Shield,
      title: 'Stay Secure',
      description: 'Your messages are protected with end-to-end encryption',
    },
    {
      icon: Smartphone,
      title: 'Cross Platform',
      description: 'Access your chats from any device, anywhere',
    },
  ]

  return (
    <div className="flex-1 flex items-center justify-center p-8" style={{ background: 'var(--bg)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        {/* Welcome Header */}
        <div className="mb-12">
          <div 
            style={{ 
              width: '96px',
              height: '96px',
              background: 'var(--primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              boxShadow: 'var(--shadow-lg)',
              animation: 'bounce 2s infinite'
            }}
          >
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Welcome to Bringlare Chat, {user?.display_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Select a chat from the sidebar to start messaging, or create a new conversation
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{
                background: 'var(--surface)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition)',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              }}
            >
              <div 
                style={{ 
                  width: '48px',
                  height: '48px',
                  background: `rgba(79, 70, 229, 0.1)`,
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <feature.icon className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ 
            background: `rgba(16, 185, 129, 0.05)`,
            border: `1px solid rgba(16, 185, 129, 0.2)`,
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}
        >
          <p className="text-sm m-0" style={{ color: 'var(--text-primary)' }}>
            💡 <strong style={{ color: 'var(--accent)' }}>Tip:</strong> Use the search bar in the sidebar to find contacts and start new conversations
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

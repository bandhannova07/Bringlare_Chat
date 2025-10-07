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
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      padding: '2rem'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: 'center',
          maxWidth: '600px',
          padding: '2rem'
        }}
      >
        {/* Welcome Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{
            width: '96px',
            height: '96px',
            background: 'linear-gradient(135deg, #075e54 0%, #25d366 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            boxShadow: '0 10px 25px rgba(7, 94, 84, 0.3)'
          }}>
            <MessageCircle style={{ width: '48px', height: '48px', color: 'white' }} />
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Welcome to Bringlare Chat, {user?.display_name?.split(' ')[0]}! 👋
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            lineHeight: '1.6'
          }}>
            Select a chat from the sidebar to start messaging, or create a new conversation
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{
                background: 'rgba(7, 94, 84, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                display: 'inline-block',
                marginBottom: '1rem'
              }}>
                <feature.icon style={{ width: '24px', height: '24px', color: '#075e54' }} />
              </div>
              <h3 style={{
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem',
                fontSize: '1.1rem'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
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
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}
        >
          <p style={{
            fontSize: '0.875rem',
            color: '#374151',
            margin: 0
          }}>
            💡 <strong>Tip:</strong> Use the search bar in the sidebar to find contacts and start new conversations
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

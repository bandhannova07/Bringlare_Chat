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
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl px-8"
      >
        {/* Welcome Header */}
        <div className="mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-chat-primary to-chat-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Bringlare Chat, {user?.display_name?.split(' ')[0]}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
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
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="bg-chat-primary/10 p-3 rounded-lg inline-block mb-4">
                <feature.icon className="w-6 h-6 text-chat-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
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
          className="text-gray-500 dark:text-gray-400"
        >
          <p className="text-sm">
            💡 <strong>Tip:</strong> Use the search bar in the sidebar to find contacts and start new conversations
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

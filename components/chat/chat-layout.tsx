'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './sidebar'
import { ChatWindow } from './chat-window'
import { WelcomeScreen } from './welcome-screen'
import { useAuth } from '@/components/providers/auth-provider'
import { dbHelpers, Chat } from '@/lib/supabase'

export function ChatLayout() {
  const { user } = useAuth()
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [chats, setChats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadChats = async () => {
      try {
        const userChats = await dbHelpers.getUserChats(user.id)
        setChats(userChats || [])
      } catch (error) {
        console.error('Error loading chats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadChats()
  }, [user])

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId)
  }

  const handleNewChat = (chat: any) => {
    setChats(prev => [chat, ...prev])
    setSelectedChatId(chat.chats.id)
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="sidebar"
      >
        <Sidebar
          chats={chats}
          selectedChatId={selectedChatId}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
          loading={loading}
        />
      </motion.div>

      {/* Main Chat Area */}
      <div className="main-chat">
        {selectedChatId ? (
          <ChatWindow
            chatId={selectedChatId}
            onBack={() => setSelectedChatId(null)}
          />
        ) : (
          <WelcomeScreen />
        )}
      </div>
    </div>
  )
}

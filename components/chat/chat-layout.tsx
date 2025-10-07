'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AdvancedSidebar } from './advanced-sidebar'
import { AdvancedChatWindow } from './advanced-chat-window'
import { WelcomeScreen } from './welcome-screen'
import { MobileHeader } from './mobile-header'
import { useAuth } from '@/components/providers/auth-provider'

export function ChatLayout() {
  const { user } = useAuth()
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [selectedChatName, setSelectedChatName] = useState('')
  const [selectedChatOnline, setSelectedChatOnline] = useState(false)

  // Mock chat data for selected chat
  const mockChats = {
    '1': { name: 'Alice Johnson', isOnline: true, lastSeen: null },
    '2': { name: 'Bob Smith', isOnline: false, lastSeen: '2 hours ago' },
    '3': { name: 'Team Alpha', isOnline: false, lastSeen: '1 hour ago' },
    '4': { name: 'Sarah Wilson', isOnline: true, lastSeen: null },
    '5': { name: 'Project Discussion', isOnline: false, lastSeen: '1 day ago' }
  }

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId)
    const chatData = mockChats[chatId as keyof typeof mockChats]
    if (chatData) {
      setSelectedChatName(chatData.name)
      setSelectedChatOnline(chatData.isOnline)
    }
    setIsMobileSidebarOpen(false)
  }

  const handleNewChat = () => {
    // Handle new chat creation
    console.log('Create new chat')
  }

  const handleMobileMenuClick = () => {
    setIsMobileSidebarOpen(true)
  }

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false)
  }

  const handleBackToChats = () => {
    setSelectedChatId(null)
    setSelectedChatName('')
  }

  return (
    <div className="app-shell">
      {/* Mobile Header - Only shown when chat is selected on mobile */}
      {selectedChatId && (
        <MobileHeader
          onMenuClick={handleMobileMenuClick}
          title={selectedChatName}
          subtitle={selectedChatOnline ? 'Online' : 'Offline'}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="sidebar"
      >
        <AdvancedSidebar
          selectedChatId={selectedChatId}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={handleMobileSidebarClose}
        />
      </motion.div>

      {/* Main Chat Area */}
      <div className="main-chat">
        {selectedChatId ? (
          <AdvancedChatWindow
            chatId={selectedChatId}
            contactName={selectedChatName}
            isOnline={selectedChatOnline}
            lastSeen={mockChats[selectedChatId as keyof typeof mockChats]?.lastSeen || undefined}
            onBack={handleBackToChats}
          />
        ) : (
          <>
            {/* Mobile Header for Welcome Screen */}
            <div className="md:hidden">
              <MobileHeader
                onMenuClick={handleMobileMenuClick}
                title="Bringlare Chat"
                subtitle={`Welcome, ${user?.display_name?.split(' ')[0]}!`}
              />
            </div>
            <WelcomeScreen />
          </>
        )}
      </div>
    </div>
  )
}

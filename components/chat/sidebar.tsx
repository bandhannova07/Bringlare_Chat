'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Settings, Moon, Sun, LogOut, Users, MessageCircle } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ChatItem } from './chat-item'
import { NewChatDialog } from './new-chat-dialog'
import { UserProfileDialog } from './user-profile-dialog'
import { formatTimestamp } from '@/lib/utils'

interface SidebarProps {
  chats: any[]
  selectedChatId: string | null
  onChatSelect: (chatId: string) => void
  onNewChat: (chat: any) => void
  loading: boolean
}

export function Sidebar({ chats, selectedChatId, onChatSelect, onNewChat, loading }: SidebarProps) {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [filteredChats, setFilteredChats] = useState(chats)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChats(chats)
    } else {
      const filtered = chats.filter(chat => {
        const chatName = chat.chats?.name || 'Direct Message'
        return chatName.toLowerCase().includes(searchQuery.toLowerCase())
      })
      setFilteredChats(filtered)
    }
  }, [chats, searchQuery])

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!user) return null

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar 
                className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-chat-primary transition-all"
                onClick={() => setShowProfileDialog(true)}
              >
                <AvatarImage src={user.photo_url || ''} alt={user.display_name} />
                <AvatarFallback className="bg-chat-primary text-white">
                  {user.display_name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 dark:text-white truncate">
                  {user.display_name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user.status_message}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeToggle}
                className="w-8 h-8"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProfileDialog(true)}
                className="w-8 h-8"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="w-8 h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-gray-700 border-0"
            />
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Button
            onClick={() => setShowNewChatDialog(true)}
            variant="chat"
            className="w-full justify-start"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {searchQuery ? 'No chats found' : 'No chats yet'}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                {searchQuery ? 'Try a different search term' : 'Start a new conversation to get started'}
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredChats.map((chat, index) => (
                <motion.div
                  key={chat.chat_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ChatItem
                    chat={chat.chats}
                    isSelected={selectedChatId === chat.chat_id}
                    onClick={() => onChatSelect(chat.chat_id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
            <span>Bringlare Chat</span>
            <span>•</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <NewChatDialog
        open={showNewChatDialog}
        onOpenChange={setShowNewChatDialog}
        onChatCreated={onNewChat}
      />
      
      <UserProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
      />
    </>
  )
}

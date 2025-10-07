'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Settings, 
  Moon, 
  Sun, 
  LogOut, 
  Menu,
  X,
  Archive,
  Star,
  MessageCircle
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

interface Chat {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  isOnline: boolean
  isPinned: boolean
  isArchived: boolean
  lastSeen?: string
}

interface AdvancedSidebarProps {
  selectedChatId: string | null
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
  isMobileOpen: boolean
  onMobileClose: () => void
}

export function AdvancedSidebar({ 
  selectedChatId, 
  onChatSelect, 
  onNewChat,
  isMobileOpen,
  onMobileClose
}: AdvancedSidebarProps) {
  const { user, signOut } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>('all')
  const [chats, setChats] = useState<Chat[]>([])
  const [filteredChats, setFilteredChats] = useState<Chat[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Mock chats data
  useEffect(() => {
    const mockChats: Chat[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        lastMessage: 'Hey! How are you doing today?',
        timestamp: new Date(Date.now() - 300000),
        unreadCount: 3,
        isOnline: true,
        isPinned: true,
        isArchived: false
      },
      {
        id: '2',
        name: 'Bob Smith',
        lastMessage: 'Thanks for the help with the project!',
        timestamp: new Date(Date.now() - 1800000),
        unreadCount: 0,
        isOnline: false,
        isPinned: false,
        isArchived: false,
        lastSeen: '2 hours ago'
      },
      {
        id: '3',
        name: 'Team Alpha',
        lastMessage: 'Meeting scheduled for tomorrow at 10 AM',
        timestamp: new Date(Date.now() - 3600000),
        unreadCount: 1,
        isOnline: false,
        isPinned: true,
        isArchived: false
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        lastMessage: 'The design looks great! 👍',
        timestamp: new Date(Date.now() - 7200000),
        unreadCount: 0,
        isOnline: true,
        isPinned: false,
        isArchived: false
      },
      {
        id: '5',
        name: 'Project Discussion',
        lastMessage: 'Let\'s finalize the requirements',
        timestamp: new Date(Date.now() - 86400000),
        unreadCount: 5,
        isOnline: false,
        isPinned: false,
        isArchived: false
      }
    ]
    setChats(mockChats)
  }, [])

  // Filter chats based on search and active tab
  useEffect(() => {
    let filtered = chats

    // Filter by tab
    switch (activeTab) {
      case 'unread':
        filtered = filtered.filter(chat => chat.unreadCount > 0)
        break
      case 'archived':
        filtered = filtered.filter(chat => chat.isArchived)
        break
      default:
        filtered = filtered.filter(chat => !chat.isArchived)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort: pinned first, then by timestamp
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.timestamp.getTime() - a.timestamp.getTime()
    })

    setFilteredChats(filtered)
  }, [chats, searchQuery, activeTab])

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return 'now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark')
  }

  const handleChatClick = (chatId: string) => {
    onChatSelect(chatId)
    if (window.innerWidth <= 768) {
      onMobileClose()
    }
  }

  const totalUnreadCount = chats.reduce((sum, chat) => sum + chat.unreadCount, 0)

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isMobileOpen ? 'active' : ''} md:hidden`}
        onClick={onMobileClose}
      />
      
      {/* Sidebar */}
      <div className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Header */}
        <div className="p-4" style={{ background: 'var(--primary)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className="chat-avatar-advanced online cursor-pointer"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  backgroundImage: user?.photo_url ? `url(${user.photo_url})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {!user?.photo_url && user?.display_name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-white truncate">
                  {user?.display_name}
                </h2>
                <p className="text-sm text-white/80 truncate">
                  Available
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={onNewChat}
                className="composer-btn-advanced"
                style={{ color: 'white' }}
              >
                <Plus className="w-5 h-5" />
              </button>
              <button 
                onClick={toggleDarkMode}
                className="composer-btn-advanced"
                style={{ color: 'white' }}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="composer-btn-advanced md:hidden"
                style={{ color: 'white' }}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Profile Menu */}
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-20 right-4 z-50"
                style={{
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border)',
                  minWidth: '200px'
                }}
              >
                <div className="p-2">
                  <button className="profile-btn w-full text-left">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <button className="profile-btn w-full text-left">
                    <Archive className="w-4 h-4 mr-3" />
                    Archived Chats
                  </button>
                  <button className="profile-btn w-full text-left">
                    <Star className="w-4 h-4 mr-3" />
                    Starred Messages
                  </button>
                  <hr style={{ margin: '8px 0', borderColor: 'var(--border)' }} />
                  <button 
                    onClick={signOut}
                    className="profile-btn danger w-full text-left"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search */}
        <div className="chat-search">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
              style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input pl-10"
            />
          </div>
        </div>

        {/* Chat Tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
          {[
            { key: 'all', label: 'All', count: chats.filter(c => !c.isArchived).length },
            { key: 'unread', label: 'Unread', count: totalUnreadCount },
            { key: 'archived', label: 'Archived', count: chats.filter(c => c.isArchived).length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key 
                  ? 'border-b-2' 
                  : ''
              }`}
              style={{
                color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottomColor: activeTab === tab.key ? 'var(--primary)' : 'transparent'
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span 
                  className="ml-2 px-2 py-1 text-xs rounded-full"
                  style={{
                    background: activeTab === tab.key ? 'var(--primary)' : 'var(--text-secondary)',
                    color: 'white'
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Chat List */}
        <div className="chat-list flex-1">
          <AnimatePresence>
            {filteredChats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleChatClick(chat.id)}
                className={`chat-item-advanced ${selectedChatId === chat.id ? 'active' : ''}`}
              >
                {chat.isPinned && (
                  <div 
                    className="absolute top-2 left-2 w-2 h-2 rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
                
                <div className={`chat-avatar-advanced ${chat.isOnline ? 'online' : ''}`}>
                  {chat.avatar ? (
                    <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                  ) : (
                    chat.name.charAt(0).toUpperCase()
                  )}
                </div>
                
                <div className="chat-info flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="chat-name font-semibold">
                      {chat.name}
                    </h3>
                    <span className="chat-time">
                      {formatTimestamp(chat.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="chat-preview flex-1">
                      {chat.lastMessage}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="unread-badge ml-2">
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredChats.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <MessageCircle 
                className="w-12 h-12 mb-4" 
                style={{ color: 'var(--text-secondary)' }} 
              />
              <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
                {searchQuery ? 'No chats found' : 'No conversations yet'}
              </p>
              {!searchQuery && (
                <button 
                  onClick={onNewChat}
                  className="mt-4 px-4 py-2 rounded-full"
                  style={{
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Start a conversation
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

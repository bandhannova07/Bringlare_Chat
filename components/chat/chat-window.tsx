'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Phone, Video, MoreVertical, Paperclip, Smile, Send, Mic } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { dbHelpers } from '@/lib/supabase'
import { database } from '@/lib/firebase'
import { ref, onValue, push, serverTimestamp, off } from 'firebase/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { MessageBubble } from './message-bubble'
import { TypingIndicator } from './typing-indicator'
import { formatLastSeen } from '@/lib/utils'

interface ChatWindowProps {
  chatId: string
  onBack: () => void
}

export function ChatWindow({ chatId, onBack }: ChatWindowProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [chatInfo, setChatInfo] = useState<any>(null)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Load chat info and messages
  useEffect(() => {
    if (!chatId || !user) return

    const loadChatData = async () => {
      setLoading(true)
      try {
        // Load messages from Supabase
        const chatMessages = await dbHelpers.getChatMessages(chatId)
        setMessages(chatMessages?.reverse() || [])

        // Get chat info (for now, we'll use a placeholder)
        setChatInfo({
          id: chatId,
          name: 'Chat Partner',
          type: 'direct',
          isOnline: true,
          lastSeen: new Date().toISOString(),
        })
      } catch (error) {
        console.error('Error loading chat data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadChatData()

    // Set up real-time message listener
    const messagesRef = ref(database, `chats/${chatId}/messages`)
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const firebaseMessages = Object.entries(snapshot.val()).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }))
        
        // Sort by timestamp
        firebaseMessages.sort((a, b) => a.timestamp - b.timestamp)
        setMessages(prev => [...prev, ...firebaseMessages.slice(prev.length)])
      }
    })

    // Set up typing indicator listener
    const typingRef = ref(database, `chats/${chatId}/typing`)
    const typingUnsubscribe = onValue(typingRef, (snapshot) => {
      if (snapshot.exists()) {
        const typingData = snapshot.val()
        const currentlyTyping = Object.entries(typingData)
          .filter(([userId, isTyping]) => userId !== user.id && isTyping)
          .map(([userId]) => userId)
        setTypingUsers(currentlyTyping)
      } else {
        setTypingUsers([])
      }
    })

    return () => {
      off(messagesRef, 'value', unsubscribe)
      off(typingRef, 'value', typingUnsubscribe)
    }
  }, [chatId, user])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || sending) return

    setSending(true)
    const messageText = newMessage.trim()
    setNewMessage('')

    try {
      // Send to Firebase Realtime Database for real-time updates
      const messagesRef = ref(database, `chats/${chatId}/messages`)
      await push(messagesRef, {
        senderId: user.id,
        senderName: user.display_name,
        senderAvatar: user.photo_url,
        content: messageText,
        type: 'text',
        timestamp: serverTimestamp(),
      })

      // Also store in Supabase for persistence
      await dbHelpers.createMessage({
        chat_id: chatId,
        sender_id: user.id,
        content: messageText,
        message_type: 'text',
        read_by: { [user.id]: new Date().toISOString() },
      })

      // Clear typing indicator
      const typingRef = ref(database, `chats/${chatId}/typing/${user.id}`)
      await push(typingRef, false)
    } catch (error) {
      console.error('Error sending message:', error)
      setNewMessage(messageText) // Restore message on error
    } finally {
      setSending(false)
    }
  }

  const handleTyping = () => {
    if (!user) return

    // Set typing indicator
    const typingRef = ref(database, `chats/${chatId}/typing/${user.id}`)
    push(typingRef, true)

    // Clear typing indicator after 3 seconds
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      push(typingRef, false)
    }, 3000)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="lg:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <Avatar className="w-10 h-10">
            <AvatarImage src="" alt={chatInfo?.name} />
            <AvatarFallback className="bg-chat-primary text-white">
              {chatInfo?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {chatInfo?.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {chatInfo?.isOnline ? 'Online' : formatLastSeen(chatInfo?.lastSeen)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smile className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                No messages yet. Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <motion.div
                key={message.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessageBubble
                  message={message}
                  isOwn={message.senderId === user?.id || message.sender_id === user?.id}
                  showAvatar={index === 0 || messages[index - 1]?.senderId !== message.senderId}
                />
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <TypingIndicator users={typingUsers} />
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value)
                handleTyping()
              }}
              placeholder="Type a message..."
              className="pr-12 bg-gray-50 dark:bg-gray-700 border-0"
              disabled={sending}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          {newMessage.trim() ? (
            <Button
              type="submit"
              variant="chat"
              size="icon"
              disabled={sending}
            >
              {sending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}

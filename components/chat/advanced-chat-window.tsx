'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical, 
  Smile, 
  Paperclip, 
  Send,
  Play,
  Download,
  Check,
  CheckCheck
} from 'lucide-react'

interface Message {
  id: string
  content: string
  type: 'text' | 'image' | 'file' | 'voice'
  sender: 'user' | 'contact'
  timestamp: Date
  status: 'sent' | 'delivered' | 'read'
  fileUrl?: string
  fileName?: string
  fileSize?: string
  duration?: string
}

interface AdvancedChatWindowProps {
  chatId: string
  contactName: string
  contactAvatar?: string
  isOnline: boolean
  lastSeen?: string
  onBack: () => void
}

export function AdvancedChatWindow({ 
  chatId, 
  contactName, 
  contactAvatar, 
  isOnline, 
  lastSeen, 
  onBack 
}: AdvancedChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Mock messages for demo
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Hey! How are you doing?',
        type: 'text',
        sender: 'contact',
        timestamp: new Date(Date.now() - 3600000),
        status: 'read'
      },
      {
        id: '2',
        content: 'I\'m doing great! Just working on some new projects. What about you?',
        type: 'text',
        sender: 'user',
        timestamp: new Date(Date.now() - 3500000),
        status: 'read'
      },
      {
        id: '3',
        content: 'That sounds exciting! I\'d love to hear more about it.',
        type: 'text',
        sender: 'contact',
        timestamp: new Date(Date.now() - 3400000),
        status: 'read'
      },
      {
        id: '4',
        content: 'Sure! It\'s a new chat application with some really cool features. Modern design, real-time messaging, and great user experience.',
        type: 'text',
        sender: 'user',
        timestamp: new Date(Date.now() - 3300000),
        status: 'delivered'
      }
    ]
    setMessages(mockMessages)
  }, [chatId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      type: 'text',
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    
    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = '44px'
    }

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ))
    }, 1000)

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'read' } : msg
      ))
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = '44px'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="msg-status-icon msg-status-sent" />
      case 'delivered':
        return <CheckCheck className="msg-status-icon msg-status-delivered" />
      case 'read':
        return <CheckCheck className="msg-status-icon msg-status-read" />
      default:
        return null
    }
  }

  const groupMessages = (messages: Message[]) => {
    const groups: Message[][] = []
    let currentGroup: Message[] = []
    
    messages.forEach((message, index) => {
      if (index === 0 || messages[index - 1].sender !== message.sender) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup)
        }
        currentGroup = [message]
      } else {
        currentGroup.push(message)
      }
    })
    
    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }
    
    return groups
  }

  const messageGroups = groupMessages(messages)

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="chat-header-advanced">
        <button 
          onClick={onBack}
          className="mobile-menu-btn md:hidden mr-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className={`chat-avatar-advanced ${isOnline ? 'online' : ''}`}>
          {contactAvatar ? (
            <img src={contactAvatar} alt={contactName} className="w-full h-full object-cover" />
          ) : (
            contactName.charAt(0).toUpperCase()
          )}
        </div>
        
        <div className="flex-1 min-w-0 ml-4">
          <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
            {contactName}
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {isOnline ? 'Online' : lastSeen ? `Last seen ${lastSeen}` : 'Offline'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="composer-btn-advanced">
            <Phone className="w-5 h-5" />
          </button>
          <button className="composer-btn-advanced">
            <Video className="w-5 h-5" />
          </button>
          <button className="composer-btn-advanced">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container flex-1 p-4 space-y-4">
        <AnimatePresence>
          {messageGroups.map((group, groupIndex) => (
            <motion.div
              key={`group-${groupIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`msg-bubble-group ${group[0].sender === 'user' ? 'sent' : 'received'}`}
            >
              {group.map((message, messageIndex) => (
                <div
                  key={message.id}
                  className={`msg-bubble-advanced ${message.sender === 'user' ? 'sent' : 'received'} ${
                    messageIndex === 0 ? 'first' : ''
                  } ${messageIndex === group.length - 1 ? 'last' : ''}`}
                >
                  <div className="message-content">
                    {message.type === 'text' && (
                      <p className="mb-1">{message.content}</p>
                    )}
                    
                    {message.type === 'voice' && (
                      <div className="voice-message">
                        <button className="voice-play-btn">
                          <Play className="w-4 h-4" />
                        </button>
                        <div className="voice-waveform">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div
                              key={i}
                              className={`voice-bar ${i < 8 ? 'active' : ''}`}
                              style={{ height: `${Math.random() * 16 + 8}px` }}
                            />
                          ))}
                        </div>
                        <span className="voice-duration">{message.duration || '0:15'}</span>
                      </div>
                    )}
                    
                    {message.type === 'file' && (
                      <div className="file-attachment">
                        <div className="file-icon">
                          <Download className="w-5 h-5" />
                        </div>
                        <div className="file-info">
                          <div className="file-name">{message.fileName}</div>
                          <div className="file-size">{message.fileSize}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="msg-time">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.sender === 'user' && (
                      <div className="msg-status">
                        {getStatusIcon(message.status)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="typing-container"
            >
              <div className="typing-avatar">
                {contactName.charAt(0).toUpperCase()}
              </div>
              <div className="typing-bubble">
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="composer-advanced">
        <button className="composer-btn-advanced">
          <Paperclip className="w-5 h-5" />
        </button>
        
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="composer-input-advanced"
            rows={1}
          />
        </div>
        
        <button 
          className="composer-btn-advanced"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Smile className="w-5 h-5" />
        </button>
        
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className={`composer-btn-advanced ${newMessage.trim() ? 'send-btn-advanced' : ''}`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

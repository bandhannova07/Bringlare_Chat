'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, CheckCheck, MoreHorizontal, Reply, Heart, ThumbsUp, Laugh } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatMessageTime, cn } from '@/lib/utils'

interface MessageBubbleProps {
  message: any
  isOwn: boolean
  showAvatar: boolean
}

export function MessageBubble({ message, isOwn, showAvatar }: MessageBubbleProps) {
  const [showReactions, setShowReactions] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const reactions = ['❤️', '👍', '😂', '😮', '😢', '😡']
  const messageTime = formatMessageTime(message.timestamp || message.created_at)
  
  // Mock read status - in real app, this would come from the message data
  const isRead = true
  const isDelivered = true

  const handleReaction = (emoji: string) => {
    // TODO: Implement reaction functionality
    console.log('React with:', emoji)
    setShowReactions(false)
  }

  return (
    <div className={cn(
      'flex items-end space-x-2 max-w-[80%]',
      isOwn ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
    )}>
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <Avatar className="w-8 h-8 mb-1">
          <AvatarImage src={message.senderAvatar || ''} alt={message.senderName} />
          <AvatarFallback className="bg-chat-primary text-white text-xs">
            {message.senderName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div className={cn(
        'relative group',
        !showAvatar && !isOwn && 'ml-10'
      )}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'relative px-4 py-2 rounded-2xl max-w-md break-words',
            isOwn
              ? 'bg-chat-primary text-white rounded-br-md'
              : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-md'
          )}
          onMouseEnter={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
        >
          {/* Sender name for group chats */}
          {!isOwn && showAvatar && message.senderName && (
            <p className="text-xs font-medium text-chat-primary dark:text-chat-accent mb-1">
              {message.senderName}
            </p>
          )}

          {/* Message content */}
          <p className="text-sm leading-relaxed">
            {message.content}
          </p>

          {/* Message time and status */}
          <div className={cn(
            'flex items-center justify-end space-x-1 mt-1',
            isOwn ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
          )}>
            <span className="text-xs">{messageTime}</span>
            {isOwn && (
              <div className="flex items-center">
                {isDelivered ? (
                  isRead ? (
                    <CheckCheck className="w-3 h-3 text-blue-400" />
                  ) : (
                    <CheckCheck className="w-3 h-3" />
                  )
                ) : (
                  <Check className="w-3 h-3" />
                )}
              </div>
            )}
          </div>

          {/* Message options */}
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                'absolute top-0 flex items-center space-x-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg px-2 py-1',
                isOwn ? 'right-0 -translate-y-full' : 'left-0 -translate-y-full'
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowReactions(!showReactions)}
              >
                <Heart className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Reply className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </motion.div>
          )}

          {/* Reaction picker */}
          {showReactions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'absolute top-0 flex items-center space-x-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg px-2 py-1',
                isOwn ? 'right-0 -translate-y-12' : 'left-0 -translate-y-12'
              )}
            >
              {reactions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="text-lg hover:scale-125 transition-transform p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Message reactions */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className={cn(
            'flex items-center space-x-1 mt-1',
            isOwn ? 'justify-end' : 'justify-start'
          )}>
            {Object.entries(message.reactions).map(([emoji, users]: [string, any]) => (
              <div
                key={emoji}
                className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1"
              >
                <span className="text-xs">{emoji}</span>
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {Array.isArray(users) ? users.length : 1}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

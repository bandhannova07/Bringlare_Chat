'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { formatTimestamp } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Users, MessageCircle } from 'lucide-react'

interface ChatItemProps {
  chat: any
  isSelected: boolean
  onClick: () => void
}

export function ChatItem({ chat, isSelected, onClick }: ChatItemProps) {
  const chatName = chat.name || 'Direct Message'
  const lastMessage = chat.last_message || 'No messages yet'
  const lastMessageTime = chat.last_message_at ? formatTimestamp(chat.last_message_at) : ''
  const isGroup = chat.type === 'group'

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700',
        isSelected && 'bg-chat-primary/10 dark:bg-chat-primary/20 border-l-4 border-chat-primary'
      )}
    >
      {/* Avatar */}
      <div className="relative">
        <Avatar className="w-12 h-12">
          <AvatarImage src="" alt={chatName} />
          <AvatarFallback className={cn(
            'text-white',
            isGroup ? 'bg-purple-500' : 'bg-chat-primary'
          )}>
            {isGroup ? (
              <Users className="w-6 h-6" />
            ) : (
              chatName.charAt(0).toUpperCase()
            )}
          </AvatarFallback>
        </Avatar>
        {/* Online indicator for direct messages */}
        {!isGroup && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
        )}
      </div>

      {/* Chat Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={cn(
            'font-medium truncate',
            isSelected 
              ? 'text-chat-primary dark:text-chat-accent' 
              : 'text-gray-900 dark:text-white'
          )}>
            {chatName}
          </h3>
          {lastMessageTime && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              {lastMessageTime}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {lastMessage}
          </p>
          {/* Unread count badge */}
          <div className="w-2 h-2 bg-chat-accent rounded-full ml-2 flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}

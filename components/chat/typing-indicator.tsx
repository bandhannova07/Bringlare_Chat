'use client'

import { motion } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface TypingIndicatorProps {
  users: string[]
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-end space-x-2 max-w-[80%]"
    >
      {/* Avatar */}
      <Avatar className="w-8 h-8 mb-1">
        <AvatarImage src="" alt="User" />
        <AvatarFallback className="bg-gray-400 text-white text-xs">
          U
        </AvatarFallback>
      </Avatar>

      {/* Typing bubble */}
      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">
            {users.length === 1 ? 'typing' : `${users.length} people typing`}
          </span>
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

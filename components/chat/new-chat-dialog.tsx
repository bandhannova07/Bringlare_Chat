'use client'

import { useState, useEffect } from 'react'
import { Search, Users, MessageCircle, Plus } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { dbHelpers } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { debounce } from '@/lib/utils'

interface NewChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onChatCreated: (chat: any) => void
}

export function NewChatDialog({ open, onOpenChange, onChatCreated }: NewChatDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  // Load user contacts when dialog opens
  useEffect(() => {
    if (open && user) {
      loadContacts()
    }
  }, [open, user])

  // Debounced search
  useEffect(() => {
    const debouncedSearch = debounce(async (query: string) => {
      if (!query.trim() || !user) {
        setSearchResults([])
        setSearchLoading(false)
        return
      }

      setSearchLoading(true)
      try {
        const results = await dbHelpers.searchUsers(query, user.id)
        setSearchResults(results || [])
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 300)

    if (searchQuery) {
      setSearchLoading(true)
      debouncedSearch(searchQuery)
    } else {
      setSearchResults([])
      setSearchLoading(false)
    }
  }, [searchQuery, user])

  const loadContacts = async () => {
    if (!user) return

    setLoading(true)
    try {
      const userContacts = await dbHelpers.getUserContacts(user.id)
      setContacts(userContacts || [])
    } catch (error) {
      console.error('Error loading contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartChat = async (targetUser: any) => {
    if (!user) return

    setLoading(true)
    try {
      // Create new direct chat
      const newChat = await dbHelpers.createChat({
        type: 'direct',
        created_by: user.id,
      })

      // Add participants
      await Promise.all([
        // Add current user
        dbHelpers.createMessage({
          chat_id: newChat.id,
          sender_id: user.id,
          content: '',
          message_type: 'text',
          read_by: { [user.id]: new Date().toISOString() },
        }),
        // Add target user
        dbHelpers.createMessage({
          chat_id: newChat.id,
          sender_id: targetUser.id,
          content: '',
          message_type: 'text',
          read_by: {},
        }),
      ])

      // Format chat for the parent component
      const formattedChat = {
        chat_id: newChat.id,
        chats: {
          ...newChat,
          name: targetUser.display_name,
        },
      }

      onChatCreated(formattedChat)
      onOpenChange(false)
      setSearchQuery('')
      setSearchResults([])

      toast({
        title: 'Chat created',
        description: `Started a new conversation with ${targetUser.display_name}`,
      })
    } catch (error) {
      console.error('Error creating chat:', error)
      toast({
        title: 'Error',
        description: 'Failed to create chat. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const displayUsers = searchQuery ? searchResults : contacts.map(c => c.contact_user)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-chat-primary" />
            <span>New Chat</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>

          {/* User List */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : displayUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {searchQuery ? 'No users found' : 'No contacts yet'}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  {searchQuery ? 'Try a different search term' : 'Search for users to start chatting'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {displayUsers.map((targetUser) => (
                  <div
                    key={targetUser.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={targetUser.photo_url || ''} alt={targetUser.display_name} />
                      <AvatarFallback className="bg-chat-primary text-white">
                        {targetUser.display_name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {targetUser.display_name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        @{targetUser.username}
                      </p>
                      {targetUser.status_message && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                          {targetUser.status_message}
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={() => handleStartChat(targetUser)}
                      disabled={loading}
                      size="sm"
                      variant="chat"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create Group Chat Button */}
          <div className="border-t pt-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={loading}
            >
              <Users className="w-4 h-4 mr-2" />
              Create Group Chat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

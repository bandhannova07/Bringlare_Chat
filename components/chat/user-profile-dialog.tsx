'use client'

import { useState } from 'react'
import { Camera, Edit2, Save, X } from 'lucide-react'
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

interface UserProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserProfileDialog({ open, onOpenChange }: UserProfileDialogProps) {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    display_name: user?.display_name || '',
    username: user?.username || '',
    status_message: user?.status_message || '',
  })

  const handleSave = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Update user profile in Supabase
      const { error } = await dbHelpers.supabase
        .from('users')
        .update({
          display_name: formData.display_name,
          username: formData.username,
          status_message: formData.status_message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      await refreshUser()
      setIsEditing(false)
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      display_name: user?.display_name || '',
      username: user?.username || '',
      status_message: user?.status_message || '',
    })
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.photo_url || ''} alt={user.display_name} />
                <AvatarFallback className="bg-chat-primary text-white text-2xl">
                  {user.display_name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full"
                disabled={loading}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Click the camera icon to change your profile picture
            </p>
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Display Name
              </label>
              {isEditing ? (
                <Input
                  value={formData.display_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="Enter your display name"
                />
              ) : (
                <p className="text-gray-900 dark:text-white py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {user.display_name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Username
              </label>
              {isEditing ? (
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your username"
                />
              ) : (
                <p className="text-gray-900 dark:text-white py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  @{user.username}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Status Message
              </label>
              {isEditing ? (
                <Input
                  value={formData.status_message}
                  onChange={(e) => setFormData(prev => ({ ...prev, status_message: e.target.value }))}
                  placeholder="Enter your status message"
                />
              ) : (
                <p className="text-gray-900 dark:text-white py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {user.status_message || 'No status message'}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Email
              </label>
              <p className="text-gray-900 dark:text-white py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                {user.email}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  variant="chat"
                  className="flex-1"
                >
                  {loading ? <LoadingSpinner size="sm" /> : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="chat"
                className="flex-1"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          {/* Account Info */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Member since</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Last seen</span>
              <span className="text-gray-900 dark:text-white">
                {user.is_online ? 'Online' : new Date(user.last_seen).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { dbHelpers, User } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

interface AuthContextType {
  firebaseUser: FirebaseUser | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const refreshUser = async () => {
    if (!firebaseUser) return
    
    try {
      const userData = await dbHelpers.getUserByFirebaseUid(firebaseUser.uid)
      setUser(userData)
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      if (user) {
        await dbHelpers.updateUserOnlineStatus(user.id, false)
      }
      await signOut(auth)
      setUser(null)
      toast({
        title: 'Signed out successfully',
        description: 'You have been signed out of your account.',
      })
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: 'Error signing out',
        description: 'There was an error signing out. Please try again.',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)
      
      if (firebaseUser) {
        try {
          // Get or create user in Supabase
          let userData = await dbHelpers.getUserByFirebaseUid(firebaseUser.uid)
          
          if (!userData) {
            // Create new user if doesn't exist
            const newUserData = {
              firebase_uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              display_name: firebaseUser.displayName || 'Anonymous',
              username: firebaseUser.displayName?.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.random().toString(36).substring(2, 6) || 'user' + Math.random().toString(36).substring(2, 6),
              photo_url: firebaseUser.photoURL || undefined,
              status_message: 'Hey there! I am using Bringlare Chat.',
              is_online: true,
              last_seen: new Date().toISOString(),
            }
            
            userData = await dbHelpers.createUser(newUserData)
          } else {
            // Update online status
            await dbHelpers.updateUserOnlineStatus(userData.id, true)
            userData.is_online = true
          }
          
          setUser(userData)
        } catch (error) {
          console.error('Error handling user authentication:', error)
          toast({
            title: 'Authentication Error',
            description: 'There was an error setting up your account.',
            variant: 'destructive',
          })
        }
      } else {
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [toast])

  // Update online status when user becomes inactive
  useEffect(() => {
    if (!user) return

    const handleBeforeUnload = () => {
      if (user) {
        dbHelpers.updateUserOnlineStatus(user.id, false)
      }
    }

    const handleVisibilityChange = () => {
      if (user) {
        const isOnline = !document.hidden
        dbHelpers.updateUserOnlineStatus(user.id, isOnline)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user])

  const value = {
    firebaseUser,
    user,
    loading,
    signOut: handleSignOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

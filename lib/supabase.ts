import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We're using Firebase Auth instead
  },
})

// Database tables structure
export interface User {
  id: string
  firebase_uid: string
  email: string
  display_name: string
  username: string
  photo_url?: string
  status_message?: string
  is_online: boolean
  last_seen: string
  created_at: string
  updated_at: string
}

export interface Chat {
  id: string
  name?: string // For group chats
  type: 'direct' | 'group'
  created_by: string
  created_at: string
  updated_at: string
  last_message?: string
  last_message_at?: string
}

export interface ChatParticipant {
  id: string
  chat_id: string
  user_id: string
  role: 'admin' | 'member'
  joined_at: string
  left_at?: string
}

export interface Message {
  id: string
  chat_id: string
  sender_id: string
  content?: string
  message_type: 'text' | 'image' | 'video' | 'audio' | 'document'
  file_url?: string
  file_name?: string
  file_size?: number
  reply_to?: string
  reactions?: Record<string, string[]> // emoji -> user_ids
  read_by: Record<string, string> // user_id -> timestamp
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  user_id: string
  contact_user_id: string
  status: 'pending' | 'accepted' | 'blocked'
  created_at: string
  updated_at: string
}

// Helper functions for database operations
export const dbHelpers = {
  // Users
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserByFirebaseUid(firebaseUid: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateUserOnlineStatus(userId: string, isOnline: boolean) {
    const { error } = await supabase
      .from('users')
      .update({ 
        is_online: isOnline,
        last_seen: new Date().toISOString()
      })
      .eq('id', userId)
    
    if (error) throw error
  },

  // Chats
  async createChat(chatData: Omit<Chat, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('chats')
      .insert(chatData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserChats(userId: string) {
    const { data, error } = await supabase
      .from('chat_participants')
      .select(`
        chat_id,
        chats (
          id,
          name,
          type,
          created_by,
          created_at,
          last_message,
          last_message_at
        )
      `)
      .eq('user_id', userId)
      .is('left_at', null)
    
    if (error) throw error
    return data
  },

  // Messages
  async createMessage(messageData: Omit<Message, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getChatMessages(chatId: string, limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey (
          id,
          display_name,
          photo_url
        )
      `)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) throw error
    return data
  },

  // Contacts
  async addContact(userId: string, contactUserId: string) {
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        user_id: userId,
        contact_user_id: contactUserId,
        status: 'pending'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserContacts(userId: string) {
    const { data, error } = await supabase
      .from('contacts')
      .select(`
        *,
        contact_user:users!contacts_contact_user_id_fkey (
          id,
          display_name,
          username,
          photo_url,
          status_message,
          is_online,
          last_seen
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted')
    
    if (error) throw error
    return data
  },

  // Search users
  async searchUsers(query: string, currentUserId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('id, display_name, username, photo_url, status_message')
      .neq('id', currentUserId)
      .or(`display_name.ilike.%${query}%,username.ilike.%${query}%`)
      .limit(20)
    
    if (error) throw error
    return data
  }
}

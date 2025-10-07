// User types
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

// Chat types
export interface Chat {
  id: string
  name?: string
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

// Message types
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
  reactions?: Record<string, string[]>
  read_by: Record<string, string>
  created_at: string
  updated_at: string
  sender?: {
    id: string
    display_name: string
    photo_url?: string
  }
}

// Firebase real-time message type
export interface FirebaseMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  type: 'text' | 'image' | 'video' | 'audio' | 'document'
  timestamp: number
  fileUrl?: string
  fileName?: string
  fileSize?: number
}

// Contact types
export interface Contact {
  id: string
  user_id: string
  contact_user_id: string
  status: 'pending' | 'accepted' | 'blocked'
  created_at: string
  updated_at: string
  contact_user?: User
}

// Notification types
export interface Notification {
  id: string
  user_id: string
  type: 'message' | 'contact_request' | 'group_invite'
  title: string
  body: string
  data: Record<string, any>
  read: boolean
  created_at: string
}

// UI types
export interface ChatItemProps {
  chat: Chat & {
    participants?: ChatParticipant[]
    unread_count?: number
  }
  isSelected: boolean
  onClick: () => void
}

export interface MessageBubbleProps {
  message: Message | FirebaseMessage
  isOwn: boolean
  showAvatar: boolean
}

// Auth types
export interface AuthUser {
  firebaseUser: any
  user: User | null
  loading: boolean
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// File upload types
export interface FileUploadResult {
  url: string
  name: string
  size: number
  type: string
}

// Search types
export interface SearchResult {
  users: User[]
  chats: Chat[]
  messages: Message[]
}

// Typing indicator types
export interface TypingUser {
  id: string
  name: string
}

// Online presence types
export interface PresenceData {
  [userId: string]: {
    isOnline: boolean
    lastSeen: number
  }
}

// Push notification types
export interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: Record<string, any>
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ProfileFormData {
  display_name: string
  username: string
  status_message: string
  photo_url?: string
}

// Chat settings types
export interface ChatSettings {
  notifications: boolean
  sound: boolean
  theme: Theme
  language: string
  autoDownload: {
    photos: boolean
    videos: boolean
    documents: boolean
  }
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
}

// Loading states
export interface LoadingState {
  [key: string]: boolean
}

// Component props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Event types
export interface ChatEvent {
  type: 'message' | 'typing' | 'presence' | 'read_receipt'
  data: any
  timestamp: number
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Database query types
export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
  filters?: Record<string, any>
}

// Pagination types
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

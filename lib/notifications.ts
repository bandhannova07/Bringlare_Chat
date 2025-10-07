import { getMessagingInstance } from './firebase'
import { getToken, onMessage } from 'firebase/messaging'

export class NotificationService {
  private static instance: NotificationService
  private messaging: any = null
  private token: string | null = null

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  async initialize(): Promise<void> {
    try {
      this.messaging = await getMessagingInstance()
      if (!this.messaging) {
        console.log('Firebase Messaging not supported in this browser')
        return
      }

      // Request permission for notifications
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        console.log('Notification permission granted')
        await this.getToken()
        this.setupMessageListener()
      } else {
        console.log('Notification permission denied')
      }
    } catch (error) {
      console.error('Error initializing notifications:', error)
    }
  }

  async getToken(): Promise<string | null> {
    if (!this.messaging) return null

    try {
      const token = await getToken(this.messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      })
      
      if (token) {
        this.token = token
        console.log('FCM token:', token)
        // TODO: Send token to your server to store for the user
        return token
      } else {
        console.log('No registration token available')
        return null
      }
    } catch (error) {
      console.error('Error getting FCM token:', error)
      return null
    }
  }

  private setupMessageListener(): void {
    if (!this.messaging) return

    onMessage(this.messaging, (payload) => {
      console.log('Foreground message received:', payload)
      
      // Show notification when app is in foreground
      this.showNotification(
        payload.notification?.title || 'New Message',
        {
          body: payload.notification?.body || 'You have a new message',
          icon: '/icons/icon-192x192.png',
          tag: 'bringlare-chat',
          data: payload.data
        }
      )
    })
  }

  private showNotification(title: string, options: NotificationOptions): void {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          ...options,
          badge: '/icons/icon-72x72.png',
          requireInteraction: true,
          actions: [
            {
              action: 'reply',
              title: 'Reply'
            },
            {
              action: 'view',
              title: 'View'
            }
          ]
        })
      })
    }
  }

  async sendNotification(userId: string, title: string, body: string, data?: any): Promise<void> {
    // This would typically be called from your server
    // Here's the structure for reference
    const notificationPayload = {
      to: userId, // FCM token of the recipient
      notification: {
        title,
        body,
        icon: '/icons/icon-192x192.png',
        click_action: process.env.NEXT_PUBLIC_APP_URL
      },
      data: data || {}
    }

    // Send to FCM server (this should be done from your backend)
    console.log('Notification payload:', notificationPayload)
  }

  getStoredToken(): string | null {
    return this.token
  }
}

// Utility functions for different notification types
export const notificationTemplates = {
  newMessage: (senderName: string, message: string) => ({
    title: `New message from ${senderName}`,
    body: message.length > 50 ? message.substring(0, 50) + '...' : message
  }),

  groupMessage: (groupName: string, senderName: string, message: string) => ({
    title: `${senderName} in ${groupName}`,
    body: message.length > 50 ? message.substring(0, 50) + '...' : message
  }),

  contactRequest: (senderName: string) => ({
    title: 'New contact request',
    body: `${senderName} wants to connect with you`
  }),

  groupInvite: (groupName: string, inviterName: string) => ({
    title: 'Group invitation',
    body: `${inviterName} invited you to join ${groupName}`
  })
}

// Initialize notification service
export const initializeNotifications = async (): Promise<NotificationService> => {
  const notificationService = NotificationService.getInstance()
  await notificationService.initialize()
  return notificationService
}

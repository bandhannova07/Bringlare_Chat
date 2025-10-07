# Bringlare Chat - Modern Real-time Messaging App

A professional real-time chat application built with Next.js 14, Firebase, and Supabase. Features include real-time messaging, user authentication, file sharing, push notifications, and more.

## 🚀 Features

### ✅ Core Features
- **Real-time Messaging**: Instant message delivery using Firebase Realtime Database
- **User Authentication**: Email/password and Google OAuth via Firebase Auth
- **User Profiles**: Customizable profiles with avatars and status messages
- **1-to-1 Chat**: Direct messaging between users
- **Group Chat**: Multi-participant conversations
- **Online Presence**: Real-time online/offline status tracking
- **Typing Indicators**: See when someone is typing
- **Message Read Receipts**: Track message delivery and read status
- **Dark/Light Mode**: Theme switching with system preference support
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Push Notifications**: Browser notifications for new messages
- **File Sharing**: Upload and share images, videos, documents
- **Search**: Find users and conversations quickly

### 🔮 Future Features
- **Message Reactions**: Emoji reactions to messages
- **Voice Messages**: Record and send audio messages
- **Video/Voice Calls**: WebRTC-based calling
- **Message Threading**: Reply to specific messages
- **Message Search**: Search through chat history
- **End-to-End Encryption**: Secure message encryption
- **PWA Support**: Install as a mobile/desktop app
- **Admin Dashboard**: System monitoring and user management
- **Custom Themes**: Personalized chat themes
- **Message Scheduling**: Schedule messages for later
- **Auto-replies**: AI-powered automatic responses

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Shadcn/UI, Radix UI
- **Authentication**: Firebase Authentication
- **Real-time Database**: Firebase Realtime Database
- **Database**: Supabase PostgreSQL
- **File Storage**: Supabase Storage
- **Notifications**: Firebase Cloud Messaging
- **Animations**: Framer Motion
- **Deployment**: Netlify
- **Version Control**: Git

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- A Firebase project with Authentication, Realtime Database, and Cloud Messaging enabled
- A Supabase project with PostgreSQL database
- Git for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd bringlare-chat
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and fill in your configuration:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

#### Supabase Setup:
1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) for all tables
4. Set up storage buckets for file uploads

#### Firebase Setup:
1. Create a new Firebase project
2. Enable Authentication with Email/Password and Google providers
3. Enable Realtime Database
4. Enable Cloud Messaging
5. Add your domain to authorized domains

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
bringlare-chat/
├── app/                    # Next.js 14 App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── chat/             # Chat-related components
│   ├── providers/        # Context providers
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   ├── supabase.ts       # Supabase configuration
│   ├── notifications.ts  # Push notifications
│   └── utils.ts          # Utility functions
├── public/               # Static assets
│   ├── icons/           # PWA icons
│   ├── manifest.json    # PWA manifest
│   └── firebase-messaging-sw.js # Service worker
├── supabase/            # Database schema
│   └── schema.sql       # PostgreSQL schema
└── types/               # TypeScript type definitions
```

## 🔧 Configuration

### Firebase Configuration

1. **Authentication**:
   - Enable Email/Password authentication
   - Enable Google authentication
   - Add your domain to authorized domains

2. **Realtime Database**:
   - Create a database in test mode
   - Set up security rules for chat data

3. **Cloud Messaging**:
   - Generate a VAPID key
   - Configure the service worker

### Supabase Configuration

1. **Database**:
   - Run the provided SQL schema
   - Enable RLS on all tables
   - Set up proper policies

2. **Storage**:
   - Create buckets for file uploads
   - Configure upload policies

## 🚀 Deployment

### Deploy to Netlify

1. Build the application:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your Git repository
   - Set environment variables
   - Deploy with build command: `npm run build`
   - Publish directory: `.next`

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:
- Firebase configuration
- Supabase configuration
- App URL (production domain)

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📱 PWA Features

The app includes Progressive Web App features:
- Installable on mobile and desktop
- Offline support (planned)
- Push notifications
- App-like experience

## 🔒 Security

- Row Level Security (RLS) enabled on all database tables
- Firebase Authentication for secure user management
- Environment variables for sensitive configuration
- HTTPS required for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Firebase](https://firebase.google.com/) for authentication and real-time database
- [Supabase](https://supabase.com/) for PostgreSQL database and storage
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shadcn/UI](https://ui.shadcn.com/) for beautiful UI components
- [Framer Motion](https://www.framer.com/motion/) for animations

## 📞 Support

If you have any questions or need help, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Happy Chatting! 💬**

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Users, Shield, Zap } from 'lucide-react'
import { LoginForm } from './login-form'
import { SignupForm } from './signup-form'
import { Button } from '@/components/ui/button'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  const features = [
    {
      icon: MessageCircle,
      title: 'Real-time Messaging',
      description: 'Send and receive messages instantly with real-time updates',
    },
    {
      icon: Users,
      title: 'Group Chats',
      description: 'Create group conversations and collaborate with teams',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your conversations are protected with enterprise-grade security',
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Lightning-fast performance with 99.9% uptime guarantee',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-chat-primary via-chat-secondary to-chat-accent flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 text-white">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to Bringlare Chat</h1>
            <p className="text-xl opacity-90">
              The modern way to communicate with your team and friends
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="bg-white/20 p-3 rounded-lg">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="opacity-80">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-chat-primary to-chat-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600 mt-2">
                {isLogin 
                  ? 'Sign in to continue to Bringlare Chat' 
                  : 'Join thousands of users on Bringlare Chat'
                }
              </p>
            </div>

            {/* Auth Form */}
            <div className="space-y-6">
              {isLogin ? <LoginForm /> : <SignupForm />}

              {/* Toggle Form */}
              <div className="text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                </p>
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-chat-primary hover:text-chat-secondary font-semibold"
                >
                  {isLogin ? 'Sign up here' : 'Sign in here'}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Features */}
          <div className="lg:hidden mt-8 text-white">
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-white/20 p-3 rounded-lg inline-block mb-2">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-sm">{feature.title}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

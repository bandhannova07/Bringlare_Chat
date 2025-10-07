'use client'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          🎨 UI Styling Test
        </h1>
        
        {/* Color Test */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-red-500 text-white p-4 rounded-lg text-center">
            Red
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg text-center">
            Green
          </div>
          <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
            Blue
          </div>
          <div className="bg-purple-500 text-white p-4 rounded-lg text-center">
            Purple
          </div>
        </div>

        {/* Chat Colors Test */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Chat Colors</h2>
          <div className="space-y-4">
            <div className="bg-chat-primary text-white p-3 rounded-lg">
              Primary Chat Color
            </div>
            <div className="bg-chat-secondary text-white p-3 rounded-lg">
              Secondary Chat Color
            </div>
            <div className="bg-chat-accent text-white p-3 rounded-lg">
              Accent Chat Color
            </div>
            <div className="bg-chat-bubble text-gray-800 p-3 rounded-lg">
              Chat Bubble Color
            </div>
          </div>
        </div>

        {/* Button Test */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
              Primary Button
            </button>
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors">
              Secondary Button
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors">
              Success Button
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
              Danger Button
            </button>
          </div>
        </div>

        {/* Animation Test */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Animations</h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-pink-500 to-violet-500 text-white p-4 rounded-lg animate-pulse">
              Pulsing Animation
            </div>
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-lg hover:scale-105 transition-transform cursor-pointer">
              Hover to Scale
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg animate-bounce">
              Bouncing Animation
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a 
            href="/" 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-lg transition-colors inline-block"
          >
            ← Back to Chat App
          </a>
        </div>
      </div>
    </div>
  )
}

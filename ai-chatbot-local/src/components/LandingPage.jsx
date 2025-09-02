import React from 'react';

function LandingPage({ onStartChat, onViewAds }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-mono">
      {/* Simple Header */}
      <div className="p-4 border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-normal text-gray-900 dark:text-white">
            💬 AI Chat + Ads Demo
          </h1>
          <button
            onClick={onStartChat}
            className="bg-gray-800 hover:bg-black text-white px-4 py-2 border border-gray-600 text-sm"
          >
            → Start Chat
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Simple Intro */}
        <div className="mb-12">
          <h2 className="text-2xl text-gray-900 dark:text-white mb-4">
            What is this?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            A simple demo showing how ads could work with ChatGPT-style interfaces. 
            The idea is that ads appear based on what you're talking about, but without being annoying.
          </p>
          
          <button
            onClick={onStartChat}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base border-0"
          >
            Try it out →
          </button>
        </div>

        {/* What you get */}
        <div className="mb-12">
          <h3 className="text-lg text-gray-900 dark:text-white mb-4">Features:</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>• Chat with Gemini AI (need your own API key)</li>
            <li>• Ads show up based on conversation context</li>
            <li>• Real-time streaming responses</li>
            <li>• Dark mode because why not</li>
          </ul>
        </div>

        {/* Ads placeholder */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg text-gray-900 dark:text-white">Sample Ads (placeholder):</h3>
            <button
              onClick={onViewAds}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm"
            >
              View All Ads →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-white dark:bg-gray-800 border border-dashed border-gray-400 dark:border-gray-500">
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  [Ad #{i} will show here]
                  <br />
                  Based on chat context
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              👆 Click "View All Ads" to see our full ad network (10 sample ads)
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-12">
          <h3 className="text-lg text-gray-900 dark:text-white mb-4">How to use:</h3>
          <div className="bg-white dark:bg-gray-800 p-6 border border-gray-300 dark:border-gray-600">
            <ol className="space-y-3 text-gray-700 dark:text-gray-300">
              <li>1. Click "Start Chat" above</li>
              <li>2. Add your Gemini API key in settings (gear icon)</li>
              <li>3. Start a new chat and talk about anything</li>
              <li>4. Watch as relevant ads appear (coming soon)</li>
            </ol>
            
            <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> This is a proof of concept. The goal is to show how ads can be contextually relevant without being annoying.
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-16 p-4 text-center border-t border-gray-300 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Made to test contextual ads with AI chat • Uses Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

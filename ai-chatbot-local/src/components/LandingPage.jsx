import React from 'react';
import ThemeToggle from './ThemeToggle';

function LandingPage({ onStartChat, onViewAds }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-mono">
      {/* Simple Header */}
      <div className="p-4 border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-normal text-gray-900 dark:text-white">
            AI Chat + Ads Demo
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
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
            <li>• Dark mode</li>
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

        </div>

        {/* How it works */}
        <div className="mb-12">
          <h3 className="text-lg text-gray-900 dark:text-white mb-4">How to use:</h3>
          <ol className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>1. Click "Start Chat" above</li>
            <li>2. Add your Gemini API key in settings (gear icon)</li>
            <li>3. Start a new chat and talk about anything</li>
            <li>4. Watch as relevant ads appear (Try asking: Dell laptops vs hp)</li>
          </ol>
        </div>
        
        {/* Footer */}
        <div className="mt-16 p-4 text-center">
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

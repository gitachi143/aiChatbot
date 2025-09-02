#!/bin/bash

# AI Chatbot Development Server Starter
echo "🚀 Starting AI Chatbot with Ads..."
echo "📁 Directory: $(pwd)"
echo "⏰ Time: $(date)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the development server
echo "🌐 Starting development server..."
echo "🔗 Access your app at: http://localhost:5173"
echo "⚠️  Press Ctrl+C to stop the server"
echo ""

npm run dev

import { useEffect, useRef, useState } from 'react';
import { Bot, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Message } from './Message';
import { MessageInput } from './MessageInput';
import { scrollToBottom, cn } from '../utils/helpers';

export function ChatWindow({ 
  messages = [], 
  currentConversation, 
  onSendMessage, 
  onDeleteMessage,
  isLoading = false,
  error = null,
  onRetry 
}) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom(messagesContainerRef.current);
    }
  }, [messages, isLoading, shouldAutoScroll]);

  // Check if user has scrolled up
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 10;
      setShouldAutoScroll(isAtBottom);
    }
  };

  const scrollToBottomManually = () => {
    setShouldAutoScroll(true);
    scrollToBottom(messagesContainerRef.current);
  };

  const handleSendMessage = async (content) => {
    if (!isOnline) {
      alert('You are offline. Please check your internet connection.');
      return;
    }

    if (!currentConversation) {
      alert('Please select or create a conversation first.');
      return;
    }

    if (onSendMessage) {
      try {
        await onSendMessage(content);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const EmptyState = () => (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Welcome to AI Chat
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {currentConversation ? 
            "Start a conversation by typing a message below." :
            "Select a conversation from the sidebar or create a new one to get started."
          }
        </p>
        {!isOnline && (
          <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">You are currently offline</span>
          </div>
        )}
      </div>
    </div>
  );

  const LoadingIndicator = () => (
    <div className="flex gap-3 mb-6">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-w-[85%] shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
        </div>
      </div>
    </div>
  );

  const ErrorMessage = () => (
    <div className="mx-4 mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-red-800 dark:text-red-200">Error</h4>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            {currentConversation?.title || 'AI Chat'}
          </h2>
          {currentConversation && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {messages.length} messages
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
            isOnline 
              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
              : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
          )}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                onDelete={onDeleteMessage}
                showActions={true}
              />
            ))}
            
            {isLoading && <LoadingIndicator />}
            {error && <ErrorMessage />}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Scroll to bottom button */}
      {!shouldAutoScroll && messages.length > 0 && (
        <div className="absolute bottom-20 right-8">
          <button
            onClick={scrollToBottomManually}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
            title="Scroll to bottom"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isLoading || !isOnline || !currentConversation}
        placeholder={
          !currentConversation 
            ? "Select a conversation to start chatting..."
            : !isOnline 
            ? "You are offline..."
            : isLoading 
            ? "Please wait for the AI to respond..."
            : "Type your message..."
        }
      />
    </div>
  );
}

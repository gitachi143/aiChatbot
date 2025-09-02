import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '../utils/helpers';

export function MessageInput({ onSendMessage, disabled = false, placeholder = "Type your message..." }) {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() && !disabled && onSendMessage) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (but not Shift+Enter or during IME composition)
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 200); // Max height of 200px
    textarea.style.height = `${newHeight}px`;
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  // Focus textarea when component mounts
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={disabled ? "Please wait..." : placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              "w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg",
              "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
              "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "resize-none outline-none transition-colors",
              "placeholder-gray-500 dark:placeholder-gray-400",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            style={{
              minHeight: '48px',
              maxHeight: '200px'
            }}
          />
          
          {/* Character count indicator for long messages */}
          {message.length > 500 && (
            <div className="absolute bottom-2 right-12 text-xs text-gray-400">
              {message.length}
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
            message.trim() && !disabled
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
              : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
          )}
          title={disabled ? "Please wait..." : "Send message (Enter)"}
        >
          {disabled ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
      
      {/* Helpful hints */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
        <span>Press Enter to send, Shift+Enter for new line</span>
        {message.length > 1000 && (
          <span className="text-yellow-600 dark:text-yellow-400">
            Long message: consider breaking it up
          </span>
        )}
      </div>
    </div>
  );
}

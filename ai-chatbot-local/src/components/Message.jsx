import { useState } from 'react';
import { Copy, Check, User, Bot, Trash2 } from 'lucide-react';
import { copyToClipboard, formatTime, cn } from '../utils/helpers';

export function Message({ message, onDelete, showActions = true }) {
  const [copied, setCopied] = useState(false);
  const [copyingCode, setCopyingCode] = useState(false);
  
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const handleCopy = async () => {
    try {
      await copyToClipboard(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const handleCopyCode = async (codeText) => {
    try {
      setCopyingCode(true);
      await copyToClipboard(codeText);
      setTimeout(() => setCopyingCode(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
      setCopyingCode(false);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Delete this message?')) {
      onDelete(message.id);
    }
  };

  // Parse content for code blocks
  const renderContent = (content) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const beforeText = content.slice(lastIndex, match.index);
        if (beforeText.trim()) {
          parts.push({
            type: 'text',
            content: beforeText,
            key: `text-${lastIndex}`
          });
        }
      }

      // Add code block
      const language = match[1] || 'text';
      const code = match[2].trim();
      parts.push({
        type: 'code',
        language,
        content: code,
        key: `code-${match.index}`
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex);
      if (remainingText.trim()) {
        parts.push({
          type: 'text',
          content: remainingText,
          key: `text-${lastIndex}`
        });
      }
    }

    // If no code blocks found, return the whole content as text
    if (parts.length === 0) {
      parts.push({
        type: 'text',
        content,
        key: 'text-only'
      });
    }

    return parts.map(part => {
      if (part.type === 'code') {
        return (
          <div key={part.key} className="my-4 rounded-lg bg-gray-900 dark:bg-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-700 text-gray-300 text-sm">
              <span>{part.language}</span>
              <button
                onClick={() => handleCopyCode(part.content)}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                {copyingCode ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-gray-100 text-sm font-mono">
                {part.content}
              </code>
            </pre>
          </div>
        );
      } else {
        return (
          <div key={part.key} className="whitespace-pre-wrap">
            {part.content}
          </div>
        );
      }
    });
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-sm rounded-lg border border-yellow-200 dark:border-yellow-800">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-3 mb-6 group", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-lg p-4 max-w-[85%] shadow-sm",
            isUser
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          )}
        >
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {renderContent(message.content)}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{formatTime(message.createdAt)}</span>
          
          {showActions && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Copy message"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
              
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit3, Settings, Moon, Sun, Search, X } from 'lucide-react';
import { formatDate, cn } from '../utils/helpers';

export function Sidebar({ 
  conversations = [], 
  currentConversation, 
  onSelectConversation, 
  onNewConversation, 
  onDeleteConversation,
  onUpdateConversation,
  onOpenSettings,
  theme,
  onToggleTheme
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditStart = (conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleEditSave = async () => {
    if (editTitle.trim() && onUpdateConversation) {
      await onUpdateConversation(editingId, { title: editTitle.trim() });
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const handleDelete = (conversation, e) => {
    e.stopPropagation();
    if (window.confirm(`Delete conversation "${conversation.title}"? This action cannot be undone.`)) {
      onDeleteConversation(conversation.id);
    }
  };

  const ConversationItem = ({ conversation }) => {
    const isSelected = currentConversation?.id === conversation.id;
    const isEditing = editingId === conversation.id;

    return (
      <div
        className={cn(
          "group relative p-3 rounded-lg cursor-pointer transition-all duration-200",
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          isSelected && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
        )}
        onClick={() => !isEditing && onSelectConversation(conversation)}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <MessageSquare className={cn(
              "w-4 h-4",
              isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
            )} />
          </div>
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleEditKeyDown}
                onBlur={handleEditSave}
                className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                autoFocus
              />
            ) : (
              <>
                <h3 className={cn(
                  "text-sm font-medium truncate",
                  isSelected ? "text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-gray-100"
                )}>
                  {conversation.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(conversation.updatedAt)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    •
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {conversation.messageCount} messages
                  </span>
                </div>
              </>
            )}
          </div>
          
          {!isEditing && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditStart(conversation);
                }}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Rename conversation"
              >
                <Edit3 className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              </button>
              <button
                onClick={(e) => handleDelete(conversation, e)}
                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Delete conversation"
              >
                <Trash2 className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          AI Chat
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Search conversations"
          >
            <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">New Chat</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8">
            {searchQuery ? (
              <div>
                <MessageSquare className="w-8 h-8 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No conversations found matching "{searchQuery}"
                </p>
              </div>
            ) : (
              <div>
                <MessageSquare className="w-8 h-8 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  No conversations yet
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Click "New Chat" to get started
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>Local AI Chat</p>
          <p>Data stored locally on your device</p>
        </div>
      </div>
    </div>
  );
}

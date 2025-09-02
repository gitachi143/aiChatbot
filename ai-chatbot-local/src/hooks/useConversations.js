import { useState, useEffect, useCallback } from 'react';
import { dbHelpers } from '../services/database';

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when current conversation changes
  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
    } else {
      setMessages([]);
    }
  }, [currentConversation]);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const convos = await dbHelpers.getConversations();
      setConversations(convos);
      
      // If no current conversation but conversations exist, select the first one
      if (!currentConversation && convos.length > 0) {
        setCurrentConversation(convos[0]);
      }
    } catch (err) {
      setError('Failed to load conversations');
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [currentConversation]);

  const loadMessages = useCallback(async (conversationId) => {
    try {
      const msgs = await dbHelpers.getMessages(conversationId);
      setMessages(msgs);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error loading messages:', err);
    }
  }, []);

  const createNewConversation = useCallback(async (title, provider = 'openai', model = 'gpt-4') => {
    try {
      const newConvo = await dbHelpers.createConversation(title, provider, model);
      setConversations(prev => [newConvo, ...prev]);
      setCurrentConversation(newConvo);
      setMessages([]);
      return newConvo;
    } catch (err) {
      setError('Failed to create conversation');
      console.error('Error creating conversation:', err);
      return null;
    }
  }, []);

  const selectConversation = useCallback((conversation) => {
    setCurrentConversation(conversation);
  }, []);

  const updateConversation = useCallback(async (id, updates) => {
    try {
      await dbHelpers.updateConversation(id, updates);
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.id === id ? { ...conv, ...updates } : conv
        )
      );
      
      if (currentConversation && currentConversation.id === id) {
        setCurrentConversation(prev => ({ ...prev, ...updates }));
      }
    } catch (err) {
      setError('Failed to update conversation');
      console.error('Error updating conversation:', err);
    }
  }, [currentConversation]);

  const deleteConversation = useCallback(async (id) => {
    try {
      await dbHelpers.deleteConversation(id);
      
      // Update local state
      setConversations(prev => prev.filter(conv => conv.id !== id));
      
      // If deleting current conversation, select another or clear
      if (currentConversation && currentConversation.id === id) {
        const remaining = conversations.filter(conv => conv.id !== id);
        if (remaining.length > 0) {
          setCurrentConversation(remaining[0]);
        } else {
          setCurrentConversation(null);
          setMessages([]);
        }
      }
    } catch (err) {
      setError('Failed to delete conversation');
      console.error('Error deleting conversation:', err);
    }
  }, [currentConversation, conversations]);

  const addMessage = useCallback(async (role, content, metadata = {}) => {
    if (!currentConversation) {
      throw new Error('No active conversation');
    }

    try {
      const newMessage = await dbHelpers.addMessage(
        currentConversation.id,
        role,
        content,
        metadata
      );
      
      // Update local messages
      setMessages(prev => [...prev, newMessage]);
      
      // Update conversation in local state
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversation.id 
            ? { 
                ...conv, 
                messageCount: conv.messageCount + 1,
                updatedAt: Date.now()
              }
            : conv
        )
      );
      
      return newMessage;
    } catch (err) {
      setError('Failed to add message');
      console.error('Error adding message:', err);
      throw err;
    }
  }, [currentConversation]);

  const deleteMessage = useCallback(async (messageId) => {
    try {
      await dbHelpers.deleteMessage(messageId);
      
      // Update local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      // Update conversation message count
      if (currentConversation) {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === currentConversation.id 
              ? { 
                  ...conv, 
                  messageCount: Math.max(0, conv.messageCount - 1),
                  updatedAt: Date.now()
                }
              : conv
          )
        );
      }
    } catch (err) {
      setError('Failed to delete message');
      console.error('Error deleting message:', err);
    }
  }, [currentConversation]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    loadConversations,
    createNewConversation,
    selectConversation,
    updateConversation,
    deleteConversation,
    addMessage,
    deleteMessage,
    clearError
  };
}

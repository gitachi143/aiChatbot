import Dexie from 'dexie';

export class ChatbotDatabase extends Dexie {
  constructor() {
    super('ChatbotDatabase');
    
    this.version(1).stores({
      conversations: '++id, title, createdAt, updatedAt, messageCount, provider, model',
      messages: '++id, conversationId, role, content, createdAt, tokens, metadata',
      settings: '&id, data'
    });
  }
}

export const db = new ChatbotDatabase();

// Database helper functions
export const dbHelpers = {
  // Conversation operations
  async createConversation(title = 'New Chat', provider = 'openai', model = 'gpt-4') {
    const now = Date.now();
    const id = await db.conversations.add({
      title,
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
      provider,
      model
    });
    return await db.conversations.get(id);
  },

  async getConversations() {
    return await db.conversations.orderBy('updatedAt').reverse().toArray();
  },

  async updateConversation(id, updates) {
    return await db.conversations.update(id, {
      ...updates,
      updatedAt: Date.now()
    });
  },

  async deleteConversation(id) {
    // Delete all messages in the conversation first
    await db.messages.where('conversationId').equals(id).delete();
    // Then delete the conversation
    return await db.conversations.delete(id);
  },

  // Message operations
  async addMessage(conversationId, role, content, metadata = {}) {
    const message = await db.messages.add({
      conversationId,
      role,
      content,
      createdAt: Date.now(),
      tokens: metadata.tokens || 0,
      metadata
    });

    // Update conversation message count and timestamp
    const conversation = await db.conversations.get(conversationId);
    if (conversation) {
      await db.conversations.update(conversationId, {
        messageCount: conversation.messageCount + 1,
        updatedAt: Date.now(),
        // Auto-generate title from first user message
        title: conversation.messageCount === 0 && role === 'user' 
          ? this.generateTitle(content)
          : conversation.title
      });
    }

    return await db.messages.get(message);
  },

  async getMessages(conversationId) {
    return await db.messages
      .where('conversationId')
      .equals(conversationId)
      .orderBy('createdAt')
      .toArray();
  },

  async deleteMessage(id) {
    const message = await db.messages.get(id);
    if (message) {
      // Update conversation message count
      const conversation = await db.conversations.get(message.conversationId);
      if (conversation && conversation.messageCount > 0) {
        await db.conversations.update(message.conversationId, {
          messageCount: conversation.messageCount - 1,
          updatedAt: Date.now()
        });
      }
    }
    return await db.messages.delete(id);
  },

  // Settings operations
  async saveSetting(key, value) {
    return await db.settings.put({ id: key, data: value });
  },

  async getSetting(key, defaultValue = null) {
    const setting = await db.settings.get(key);
    return setting ? setting.data : defaultValue;
  },

  async deleteSetting(key) {
    return await db.settings.delete(key);
  },

  // Utility functions
  generateTitle(content) {
    // Generate a title from the first 50 characters of content
    const cleanContent = content.replace(/\n/g, ' ').trim();
    return cleanContent.length > 50 
      ? cleanContent.substring(0, 47) + '...'
      : cleanContent || 'New Chat';
  },

  // Export/Import functions
  async exportData() {
    const conversations = await this.getConversations();
    const messages = await db.messages.toArray();
    const settings = await db.settings.toArray();
    
    return {
      conversations,
      messages,
      settings,
      exportedAt: Date.now(),
      version: 1
    };
  },

  async importData(data) {
    try {
      // Clear existing data
      await db.conversations.clear();
      await db.messages.clear();
      
      // Import new data
      if (data.conversations) {
        await db.conversations.bulkAdd(data.conversations);
      }
      if (data.messages) {
        await db.messages.bulkAdd(data.messages);
      }
      if (data.settings) {
        await db.settings.bulkPut(data.settings);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  },

  // Search functionality
  async searchMessages(query) {
    const lowercaseQuery = query.toLowerCase();
    return await db.messages
      .filter(message => 
        message.content.toLowerCase().includes(lowercaseQuery)
      )
      .toArray();
  }
};

// Initialize default settings on first run
db.ready(() => {
  db.settings.get('preferences').then(setting => {
    if (!setting) {
      dbHelpers.saveSetting('preferences', {
        theme: 'dark',
        defaultProvider: 'openai',
        defaultModel: 'gpt-4',
        fontSize: 'medium',
        autoSave: true,
        streamResponse: true
      });
    }
  });
});

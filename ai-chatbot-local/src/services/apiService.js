// API Service for communicating with different AI providers

export const API_PROVIDERS = {
  OPENAI: 'openai',
  GEMINI: 'gemini'
};

export const MODELS = {
  [API_PROVIDERS.OPENAI]: {
    'gpt-4o': 'GPT-4o',
    'gpt-4o-mini': 'GPT-4o Mini',
    'gpt-4-turbo': 'GPT-4 Turbo',
    'gpt-3.5-turbo': 'GPT-3.5 Turbo'
  },
  [API_PROVIDERS.GEMINI]: {
    'gemini-1.5-pro': 'Gemini 1.5 Pro',
    'gemini-1.5-flash': 'Gemini 1.5 Flash',
    'gemini-pro': 'Gemini Pro'
  }
};

class APIError extends Error {
  constructor(message, status, provider) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.provider = provider;
  }
}

export class APIService {
  constructor() {
    this.apiKeys = {};
  }

  setApiKey(provider, key) {
    this.apiKeys[provider] = key;
  }

  getApiKey(provider) {
    return this.apiKeys[provider];
  }

  async sendMessage(messages, provider, model, options = {}) {
    const apiKey = this.getApiKey(provider);
    if (!apiKey) {
      throw new APIError(`API key not found for ${provider}`, 401, provider);
    }

    switch (provider) {
      case API_PROVIDERS.OPENAI:
        return await this.sendOpenAIMessage(messages, model, apiKey, options);
      case API_PROVIDERS.GEMINI:
        return await this.sendGeminiMessage(messages, model, apiKey, options);
      default:
        throw new APIError(`Unsupported provider: ${provider}`, 400, provider);
    }
  }

  async sendOpenAIMessage(messages, model, apiKey, options = {}) {
    const {
      temperature = 0.7,
      maxTokens = 4000,
      stream = false
    } = options;

    const requestBody = {
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature,
      max_tokens: maxTokens,
      stream
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.error?.message || `HTTP ${response.status}`,
          response.status,
          API_PROVIDERS.OPENAI
        );
      }

      if (stream) {
        return this.handleOpenAIStream(response);
      } else {
        const data = await response.json();
        return {
          content: data.choices[0].message.content,
          usage: data.usage,
          model: data.model,
          finishReason: data.choices[0].finish_reason
        };
      }
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        `Network error: ${error.message}`,
        0,
        API_PROVIDERS.OPENAI
      );
    }
  }

  async sendGeminiMessage(messages, model, apiKey, options = {}) {
    const {
      temperature = 0.7,
      maxTokens = 4000,
      stream = false,
      onStream = null
    } = options;

    // Convert messages to Gemini format
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const requestBody = {
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        candidateCount: 1
      }
    };

    try {
      // Use streaming endpoint if streaming is enabled
      const endpoint = stream 
        ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}&alt=sse`
        : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.error?.message || `HTTP ${response.status}`,
          response.status,
          API_PROVIDERS.GEMINI
        );
      }

      if (stream) {
        return await this.handleGeminiStream(response, onStream);
      } else {
        const data = await response.json();
        const candidate = data.candidates?.[0];
        
        if (!candidate || !candidate.content) {
          throw new APIError(
            'No response generated',
            500,
            API_PROVIDERS.GEMINI
          );
        }

        return {
          content: candidate.content.parts[0].text,
          usage: data.usageMetadata,
          model,
          finishReason: candidate.finishReason
        };
      }
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        `Network error: ${error.message}`,
        0,
        API_PROVIDERS.GEMINI
      );
    }
  }

  async handleGeminiStream(response, onStream) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    
    try {
      while (true) {
        const { value, done } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const candidate = parsed.candidates?.[0];
              
              if (candidate?.content?.parts?.[0]?.text) {
                const newText = candidate.content.parts[0].text;
                fullContent += newText;
                
                // Call the streaming callback with the new text
                if (onStream) {
                  onStream(newText);
                }
              }
            } catch (e) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      }
      
      return {
        content: fullContent,
        usage: null,
        model: 'gemini-stream',
        finishReason: 'stop'
      };
    } finally {
      reader.releaseLock();
    }
  }

  async handleOpenAIStream(response) {
    // This is a simplified version - full streaming implementation would be more complex
    // For now, we'll return a placeholder that indicates streaming is not yet implemented
    throw new APIError(
      'Streaming not yet implemented',
      501,
      API_PROVIDERS.OPENAI
    );
  }

  async validateApiKey(provider, apiKey) {
    try {
      const testMessages = [{ role: 'user', content: 'Hello' }];
      const testModel = provider === API_PROVIDERS.OPENAI ? 'gpt-3.5-turbo' : 'gemini-pro';
      
      this.setApiKey(provider, apiKey);
      await this.sendMessage(testMessages, provider, testModel, { maxTokens: 10 });
      return true;
    } catch (error) {
      return false;
    }
  }

  getAvailableModels(provider) {
    return MODELS[provider] || {};
  }

  formatErrorMessage(error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case 401:
          return 'Invalid API key. Please check your credentials.';
        case 403:
          return 'Access forbidden. Check your API key permissions.';
        case 429:
          return 'Rate limit exceeded. Please wait a moment and try again.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return error.message || 'An error occurred while communicating with the AI service.';
      }
    }
    return 'An unexpected error occurred.';
  }
}

export const apiService = new APIService();
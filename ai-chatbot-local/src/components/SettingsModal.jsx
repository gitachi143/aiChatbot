import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Key, Download, Upload, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { API_PROVIDERS, MODELS, apiService } from '../services/apiService';
import { dbHelpers } from '../services/database';
import { downloadFile, readFile, cn } from '../utils/helpers';

export function SettingsModal({ isOpen, onClose, onApiKeysChange }) {
  const [apiKeys, setApiKeys] = useState({
    [API_PROVIDERS.OPENAI]: '',
    [API_PROVIDERS.GEMINI]: ''
  });
  const [showApiKeys, setShowApiKeys] = useState({
    [API_PROVIDERS.OPENAI]: false,
    [API_PROVIDERS.GEMINI]: false
  });
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    defaultProvider: API_PROVIDERS.OPENAI,
    defaultModel: 'gpt-4',
    fontSize: 'medium',
    autoSave: true
  });
  const [validating, setValidating] = useState({});
  const [validationResults, setValidationResults] = useState({});
  const [saving, setSaving] = useState(false);

  // Load settings when modal opens
  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      const savedApiKeys = await dbHelpers.getSetting('apiKeys', {});
      const savedPreferences = await dbHelpers.getSetting('preferences', preferences);
      
      setApiKeys({ ...apiKeys, ...savedApiKeys });
      setPreferences(savedPreferences);
      
      // Set API keys in service
      Object.entries(savedApiKeys).forEach(([provider, key]) => {
        if (key) {
          apiService.setApiKey(provider, key);
        }
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleApiKeyChange = (provider, value) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
    // Clear validation result when key changes
    setValidationResults(prev => ({ ...prev, [provider]: null }));
  };

  const validateApiKey = async (provider) => {
    const key = apiKeys[provider]?.trim();
    if (!key) return;

    setValidating(prev => ({ ...prev, [provider]: true }));
    
    try {
      const isValid = await apiService.validateApiKey(provider, key);
      setValidationResults(prev => ({ 
        ...prev, 
        [provider]: { valid: isValid, message: isValid ? 'Valid API key' : 'Invalid API key' }
      }));
    } catch (error) {
      setValidationResults(prev => ({ 
        ...prev, 
        [provider]: { valid: false, message: 'Failed to validate API key' }
      }));
    } finally {
      setValidating(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Save API keys
      const keysToSave = {};
      Object.entries(apiKeys).forEach(([provider, key]) => {
        if (key?.trim()) {
          keysToSave[provider] = key.trim();
          apiService.setApiKey(provider, key.trim());
        }
      });
      
      await dbHelpers.saveSetting('apiKeys', keysToSave);
      await dbHelpers.saveSetting('preferences', preferences);
      
      if (onApiKeysChange) {
        onApiKeysChange(keysToSave);
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const exportSettings = async () => {
    try {
      const data = await dbHelpers.exportData();
      const exportData = {
        ...data,
        apiKeys: apiKeys, // Include current API keys
        preferences: preferences
      };
      
      const content = JSON.stringify(exportData, null, 2);
      const filename = `ai-chat-backup-${new Date().toISOString().split('T')[0]}.json`;
      downloadFile(content, filename);
    } catch (error) {
      console.error('Failed to export settings:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const importSettings = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const content = await readFile(file);
      const data = JSON.parse(content);
      
      if (data.apiKeys) {
        setApiKeys(prev => ({ ...prev, ...data.apiKeys }));
      }
      
      if (data.preferences) {
        setPreferences(data.preferences);
      }
      
      if (data.conversations && data.messages) {
        const confirmImport = window.confirm(
          'This will replace all your existing conversations. Are you sure you want to continue?'
        );
        
        if (confirmImport) {
          await dbHelpers.importData(data);
          alert('Data imported successfully! Please refresh the page.');
        }
      }
    } catch (error) {
      console.error('Failed to import settings:', error);
      alert('Failed to import data. Please check the file format.');
    }
    
    // Reset file input
    event.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* API Keys Section */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Keys
            </h3>
            
            <div className="space-y-6">
              {/* OpenAI */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    OpenAI API Key
                  </label>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Get API Key <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                <div className="relative">
                  <input
                    type={showApiKeys[API_PROVIDERS.OPENAI] ? 'text' : 'password'}
                    value={apiKeys[API_PROVIDERS.OPENAI]}
                    onChange={(e) => handleApiKeyChange(API_PROVIDERS.OPENAI, e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => validateApiKey(API_PROVIDERS.OPENAI)}
                      disabled={!apiKeys[API_PROVIDERS.OPENAI]?.trim() || validating[API_PROVIDERS.OPENAI]}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                      title="Validate API key"
                    >
                      {validating[API_PROVIDERS.OPENAI] ? (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowApiKeys(prev => ({ 
                        ...prev, 
                        [API_PROVIDERS.OPENAI]: !prev[API_PROVIDERS.OPENAI] 
                      }))}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {showApiKeys[API_PROVIDERS.OPENAI] ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                
                {validationResults[API_PROVIDERS.OPENAI] && (
                  <div className={cn(
                    "mt-2 flex items-center gap-2 text-sm",
                    validationResults[API_PROVIDERS.OPENAI].valid 
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  )}>
                    {validationResults[API_PROVIDERS.OPENAI].valid ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {validationResults[API_PROVIDERS.OPENAI].message}
                  </div>
                )}
              </div>

              {/* Gemini */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Google Gemini API Key
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Get API Key <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                <div className="relative">
                  <input
                    type={showApiKeys[API_PROVIDERS.GEMINI] ? 'text' : 'password'}
                    value={apiKeys[API_PROVIDERS.GEMINI]}
                    onChange={(e) => handleApiKeyChange(API_PROVIDERS.GEMINI, e.target.value)}
                    placeholder="AIza..."
                    className="w-full px-3 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => validateApiKey(API_PROVIDERS.GEMINI)}
                      disabled={!apiKeys[API_PROVIDERS.GEMINI]?.trim() || validating[API_PROVIDERS.GEMINI]}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                      title="Validate API key"
                    >
                      {validating[API_PROVIDERS.GEMINI] ? (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowApiKeys(prev => ({ 
                        ...prev, 
                        [API_PROVIDERS.GEMINI]: !prev[API_PROVIDERS.GEMINI] 
                      }))}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {showApiKeys[API_PROVIDERS.GEMINI] ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                
                {validationResults[API_PROVIDERS.GEMINI] && (
                  <div className={cn(
                    "mt-2 flex items-center gap-2 text-sm",
                    validationResults[API_PROVIDERS.GEMINI].valid 
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  )}>
                    {validationResults[API_PROVIDERS.GEMINI].valid ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {validationResults[API_PROVIDERS.GEMINI].message}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Preferences
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Provider
                </label>
                <select
                  value={preferences.defaultProvider}
                  onChange={(e) => setPreferences(prev => ({ ...prev, defaultProvider: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value={API_PROVIDERS.OPENAI}>OpenAI</option>
                  <option value={API_PROVIDERS.GEMINI}>Google Gemini</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Model
                </label>
                <select
                  value={preferences.defaultModel}
                  onChange={(e) => setPreferences(prev => ({ ...prev, defaultModel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {Object.entries(MODELS[preferences.defaultProvider] || {}).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Data Management Section */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Data Management
            </h3>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportSettings}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
              
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={importSettings}
                  className="hidden"
                />
              </label>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Export your conversations and settings as a backup, or import from a previous backup.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your API keys are stored locally and never sent to our servers.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

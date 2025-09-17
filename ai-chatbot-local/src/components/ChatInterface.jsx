import { useState, useRef, useEffect } from 'react';
import { apiService, API_PROVIDERS } from '../services/apiService';
import { findMatchingAds, AdTracker } from '../utils/adMatcher';
import InlineAd, { StickyMiniAd, CompactInlineAd } from './InlineAd';
import ThemeToggle from './ThemeToggle';

// Simple ChatGPT-style formatting component with ad injection
function FormattedMessage({ content, isStreaming = false, adToShow = null, onAdBecomeSticky, onAdLeaveSticky, onAdInjected = null }) {
  // Split content into lines and process each line
  const formatText = (text) => {
    const lines = text.split('\n');
    const formattedLines = [];
    let adInjected = false; // Track if we've already injected an ad
    let sectionCount = 0; // Track number of sections for ad placement
    let processedContentLength = 0; // Track how much content we've processed
    let linesProcessedSinceLastSection = 0; // Lines since last section
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      processedContentLength += line.length;
      linesProcessedSinceLastSection++;
      
      // Skip empty lines but preserve spacing
      if (line.trim() === '') {
        formattedLines.push(
          <div key={`empty-${i}`} className="h-3"></div>
        );
        continue;
      }
      
      // Check if we should inject ad after sufficient content from first section
      if (!adInjected && adToShow && sectionCount >= 1 && 
          linesProcessedSinceLastSection >= 4 && processedContentLength >= 250) {
        console.log(`🎯 Injecting ad after sufficient content (${processedContentLength} chars, ${linesProcessedSinceLastSection} lines since section)`);
        
        // Add divider before ad
        formattedLines.push(
          <div key={`ad-divider-before-${i}`} className="my-4">
            <hr className="border border-white dark:border-white" />
          </div>
        );
        
        // Add the ad
        formattedLines.push(
          <div key={`ad-content-${i}`}>
            <CompactInlineAd 
              ad={adToShow} 
              onBecomeSticky={onAdBecomeSticky}
              onLeaveSticky={onAdLeaveSticky}
            />
          </div>
        );
        adInjected = true;
        // Notify that ad was injected - delay during streaming to avoid freezing
        if (onAdInjected && !isStreaming) {
          onAdInjected(adToShow);
        } else if (onAdInjected && isStreaming) {
          // Delay the callback during streaming to avoid interfering
          setTimeout(() => onAdInjected(adToShow), 100);
        }
      }
      
      // Large headers (lines that end with : and are short)
      if (line.endsWith(':') && line.length < 50 && !line.includes('http')) {
        sectionCount++;
        linesProcessedSinceLastSection = 0; // Reset counter for new section
        
        // Add divider before header (except for first header)
        const isFirstHeader = formattedLines.length === 0 || 
          !formattedLines.some(element => 
            element?.props?.children?.props?.className?.includes('font-bold')
          );
        
        if (!isFirstHeader) {
          formattedLines.push(
            <div key={`divider-${i}`} className="my-6">
              <hr className="border border-white dark:border-white" />
            </div>
          );
        }
        
        formattedLines.push(
          <div key={i}>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-3">
              {line.slice(0, -1)}
            </h2>
          </div>
        );
        continue;
      }
      
      // Medium headers (lines that start with ## or are ALL CAPS and short)
      if (line.startsWith('## ') || (line === line.toUpperCase() && line.length < 40 && /^[A-Z\s]+$/.test(line))) {
        const headerText = line.startsWith('## ') ? line.slice(3) : line;
        sectionCount++;
        linesProcessedSinceLastSection = 0; // Reset counter for new section
        
        // Add divider before header (except for first header)
        const isFirstHeader = formattedLines.length === 0 || 
          !formattedLines.some(element => 
            element?.props?.children?.props?.className?.includes('font-')
          );
        
        if (!isFirstHeader) {
          formattedLines.push(
            <div key={`divider-${i}`} className="my-6">
              <hr className="border border-white dark:border-white" />
            </div>
          );
        }
        
        formattedLines.push(
          <div key={i}>
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mt-4 mb-2">
              {headerText}
            </h3>
          </div>
        );
        continue;
      }
      
      // Small headers (lines that start with # )
      if (line.startsWith('# ')) {
        sectionCount++;
        linesProcessedSinceLastSection = 0; // Reset counter for new section
        
        // Add divider before header (except for first header)
        const isFirstHeader = formattedLines.length === 0 || 
          !formattedLines.some(element => 
            element?.props?.children?.props?.className?.includes('font-')
          );
        
        if (!isFirstHeader) {
          formattedLines.push(
            <div key={`divider-${i}`} className="my-6">
              <hr className="border border-white dark:border-white" />
            </div>
          );
        }
        
        formattedLines.push(
          <div key={i}>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mt-4 mb-2">
              {line.slice(2)}
            </h4>
          </div>
        );
        continue;
      }
      
      // List items (lines that start with - or *)
      if (line.match(/^\s*[-*]\s/)) {
        formattedLines.push(
          <div key={i} className="flex items-start gap-2 my-1">
            <span className="text-gray-600 dark:text-gray-400 mt-1">•</span>
            <span className="text-sm leading-relaxed text-gray-900 dark:text-gray-100 flex-1">
              {line.replace(/^\s*[-*]\s/, '')}
            </span>
          </div>
        );
        continue;
      }
      
      // Numbered list items
      if (line.match(/^\s*\d+\.\s/)) {
        const match = line.match(/^\s*(\d+)\.\s(.*)$/);
        if (match) {
          formattedLines.push(
            <div key={i} className="flex items-start gap-2 my-1">
              <span className="text-blue-600 dark:text-blue-400 font-medium text-sm mt-0.5 min-w-[20px]">
                {match[1]}.
              </span>
              <span className="text-sm leading-relaxed text-gray-900 dark:text-gray-100 flex-1">
                {match[2]}
              </span>
            </div>
          );
          continue;
        }
      }
      
      // Code blocks (lines with code-like patterns)
      if (line.includes('```') || line.match(/^\s*[{}()[\];]/)) {
        formattedLines.push(
          <div key={i} className="my-2">
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-900 dark:text-gray-100 block">
              {line}
            </code>
          </div>
        );
        continue;
      }
      
      // Section dividers (lines with --- or ===)
      if (line.match(/^[-=]{3,}$/)) {
        formattedLines.push(
          <div key={i} className="my-4">
            <hr className="border border-white dark:border-white" />
          </div>
        );
        continue;
      }
      
      // Regular paragraphs
      formattedLines.push(
        <p key={i} className="text-sm leading-relaxed text-gray-900 dark:text-gray-100 mb-3 last:mb-0">
          {line}
        </p>
      );
    }
    
    // If we have an ad but haven't placed it yet, place it strategically
    if (!adInjected && adToShow) {
      const textLength = text.replace(/\s+/g, ' ').length;
      const shouldPlaceFallbackAd = !isStreaming || textLength > 300; // Place during streaming if enough content
      
      if (shouldPlaceFallbackAd) {
        console.log(`🎯 Placing fallback ad: ${adToShow.title} (textLength: ${textLength}, streaming: ${isStreaming}, sections: ${sectionCount})`);
        
        // Add divider before ad
        formattedLines.push(
          <div key="ad-divider-fallback" className="my-4">
            <hr className="border border-white dark:border-white" />
          </div>
        );
        
        // Add the ad
        formattedLines.push(
          <div key="ad-fallback">
            <CompactInlineAd 
              ad={adToShow} 
              onBecomeSticky={onAdBecomeSticky}
              onLeaveSticky={onAdLeaveSticky}
            />
          </div>
        );
        adInjected = true;
        // Notify that ad was injected - delay during streaming to avoid freezing
        if (onAdInjected && !isStreaming) {
          onAdInjected(adToShow);
        } else if (onAdInjected && isStreaming) {
          // Delay the callback during streaming to avoid interfering
          setTimeout(() => onAdInjected(adToShow), 100);
        }
      }
    } else if (adInjected && adToShow) {
      console.log(`✅ Ad already placed, skipping fallback for: ${adToShow.title}`);
    }
    
    return formattedLines;
  };

  return (
    <div className="text-formatting">
      {formatText(content)}
      {isStreaming && (
        <span className="inline-block w-2 h-5 bg-gray-900 dark:bg-gray-100 ml-1 animate-pulse align-top"></span>
      )}
    </div>
  );
}

// Available Gemini models
const GEMINI_MODELS = {
  'gemini-1.5-pro': {
    name: 'Gemini 1.5 Pro',
    description: 'Most capable model, slower but more intelligent',
    icon: ''
  },
  'gemini-1.5-flash': {
    name: 'Gemini 1.5 Flash', 
    description: 'Fastest model, quick responses',
    icon: ''
  }
};

function ChatInterface({ onBackToHome }) {
  const [showSettings, setShowSettings] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState(null);
  const [settings, setSettings] = useState({
    geminiKey: localStorage.getItem('gemini_api_key') || '',
    defaultModel: localStorage.getItem('default_gemini_model') || 'gemini-1.5-flash',
    enableStreaming: localStorage.getItem('enable_streaming') !== 'false'
  });
  
  // Ad network state
  const [adTracker] = useState(() => new AdTracker());
  const [messageAds, setMessageAds] = useState(new Map()); // Map of message IDs to ads
  const [stickyAd, setStickyAd] = useState(null); // Current sticky ad
  
  const messagesEndRef = useRef(null);
  const streamingContentRef = useRef('');
  const textareaRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const autoScrollTimeoutRef = useRef(null);

  // Check if user is near bottom of chat
  const isNearBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    
    const threshold = 100; // pixels from bottom
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < threshold;
  };

  // Smart scroll to bottom - only if user hasn't scrolled up
  const scrollToBottom = () => {
    if (shouldAutoScroll && !isUserScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle scroll events to detect manual scrolling
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    setIsUserScrolling(true);
    
    // Clear existing timeout
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
    }
    
    // If user scrolled near bottom, resume auto-scroll
    if (isNearBottom()) {
      setShouldAutoScroll(true);
      setIsUserScrolling(false);
    } else {
      setShouldAutoScroll(false);
      
      // Resume auto-scroll after user stops scrolling for 2 seconds
      autoScrollTimeoutRef.current = setTimeout(() => {
        if (isNearBottom()) {
          setShouldAutoScroll(true);
          setIsUserScrolling(false);
        }
      }, 2000);
    }
  };

  // Attach scroll listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        container.removeEventListener('scroll', handleScroll);
        if (autoScrollTimeoutRef.current) {
          clearTimeout(autoScrollTimeoutRef.current);
        }
      };
    }
  }, []);

  // Auto-scroll when messages change, but only if appropriate
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 50); // Small delay to let content render
    
    return () => clearTimeout(timeoutId);
  }, [messages, streamingContent, shouldAutoScroll]);

  // Update message ads when messages change - preserve existing ads, only add new ones
  useEffect(() => {
    if (messages.length === 0) {
      setMessageAds(new Map());
      return;
    }

    // Preserve existing ads and only add new ones if no ad exists yet
    setMessageAds(prevMessageAds => {
      const newMessageAds = new Map(prevMessageAds); // Copy existing ads
      let adPlaced = Array.from(prevMessageAds.values()).length > 0; // Check if any ad already exists
      
      // Only check messages that don't already have ads
      messages.forEach(message => {
        if (message.role === 'assistant' && !adPlaced && !newMessageAds.has(message.id)) {
          const ad = determineAdPlacement(message, messages);
          if (ad) {
            console.log(`🔄 useEffect setting initial ad: ${ad.title} for message ${message.id}`);
            newMessageAds.set(message.id, ad);
            adPlaced = true; // Prevent additional ads
          }
        }
      });
      
      return newMessageAds;
    });
  }, [messages, currentConversation?.id]);

  // Dark theme is now managed by ThemeProvider

  // Set Gemini API key in service when it changes
  useEffect(() => {
    if (settings.geminiKey) {
      apiService.setApiKey(API_PROVIDERS.GEMINI, settings.geminiKey);
      console.log('API key set in service:', settings.geminiKey.substring(0, 8) + '...');
    } else {
      apiService.clearApiKey(API_PROVIDERS.GEMINI);
      console.log('API key cleared from service');
    }
  }, [settings.geminiKey]);

  // Load API key from localStorage on initial mount
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey && storedKey !== settings.geminiKey) {
      setSettings(prev => ({
        ...prev,
        geminiKey: storedKey
      }));
    }
  }, []);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [newMessage]);

  // Function to determine and place ads for AI messages - now checks immediately
  const determineAdPlacement = (message, allMessages) => {
    // Only place ads for assistant messages
    if (message.role !== 'assistant' || !message.content) return null;
    
    // Get recent context including current message and previous user message
    const messageIndex = allMessages.findIndex(m => m.id === message.id);
    const contextMessages = allMessages
      .slice(Math.max(0, messageIndex - 1), messageIndex + 1) // Include user message + AI response
      .map(msg => msg.content)
      .join(' ');
    
    // Find matching ads immediately based on content
    const shownAds = adTracker.getShownAds(currentConversation?.id);
    const recentAds = adTracker.getRecentAds();
    
    const matchingAds = findMatchingAds(contextMessages, {
      maxAds: 1,
      minScore: 10, // Adjusted for new scoring system (was 5)
      excludeAdIds: shownAds,
      recentAdIds: recentAds
    });
    
    if (matchingAds.length > 0) {
      const selectedAd = matchingAds[0].ad;
      // Mark ad as shown
      if (currentConversation?.id) {
        adTracker.markAdShown(currentConversation.id, selectedAd.id);
      }
      return selectedAd;
    }
    
    return null;
  };
  
  // Function to check for ad matches during user input
  const checkForInputAd = (userInput) => {
    if (!userInput || !currentConversation?.id) return null;
    
    const shownAds = adTracker.getShownAds(currentConversation.id);
    const recentAds = adTracker.getRecentAds();
    
    const matchingAds = findMatchingAds(userInput, {
      maxAds: 1,
      minScore: 15, // Adjusted for new scoring system (was 7)
      excludeAdIds: shownAds,
      recentAdIds: recentAds
    });
    
    if (matchingAds.length > 0) {
      const selectedAd = matchingAds[0].ad;
      adTracker.markAdShown(currentConversation.id, selectedAd.id);
      return selectedAd;
    }
    
    return null;
  };

  // Function to check for ad matches during streaming
  const checkForStreamingAd = (combinedContent, messageId) => {
    if (!combinedContent || !currentConversation?.id) return null;
    
    const shownAds = adTracker.getShownAds(currentConversation.id);
    const recentAds = adTracker.getRecentAds();
    
    const matchingAds = findMatchingAds(combinedContent, {
      maxAds: 1,
      minScore: 15, // Adjusted for new scoring system (was 6)
      excludeAdIds: shownAds,
      recentAdIds: recentAds
    });
    
    console.log(`🎯 Found ${matchingAds.length} matching ads for streaming`);
    if (matchingAds.length > 0) {
      console.log(`Best match: ${matchingAds[0].ad.title} (score: ${matchingAds[0].relevanceScore})`);
      const selectedAd = matchingAds[0].ad;
      adTracker.markAdShown(currentConversation.id, selectedAd.id);
      return selectedAd;
    }
    
    return null;
  };

  // Sticky ad handlers
  const handleAdBecomeSticky = (adData) => {
    setStickyAd(adData);
  };

  const handleAdLeaveSticky = (adId) => {
    setStickyAd(prev => prev?.id === adId ? null : prev);
  };

  const handleScrollToStickyAd = () => {
    if (stickyAd?.element) {
      stickyAd.element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  const handleCloseStickyAd = () => {
    setStickyAd(null);
  };

  const handleNewConversation = () => {
    const modelInfo = GEMINI_MODELS[settings.defaultModel];
    const newConv = {
      id: Date.now(),
      title: 'New Chat',
      createdAt: Date.now(),
      model: settings.defaultModel,
      modelName: modelInfo.name
    };
    setConversations([newConv, ...conversations]);
    setCurrentConversation(newConv);
    setMessages([]);
    setError(null);
    setStreamingContent('');
    setIsStreaming(false);
    setCurrentMessageId(null);
    setMessageAds(new Map()); // Clear ads for new conversation
    setStickyAd(null); // Clear sticky ad for new conversation
  };

  // Enhanced smooth streaming with better character timing
  const simulateSmootherStreaming = (fullText, callback, onComplete) => {
    if (!fullText || fullText.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    let currentIndex = 0;
    let currentText = '';
    
    const streamNextChunk = () => {
      if (currentIndex < fullText.length) {
        // Add 1-3 characters at a time for more realistic typing
        const chunkSize = Math.min(
          Math.random() > 0.8 ? 3 : Math.random() > 0.5 ? 2 : 1,
          fullText.length - currentIndex
        );
        
        const nextChunk = fullText.substring(currentIndex, currentIndex + chunkSize);
        currentText += nextChunk;
        currentIndex += chunkSize;
        
        callback(currentText);
        
        // Variable delay based on content type - more realistic timing
        let delay = 30; // Base delay
        
        if (nextChunk.includes('\n\n')) delay = 200; // Long pause for paragraph breaks
        else if (nextChunk.includes('\n')) delay = 120; // Pause at line breaks
        else if (nextChunk.match(/[.!?]/)) delay = 180; // Pause at sentence endings
        else if (nextChunk.match(/[,;:]/)) delay = 100; // Small pause at commas
        else if (nextChunk.includes(' ')) delay = 60; // Slight pause at spaces
        else delay = Math.random() * 30 + 25; // 25-55ms for normal characters
        
        setTimeout(streamNextChunk, delay);
      } else {
        // Streaming complete
        if (onComplete) onComplete();
      }
    };

    streamNextChunk();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversation || isLoading || isStreaming) return;

    // Check if Gemini API key is available
    if (!settings.geminiKey) {
      setError('Please add your Gemini API key in settings.');
      setShowSettings(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setStreamingContent(''); // Clear previous streaming content
    setCurrentMessageId(null); // Clear previous streaming message ID

    try {
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: newMessage.trim(),
        timestamp: Date.now()
      };

      // Check for ad match in user input immediately
      const inputAd = checkForInputAd(newMessage.trim());
      
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setNewMessage('');
      
      // If we found an ad from user input, we'll use it for the AI response

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      console.log(`Sending message to Gemini ${currentConversation.model}...`);
      console.log('=== SEND MESSAGE DEBUG ===');
      console.log('Current API key:', settings.geminiKey ? settings.geminiKey.substring(0, 8) + '...' : 'Not set');
      console.log('Service has key:', apiService.getApiKey(API_PROVIDERS.GEMINI) ? 'Yes' : 'No');
      console.log('Model:', currentConversation.model);
      console.log('Message count:', updatedMessages.length);
      console.log('==============================');
      
      // Prepare messages for API with formatting instructions
      const apiMessages = [
        {
          role: 'system',
          content: 'Please format your responses with clear structure. Use:\n- Headers ending with ":" for main topics (e.g., "Introduction:", "Key Features:")\n- "- " for bullet points\n- "1. " for numbered lists\n- Clear paragraph breaks between sections\n- Multiple sections when explaining complex topics\n\nThis helps create better visual formatting with automatic section dividers.'
        },
        ...updatedMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      if (settings.enableStreaming) {
        // Start streaming
        setIsStreaming(true);
        setCurrentMessageId(Date.now() + 1); // Anticipate AI message ID
        setIsLoading(false);
        streamingContentRef.current = ''; // Reset ref for new stream

        const response = await apiService.sendMessage(
          apiMessages,
          API_PROVIDERS.GEMINI,
          currentConversation.model,
          {
            temperature: 0.7,
            maxOutputTokens: 4000,
            stream: false // Get full response then simulate streaming
          }
        );

        // Get ad for streaming content early - use more context for better matching
        const streamingMessageId = Date.now() + 1;
        setCurrentMessageId(streamingMessageId); // Set the message ID immediately
        
        // Use full user message + beginning of response for better ad matching
        const contextForAd = newMessage.trim() + ' ' + (response.content.substring(0, 300) || '');
        console.log(`🔍 Ad matching context: "${contextForAd}"`);
        
        const streamingAd = inputAd || checkForStreamingAd(contextForAd, streamingMessageId);
        if (streamingAd) {
          console.log(`📌 Selected streaming ad: ${streamingAd.title} for message ${streamingMessageId}`);
          setMessageAds(prev => new Map(prev.set(streamingMessageId, streamingAd)));
        } else {
          console.log(`❌ No ad found for streaming content, message ${streamingMessageId}`);
        }
        
        // Simulate smooth streaming with proper completion handling
        simulateSmootherStreaming(
          response.content, 
          (partialText) => {
            streamingContentRef.current = partialText;
            setStreamingContent(partialText);
          },
          () => {
            // Called when streaming is complete
            setTimeout(() => {
              const aiMessageId = Date.now() + 1;
              const aiMessage = {
                id: aiMessageId,
                role: 'assistant',
                content: response.content,
                timestamp: Date.now()
              };

              const finalMessages = [...updatedMessages, aiMessage];
              
              // Only determine new ad if message doesn't already have one from streaming
              if (!messageAds.has(aiMessageId)) {
                const responseAd = inputAd || determineAdPlacement(aiMessage, finalMessages);
                if (responseAd) {
                  console.log(`🎯 Setting completion ad: ${responseAd.title} for message ${aiMessageId}`);
                  setMessageAds(prev => new Map(prev.set(aiMessageId, responseAd)));
                } else {
                  console.log(`❌ No completion ad found for message ${aiMessageId}`);
                }
              } else {
                console.log(`✅ Message ${aiMessageId} already has ad from streaming, not overriding`);
              }

              // Smooth transition: first add the message, then clear streaming
              setMessages(finalMessages);
              setTimeout(() => {
                setStreamingContent(''); // Clear streaming content after adding message
                setCurrentMessageId(null);
                setIsStreaming(false);
              }, 100); // Very short delay for smooth transition
            }, 300); // Small delay to show completion
          }
        );

      } else {
        // Non-streaming mode
        const response = await apiService.sendMessage(
          apiMessages,
          API_PROVIDERS.GEMINI,
          currentConversation.model,
          {
            temperature: 0.7,
            maxOutputTokens: 4000,
            stream: false
          }
        );

        const aiMessageId = Date.now() + 1;
        const aiMessage = {
          id: aiMessageId,
          role: 'assistant',
          content: response.content,
          timestamp: Date.now()
        };

        const finalMessages = [...updatedMessages, aiMessage];
        
        // Only determine new ad if message doesn't already have one
        if (!messageAds.has(aiMessageId)) {
          const responseAd = inputAd || determineAdPlacement(aiMessage, finalMessages);
          if (responseAd) {
            console.log(`🎯 Setting non-streaming ad: ${responseAd.title} for message ${aiMessageId}`);
            setMessageAds(prev => new Map(prev.set(aiMessageId, responseAd)));
          }
        } else {
          console.log(`✅ Message ${aiMessageId} already has ad, not overriding`);
        }

        setMessages(finalMessages);
      }

      // Update conversation title if it's the first exchange
      if (updatedMessages.length === 1) {
        const newTitle = userMessage.content.length > 50 
          ? userMessage.content.substring(0, 47) + '...'
          : userMessage.content;
        
        setConversations(prev => 
          prev.map(conv => 
            conv.id === currentConversation.id 
              ? { ...conv, title: newTitle }
              : conv
          )
        );
        setCurrentConversation(prev => ({ ...prev, title: newTitle }));
      }

    } catch (error) {
      console.error('Gemini API Error:', error);
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (error.status === 401) {
        errorMessage = 'Invalid Gemini API key. Please check your credentials in settings.';
      } else if (error.status === 403) {
        errorMessage = 'Access forbidden. Please check your Gemini API key permissions.';
      } else if (error.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setStreamingContent('');
      setIsStreaming(false);
      setCurrentMessageId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('gemini_api_key', newSettings.geminiKey || '');
    localStorage.setItem('default_gemini_model', newSettings.defaultModel || 'gemini-1.5-flash');
    localStorage.setItem('enable_streaming', newSettings.enableStreaming);
    
    // Force update the API service with new key immediately
    if (newSettings.geminiKey) {
      apiService.setApiKey(API_PROVIDERS.GEMINI, newSettings.geminiKey);
    }
    
    setError(null);
    setShowSettings(false);
  };

  return (
    <div className="h-screen flex bg-white dark:bg-gray-950">
      {/* Sticky Ad */}
      {stickyAd && (
        <StickyMiniAd
          ad={stickyAd}
          onScrollToAd={handleScrollToStickyAd}
          onClose={handleCloseStickyAd}
        />
      )}
      
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <span>AI Chat</span>
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={onBackToHome}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
              title="Back to Home"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
            <ThemeToggle />
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
              title="Settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-3">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-200 dark:border-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">New chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => {
                const modelInfo = GEMINI_MODELS[conv.model] || GEMINI_MODELS['gemini-1.5-flash'];
                return (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                      currentConversation?.id === conv.id
                        ? 'bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => {
                      setCurrentConversation(conv);
                      setMessages([]);
                      setStreamingContent('');
                      setIsStreaming(false);
                      setCurrentMessageId(null);
                      setMessageAds(new Map()); // Clear ads for conversation switch
                      setStickyAd(null); // Clear sticky ad for conversation switch
                    }}
                  >
                    <h3 className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                      {conv.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <span>{conv.modelName || modelInfo.name}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${stickyAd ? 'mt-16' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {currentConversation?.title || 'AI Assistant'}
            </h2>
            {currentConversation && (
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <span></span>
                <span>{currentConversation.modelName || GEMINI_MODELS[currentConversation.model]?.name}</span>
                {settings.enableStreaming && <span className="text-green-600 dark:text-green-400">• Streaming</span>}
              </p>
            )}
          </div>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
          {messages.length === 0 && !isStreaming && !isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-2xl px-6">
                <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl">
                </div>
                <h3 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                  How can I help you today?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  I can help with writing, analysis, coding, math, and much more.
                </p>
                {!settings.geminiKey && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Add your Gemini API key in settings to start chatting
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="space-y-6">
                {/* Regular Messages */}
                {messages.map((message) => (
                  <div key={message.id} className="group">
                    {message.role === 'user' ? (
                      <div className="flex justify-end">
                        <div className="max-w-[70%] px-4 py-3 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl rounded-tr-md">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm">
                        </div>
                        <div className="flex-1 max-w-none">
                          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 max-w-[80%]">
                            <FormattedMessage 
                              content={message.content} 
                              isStreaming={false} 
                              adToShow={messageAds.get(message.id)}
                              onAdBecomeSticky={handleAdBecomeSticky}
                              onAdLeaveSticky={handleAdLeaveSticky}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Streaming Message or Loading */}
                {(isLoading || isStreaming) && (
                  <div className="group">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm">
                      </div>
                      <div className="flex-1 max-w-none">
                        {isStreaming && streamingContent ? (
                          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 max-w-[80%]">
                            <FormattedMessage 
                              content={streamingContent} 
                              isStreaming={true} 
                              adToShow={messageAds.get(currentMessageId) || null}
                              onAdBecomeSticky={handleAdBecomeSticky}
                              onAdLeaveSticky={handleAdLeaveSticky}
                              onAdInjected={(ad) => {
                                // Ad already stored during streaming setup, just confirm it's the same one
                                console.log(`✅ Ad injected during streaming: ${ad.title} for message ${currentMessageId}`);
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-auto max-w-4xl px-4 mb-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-xs text-red-500 hover:text-red-700 mt-2 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <form onSubmit={handleSendMessage} className="relative">
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  !currentConversation
                    ? "Select a conversation to start chatting..."
                    : !settings.geminiKey
                    ? "Add your Gemini API key in settings..."
                    : "Message Gemini..."
                }
                disabled={!currentConversation || isLoading || isStreaming || !settings.geminiKey}
                rows={1}
                className="w-full pr-12 py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:border-transparent resize-none outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-500 dark:placeholder-gray-400 leading-relaxed"
                style={{ minHeight: '48px', maxHeight: '200px' }}
              />
              <button
                type="submit"
                disabled={!currentConversation || !newMessage.trim() || isLoading || isStreaming || !settings.geminiKey}
                className="absolute right-2 bottom-2 p-2 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-gray-800 hover:bg-gray-700 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-800"
              >
                {isLoading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : isStreaming ? (
                  <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </form>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              {settings.enableStreaming ? '' : 'Press Enter to send, Shift+Enter for new line'}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <GeminiSettingsModal 
          onClose={() => setShowSettings(false)} 
          onSave={saveSettings} 
          currentSettings={settings} 
        />
      )}
    </div>
  );
}

// Settings Modal
function GeminiSettingsModal({ onClose, onSave, currentSettings }) {
  const [geminiKey, setGeminiKey] = useState(currentSettings.geminiKey);
  const [defaultModel, setDefaultModel] = useState(currentSettings.defaultModel);
  const [enableStreaming, setEnableStreaming] = useState(currentSettings.enableStreaming);

  const handleSave = () => {
    onSave({
      geminiKey,
      defaultModel,
      enableStreaming
    });
  };

  const handleDebugApiKey = () => {
    console.log('=== API KEY DEBUG ===');
    console.log('Current form key:', geminiKey ? geminiKey.substring(0, 8) + '...' : 'Not set');
    console.log('localStorage key:', localStorage.getItem('gemini_api_key') ? localStorage.getItem('gemini_api_key').substring(0, 8) + '...' : 'Not set');
    apiService.debugApiKeys();
    console.log('Current settings:', currentSettings);
    
    // Test API key validity
    if (geminiKey) {
      console.log('Testing API key validity...');
      testApiKey(geminiKey);
    } else {
      console.log('No API key to test');
    }
    
    console.log('=== END DEBUG ===');
    
    // Force clear and reset API key
    apiService.clearApiKey(API_PROVIDERS.GEMINI);
    if (geminiKey) {
      apiService.setApiKey(API_PROVIDERS.GEMINI, geminiKey);
      console.log('API key force reset completed');
    }
  };

  const testApiKey = async (testKey) => {
    try {
      console.log('Making test API call...');
      
      // Test with a simple model list call first (lower quota usage)
      console.log('Step 1: Testing model list access...');
      const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${testKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Model List Response Status:', listResponse.status);
      if (!listResponse.ok) {
        const listErrorData = await listResponse.json().catch(() => ({}));
        console.error('Model List Failed:', {
          status: listResponse.status,
          statusText: listResponse.statusText,
          errorData: listErrorData
        });
        return;
      } else {
        const listData = await listResponse.json();
        console.log('Model List Success:', listData);
      }

      // Test with actual content generation
      console.log('Step 2: Testing content generation...');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${testKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: 'Say hi' }]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 5
          }
        })
      });

      console.log('Content Generation Response Status:', response.status);
      console.log('Content Generation Response Headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Content Generation Failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${testKey.substring(0, 8)}...`
        });
        
        // Check for specific error types
        if (response.status === 429) {
          console.error('🔴 RATE LIMIT: This API key has exceeded its quota or rate limit');
          console.log('💡 Solutions:');
          console.log('   1. Wait 24 hours for quota reset');
          console.log('   2. Check your Google AI Studio quota limits');
          console.log('   3. Verify billing is set up if needed');
          console.log('   4. Try a different API key');
        } else if (response.status === 403) {
          console.error('🔴 FORBIDDEN: API key lacks permissions or is invalid');
        } else if (response.status === 401) {
          console.error('🔴 UNAUTHORIZED: API key is invalid or malformed');
        }
      } else {
        const data = await response.json();
        console.log('✅ Content Generation Success:', data);
        console.log('🎉 API key is working correctly!');
      }
    } catch (error) {
      console.error('API Test Network Error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        </div>

        <div className="p-6 space-y-6">
          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIza..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Get API Key
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <button
                onClick={() => {
                  console.log('Debug button clicked!'); 
                  handleDebugApiKey();
                  alert('Debug info logged to console. Check the Console tab in Developer Tools (F12).');
                }}
                className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                title="Debug API key issues (check console)"
              >
                Debug
              </button>
              <button
                onClick={() => {
                  console.log('Clearing all API state...');
                  apiService.clearAllApiKeys();
                  localStorage.removeItem('gemini_api_key');
                  setGeminiKey('');
                  alert('All API keys and cache cleared. Please re-enter your API key.');
                }}
                className="inline-flex items-center gap-1 text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200 px-2 py-1 rounded border border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Clear all API keys and reset"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Streaming Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Streaming
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Show responses as they're generated
              </p>
            </div>
            <button
              onClick={() => setEnableStreaming(!enableStreaming)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enableStreaming ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enableStreaming ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Default Model
            </label>
            <div className="space-y-2">
              {Object.entries(GEMINI_MODELS).map(([modelId, modelInfo]) => (
                <button
                  key={modelId}
                  onClick={() => setDefaultModel(modelId)}
                  className={`w-full p-3 rounded-lg border transition-colors text-left ${
                    defaultModel === modelId
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${
                        defaultModel === modelId
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {modelInfo.name}
                      </div>
                      <div className={`text-xs ${
                        defaultModel === modelId
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {modelInfo.description}
                      </div>
                    </div>
                    {defaultModel === modelId && (
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;

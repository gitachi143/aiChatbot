import { sampleAds } from '../data/ads';

// Common words to ignore when matching
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 
  'with', 'you', 'your', 'this', 'they', 'them', 'we', 'me', 'my', 'our',
  'can', 'could', 'should', 'would', 'have', 'had', 'do', 'does', 'did',
  'what', 'when', 'where', 'why', 'how', 'who', 'which', 'i', 'am', 'like',
  'get', 'got', 'make', 'made', 'take', 'taken', 'go', 'went', 'come', 'came'
]);

// Extract keywords from text content
function extractKeywords(text) {
  if (!text || typeof text !== 'string') return [];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => 
      word.length > 2 && 
      !STOP_WORDS.has(word) &&
      !/^\d+$/.test(word) // Exclude pure numbers
    )
    .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates
}

// Calculate relevance score between content and ad
function calculateRelevanceScore(contentKeywords, ad) {
  let score = 0;
  const adKeywords = ad.keywords.map(k => k.toLowerCase());
  const adTitle = ad.title.toLowerCase();
  const adSummary = (ad.summary || ad.description || '').toLowerCase();
  const adCategory = ad.category.toLowerCase();
  
  // Direct keyword matches (highest weight)
  contentKeywords.forEach(keyword => {
    if (adKeywords.includes(keyword)) {
      score += 10;
    }
    
    // Partial matches in keywords
    adKeywords.forEach(adKeyword => {
      if (adKeyword.includes(keyword) || keyword.includes(adKeyword)) {
        score += 5;
      }
    });
    
    // Title matches
    if (adTitle.includes(keyword)) {
      score += 8;
    }
    
    // Summary matches
    if (adSummary.includes(keyword)) {
      score += 6;
    }
    
    // Category matches
    if (adCategory.includes(keyword) || keyword.includes(adCategory)) {
      score += 7;
    }
  });
  
  // Company name bonus if mentioned
  if (ad.company?.name) {
    const companyName = ad.company.name.toLowerCase();
    contentKeywords.forEach(keyword => {
      if (companyName.includes(keyword) || keyword.includes(companyName)) {
        score += 15; // High bonus for brand mentions
      }
    });
  }
  
  return score;
}

// Find best matching ads for given content
export function findMatchingAds(content, options = {}) {
  const {
    maxAds = 1,
    minScore = 5,
    excludeAdIds = [],
    recentAdIds = [] // Ads shown recently - reduce their priority
  } = options;
  
  if (!content || typeof content !== 'string') {
    return [];
  }
  
  const keywords = extractKeywords(content);
  if (keywords.length === 0) {
    return [];
  }
  
  const scoredAds = sampleAds
    .filter(ad => !excludeAdIds.includes(ad.id))
    .map(ad => ({
      ad,
      score: calculateRelevanceScore(keywords, ad)
    }))
    .filter(item => item.score >= minScore)
    .sort((a, b) => {
      // Reduce score for recently shown ads
      const aScore = recentAdIds.includes(a.ad.id) ? a.score * 0.3 : a.score;
      const bScore = recentAdIds.includes(b.ad.id) ? b.score * 0.3 : b.score;
      return bScore - aScore;
    });
  
  return scoredAds
    .slice(0, maxAds)
    .map(item => ({
      ad: item.ad,
      relevanceScore: item.score,
      matchedKeywords: keywords.filter(keyword => 
        item.ad.keywords.some(adKeyword => 
          adKeyword.toLowerCase().includes(keyword) || 
          keyword.includes(adKeyword.toLowerCase())
        ) ||
        item.ad.title.toLowerCase().includes(keyword) ||
        (item.ad.summary || item.ad.description || '').toLowerCase().includes(keyword)
      )
    }));
}

// Analyze chat messages and determine ad placement opportunities
export function analyzeChatForAdPlacement(messages, options = {}) {
  const {
    maxAdsPerConversation = 3,
    minMessagesBetweenAds = 4,
    recentAdIds = []
  } = options;
  
  if (!messages || messages.length < 2) {
    return [];
  }
  
  const placements = [];
  let lastAdMessageIndex = -1;
  
  // Look for AI responses that have sections (potential ad placement points)
  messages.forEach((message, index) => {
    if (message.role === 'assistant' && index > lastAdMessageIndex + minMessagesBetweenAds) {
      // Check if this message has dividers/sections (indicating structured content)
      const hasStructuredContent = message.content.includes(':') || 
                                   message.content.includes('\n\n') ||
                                   message.content.includes('##') ||
                                   message.content.includes('- ') ||
                                   message.content.includes('1.');
      
      if (hasStructuredContent) {
        // Combine recent messages for context
        const contextMessages = messages
          .slice(Math.max(0, index - 2), index + 1)
          .map(msg => msg.content)
          .join(' ');
        
        const matchingAds = findMatchingAds(contextMessages, {
          maxAds: 1,
          minScore: 8,
          recentAdIds
        });
        
        if (matchingAds.length > 0) {
          placements.push({
            messageIndex: index,
            ad: matchingAds[0].ad,
            relevanceScore: matchingAds[0].relevanceScore,
            matchedKeywords: matchingAds[0].matchedKeywords
          });
          lastAdMessageIndex = index;
        }
      }
    }
  });
  
  // Limit total ads per conversation
  return placements
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxAdsPerConversation);
}

// Track shown ads to avoid repetition
export class AdTracker {
  constructor() {
    this.shownAds = new Map(); // conversationId -> Set of ad IDs
    this.recentAds = []; // Global recent ads (max 10)
  }
  
  markAdShown(conversationId, adId) {
    if (!this.shownAds.has(conversationId)) {
      this.shownAds.set(conversationId, new Set());
    }
    this.shownAds.get(conversationId).add(adId);
    
    // Update recent ads globally
    this.recentAds.unshift(adId);
    if (this.recentAds.length > 10) {
      this.recentAds.pop();
    }
  }
  
  getShownAds(conversationId) {
    return Array.from(this.shownAds.get(conversationId) || new Set());
  }
  
  getRecentAds() {
    return [...this.recentAds];
  }
  
  clearConversation(conversationId) {
    this.shownAds.delete(conversationId);
  }
}

// Export utilities for testing
export { extractKeywords, calculateRelevanceScore };

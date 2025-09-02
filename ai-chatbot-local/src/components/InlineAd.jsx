import { useState, useRef, useEffect } from 'react';

function InlineAd({ ad, onBecomeSticky, onLeaveSticky, isSticky = false }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const adRef = useRef(null);

  const nextImage = () => {
    if (ad.type === 'carousel' && ad.images) {
      setCurrentImageIndex((prev) => (prev + 1) % ad.images.length);
    }
  };

  const prevImage = () => {
    if (ad.type === 'carousel' && ad.images) {
      setCurrentImageIndex((prev) => (prev - 1 + ad.images.length) % ad.images.length);
    }
  };

  // Temporarily disabled sticky functionality to avoid complications
  useEffect(() => {
    // Sticky functionality disabled for now
    return () => {
      // Cleanup if needed
    };
  }, [ad.id, onBecomeSticky, onLeaveSticky]);

  const scrollToAd = () => {
    if (adRef.current) {
      adRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  return (
    <>
      <div 
        ref={adRef}
        className="bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 p-4 rounded-lg my-4 relative"
      >
        {/* Company Logo in top right corner (bigger) */}
        <div className="absolute top-3 right-3">
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded p-2 flex flex-col items-center">
            <div className="w-8 h-8 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-400 rounded flex items-center justify-center mb-1">
              <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {ad.company?.name?.charAt(0) || '?'}
              </div>
            </div>
            <div className="text-xs text-center text-gray-600 dark:text-gray-400 font-medium leading-tight">
              {ad.company?.name || 'Company'}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pr-24">
          {/* Ad Title */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {ad.title}
            </h3>
          </div>

          {/* Summary */}
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">
            {ad.summary || ad.description}
          </p>

          {/* Images - Only for physical products */}
          {ad.hasImage && (
            <div className="mb-3">
              {/* Single Image */}
              {ad.type === 'single-image' && (
                <div className="w-full h-24 bg-gray-200 dark:bg-gray-600 flex items-center justify-center border border-dashed border-gray-400 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors rounded">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="text-sm font-mono">📷 {ad.image}</div>
                  </div>
                </div>
              )}

              {/* Carousel */}
              {ad.type === 'carousel' && ad.images && (
                <div className="relative">
                  <div className="w-full h-24 bg-gray-200 dark:bg-gray-600 flex items-center justify-center border border-dashed border-gray-400 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors rounded">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <div className="text-sm font-mono">📷 {ad.images[currentImageIndex]}</div>
                    </div>
                  </div>
                  
                  {/* Carousel Controls */}
                  {ad.images.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-5 h-5 flex items-center justify-center hover:bg-opacity-75 text-xs rounded"
                      >
                        ←
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-5 h-5 flex items-center justify-center hover:bg-opacity-75 text-xs rounded"
                      >
                        →
                      </button>

                      {/* Dots indicator */}
                      <div className="flex justify-center mt-1 space-x-1">
                        {ad.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-1 h-1 rounded-full ${
                              index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-400 dark:bg-gray-500'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Expand/Collapse button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline mb-2 flex items-center gap-1"
          >
            {isExpanded ? '▼ Hide details' : '▶ Show details'}
          </button>

          {/* Expanded Details - Links */}
          {isExpanded && ad.links && (
            <div className="mb-2">
              {ad.links.slice(0, 3).map((link, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-500 pb-1 mb-1 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <a
                        href={`https://${link.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium"
                      >
                        {link.text}
                      </a>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                        {link.description && link.description.length > 80 
                          ? link.description.substring(0, 80) + '...'
                          : link.description || `Browse ${link.text.toLowerCase()}`}
                      </div>
                    </div>
                    <svg className="w-3 h-3 text-gray-400 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
              
              {/* More results link */}
              <div className="mt-1">
                <a
                  href={`https://${ad.links[0]?.url.split('/')[0] || 'example.com'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                >
                  More from {ad.company?.name || 'this company'} »
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Sponsored message at bottom right */}
        <div className="absolute bottom-3 right-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
          Sponsored
        </div>
      </div>
      
      {/* White divider line after ad */}
      <div className="my-4">
        <hr className="border border-white dark:border-white" />
      </div>
    </>
  );
}

// Sticky Mini Ad Component
function StickyMiniAd({ ad, onScrollToAd, onClose }) {
  if (!ad) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="flex items-center gap-3 relative">
          {/* Mini Company Logo */}
          <div className="flex-shrink-0">
            <div className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded p-1 flex items-center justify-center">
              <div className="w-6 h-6 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-400 rounded flex items-center justify-center">
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  {ad.company?.name?.charAt(0) || '?'}
                </div>
              </div>
            </div>
          </div>

          {/* Ad Content - Clickable */}
          <div 
            className="flex-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
            onClick={onScrollToAd}
          >
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {ad.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {ad.summary}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Close sticky ad"
          >
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Small "Sponsored" label */}
          <div className="absolute top-0 right-8 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-1 py-0.5 rounded text-xs">
            Ad
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact Inline Ad Component (no image, minimal details)
function CompactInlineAd({ ad, onBecomeSticky, onLeaveSticky, isSticky = false }) {
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded
  const adRef = useRef(null);

  // Temporarily disabled sticky functionality to avoid complications
  useEffect(() => {
    // Sticky functionality disabled for now
    return () => {
      // Cleanup if needed
    };
  }, [ad.id, onBecomeSticky, onLeaveSticky]);

  return (
    <>
      <div 
        ref={adRef}
        className="bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 p-3 rounded-lg my-4 relative"
      >
        {/* Company Logo in top right corner (smaller) */}
        <div className="absolute top-2 right-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded p-1 flex flex-col items-center">
            <div className="w-6 h-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-400 rounded flex items-center justify-center">
              <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {ad.company?.name?.charAt(0) || '?'}
              </div>
            </div>
            <div className="text-xs text-center text-gray-600 dark:text-gray-400 font-medium leading-tight mt-0.5">
              {ad.company?.name || 'Company'}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pr-16">
          {/* Ad Title */}
          <div className="mb-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              {ad.title}
            </h3>
          </div>

          {/* Summary */}
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 leading-relaxed">
            {ad.summary || ad.description}
          </p>

          {/* Expand/Collapse button for details */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline mb-2 flex items-center gap-1"
          >
            {isExpanded ? '▼ Hide details' : '▶ Show details'}
          </button>

          {/* Expanded Details - Links (when expanded) */}
          {isExpanded && ad.links && (
            <div className="mb-2">
              {ad.links.slice(0, 2).map((link, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-500 pb-1 mb-1 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <a
                        href={`https://${link.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium"
                      >
                        {link.text}
                      </a>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                        {link.description && link.description.length > 60 
                          ? link.description.substring(0, 60) + '...'
                          : link.description || `Browse ${link.text.toLowerCase()}`}
                      </div>
                    </div>
                    <svg className="w-3 h-3 text-gray-400 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
              
              {/* More results link */}
              <div className="mt-1">
                <a
                  href={`https://${ad.links[0]?.url.split('/')[0] || 'example.com'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                >
                  More from {ad.company?.name || 'this company'} »
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Sponsored message at bottom right */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded">
          Sponsored
        </div>
      </div>
      
      {/* White divider line after ad */}
      <div className="my-4">
        <hr className="border border-white dark:border-white" />
      </div>
    </>
  );
}

export default InlineAd;
export { StickyMiniAd, CompactInlineAd };

import { useState, useRef } from 'react';

// Single unified ad component - no images, no products, just title/description/links
export function InlineAd({ ad, className = '' }) {
  return (
    <div className={`my-4 ${className}`}>
      <CompactInlineAd ad={ad} />
    </div>
  );
}

// Compact inline ad component (main ad display)
export function CompactInlineAd({ ad, className = '' }) {
  const [isExpanded, setIsExpanded] = useState(true); // Expanded by default
  const linksRef = useRef(null);
  const adRef = useRef(null);
  
  if (!ad) return null;

  const handleStickyClick = () => {
    if (adRef.current) {
      adRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={adRef} className={`my-4 ${className}`}>
      {/* Sticky Top Section - This part freezes when scrolled */}
      <div 
        onClick={handleStickyClick}
        className="sticky top-0 bg-yellow-50 dark:bg-gray-800 border border-yellow-200 dark:border-gray-700 rounded-t-lg border-b-0 p-4 relative z-10 cursor-pointer hover:bg-yellow-100 dark:hover:bg-gray-700 transition-colors"
      >
        {/* Top Right Logo Box */}
        <div className="absolute top-4 right-4">
          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 flex flex-col items-center">
            <div className="w-6 h-6 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-500 rounded flex items-center justify-center mb-1">
              <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {ad.company?.name?.charAt(0) || '?'}
              </div>
            </div>
            <div className="text-xs text-center text-gray-600 dark:text-gray-400 font-medium leading-tight">
              {ad.company?.name || 'Company'}
            </div>
          </div>
        </div>

        {/* Main Content - Top Part */}
        <div className="pr-20">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {ad.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {ad.summary}
          </p>
        </div>

        {/* Bottom Right Sponsored */}
        <div className="absolute bottom-2 right-4">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Sponsored
          </p>
        </div>
      </div>

      {/* Bottom Section - This part scrolls away */}
      <div ref={linksRef} className="bg-yellow-50 dark:bg-gray-800 border border-yellow-200 dark:border-gray-700 rounded-b-lg border-t-0 p-4 pt-2">
        {/* Links Section - List format with arrows */}
        {ad.links && ad.links.length > 0 && (
          <div className="mb-1">
            {ad.links.map((link, index) => (
              <div key={index}>
                {index > 0 && (
                  <hr className="border-t border-gray-200 dark:border-gray-600 my-2" />
                )}
                <a
                  href={`https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-700 -mx-2 px-2 rounded group"
                >
                  <div className="flex-1">
                    <div className="text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:underline mb-1">
                      {link.text}
                    </div>
                    {link.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {link.description}
                      </div>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-gray-400 ml-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Hidden expand/collapse functionality for future features */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="hidden"
          aria-hidden="true"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      </div>
    </div>
  );
}

// Sticky mini ad (currently disabled as requested)
export function StickyMiniAd({ ad }) {
  // Currently disabled - return null
  return null;
}

export default InlineAd;
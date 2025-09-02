import { useState } from 'react';
import { sampleAds, getAllCategories } from '../data/ads';

function AdCard({ ad }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true); // Pre-opened

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

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-6 relative">
      {/* Top Right Logo */}
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

      {/* Main Content */}
      <div className="pr-20">
        {/* Ad Title and Category */}
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {ad.title}
          </h3>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
            {ad.category}
          </span>
        </div>

        {/* Summary */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed">
          {ad.summary || ad.description}
        </p>

        {/* Images - Only for physical products */}
        {ad.hasImage && (
          <div className="mb-4">
            {/* Single Image */}
            {ad.type === 'single-image' && (
              <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center border border-dashed border-gray-400 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="text-sm font-mono">📷 IMAGE</div>
                  <div className="text-xs mt-1">{ad.image}</div>
                  <div className="text-xs mt-1 italic">
                    This image is clickable
                  </div>
                </div>
              </div>
            )}

            {/* Carousel */}
            {ad.type === 'carousel' && ad.images && (
              <div className="relative">
                <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center border border-dashed border-gray-400 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="text-sm font-mono">📷 IMAGE {currentImageIndex + 1}/{ad.images.length}</div>
                    <div className="text-xs mt-1">{ad.images[currentImageIndex]}</div>
                    <div className="text-xs mt-1 italic">
                      This image is clickable
                    </div>
                  </div>
                </div>
                
                {/* Carousel Controls */}
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-6 h-6 flex items-center justify-center hover:bg-opacity-75 text-xs"
                >
                  ←
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-6 h-6 flex items-center justify-center hover:bg-opacity-75 text-xs"
                >
                  →
                </button>

                {/* Dots indicator */}
                <div className="flex justify-center mt-1 space-x-1">
                  {ad.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-1.5 h-1.5 rounded-full ${
                        index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expand/Collapse button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-3 flex items-center gap-1"
        >
          {isExpanded ? '▼ Hide details' : '▶ Show details'}
        </button>

        {/* Expanded Details - Pre-opened Google-style site sections */}
        {isExpanded && ad.links && (
          <div className="mb-4">
            {ad.links.map((link, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-600 pb-2 mb-2 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <a
                      href={`https://${link.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                    >
                      {link.text}
                    </a>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {link.description || `Browse ${link.text.toLowerCase()} section with detailed options and information.`}
                    </div>
                  </div>
                  <svg className="w-3 h-3 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
            
            {/* More results link */}
            <div className="mt-3">
              <a
                href={`https://${ad.links[0]?.url.split('/')[0] || 'example.com'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
              >
                More results from {ad.links[0]?.url.split('/')[0] || 'this site'} »
              </a>
            </div>
          </div>
        )}

        {/* Basic info and Keywords */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {ad.hasImage ? '🖼️ Product' : '🔧 Service'} • ID: {ad.id} • {ad.type === 'carousel' ? `${ad.images?.length || 0} images` : ad.hasImage ? '1 image' : 'Digital'}
        </div>

        <div className="flex flex-wrap gap-1">
          {ad.keywords.slice(0, 4).map((keyword, index) => (
            <span 
              key={index}
              className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
            >
              #{keyword}
            </span>
          ))}
          {ad.keywords.length > 4 && (
            <span className="text-xs text-gray-400">
              +{ad.keywords.length - 4} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function AdsPage({ onBackToHome }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = getAllCategories();

  const filteredAds = selectedCategory === 'all' 
    ? sampleAds 
    : sampleAds.filter(ad => ad.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-mono">
      {/* Header */}
      <div className="p-4 border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-normal text-gray-900 dark:text-white">
            📢 Ad Network - Sample Ads
          </h1>
          <button
            onClick={onBackToHome}
            className="bg-gray-800 hover:bg-black text-white px-4 py-2 border border-gray-600 text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Info */}
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            These are the 10 sample ads in our network displayed as horizontal rectangles. Each ad has a small company logo box in the top-right corner. 
            Physical products show images below the description, while digital services are more compact (no extra space). All ads include pre-opened Google-style link sections.
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 text-sm border ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              All ({sampleAds.length})
            </button>
            {categories.map(category => {
              const count = sampleAds.filter(ad => ad.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 text-sm border capitalize ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Ads List - Horizontal Rectangles */}
        <div className="space-y-4">
          {filteredAds.map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Ad Network Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {sampleAds.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Ads</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {sampleAds.filter(ad => ad.hasImage).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">With Images</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {sampleAds.filter(ad => !ad.hasImage).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Services</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {sampleAds.reduce((total, ad) => total + (ad.links?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Links</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>Optimized Layout:</strong> Each ad displays as a horizontal rectangle with a small company logo box in the top-right corner. 
              Product ads include images, while service ads are more compact without extra space. Perfect for quick scanning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdsPage;

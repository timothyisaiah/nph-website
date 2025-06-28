import React, { useState, useEffect, useMemo, useCallback } from 'react';

interface FeedingTip {
  title: string;
  icon: string;
  tips: string[];
}

interface FeedingTipsCarouselProps {
  feedingTips: Record<string, FeedingTip>;
}

const FeedingTipsCarousel: React.FC<FeedingTipsCarouselProps> = ({ feedingTips }) => {
  const tipCategories = useMemo(() => Object.keys(feedingTips), [feedingTips]);
  const [activeTipCategory, setActiveTipCategory] = useState(tipCategories[0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [autoPlayProgress, setAutoPlayProgress] = useState(0);
  const currentIndex = useMemo(() => tipCategories.indexOf(activeTipCategory), [tipCategories, activeTipCategory]);

  const nextTip = useCallback(() => {
    const nextIndex = (currentIndex + 1) % tipCategories.length;
    setActiveTipCategory(tipCategories[nextIndex]);
    setAutoPlayProgress(0);
  }, [currentIndex, tipCategories]);

  const prevTip = useCallback(() => {
    const prevIndex = currentIndex === 0 ? tipCategories.length - 1 : currentIndex - 1;
    setActiveTipCategory(tipCategories[prevIndex]);
    setAutoPlayProgress(0);
  }, [currentIndex, tipCategories]);

  const goToTip = useCallback((category: string) => {
    setActiveTipCategory(category);
    setAutoPlayProgress(0);
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setAutoPlayProgress((prev) => {
        if (prev >= 100) {
          nextTip();
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextTip]);

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 shadow-lg border border-green-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Health Feeding Tips</h3>
        </div>
        <button
          onClick={toggleAutoPlay}
          className={`p-2 rounded-lg transition-colors ${
            isAutoPlaying 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-gray-600 hover:bg-green-100'
          }`}
          title={isAutoPlaying ? 'Pause auto-play' : 'Start auto-play'}
        >
          {isAutoPlaying ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
      </div>
      <div className="relative mb-6">
        {isAutoPlaying && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-lg overflow-hidden z-20">
            <div 
              className="h-full bg-green-500 transition-all duration-100 ease-linear"
              style={{ width: `${autoPlayProgress}%` }}
            />
          </div>
        )}
        <button
          onClick={prevTip}
          className="carousel-nav-button absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-50 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextTip}
          className="carousel-nav-button absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-50 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="carousel-content bg-white rounded-lg p-6 shadow-sm min-h-[200px] overflow-hidden">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2 animate-pulse">{feedingTips[activeTipCategory].icon}</div>
            <h4 className="font-semibold text-green-700 text-lg transition-all duration-300">{feedingTips[activeTipCategory].title}</h4>
          </div>
          <ul className="space-y-3">
            {feedingTips[activeTipCategory].tips.map((tip: string, index: number) => (
              <li key={index} className="text-gray-600 text-sm flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <span className="text-green-500 mt-1 text-xs font-bold">•</span>
                <span className="transition-all duration-300">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        {tipCategories.map((category: string) => (
          <button
            key={category}
            onClick={() => goToTip(category)}
            className={`carousel-indicator w-3 h-3 rounded-full transition-colors ${
              activeTipCategory === category 
                ? 'bg-green-600 active' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            title={feedingTips[category].title}
          />
        ))}
      </div>
      {/* <div className="flex justify-center gap-2 mb-6">
        {tipCategories.map((category: string) => (
          <button
            key={category}
            onClick={() => goToTip(category)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeTipCategory === category 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-green-100'
            }`}
          >
            {category === 'infant' ? 'Infant (0-6m)' : 
             category === 'complementary' ? 'Complementary (6-24m)' : 
             'Young Child (2-5y)'}
          </button>
        ))}
      </div> */}
      {/* <button  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium">
        Get Personalized Tips
      </button> */}
    </div>
  );
};

FeedingTipsCarousel.displayName = 'FeedingTipsCarousel';

export default FeedingTipsCarousel; 
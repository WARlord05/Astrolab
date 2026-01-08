import React, { useState, useRef, useEffect } from 'react';
import { Horoscope } from '@/lib/astrology';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { HoroscopeCard } from './HoroscopeCard';

interface SwipeableCardsProps {
  forecasts: {
    yesterday: Horoscope | null;
    today: Horoscope;
    tomorrow: Horoscope | null;
    weekly: Horoscope | null;
    monthly: Horoscope | null;
  };
  isLoadingExtended: boolean;
  translatedHoroscopes: Record<string, Horoscope> | null;
  onLoadTab: (tab: 'yesterday' | 'today' | 'tomorrow' | 'weekly' | 'monthly') => void;
}

export const SwipeableCards: React.FC<SwipeableCardsProps> = ({
  forecasts,
  isLoadingExtended,
  translatedHoroscopes,
  onLoadTab,
}) => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start with Today
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const tabs = ['yesterday', 'today', 'tomorrow', 'weekly', 'monthly'] as const;
  const currentTab = tabs[currentIndex];
  const currentForecast = forecasts[currentTab] || null;

  useEffect(() => {
    if (currentForecast) {
      onLoadTab(currentTab);
    }
  }, [currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    setTouchEndY(e.changedTouches[0].clientY);
    handleSwipe();
  };

  const handleSwipe = () => {
    const horizontalDistance = Math.abs(touchStart - touchEnd);
    const verticalDistance = Math.abs(touchStartY - touchEndY);
    
    // Minimum swipe distance of 100px for more deliberate swipes
    const minSwipeDistance = 100;
    
    // Only trigger swipe if horizontal movement is significantly greater than vertical
    // This prevents vertical scrolling from triggering card changes
    if (horizontalDistance > verticalDistance && horizontalDistance > minSwipeDistance) {
      if (touchStart - touchEnd > minSwipeDistance) {
        // Swiped left - next card
        if (currentIndex < tabs.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      }
      if (touchEnd - touchStart > minSwipeDistance) {
        // Swiped right - previous card
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
      }
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < tabs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getTabLabel = (tab: typeof tabs[number]) => {
    const labels = {
      yesterday: 'Yesterday',
      today: 'Today',
      tomorrow: 'Tomorrow',
      weekly: 'Weekly',
      monthly: 'Monthly',
    };
    return labels[tab];
  };

  if (!currentForecast) {
    return (
      <div className="text-center text-purple-200">
        <p>Loading forecast...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Card Counter and Swipe Indicator - Above Card */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/20"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <div className="text-center flex-1">
          <h3 className="text-white font-bold text-lg">{getTabLabel(currentTab)}</h3>
          <p className="text-white/50 text-sm">
            {currentIndex + 1} of {tabs.length}
          </p>
        </div>

        <button
          onClick={goToNext}
          disabled={currentIndex === tabs.length - 1}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/20"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Swipe Indicator for first-time users */}
      {currentIndex === 1 && (
        <div className="text-center animate-bounce">
          <p className="text-white/40 text-xs flex items-center justify-center gap-2">
            <ChevronLeft className="w-3 h-3" />
            Swipe or tap arrows
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>
      )}

      {/* Progress dots */}
      <div className="flex justify-center gap-2">
        {tabs.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-8'
                : 'bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to ${getTabLabel(tabs[index])}`}
          />
        ))}
      </div>

      {/* Card Stack */}
      <div
        ref={containerRef}
        className="relative w-full min-h-[500px] perspective"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background cards for depth effect */}
        {[2, 1].map((offset) => (
          <div
            key={offset}
            className="absolute inset-0 bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 transform"
            style={{
              transform: `translateY(${offset * 8}px) scale(${1 - offset * 0.02})`,
              zIndex: -offset,
              opacity: 0.5,
            }}
          />
        ))}

        {/* Main card with animation */}
        <div className="absolute inset-0 transition-all duration-300 ease-out w-full h-full">
          <HoroscopeCard
            horoscope={translatedHoroscopes?.[currentTab] || currentForecast}
            showDetails={currentTab === 'today' || currentTab === 'tomorrow'}
          />
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Horoscope, UserData, ZODIAC_SIGN_DETAILS } from '@/lib/astrology';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HoroscopeCard } from './HoroscopeCard';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface SwipeableCardsProps {
  userData: UserData;
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
  userData,
  forecasts,
  isLoadingExtended,
  translatedHoroscopes,
  onLoadTab,
}) => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start with Today (profile is 0)
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const tabs = ['profile', 'yesterday', 'today', 'tomorrow', 'weekly', 'monthly'] as const;
  const currentTab = tabs[currentIndex];
  const currentForecast = currentTab === 'profile' ? null : forecasts[currentTab as Exclude<typeof currentTab, 'profile'>] || null;

  useEffect(() => {
    if (currentTab !== 'profile' && currentForecast) {
      onLoadTab(currentTab as Exclude<typeof currentTab, 'profile'>);
    }
  }, [currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStart - touchEnd > 50) {
      // Swiped left - next card
      if (currentIndex < tabs.length - 1) {
        setSwipeDirection('left');
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setSwipeDirection(null);
        }, 250);
      }
    }
    if (touchEnd - touchStart > 50) {
      // Swiped right - previous card
      if (currentIndex > 0) {
        setSwipeDirection('right');
        setTimeout(() => {
          setCurrentIndex(currentIndex - 1);
          setSwipeDirection(null);
        }, 250);
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
      profile: 'Profile',
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
      {/* Card Stack */}
      <div
        ref={containerRef}
        className="relative w-full min-h-[500px]"
        style={{ perspective: '1000px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background cards for depth effect - visible stack */}
        {[3, 2, 1].map((offset) => (
          <div
            key={offset}
            className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20"
            style={{
              transform: `translateY(${offset * 12}px) scale(${1 - offset * 0.025}) translateZ(${-offset * 50}px)`,
              zIndex: -offset,
              opacity: 0.6,
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        ))}

        {/* Main card with smooth swipe animation */}
        <div 
          className="absolute inset-0 w-full h-full rounded-3xl"
          style={{
            transform: swipeDirection === 'left' 
              ? 'translateX(120%) rotateY(-20deg) rotateZ(5deg)' 
              : swipeDirection === 'right' 
              ? 'translateX(-120%) rotateY(20deg) rotateZ(-5deg)' 
              : 'translateX(0) rotateY(0) rotateZ(0)',
            opacity: swipeDirection ? 0.3 : 1,
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {currentTab === 'profile' ? (
            <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 w-full h-full flex flex-col overflow-hidden">
              <div className="text-center space-y-3">
                <div className="text-5xl font-bold text-white">{userData.zodiacSign}</div>
                <p className="text-purple-200 text-base">{ZODIAC_SIGN_DETAILS[userData.zodiacSign].element} Sign</p>
                <div className="flex items-center justify-center gap-2 text-purple-200 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(), 'MMM d, yyyy')}</span>
                </div>
              </div>
              <Separator className="bg-white/10 my-4 flex-shrink-0" />
              <div className="space-y-2 text-left flex-grow overflow-y-auto">
                <p className="text-purple-100 text-sm"><span className="font-semibold text-white">Birth:</span> {format(userData.birthDate, 'PPP')}</p>
                <p className="text-purple-100 text-sm"><span className="font-semibold text-white">Time:</span> {userData.birthTime}</p>
                <p className="text-purple-100 text-sm"><span className="font-semibold text-white">Height:</span> {userData.height} cm</p>
                <p className="text-purple-100 text-sm"><span className="font-semibold text-white">Traits:</span> {ZODIAC_SIGN_DETAILS[userData.zodiacSign].traits.join(', ')}</p>
              </div>
            </div>
          ) : (
            <HoroscopeCard
              horoscope={translatedHoroscopes?.[currentTab] || currentForecast}
              showDetails={currentTab === 'today' || currentTab === 'tomorrow'}
            />
          )}
        </div>
      </div>

      {/* Card Counter and Swipe Indicator */}
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
    </div>
  );
};

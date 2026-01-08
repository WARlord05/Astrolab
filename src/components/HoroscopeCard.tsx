import React, { useState } from 'react';
import { Horoscope } from '@/lib/astrology';
import { Separator } from '@/components/ui/separator';
import { X, Zap, Palette, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface HoroscopeCardProps {
    horoscope: Horoscope;
    showDetails?: boolean;
}

export const HoroscopeCard: React.FC<HoroscopeCardProps> = ({ horoscope, showDetails = true }) => {
    const [showMeaning, setShowMeaning] = useState(false);
    const todayFormatted = format(new Date(), 'PPP');
    const isToday = horoscope.date === todayFormatted;
    
    // Determine the forecast title based on the date
    const getTitle = () => {
        if (horoscope.date === 'Yesterday') return 'Yesterday\'s Forecast';
        if (horoscope.date === 'This Week') return 'Weekly Forecast';
        if (horoscope.date === 'This Month') return 'Monthly Forecast';
        if (isToday) return 'Daily Forecast';
        return 'Tomorrow\'s Forecast';
    };

    return (
        <>
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 space-y-4 hover:border-white/30 transition-all duration-300 hover:shadow-purple-500/20 w-full h-full flex flex-col overflow-hidden">
                <div className="flex justify-between items-start flex-shrink-0">
                    <div className="min-w-0">
                        <h3 className="text-white text-xl font-bold flex items-center gap-2 mb-1">
                            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse flex-shrink-0" />
                            <span className="truncate">{getTitle()}</span>
                        </h3>
                        <p className="text-purple-300 text-xs">{horoscope.date}</p>
                    </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors flex-grow overflow-y-auto">
                    <p className="text-purple-100 leading-relaxed italic text-sm">
                        "{horoscope.prediction}"
                    </p>
                </div>

                {showDetails && (
                    <>
                        <Separator className="bg-white/10 flex-shrink-0" />

                        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                            <div 
                                onClick={() => setShowMeaning(true)} 
                                className="cursor-pointer hover:opacity-90 transition-all p-3 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/15 hover:shadow-lg hover:shadow-red-500/10 flex flex-col justify-between min-h-[90px]"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-4 h-4 text-red-400 flex-shrink-0" />
                                    <span className="text-xs font-medium text-red-300/80 uppercase tracking-wide">Lucky Number</span>
                                </div>
                                <span className="text-2xl font-extrabold text-white">{horoscope.luckyNumber}</span>
                            </div>

                            <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/15 transition-all hover:shadow-lg hover:shadow-blue-500/10 flex flex-col justify-between min-h-[90px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Palette className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                    <span className="text-xs font-medium text-blue-300/80 uppercase tracking-wide">Color</span>
                                </div>
                                <span className="text-lg font-extrabold text-white line-clamp-2">{horoscope.luckyColor}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {showMeaning && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 w-full max-w-md hover:border-white/40 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-white text-3xl font-bold">
                                Lucky Number <span className="text-yellow-400">{horoscope.luckyNumber}</span>
                            </h2>
                            <button 
                                onClick={() => setShowMeaning(false)}
                                className="rounded-full hover:bg-white/20 p-2 transition-all hover:scale-110 text-white/60 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-purple-100 leading-relaxed mb-6 text-base">
                            {horoscope.luckyNumberMeaning || "No meaning available"}
                        </p>
                        <Button 
                            onClick={() => setShowMeaning(false)} 
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl py-3 transition-all hover:shadow-lg hover:shadow-purple-500/30"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

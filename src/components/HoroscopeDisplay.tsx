import React, { useState } from 'react';
import { Horoscope, UserData, ZODIAC_SIGN_DETAILS } from '@/lib/astrology';
import { Separator } from '@/components/ui/separator';
import { Star, Calendar, Zap, Palette, User, Clock, Heart, TrendingUp, X, Droplet, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface HoroscopeCardProps {
    horoscope: Horoscope;
}

const HoroscopeCard: React.FC<HoroscopeCardProps> = ({ horoscope }) => {
    const [showMeaning, setShowMeaning] = useState(false);
    const todayFormatted = format(new Date(), 'PPP');
    const isToday = horoscope.date === todayFormatted;

    return (
        <>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-white text-xl font-bold flex items-center gap-2 mb-1">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            {isToday ? "Daily Forecast" : "Tomorrow's Forecast"}
                        </h3>
                        <p className="text-purple-200 text-sm">{horoscope.date}</p>
                    </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-purple-100 leading-relaxed italic">
                        "{horoscope.prediction}"
                    </p>
                </div>

                <Separator className="bg-white/10" />

                <div className="grid grid-cols-2 gap-4">
                    <div 
                        onClick={() => setShowMeaning(true)} 
                        className="cursor-pointer hover:opacity-80 transition-opacity p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/10"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-red-400" />
                            <span className="text-xs font-medium text-white/70">Lucky Number</span>
                        </div>
                        <span className="text-2xl font-extrabold text-white">{horoscope.luckyNumber}</span>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Palette className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-medium text-white/70">Lucky Color</span>
                        </div>
                        <span className="text-2xl font-extrabold text-white">{horoscope.color}</span>
                    </div>
                </div>
            </div>

            {showMeaning && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 w-full max-w-md">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-white text-2xl font-bold">
                                Lucky Number {horoscope.luckyNumber}
                            </h2>
                            <button 
                                onClick={() => setShowMeaning(false)}
                                className="rounded-md hover:bg-white/10 p-1 transition-colors text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-purple-100 leading-relaxed mb-4">
                            {horoscope.luckyNumberMeaning || "No meaning available"}
                        </p>
                        <Button 
                            onClick={() => setShowMeaning(false)} 
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

interface HoroscopeDisplayProps {
    userData: UserData;
    horoscopes: { today: Horoscope; tomorrow: Horoscope };
    onReset: () => void;
}

const UserDetailsCard: React.FC<{ userData: UserData }> = ({ userData }) => {
    const zodiacDetails = ZODIAC_SIGN_DETAILS[userData.zodiacSign];
    
    return (
        <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="text-center">
                <div className="text-6xl mb-4 font-bold text-white">{userData.zodiacSign}</div>
                <h2 className="text-white text-2xl font-bold mb-2">{userData.zodiacSign}</h2>
                <p className="text-purple-200 text-lg mb-4">{zodiacDetails.element} Sign</p>
                <div className="flex items-center justify-center gap-2 text-purple-200">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <Separator className="bg-white/10 my-4" />
                <div className="space-y-2 text-left">
                    <p className="text-purple-100"><span className="font-semibold text-white">Birth Date:</span> {format(userData.birthDate, 'PPP')}</p>
                    <p className="text-purple-100"><span className="font-semibold text-white">Birth Time:</span> {userData.birthTime}</p>
                    <p className="text-purple-100"><span className="font-semibold text-white">Height:</span> {userData.height} cm</p>
                    <p className="text-purple-100"><span className="font-semibold text-white">Traits:</span> {zodiacDetails.traits.join(', ')}</p>
                </div>
            </div>
        </div>
    );
};

const HoroscopeDisplay: React.FC<HoroscopeDisplayProps> = ({ userData, horoscopes, onReset }) => {
    return (
        <div className="w-full space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-white text-4xl font-bold">
                    Cosmic Insight
                </h1>
                <p className="text-purple-200 text-lg">
                    Your personalized forecast for {userData.zodiacSign}
                </p>
            </div>

            <UserDetailsCard userData={userData} />

            <div className="space-y-6">
                <HoroscopeCard horoscope={horoscopes.today} />
                <HoroscopeCard horoscope={horoscopes.tomorrow} />
            </div>

            <div className="text-center pt-6">
                <Button 
                    onClick={onReset} 
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white border w-full"
                >
                    Get Another Reading
                </Button>
            </div>
        </div>
    );
};

export default HoroscopeDisplay;
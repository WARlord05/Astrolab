import React, { useState, useEffect } from 'react';
import { Horoscope, UserData, ZODIAC_SIGN_DETAILS } from '@/lib/astrology';
import { Separator } from '@/components/ui/separator';
import { Star, Calendar, Zap, Palette, User, Clock, Heart, TrendingUp, X, Droplet, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { fetchWeeklyHoroscope, fetchMonthlyHoroscope, HoroscopeData, fetchDailyHoroscope } from '@/services/astroApiService';
import { HoroscopeCard } from './HoroscopeCard';
import { SwipeableCards } from './SwipeableCards';
import { Capacitor } from '@capacitor/core';

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
    const [activeTab, setActiveTab] = useState<'yesterday' | 'today' | 'tomorrow' | 'weekly' | 'monthly'>('today');
    const [yesterdayData, setYesterdayData] = useState<Horoscope | null>(null);
    const [weeklyData, setWeeklyData] = useState<Horoscope | null>(null);
    const [monthlyData, setMonthlyData] = useState<Horoscope | null>(null);
    const [isLoadingExtended, setIsLoadingExtended] = useState(false);
    const [isNativeApp, setIsNativeApp] = useState(false);
    const [preTranslatedToday, setPreTranslatedToday] = useState<Horoscope | null>(null);
    const [preTranslatedTomorrow, setPreTranslatedTomorrow] = useState<Horoscope | null>(null);
    const [preTranslatedYesterday, setPreTranslatedYesterday] = useState<Horoscope | null>(null);
    const [preTranslatedWeekly, setPreTranslatedWeekly] = useState<Horoscope | null>(null);
    const [preTranslatedMonthly, setPreTranslatedMonthly] = useState<Horoscope | null>(null);

    // Translate a single chunk of text
    const translateSingleChunk = async (text: string, targetLang: string): Promise<string> => {
        try {
            if (!text || targetLang === 'en') return text;

            const response = await fetch('https://translate-api-sigma.vercel.app/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    to: targetLang
                })
            });

            if (!response.ok) {
                console.error(`Translation API error: ${response.status}`);
                return text;
            }

            const result = await response.json();
            return result.text || text;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    };

    // Translate full horoscope text (with sentence splitting for long texts)
    const translateHoroscope = async (text: string, targetLang: string): Promise<string> => {
        try {
            if (!text || targetLang === 'en') return text;

            const maxChunkLength = 500;
            if (text.length > maxChunkLength) {
                const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
                let translated = '';
                
                for (const sentence of sentences) {
                    const trimmed = sentence.trim();
                    if (!trimmed) continue;
                    
                    const result = await translateSingleChunk(trimmed, targetLang);
                    translated += result + ' ';
                    await new Promise(resolve => setTimeout(resolve, 100)); // Shorter delay
                }
                
                return translated.trim();
            } else {
                return await translateSingleChunk(text, targetLang);
            }
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    };

    const handleTabChange = (tab: 'yesterday' | 'today' | 'tomorrow' | 'weekly' | 'monthly') => {
        setActiveTab(tab);
    };
    
    // Detect if running in native app
    useEffect(() => {
        const detectNativeApp = async () => {
            try {
                const isNative = Capacitor.isNativePlatform();
                setIsNativeApp(isNative);
            } catch (error) {
                setIsNativeApp(false);
            }
        };
        detectNativeApp();
    }, []);
    
    // Load yesterday, weekly, and monthly forecasts on component mount
    useEffect(() => {
        const loadExtendedForecasts = async () => {
            setIsLoadingExtended(true);
            try {
                const targetLang = userData.preferredLanguage || 'en';
                
                // Load all three in parallel
                const [yesterdayResult, weeklyResult, monthlyResult] = await Promise.allSettled([
                    fetchDailyHoroscope(userData.zodiacSign, 'yesterday'),
                    fetchWeeklyHoroscope(userData.zodiacSign),
                    fetchMonthlyHoroscope(userData.zodiacSign),
                ]);

                // Process yesterday
                if (yesterdayResult.status === 'fulfilled') {
                    const data = yesterdayResult.value;
                    const yesterday = {
                        prediction: typeof data === 'string' ? data : data.prediction,
                        luckyNumber: typeof data === 'string' ? 0 : data.luckyNumber,
                        luckyColor: typeof data === 'string' ? '' : data.luckyColor,
                        date: 'Yesterday',
                        luckyNumberMeaning: typeof data === 'string' ? '' : data.luckyNumberMeaning,
                        sign: userData.zodiacSign,
                    };
                    setYesterdayData(yesterday);
                    
                    // Pre-translate if needed
                    if (targetLang !== 'en') {
                        const translatedPrediction = await translateHoroscope(yesterday.prediction, targetLang);
                        setPreTranslatedYesterday({ ...yesterday, prediction: translatedPrediction });
                    }
                }

                // Process weekly
                if (weeklyResult.status === 'fulfilled') {
                    const data = weeklyResult.value;
                    const weekly = {
                        prediction: typeof data === 'string' ? data : data.prediction,
                        luckyNumber: typeof data === 'string' ? 0 : data.luckyNumber,
                        luckyColor: typeof data === 'string' ? '' : data.luckyColor,
                        date: 'This Week',
                        luckyNumberMeaning: typeof data === 'string' ? '' : data.luckyNumberMeaning,
                        sign: userData.zodiacSign,
                    };
                    setWeeklyData(weekly);
                    
                    // Pre-translate if needed
                    if (targetLang !== 'en') {
                        const translatedPrediction = await translateHoroscope(weekly.prediction, targetLang);
                        setPreTranslatedWeekly({ ...weekly, prediction: translatedPrediction });
                    }
                }

                // Process monthly
                if (monthlyResult.status === 'fulfilled') {
                    const data = monthlyResult.value;
                    const monthly = {
                        prediction: typeof data === 'string' ? data : data.prediction,
                        luckyNumber: typeof data === 'string' ? 0 : data.luckyNumber,
                        luckyColor: typeof data === 'string' ? '' : data.luckyColor,
                        date: 'This Month',
                        luckyNumberMeaning: typeof data === 'string' ? '' : data.luckyNumberMeaning,
                        sign: userData.zodiacSign,
                    };
                    setMonthlyData(monthly);
                    
                    // Pre-translate if needed
                    if (targetLang !== 'en') {
                        const translatedPrediction = await translateHoroscope(monthly.prediction, targetLang);
                        setPreTranslatedMonthly({ ...monthly, prediction: translatedPrediction });
                    }
                }
            } catch (error) {
                console.error('Error loading extended forecasts:', error);
            } finally {
                setIsLoadingExtended(false);
            }
        };

        if (userData) {
            loadExtendedForecasts();
        }
    }, [userData]);

    // Pre-translate today and tomorrow horoscopes when preferredLanguage changes
    useEffect(() => {
        const preTranslateTodayTomorrow = async () => {
            const targetLang = userData.preferredLanguage || 'en';
            
            if (targetLang !== 'en') {
                const translatedTodayPrediction = await translateHoroscope(horoscopes.today.prediction, targetLang);
                setPreTranslatedToday({ ...horoscopes.today, prediction: translatedTodayPrediction });
                
                const translatedTomorrowPrediction = await translateHoroscope(horoscopes.tomorrow.prediction, targetLang);
                setPreTranslatedTomorrow({ ...horoscopes.tomorrow, prediction: translatedTomorrowPrediction });
            }
        };

        preTranslateTodayTomorrow();
    }, [userData.preferredLanguage, horoscopes]);
    
    const handleTabChange = (tab: 'yesterday' | 'today' | 'tomorrow' | 'weekly' | 'monthly') => {
        setActiveTab(tab);
    };
    
    return (
        <div className="w-full space-y-6">
            <div className="text-center space-y-3 mb-8">
                <h1 className="text-white text-5xl font-bold bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                    ✨ Cosmic Insight ✨
                </h1>
                <p className="text-purple-200 text-lg">
                    Your personalized forecast for {userData.zodiacSign}
                </p>
            </div>

            <UserDetailsCard userData={userData} />

            {/* Tabs - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex gap-3 justify-center flex-wrap bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <button
                    onClick={() => handleTabChange('yesterday')}
                    className={cn(
                        "px-6 py-2 rounded-xl text-sm font-semibold transition-all border border-white/20",
                        activeTab === 'yesterday'
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:border-white/30"
                    )}
                    disabled={isLoadingExtended && activeTab !== 'yesterday'}
                >
                    {isLoadingExtended && activeTab === 'yesterday' ? '⏳ Loading' : 'Yesterday'}
                </button>
                <button
                    onClick={() => handleTabChange('today')}
                    className={cn(
                        "px-6 py-2 rounded-xl text-sm font-semibold transition-all border border-white/20",
                        activeTab === 'today'
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:border-white/30"
                    )}
                >
                    Today
                </button>
                <button
                    onClick={() => handleTabChange('tomorrow')}
                    className={cn(
                        "px-6 py-2 rounded-xl text-sm font-semibold transition-all border border-white/20",
                        activeTab === 'tomorrow'
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:border-white/30"
                    )}
                >
                    Tomorrow
                </button>
                <button
                    onClick={() => handleTabChange('weekly')}
                    className={cn(
                        "px-6 py-2 rounded-xl text-sm font-semibold transition-all border border-white/20",
                        activeTab === 'weekly'
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:border-white/30"
                    )}
                    disabled={isLoadingExtended && activeTab !== 'weekly'}
                >
                    {isLoadingExtended && activeTab === 'weekly' ? '⏳ Loading' : 'Weekly'}
                </button>
                <button
                    onClick={() => handleTabChange('monthly')}
                    className={cn(
                        "px-6 py-2 rounded-xl text-sm font-semibold transition-all border border-white/20",
                        activeTab === 'monthly'
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:border-white/30"
                    )}
                    disabled={isLoadingExtended && activeTab !== 'monthly'}
                >
                    {isLoadingExtended && activeTab === 'monthly' ? '⏳ Loading' : 'Monthly'}
                </button>
            </div>

            {/* Mobile Layout - Tinder Style Cards */}
            <div className="md:hidden">
                <SwipeableCards
                    forecasts={{
                        yesterday: preTranslatedYesterday || yesterdayData,
                        today: preTranslatedToday || horoscopes.today,
                        tomorrow: preTranslatedTomorrow || horoscopes.tomorrow,
                        weekly: preTranslatedWeekly || weeklyData,
                        monthly: preTranslatedMonthly || monthlyData,
                    }}
                    isLoadingExtended={isLoadingExtended}
                    translatedHoroscopes={{}}
                    onLoadTab={handleTabChange}
                />
            </div>

            {/* Desktop Layout - Tab Based */}
            <div className="hidden md:block space-y-6">
                {activeTab === 'today' && <HoroscopeCard horoscope={preTranslatedToday || horoscopes.today} showDetails={true} />}
                {activeTab === 'tomorrow' && <HoroscopeCard horoscope={preTranslatedTomorrow || horoscopes.tomorrow} showDetails={true} />}
                {activeTab === 'yesterday' && yesterdayData && <HoroscopeCard horoscope={preTranslatedYesterday || yesterdayData} showDetails={false} />}
                {activeTab === 'weekly' && weeklyData && <HoroscopeCard horoscope={preTranslatedWeekly || weeklyData} showDetails={false} />}
                {activeTab === 'monthly' && monthlyData && <HoroscopeCard horoscope={preTranslatedMonthly || monthlyData} showDetails={false} />}
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
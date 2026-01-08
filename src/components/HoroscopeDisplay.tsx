import React, { useState } from 'react';
import { Horoscope, UserData, ZODIAC_SIGN_DETAILS } from '@/lib/astrology';
import { Separator } from '@/components/ui/separator';
import { Star, Calendar, Zap, Palette, User, Clock, Heart, TrendingUp, X, Droplet, Sparkles, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { fetchWeeklyHoroscope, fetchMonthlyHoroscope, HoroscopeData, fetchDailyHoroscope } from '@/services/astroApiService';
import { HoroscopeCard } from './HoroscopeCard';
import { SwipeableCards } from './SwipeableCards';

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
    const [targetLanguage, setTargetLanguage] = useState<string | null>(null);
    const [translatedHoroscopes, setTranslatedHoroscopes] = useState<{ today: Horoscope; tomorrow: Horoscope } | null>(null);
    const [translatedExtended, setTranslatedExtended] = useState<{ yesterday?: Horoscope; weekly?: Horoscope; monthly?: Horoscope }>({});
    const [isTranslating, setIsTranslating] = useState(false);
    const [yesterdayData, setYesterdayData] = useState<Horoscope | null>(null);
    const [weeklyData, setWeeklyData] = useState<Horoscope | null>(null);
    const [monthlyData, setMonthlyData] = useState<Horoscope | null>(null);
    const [isLoadingExtended, setIsLoadingExtended] = useState(false);

    const languages = [
        { code: 'es', name: '🇪🇸 Spanish' },
        { code: 'fr', name: '🇫🇷 French' },
        { code: 'de', name: '🇩🇪 German' },
        { code: 'it', name: '🇮🇹 Italian' },
        { code: 'pt', name: '🇵🇹 Portuguese' },
        { code: 'ja', name: '🇯🇵 Japanese' },
        { code: 'zh', name: '🇨🇳 Chinese' },
        { code: 'ko', name: '🇰🇷 Korean' },
        { code: 'hi', name: '🇮🇳 Hindi' },
        { code: 'mr', name: '🇮🇳 Marathi' },
    ];

    const translateText = async (text: string, targetLang: string) => {
        try {
            // Split text into chunks to avoid hitting URL length limits
            const maxChunkLength = 500;
            if (text.length > maxChunkLength) {
                // Split by sentences
                const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
                let translated = '';
                
                for (const sentence of sentences) {
                    const trimmed = sentence.trim();
                    if (!trimmed) continue;
                    
                    const result = await translateSingleChunk(trimmed, targetLang);
                    translated += result + ' ';
                    
                    // Add delay between requests
                    await new Promise(resolve => setTimeout(resolve, 200));
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

    const translateSingleChunk = async (text: string, targetLang: string): Promise<string> => {
        try {
            const response = await fetch('http://localhost:5000/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: text,
                    source: 'auto',
                    target: targetLang,
                    format: 'text',
                    api_key: ''
                })
            });

            const result = await response.json();
            
            if (result.translatedText) {
                return result.translatedText;
            }
            return text;
        } catch (error) {
            console.error('Translation chunk error:', error);
            return text;
        }
    };

    const handleTranslate = async (langCode: string) => {
        setIsTranslating(true);
        setTargetLanguage(langCode);

        try {
            if (activeTab === 'today' || activeTab === 'tomorrow') {
                const translatedToday = { ...horoscopes.today };
                const translatedTomorrow = { ...horoscopes.tomorrow };

                translatedToday.prediction = await translateText(horoscopes.today.prediction, langCode);
                await new Promise(resolve => setTimeout(resolve, 300)); // Delay between requests
                translatedTomorrow.prediction = await translateText(horoscopes.tomorrow.prediction, langCode);

                setTranslatedHoroscopes({
                    today: translatedToday,
                    tomorrow: translatedTomorrow,
                });
            } else if (activeTab === 'yesterday' && yesterdayData) {
                const translated = { ...yesterdayData };
                translated.prediction = await translateText(yesterdayData.prediction, langCode);
                setTranslatedExtended({ yesterday: translated });
            } else if (activeTab === 'weekly' && weeklyData) {
                const translated = { ...weeklyData };
                translated.prediction = await translateText(weeklyData.prediction, langCode);
                setTranslatedExtended({ weekly: translated });
            } else if (activeTab === 'monthly' && monthlyData) {
                const translated = { ...monthlyData };
                translated.prediction = await translateText(monthlyData.prediction, langCode);
                setTranslatedExtended({ monthly: translated });
            }
        } catch (error) {
            console.error('Error translating horoscopes:', error);
        } finally {
            setIsTranslating(false);
        }
    };

    const displayHoroscopes = translatedHoroscopes || horoscopes;
    
    const handleTabChange = async (tab: 'yesterday' | 'today' | 'tomorrow' | 'weekly' | 'monthly') => {
        setActiveTab(tab);
        setTargetLanguage(null);
        setTranslatedHoroscopes(null);
        setTranslatedExtended({});

        if (tab === 'yesterday' && !yesterdayData) {
            setIsLoadingExtended(true);
            try {
                const data = await fetchDailyHoroscope(userData.zodiacSign, 'yesterday');
                setYesterdayData({
                    prediction: typeof data === 'string' ? data : data.prediction,
                    luckyNumber: typeof data === 'string' ? 0 : data.luckyNumber,
                    luckyColor: typeof data === 'string' ? '' : data.luckyColor,
                    date: 'Yesterday',
                    luckyNumberMeaning: typeof data === 'string' ? '' : data.luckyNumberMeaning,
                    sign: userData.zodiacSign,
                });
            } catch (error) {
                console.error('Error fetching yesterday horoscope:', error);
            } finally {
                setIsLoadingExtended(false);
            }
        }

        if (tab === 'weekly' && !weeklyData) {
            setIsLoadingExtended(true);
            try {
                const data = await fetchWeeklyHoroscope(userData.zodiacSign);
                setWeeklyData({
                    prediction: typeof data === 'string' ? data : data.prediction,
                    luckyNumber: typeof data === 'string' ? 0 : data.luckyNumber,
                    luckyColor: typeof data === 'string' ? '' : data.luckyColor,
                    date: 'This Week',
                    luckyNumberMeaning: typeof data === 'string' ? '' : data.luckyNumberMeaning,
                    sign: userData.zodiacSign,
                });
            } catch (error) {
                console.error('Error fetching weekly horoscope:', error);
            } finally {
                setIsLoadingExtended(false);
            }
        }

        if (tab === 'monthly' && !monthlyData) {
            setIsLoadingExtended(true);
            try {
                const data = await fetchMonthlyHoroscope(userData.zodiacSign);
                setMonthlyData({
                    prediction: typeof data === 'string' ? data : data.prediction,
                    luckyNumber: typeof data === 'string' ? 0 : data.luckyNumber,
                    luckyColor: typeof data === 'string' ? '' : data.luckyColor,
                    date: 'This Month',
                    luckyNumberMeaning: typeof data === 'string' ? '' : data.luckyNumberMeaning,
                    sign: userData.zodiacSign,
                });
            } catch (error) {
                console.error('Error fetching monthly horoscope:', error);
            } finally {
                setIsLoadingExtended(false);
            }
        }
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

            {/* Tabs */}
            <div className="flex gap-3 justify-center flex-wrap bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
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

            <div className="flex gap-2 flex-wrap justify-center">
                <div className="w-full text-center bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-4">
                    <p className="text-yellow-200 text-sm">
                        ⚠️ Translation feature coming soon. Please use chome's built-in translation for now. ⚠️
                    </p>
                </div>
            </div>

            {/* Mobile Layout - Tinder Style Cards */}
            <div className="md:hidden">
                <SwipeableCards
                    forecasts={{
                        yesterday: yesterdayData,
                        today: displayHoroscopes.today,
                        tomorrow: displayHoroscopes.tomorrow,
                        weekly: weeklyData,
                        monthly: monthlyData,
                    }}
                    isLoadingExtended={isLoadingExtended}
                    translatedHoroscopes={translatedExtended}
                    onLoadTab={handleTabChange}
                />
            </div>

            {/* Desktop Layout - Tab Based */}
            <div className="hidden md:block space-y-6">
                {activeTab === 'today' && <HoroscopeCard horoscope={displayHoroscopes.today} showDetails={true} />}
                {activeTab === 'tomorrow' && <HoroscopeCard horoscope={displayHoroscopes.tomorrow} showDetails={true} />}
                {activeTab === 'yesterday' && yesterdayData && <HoroscopeCard horoscope={translatedExtended.yesterday || yesterdayData} showDetails={false} />}
                {activeTab === 'weekly' && weeklyData && <HoroscopeCard horoscope={translatedExtended.weekly || weeklyData} showDetails={false} />}
                {activeTab === 'monthly' && monthlyData && <HoroscopeCard horoscope={translatedExtended.monthly || monthlyData} showDetails={false} />}
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
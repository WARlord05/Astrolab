import React from 'react';
import { Horoscope, UserData } from '@/lib/astrology';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, Calendar, Zap, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HoroscopeCardProps {
    horoscope: Horoscope;
}

const HoroscopeCard: React.FC<HoroscopeCardProps> = ({ horoscope }) => (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
                <Calendar className="w-5 h-5 text-primary" />
                {horoscope.date}
            </CardTitle>
            <CardDescription className="text-lg font-semibold text-primary">
                {horoscope.date === new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) ? "Today's Reading" : "Tomorrow's Forecast"}
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow">
            <p className="text-lg italic text-gray-700 dark:text-gray-300 border-l-4 border-yellow-500 pl-3 py-1">
                "{horoscope.prediction}"
            </p>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Lucky Number:</span>
                    <span className="font-bold text-lg text-primary">{horoscope.luckyNumber}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Lucky Color:</span>
                    <span className="font-bold text-primary">{horoscope.color}</span>
                </div>
            </div>
        </CardContent>
    </Card>
);

interface HoroscopeDisplayProps {
    userData: UserData;
    horoscopes: { today: Horoscope; tomorrow: Horoscope };
    onReset: () => void;
}

const HoroscopeDisplay: React.FC<HoroscopeDisplayProps> = ({ userData, horoscopes, onReset }) => {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 p-4">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary">
                    <Star className="inline w-8 h-8 mr-2 text-yellow-500" />
                    Your Astrolab Reading
                </h1>
                <p className="text-xl text-muted-foreground">
                    Horoscopes for {userData.zodiacSign}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <HoroscopeCard horoscope={horoscopes.today} />
                <HoroscopeCard horoscope={horoscopes.tomorrow} />
            </div>

            <div className="text-center pt-4">
                <Button onClick={onReset} variant="secondary">
                    Enter New Details
                </Button>
            </div>
        </div>
    );
};

export default HoroscopeDisplay;
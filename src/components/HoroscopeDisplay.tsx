import React from 'react';
import { Horoscope, UserData } from '@/lib/astrology';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, Calendar, Zap, Palette, User, Clock, Heart, Ruler, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HoroscopeCardProps {
    horoscope: Horoscope;
}

const HoroscopeCard: React.FC<HoroscopeCardProps> = ({ horoscope }) => {
    const todayFormatted = format(new Date(), 'PPP');
    const isToday = horoscope.date === todayFormatted;

    return (
        <Card className="flex flex-col h-full shadow-xl border-t-4 border-yellow-500 dark:border-yellow-400 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-yellow-500" />
                        {isToday ? "Today" : "Tomorrow"}
                    </CardTitle>
                    <Badge variant={isToday ? "default" : "secondary"} className="text-sm px-3 py-1">
                        {isToday ? "Current Forecast" : "Upcoming"}
                    </Badge>
                </div>
                <CardDescription className="text-sm text-muted-foreground">{horoscope.date}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">
                <div className="p-4 bg-accent/30 rounded-lg border border-accent">
                    <p className="text-lg italic font-medium text-foreground">
                        "{horoscope.prediction}"
                    </p>
                </div>
                
                <Separator />

                <div className="grid grid-cols-2 gap-4">
                    <FeatureItem 
                        icon={Zap} 
                        label="Lucky Number" 
                        value={horoscope.luckyNumber.toString()} 
                        color="text-red-500"
                    />
                    <FeatureItem 
                        icon={Palette} 
                        label="Lucky Color" 
                        value={horoscope.color} 
                        color="text-blue-500"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

const FeatureItem: React.FC<{ icon: React.ElementType, label: string, value: string, color: string }> = ({ icon: Icon, label, value, color }) => (
    <div className="flex flex-col items-start p-3 bg-background rounded-md border">
        <div className="flex items-center space-x-2 mb-1">
            <Icon className={cn("w-4 h-4", color)} />
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
        </div>
        <span className="text-xl font-extrabold text-primary">{value}</span>
    </div>
);

interface HoroscopeDisplayProps {
    userData: UserData;
    horoscopes: { today: Horoscope; tomorrow: Horoscope };
    onReset: () => void;
}

const UserDetailsCard: React.FC<{ userData: UserData }> = ({ userData }) => (
    <Card className="p-6 shadow-lg bg-secondary/50">
        <h3 className="text-xl font-bold mb-4 flex items-center text-primary">
            <User className="w-5 h-5 mr-2" /> Your Profile
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <DetailItem icon={Star} label="Zodiac Sign" value={userData.zodiacSign} />
            <DetailItem icon={Heart} label="Current Mood" value={userData.mood} />
            <DetailItem icon={Calendar} label="Birth Date" value={format(userData.birthDate, 'PPP')} />
            <DetailItem icon={Clock} label="Birth Time" value={userData.birthTime} />
            <DetailItem icon={Weight} label="Weight" value={`${userData.weight} kg`} />
            <DetailItem icon={Ruler} label="Height" value={`${userData.height} cm`} />
        </div>
    </Card>
);

const DetailItem: React.FC<{ icon: React.ElementType, label: string, value: string }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-muted-foreground">{label}:</span>
        <span className="font-semibold text-foreground">{value}</span>
    </div>
);


const HoroscopeDisplay: React.FC<HoroscopeDisplayProps> = ({ userData, horoscopes, onReset }) => {
    return (
        <div className="w-full max-w-5xl mx-auto space-y-10 p-4">
            <div className="text-center space-y-3">
                <h1 className="text-5xl font-extrabold tracking-tighter text-primary">
                    <Star className="inline w-10 h-10 mr-3 text-yellow-500 fill-yellow-500" />
                    Cosmic Insight
                </h1>
                <p className="text-2xl text-muted-foreground font-light">
                    Your personalized forecast for {userData.zodiacSign}
                </p>
            </div>

            <UserDetailsCard userData={userData} />

            <div className="grid lg:grid-cols-2 gap-8">
                <HoroscopeCard horoscope={horoscopes.today} />
                <HoroscopeCard horoscope={horoscopes.tomorrow} />
            </div>

            <div className="text-center pt-6">
                <Button onClick={onReset} variant="outline" className="text-lg px-8 py-6 border-2 border-primary hover:bg-primary/10">
                    Enter New Details
                </Button>
            </div>
        </div>
    );
};

export default HoroscopeDisplay;
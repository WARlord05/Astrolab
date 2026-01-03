import React, { useState, useEffect, useMemo } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import UserForm from "@/components/UserForm";
import HoroscopeDisplay from "@/components/HoroscopeDisplay";
import { UserData, Horoscope } from "@/lib/astrology";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useHoroscope } from "@/hooks/useHoroscope";
import { Loader2, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [horoscopes, setHoroscopes] = useState<{ today: Horoscope; tomorrow: Horoscope } | null>(null);
  const { toast } = useToast();
  
  // Generate stars once and memoize them to prevent recalculation on re-renders
  const stars = useMemo(() => {
    return [...Array(50)].map((_, i) => ({
      id: i,
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, []);
  
  // Fetch horoscopes from API when zodiac sign is selected
  const { horoscopes: apiHoroscopes, isLoading, isError, error } = useHoroscope(userData?.zodiacSign ?? null);

  useEffect(() => {
    if (apiHoroscopes) {
      setHoroscopes(apiHoroscopes);
    }
  }, [apiHoroscopes]);

  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error",
        description: "Failed to fetch horoscope data. Please try again.",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  const handleFormSubmit = (data: UserData) => {
    setUserData(data);
    setHoroscopes(null); // Reset horoscopes while loading
  };

  const handleReset = () => {
    setUserData(null);
    setHoroscopes(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              width: star.width + 'px',
              height: star.height + 'px',
              top: star.top + '%',
              left: star.left + '%',
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* Floating moon and sun */}
      <Moon className="absolute top-10 left-10 w-12 h-12 text-blue-200 opacity-20 animate-pulse pointer-events-none" />
      <Sun className="absolute bottom-10 right-10 w-16 h-16 text-amber-200 opacity-20 animate-pulse pointer-events-none" />

      <div className="flex-grow flex items-center justify-center w-full max-w-2xl py-10 relative z-10">
        {userData && horoscopes ? (
          <HoroscopeDisplay 
            userData={userData} 
            horoscopes={horoscopes} 
            onReset={handleReset} 
          />
        ) : userData && isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-yellow-400" />
            <p className="text-lg text-purple-200">Loading your horoscope...</p>
          </div>
        ) : (
          <UserForm onSubmitData={handleFormSubmit} />
        )}
      </div>

      {!userData && (
        <div className="absolute bottom-8 text-center text-purple-200 text-sm pointer-events-none">
          <MadeWithDyad />
        </div>
      )}
    </div>
  );
};

export default Index;
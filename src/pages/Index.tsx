import React, { useState } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import UserForm from "@/components/UserForm";
import HoroscopeDisplay from "@/components/HoroscopeDisplay";
import { UserData, Horoscope } from "@/lib/astrology";
import { getHoroscopes } from "@/lib/mockHoroscope";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [horoscopes, setHoroscopes] = useState<{ today: Horoscope; tomorrow: Horoscope } | null>(null);

  const handleFormSubmit = (data: UserData) => {
    setUserData(data);
    
    // In a real application, this is where you would call an API to get the horoscope
    const results = getHoroscopes(data.zodiacSign);
    setHoroscopes(results);
  };

  const handleReset = () => {
    setUserData(null);
    setHoroscopes(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex-grow flex items-center justify-center w-full py-10">
        {userData && horoscopes ? (
          <HoroscopeDisplay 
            userData={userData} 
            horoscopes={horoscopes} 
            onReset={handleReset} 
          />
        ) : (
          <UserForm onSubmitData={handleFormSubmit} />
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;
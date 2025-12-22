export const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

export type ZodiacSign = typeof ZODIAC_SIGNS[number];

export interface UserData {
  weight: number;
  height: number;
  birthDate: Date;
  birthTime: string; // HH:MM format
  zodiacSign: ZodiacSign;
  mood: 'Happy' | 'Neutral' | 'Stressed';
}

export interface Horoscope {
  date: string;
  sign: ZodiacSign;
  prediction: string;
  luckyNumber: number;
  color: string;
}
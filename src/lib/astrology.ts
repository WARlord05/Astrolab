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

export interface ZodiacSignDetail {
  dates: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  rulingPlanet: string;
  quality: 'Cardinal' | 'Fixed' | 'Mutable';
  traits: string[];
}

export const ZODIAC_SIGN_DETAILS: Record<ZodiacSign, ZodiacSignDetail> = {
  Aries: {
    dates: 'March 21 - April 19',
    element: 'Fire',
    rulingPlanet: 'Mars',
    quality: 'Cardinal',
    traits: ['Courageous', 'Determined', 'Confident'],
  },
  Taurus: {
    dates: 'April 20 - May 20',
    element: 'Earth',
    rulingPlanet: 'Venus',
    quality: 'Fixed',
    traits: ['Strong', 'Sensual', 'Practical'],
  },
  Gemini: {
    dates: 'May 21 - June 20',
    element: 'Air',
    rulingPlanet: 'Mercury',
    quality: 'Mutable',
    traits: ['Adaptable', 'Intelligent', 'Communicative'],
  },
  Cancer: {
    dates: 'June 21 - July 22',
    element: 'Water',
    rulingPlanet: 'Moon',
    quality: 'Cardinal',
    traits: ['Emotional', 'Nurturing', 'Intuitive'],
  },
  Leo: {
    dates: 'July 23 - August 22',
    element: 'Fire',
    rulingPlanet: 'Sun',
    quality: 'Fixed',
    traits: ['Passionate', 'Generous', 'Warm-hearted'],
  },
  Virgo: {
    dates: 'August 23 - September 22',
    element: 'Earth',
    rulingPlanet: 'Mercury',
    quality: 'Mutable',
    traits: ['Analytical', 'Kind', 'Hardworking'],
  },
  Libra: {
    dates: 'September 23 - October 22',
    element: 'Air',
    rulingPlanet: 'Venus',
    quality: 'Cardinal',
    traits: ['Balanced', 'Social', 'Fair-minded'],
  },
  Scorpio: {
    dates: 'October 23 - November 21',
    element: 'Water',
    rulingPlanet: 'Pluto, Mars',
    quality: 'Fixed',
    traits: ['Intense', 'Resourceful', 'Brave'],
  },
  Sagittarius: {
    dates: 'November 22 - December 21',
    element: 'Fire',
    rulingPlanet: 'Jupiter',
    quality: 'Mutable',
    traits: ['Optimistic', 'Adventurous', 'Philosophical'],
  },
  Capricorn: {
    dates: 'December 22 - January 19',
    element: 'Earth',
    rulingPlanet: 'Saturn',
    quality: 'Cardinal',
    traits: ['Disciplined', 'Responsible', 'Ambitious'],
  },
  Aquarius: {
    dates: 'January 20 - February 18',
    element: 'Air',
    rulingPlanet: 'Uranus, Saturn',
    quality: 'Fixed',
    traits: ['Independent', 'Humanitarian', 'Original'],
  },
  Pisces: {
    dates: 'February 19 - March 20',
    element: 'Water',
    rulingPlanet: 'Neptune, Jupiter',
    quality: 'Mutable',
    traits: ['Compassionate', 'Artistic', 'Intuitive'],
  },
};
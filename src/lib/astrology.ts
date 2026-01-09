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
  preferredLanguage?: string; // Language code for translation (e.g., 'es', 'fr', 'mr')
}

/**
 * Calculate zodiac sign from birth date
 * @param date - Birth date
 * @returns Zodiac sign name
 */
export const getZodiacSignFromDate = (date: Date): ZodiacSign => {
  const month = date.getMonth() + 1; // getMonth returns 0-11
  const day = date.getDate();

  const zodiacData: Array<{ sign: ZodiacSign; startMonth: number; startDay: number; endMonth: number; endDay: number }> = [
    { sign: 'Aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
    { sign: 'Taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
    { sign: 'Gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 21 },
    { sign: 'Cancer', startMonth: 6, startDay: 22, endMonth: 7, endDay: 22 },
    { sign: 'Leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    { sign: 'Virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    { sign: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 23 },
    { sign: 'Scorpio', startMonth: 10, startDay: 24, endMonth: 11, endDay: 21 },
    { sign: 'Sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
    { sign: 'Capricorn', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
    { sign: 'Aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
    { sign: 'Pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
  ];

  for (const zodiac of zodiacData) {
    let isInRange = false;

    if (zodiac.startMonth === zodiac.endMonth) {
      isInRange = month === zodiac.startMonth && day >= zodiac.startDay && day <= zodiac.endDay;
    } else if (zodiac.startMonth < zodiac.endMonth) {
      isInRange = (month === zodiac.startMonth && day >= zodiac.startDay) || (month === zodiac.endMonth && day <= zodiac.endDay);
    } else {
      // Wraps around year (e.g., Capricorn: Dec 22 - Jan 19)
      isInRange = (month === zodiac.startMonth && day >= zodiac.startDay) || (month === zodiac.endMonth && day <= zodiac.endDay);
    }

    if (isInRange) {
      return zodiac.sign;
    }
  }

  return 'Aries'; // Default fallback
};

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
    traits: ['Energetic', 'Courageous', 'Impulsive'],
  },
  Taurus: {
    dates: 'April 20 - May 20',
    element: 'Earth',
    rulingPlanet: 'Venus',
    quality: 'Fixed',
    traits: ['Reliable', 'Practical', 'Stubborn'],
  },
  Gemini: {
    dates: 'May 21 - June 21',
    element: 'Air',
    rulingPlanet: 'Mercury',
    quality: 'Mutable',
    traits: ['Curious', 'Quick-witted', 'Inconsistent'],
  },
  Cancer: {
    dates: 'June 22 - July 22',
    element: 'Water',
    rulingPlanet: 'Moon',
    quality: 'Cardinal',
    traits: ['Loyal', 'Protective', 'Moody'],
  },
  Leo: {
    dates: 'July 23 - August 22',
    element: 'Fire',
    rulingPlanet: 'Sun',
    quality: 'Fixed',
    traits: ['Creative', 'Generous', 'Domineering'],
  },
  Virgo: {
    dates: 'August 23 - September 22',
    element: 'Earth',
    rulingPlanet: 'Mercury',
    quality: 'Mutable',
    traits: ['Analytical', 'Hardworking', 'Critical'],
  },
  Libra: {
    dates: 'September 23 - October 23',
    element: 'Air',
    rulingPlanet: 'Venus',
    quality: 'Cardinal',
    traits: ['Diplomatic', 'Cooperative', 'Indecisive'],
  },
  Scorpio: {
    dates: 'October 24 - November 21',
    element: 'Water',
    rulingPlanet: 'Pluto, Mars',
    quality: 'Fixed',
    traits: ['Passionate', 'Resourceful', 'Jealous'],
  },
  Sagittarius: {
    dates: 'November 22 - December 21',
    element: 'Fire',
    rulingPlanet: 'Jupiter',
    quality: 'Mutable',
    traits: ['Adventurous', 'Honest', 'Tactless'],
  },
  Capricorn: {
    dates: 'December 22 - January 19',
    element: 'Earth',
    rulingPlanet: 'Saturn',
    quality: 'Cardinal',
    traits: ['Disciplined', 'Responsible', 'Unforgiving'],
  },
  Aquarius: {
    dates: 'January 20 - February 18',
    element: 'Air',
    rulingPlanet: 'Uranus, Saturn',
    quality: 'Fixed',
    traits: ['Independent', 'Intellectual', 'Detached'],
  },
  Pisces: {
    dates: 'February 19 - March 20',
    element: 'Water',
    rulingPlanet: 'Neptune, Jupiter',
    quality: 'Mutable',
    traits: ['Artistic', 'Compassionate', 'Escapist'],
  },
};

export interface Horoscope {
  date: string;
  sign: ZodiacSign;
  prediction: string;
  luckyNumber: number | null;
  luckyNumberMeaning: string | null;
  luckyColor: string | null;
}
import { Horoscope, ZodiacSign } from "./astrology";
import { format, addDays } from "date-fns";

const MOCK_PREDICTIONS = [
  "A day of unexpected opportunities. Be open to new collaborations.",
  "Focus on self-care and reflection. Your intuition is strong today.",
  "Financial matters require attention. Review your budget carefully.",
  "A great time for communication and connecting with loved ones.",
  "Challenges may arise, but your resilience will see you through.",
  "Creative energy is high. Start that project you've been postponing.",
  "Expect a breakthrough in a long-standing personal issue.",
  "Travel plans look favorable, even if it's just a short trip.",
];

const MOCK_COLORS = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Silver", "Gold"];

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function generateMockHoroscope(sign: ZodiacSign, date: Date): Horoscope {
    return {
        date: format(date, 'PPP'),
        sign: sign,
        prediction: getRandomElement(MOCK_PREDICTIONS),
        luckyNumber: Math.floor(Math.random() * 99) + 1,
        color: getRandomElement(MOCK_COLORS),
    };
}

export function getHoroscopes(sign: ZodiacSign): { today: Horoscope, tomorrow: Horoscope } {
    const today = new Date();
    const tomorrow = addDays(today, 1);

    return {
        today: generateMockHoroscope(sign, today),
        tomorrow: generateMockHoroscope(sign, tomorrow),
    };
}
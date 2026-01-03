import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDailyHoroscope, fetchWeeklyHoroscope, fetchMonthlyHoroscope } from '@/services/astroApiService';
import { Horoscope, ZodiacSign } from '@/lib/astrology';
import { format, addDays } from 'date-fns';

interface UseHoroscopeResult {
  horoscopes: { today: Horoscope; tomorrow: Horoscope } | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Custom hook for fetching horoscopes from AstroAPI
 * @param zodiacSign - The zodiac sign
 * @returns Horoscope data and loading states
 */
export const useHoroscope = (zodiacSign: ZodiacSign | null): UseHoroscopeResult => {
  const todayDate = format(new Date(), 'PPP');
  const tomorrowDate = format(addDays(new Date(), 1), 'PPP');

  console.log('🌟 useHoroscope called with sign:', zodiacSign);

  const { data: todayData, isLoading: todayLoading, error: todayError } = useQuery({
    queryKey: ['horoscope', 'daily', zodiacSign, 'today'],
    queryFn: () => {
      console.log('📅 Fetching today horoscope for:', zodiacSign);
      return fetchDailyHoroscope(zodiacSign!, 'today');
    },
    enabled: !!zodiacSign,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const { data: tomorrowData, isLoading: tomorrowLoading, error: tomorrowError } = useQuery({
    queryKey: ['horoscope', 'daily', zodiacSign, 'tomorrow'],
    queryFn: () => {
      console.log('📅 Fetching tomorrow horoscope for:', zodiacSign);
      return fetchDailyHoroscope(zodiacSign!, 'tomorrow');
    },
    enabled: !!zodiacSign,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const isLoading = todayLoading || tomorrowLoading;
  const isError = !!todayError || !!tomorrowError;
  const error = (todayError || tomorrowError) as Error | null;

  if (isLoading) console.log('⏳ Loading horoscope data...');
  if (isError) console.error('❌ Error loading horoscope:', error);

  const horoscopes = todayData && tomorrowData ? {
    today: {
      date: todayDate,
      sign: zodiacSign!,
      prediction: typeof todayData === 'object' ? (todayData as any).prediction : todayData,
      luckyNumber: typeof todayData === 'object' ? (todayData as any).luckyNumber : null,
      luckyNumberMeaning: typeof todayData === 'object' ? (todayData as any).luckyNumberMeaning : null,
      color: typeof todayData === 'object' ? (todayData as any).luckyColor : null,
    },
    tomorrow: {
      date: tomorrowDate,
      sign: zodiacSign!,
      prediction: typeof tomorrowData === 'object' ? (tomorrowData as any).prediction : tomorrowData,
      luckyNumber: typeof tomorrowData === 'object' ? (tomorrowData as any).luckyNumber : null,
      luckyNumberMeaning: typeof tomorrowData === 'object' ? (tomorrowData as any).luckyNumberMeaning : null,
      color: typeof tomorrowData === 'object' ? (tomorrowData as any).luckyColor : null,
    },
  } : null;

  if (horoscopes) console.log('✅ Horoscopes ready!', horoscopes);

  return { horoscopes, isLoading, isError, error };
};

/**
 * Custom hook for fetching weekly horoscope
 */
export const useWeeklyHoroscope = (zodiacSign: ZodiacSign | null) => {
  return useQuery({
    queryKey: ['horoscope', 'weekly', zodiacSign],
    queryFn: () => fetchWeeklyHoroscope(zodiacSign!),
    enabled: !!zodiacSign,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Custom hook for fetching monthly horoscope
 */
export const useMonthlyHoroscope = (zodiacSign: ZodiacSign | null) => {
  return useQuery({
    queryKey: ['horoscope', 'monthly', zodiacSign],
    queryFn: () => fetchMonthlyHoroscope(zodiacSign!),
    enabled: !!zodiacSign,
    staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

/**
 * Helper function to get random color
 */
function getRandomColor(): string {
  const colors = [
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Purple',
    'Orange',
    'Pink',
    'Cyan',
    'Magenta',
    'Gold',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

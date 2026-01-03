/**
 * API Service for AstroAPI Backend
 * Handles all communication with the Flask Horoscope API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface HoroscopeData {
  prediction: string;
  luckyNumber: number | null;
  luckyNumberMeaning: string | null;
  luckyColor: string | null;
}

export interface ApiHoroscope {
  success: boolean;
  data: HoroscopeData | string;
  status: number;
}

/**
 * Fetches daily horoscope from the API
 * @param sign - Zodiac sign name
 * @param day - Day (today, tomorrow, yesterday, or YYYY-MM-DD format)
 * @returns Horoscope data object with prediction, lucky number, and color
 */
export const fetchDailyHoroscope = async (sign: string, day: string = 'today'): Promise<HoroscopeData | string> => {
  try {
    const url = `${API_BASE_URL}/get-horoscope/daily?day=${day}&sign=${sign.toLowerCase()}`;
    console.log('🔍 Fetching horoscope from:', url);
    
    const response = await fetch(url);
    
    console.log('✅ Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiHoroscope = await response.json();
    console.log('✅ Response data:', data);

    if (!data.success) {
      throw new Error('API returned unsuccessful response');
    }

    console.log('✅ Horoscope fetched successfully!');
    return data.data;
  } catch (error) {
    console.error('❌ Error fetching daily horoscope:', error);
    throw error;
  }
};

/**
 * Fetches weekly horoscope from the API
 * @param sign - Zodiac sign name
 * @returns Horoscope data object with prediction, lucky number, and color
 */
export const fetchWeeklyHoroscope = async (sign: string): Promise<HoroscopeData | string> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/get-horoscope/weekly?sign=${sign.toLowerCase()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiHoroscope = await response.json();

    if (!data.success) {
      throw new Error('API returned unsuccessful response');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching weekly horoscope:', error);
    throw error;
  }
};

/**
 * Fetches monthly horoscope from the API
 * @param sign - Zodiac sign name
 * @returns Horoscope data object with prediction, lucky number, and color
 */
export const fetchMonthlyHoroscope = async (sign: string): Promise<HoroscopeData | string> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/get-horoscope/monthly?sign=${sign.toLowerCase()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiHoroscope = await response.json();

    if (!data.success) {
      throw new Error('API returned unsuccessful response');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching monthly horoscope:', error);
    throw error;
  }
};

/**
 * Test API connectivity
 * @returns true if API is reachable
 */
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_BASE_URL);
    return response.ok || response.status === 404; // API might return 404 for base URL, that's ok
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

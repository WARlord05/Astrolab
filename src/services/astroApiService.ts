/**
 * API Service for AstroAPI Backend
 * Handles all communication with the Flask Horoscope API
 */

// Primary and fallback API URLs
const API_URLS = [
  import.meta.env.VITE_API_URL || 'https://astro-api-teal.vercel.app/api/v1',
  import.meta.env.VITE_API_URL_SECONDARY || 'https://astro-api-git-main-warlord05s-projects.vercel.app/api/v1',
  import.meta.env.VITE_API_URL_TERTIARY || 'https://astro-bucut4p7s-warlord05s-projects.vercel.app/api/v1',
  'http://localhost:5000/api/v1', // Local development fallback
];

let currentApiIndex = 0;

const getNextApiUrl = (fallback: boolean = true): string => {
  if (!fallback) return API_URLS[0];
  
  const url = API_URLS[currentApiIndex];
  if (currentApiIndex < API_URLS.length - 1) {
    currentApiIndex += 1;
  }
  return url;
};

const resetApiIndex = (): void => {
  currentApiIndex = 0;
};

const API_BASE_URL = API_URLS[0];

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
 * Attempts to fetch from the API with fallback to secondary endpoints
 * @param endpoint - The endpoint to fetch from
 * @returns Promise with the response
 */
const fetchWithFallback = async (endpoint: string): Promise<Response> => {
  let lastError: Error | null = null;
  resetApiIndex();

  for (let i = 0; i < API_URLS.length; i++) {
    try {
      const url = `${API_URLS[i]}${endpoint}`;
      console.log(`🔍 Fetching from (attempt ${i + 1}):`, url);

      const response = await fetch(url, { timeout: 5000 });

      if (response.ok) {
        console.log(`✅ Success from endpoint ${i + 1}`);
        return response;
      }
    } catch (error) {
      lastError = error as Error;
      console.warn(`⚠️ Endpoint ${i + 1} failed:`, error);
      continue;
    }
  }

  // If all endpoints fail, throw the last error
  throw lastError || new Error('All API endpoints failed');
};

/**
 * Fetches daily horoscope from the API
 * @param sign - Zodiac sign name
 * @param day - Day (today, tomorrow, yesterday, or YYYY-MM-DD format)
 * @returns Horoscope data object with prediction, lucky number, and color
 */
export const fetchDailyHoroscope = async (sign: string, day: string = 'today'): Promise<HoroscopeData | string> => {
  try {
    const endpoint = `/get-horoscope/daily?day=${day}&sign=${sign.toLowerCase()}`;
    const response = await fetchWithFallback(endpoint);

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
    const endpoint = `/get-horoscope/weekly?sign=${sign.toLowerCase()}`;
    const response = await fetchWithFallback(endpoint);

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
    const endpoint = `/get-horoscope/monthly?sign=${sign.toLowerCase()}`;
    const response = await fetchWithFallback(endpoint);

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
 * Test API connectivity with all endpoints
 * @returns true if any API endpoint is reachable
 */
export const testApiConnection = async (): Promise<boolean> => {
  for (let i = 0; i < API_URLS.length; i++) {
    try {
      const response = await fetch(API_URLS[i], { timeout: 5000 });
      if (response.ok || response.status === 404) {
        console.log(`✅ API endpoint ${i + 1} is reachable`);
        return true;
      }
    } catch (error) {
      console.warn(`⚠️ API endpoint ${i + 1} not reachable:`, error);
      continue;
    }
  }
  return false;
};

/**
 * Get the list of configured API URLs
 * @returns array of API URLs
 */
export const getApiUrls = (): string[] => {
  return API_URLS;
};

/**
 * Get the primary (current) API URL
 * @returns the primary API URL
 */
export const getPrimaryApiUrl = (): string => {
  return API_BASE_URL;
};

export async function fetchWithRetry(url, options = {}, retries = 3, backoff = 1500) {
  try {
    const res = await fetch(url, options);
    
    // AniList usually returns 429 for rate limiting
    if (res.status === 429) {
      if (retries > 0) {
        console.warn(`Rate Limit hit for ${url}. Retrying in ${backoff}ms... (${retries} left)`);
        await new Promise(resolve => setTimeout(resolve, backoff));
        return fetchWithRetry(url, options, retries - 1, backoff * 2);
      }
      throw new Error('Rate limit exceeded after retries');
    }

    // Handles 500 errors or other HTTP issues
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.errors?.[0]?.message || `HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    if (retries > 0 && !err.message.includes('HTTP error! status: 4')) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw err;
  }
}

const DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Flexible cacheFetch that handles (url, options, ttl, key) or (url, options, key)
 */
export async function cacheFetch(url, options = {}, arg3 = DEFAULT_TTL, arg4 = null) {
  let ttl = DEFAULT_TTL;
  let customKey = null;

  if (typeof arg3 === 'string') {
    customKey = arg3;
    ttl = typeof arg4 === 'number' ? arg4 : DEFAULT_TTL;
  } else {
    ttl = typeof arg3 === 'number' ? arg3 : DEFAULT_TTL;
    customKey = arg4;
  }

  const cacheKey = customKey || `cache_${url}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        console.log(`[Cache Hit] ${cacheKey}`);
        return { data, fromCache: true };
      }
    } catch (e) {
      console.warn("Cache parse error", e);
    }
  }

  const fetchOptions = {
    ...options,
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    }
  };

  const data = await fetchWithRetry(url, fetchOptions);
  
  if (data) {
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  }

  return { data, fromCache: false };
}

export const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function convertToIST(jstDay, jstTime) {
  if (!jstDay || !jstTime) return null;

  const [hours, minutes] = jstTime.split(':').map(Number);

  let istHours = hours - 3;
  let istMinutes = minutes - 30;

  if (istMinutes < 0) {
    istMinutes += 60;
    istHours -= 1;
  }

  let dayShift = 0;
  if (istHours < 0) {
    istHours += 24;
    dayShift = -1;
  }

  const ampm = istHours >= 12 ? 'PM' : 'AM';
  const displayHours = istHours % 12 || 12;
  const timeStr = `${displayHours}:${String(istMinutes).padStart(2, '0')} ${ampm}`;
  
  const dayIndex = days.indexOf(jstDay.toLowerCase().replace('s', ''));
  let istDayIndex = (dayIndex + dayShift + 7) % 7;
  const istDay = days[istDayIndex];
  
  return {
    time: timeStr,
    day: istDay.charAt(0).toUpperCase() + istDay.slice(1)
  };
}

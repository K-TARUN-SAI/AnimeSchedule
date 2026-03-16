export async function fetchWithRetry(url, options = {}, retries = 3, backoff = 1500) {
  try {
    const res = await fetch(url, options);
    if (res.status === 429) {
      if (retries > 0) {
        console.warn(`Rate Limit hit for ${url}. Retrying in ${backoff}ms... (${retries} left)`);
        await new Promise(resolve => setTimeout(resolve, backoff));
        return fetchWithRetry(url, options, retries - 1, backoff * 1.5);
      }
      throw new Error('Rate limit exceeded after retries');
    }
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    if (retries > 0 && err.message !== 'Rate limit exceeded after retries') {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 1.5);
    }
    throw err;
  }
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

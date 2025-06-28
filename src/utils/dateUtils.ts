// Utility functions for date handling in Singapore timezone (UTC+8)

/**
 * Converts a UTC ISO string to Singapore timezone for display
 * @param utcDateString - ISO string in UTC
 * @returns Formatted date string in Singapore timezone
 */
export function formatDateToSingaporeTime(utcDateString: string): string {
  const date = new Date(utcDateString);
  return date.toLocaleString('en-SG', {
    timeZone: 'Asia/Singapore',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Converts a UTC ISO string to Singapore timezone date only
 * @param utcDateString - ISO string in UTC
 * @returns Formatted date string in Singapore timezone
 */
export function formatDateOnlyToSingaporeTime(utcDateString: string): string {
  const date = new Date(utcDateString);
  return date.toLocaleDateString('en-SG', {
    timeZone: 'Asia/Singapore',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Converts a UTC ISO string to Singapore timezone time only
 * @param utcDateString - ISO string in UTC
 * @returns Formatted time string in Singapore timezone
 */
export function formatTimeOnlyToSingaporeTime(utcDateString: string): string {
  const date = new Date(utcDateString);
  return date.toLocaleTimeString('en-SG', {
    timeZone: 'Asia/Singapore',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Calculates time remaining until a given date in Singapore timezone
 * @param endDateString - ISO string of the end date
 * @returns Formatted time remaining string
 */
export function formatTimeRemainingInSingaporeTime(endDateString: string): string {
  const end = new Date(endDateString);
  const now = new Date();
  
  // Adjust for Singapore timezone (UTC+8)
  const singaporeOffset = 8 * 60 * 60 * 1000;
  const endSingapore = new Date(end.getTime() + singaporeOffset);
  const nowSingapore = new Date(now.getTime() + singaporeOffset);
  
  const diff = endSingapore.getTime() - nowSingapore.getTime();
  
  if (diff <= 0) return 'Voting ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''} left`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes > 1 ? 's' : ''} left`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
  }
}

/**
 * Gets current time in Singapore timezone as ISO string
 * @returns Current time in Singapore timezone as ISO string
 */
export function getCurrentSingaporeTimeISO(): string {
  const now = new Date();
  const singaporeTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
  return singaporeTime.toISOString();
}

/**
 * Converts local date and time strings to Singapore timezone ISO string
 * @param dateStr - Date string (YYYY-MM-DD)
 * @param timeStr - Time string (HH:MM)
 * @returns ISO string in Singapore timezone
 */
export function convertLocalToSingaporeTime(dateStr: string, timeStr: string): string {
  const localDateTime = new Date(`${dateStr}T${timeStr}:00`);
  const singaporeTime = new Date(localDateTime.getTime() + (8 * 60 * 60 * 1000));
  return singaporeTime.toISOString();
} 
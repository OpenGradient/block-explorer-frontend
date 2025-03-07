import type { FormatDistanceToNowOptions, FormatOptions } from 'date-fns';
import { formatDistanceToNow, format, fromUnixTime, formatISO } from 'date-fns';

export const getRelativeTime = (unixTimestamp: number, options?: FormatDistanceToNowOptions): string => {
  const date = fromUnixTime(unixTimestamp);
  return formatDistanceToNow(date, options);
};

/**
 * Formats a Unix timestamp to a pretty relative time with timezone info
 * @param unixTimestamp Unix timestamp in seconds
 * @returns Formatted relative time string with date and timezone
 */
export const formatTimestamp = (unixTimestamp: number, formatStr = 'Pp', options?: FormatOptions): string => {
  // Convert Unix timestamp (seconds) to Date
  const date = fromUnixTime(unixTimestamp);

  // Get full date with timezone for additional context
  return format(date, formatStr, options);
};

export const convertUnixTimestampToUTC = (unixTimestamp: number) => {
  const date = fromUnixTime(unixTimestamp);
  return formatISO(date, { format: 'extended' });
};

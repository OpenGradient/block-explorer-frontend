import { formatDistanceToNow, format, fromUnixTime } from 'date-fns';

/**
 * Formats a Unix timestamp to a pretty relative time with timezone info
 * @param unixTimestamp Unix timestamp in seconds
 * @returns Formatted relative time string with date and timezone
 */
export const formatPrettyTimestamp = (unixTimestamp: number): { relativeTime: string; fullDate: string } => {
  // Convert Unix timestamp (seconds) to Date
  const date = fromUnixTime(unixTimestamp);

  // Get the relative time string (e.g., "in 15 days" or "2 hours ago")
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });

  // Get full date with timezone for additional context
  const fullDate = format(date, 'Pp');

  // Combine relative and absolute time
  return { relativeTime, fullDate };
};

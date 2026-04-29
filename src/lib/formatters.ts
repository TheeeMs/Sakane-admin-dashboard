/**
 * Format a date string to a readable format
 */
export const formatDate = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  return new Date(dateString).toLocaleDateString(
    "en-US",
    options || defaultOptions,
  );
};

/**
 * Format time range
 */
export const formatTime = (startTime: string, endTime?: string): string => {
  return endTime ? `${startTime} - ${endTime}` : startTime;
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (current: number, max: number): number => {
  if (max === 0) return 0;
  return Math.round((current / max) * 100);
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};

/**
 * Format currency
 */
export const formatCurrency = (
  amount: number,
  currency: string = "EGP",
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

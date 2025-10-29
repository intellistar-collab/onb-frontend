import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price value with proper number formatting
 * @param price - The price value (number or string)
 * @param currency - The currency symbol (default: '$')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted price string (e.g., "$3,999.00")
 */
export function formatPrice(price: number | string, currency: string = '$', decimals: number = 2): string {
  // If price is already a formatted string with currency, return as is
  if (typeof price === 'string' && price.startsWith('$')) {
    return price;
  }
  
  // Extract numeric value from string (remove currency symbols, commas, etc.)
  const numericPrice = typeof price === 'string' 
    ? parseFloat(price.replace(/[^0-9.-]/g, '')) 
    : price;
  
  if (isNaN(numericPrice)) {
    return `${currency}0.00`;
  }
  
  return `${currency}${numericPrice.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/**
 * Formats a number as currency using Intl.NumberFormat
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$1,234")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a number with locale-specific formatting
 * @param num - The number to format
 * @returns Formatted number string (e.g., "1,234")
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Formats a number as a percentage
 * @param num - The number to format (0-1 range)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string (e.g., "75%")
 */
export const formatPercentage = (num: number, decimals: number = 0): string => {
  return `${(num * 100).toFixed(decimals)}%`;
};

/**
 * Gets initials from a full name
 * @param name - The full name
 * @returns Initials string (e.g., "JD" for "John Doe")
 */
export const getInitials = (name: string): string => {
  if (!name) return "U";
  const words = name.trim().split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

/**
 * Formats a date as relative time (e.g., "Today", "Yesterday", "3 days ago")
 * @param date - The date to format
 * @param now - The current date (defaults to new Date())
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (date: Date, now: Date = new Date()): string => {
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

/**
 * Safely formats a date string or Date object to a localized date string
 * @param date - The date to format (string or Date)
 * @param fallback - Fallback text if date is invalid (defaults to "Not provided")
 * @returns Formatted date string or fallback text
 */
export const formatDate = (date: string | Date | null | undefined, fallback: string = "Not provided"): string => {
  if (!date) return fallback;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date provided:', date);
      return fallback;
    }
    
    return dateObj.toLocaleDateString();
  } catch (error) {
    console.warn('Error formatting date:', error, 'Original value:', date);
    return fallback;
  }
};
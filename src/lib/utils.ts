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
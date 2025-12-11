import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to merge class names
 * A lightweight alternative to tailwind-merge for simple cases
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

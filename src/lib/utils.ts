import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a random password of specified length
 */
export function generatePassword(length: number = 10): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  
  // Ensure at least one character from each category
  password += charset.substring(0, 26).charAt(Math.floor(Math.random() * 26)); // Uppercase
  password += charset.substring(26, 52).charAt(Math.floor(Math.random() * 26)); // Lowercase
  password += charset.substring(52, 62).charAt(Math.floor(Math.random() * 10)); // Number
  password += charset.substring(62).charAt(Math.floor(Math.random() * (charset.length - 62))); // Special
  
  // Fill the rest of the password
  for (let i = 4; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

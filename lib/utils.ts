import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRM(amount: number, withSymbol = true): string {
  const formatted = amount.toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return withSymbol ? `RM ${formatted}` : formatted
}

/** Formats raw digits into Malaysian IC format 000000-00-0000 */
export function formatIC(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 12)
  const parts = [digits.slice(0, 6), digits.slice(6, 8), digits.slice(8, 12)]
  return parts.filter(Boolean).join('-')
}

export function isValidIC(value: string): boolean {
  return value.replace(/\D/g, '').length === 12
}

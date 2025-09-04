import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function relativeDateRange(startDate: string | Date | null | undefined, endDate: string | Date | null | undefined): 'past' | 'present' | 'future' | null {
  if (!startDate || !endDate) return null
 
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
 
  start.setUTCHours(0, 0, 0, 0)
  end.setUTCHours(23, 59, 59, 999)
  now.setUTCHours(12, 0, 0, 0)
 
  if (now < start) {
    return 'future'
  } else if (now >= start && now <= end) {
    return 'present'
  } else {
    return 'past'
  }
}

export function formatDateRange(startDate: string | Date | null | undefined, endDate: string | Date | null | undefined): string {
  if (!startDate || !endDate) return ''
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  const startMonth = start.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
  const endMonth = end.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
  const startDay = start.getUTCDate()
  const endDay = end.getUTCDate()
  const year = start.getUTCFullYear()
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${year}`
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
  }
}

export function cleanCountryCode(countryCode: string | null | undefined): string | null {
  if (!countryCode) return null
  
  // Remove all invisible Unicode characters that Sanity visual editing adds
  return countryCode
    .replace(/[\u200B-\u200F\uFEFF\u2060-\u2064]/g, '') // Zero-width spaces, joiners, etc.
    .replace(/[\u202A-\u202E]/g, '') // Text direction marks
    .trim()
    .toLowerCase()
}

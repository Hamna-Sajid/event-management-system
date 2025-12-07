/**
 * @library Event Formatters
 * 
 * Formatting utilities for event-related data display
 * 
 * @remarks
 * This library provides consistent formatting functions for:
 * - Date formatting (single dates and date ranges)
 * - Time display formatting
 * - Venue information assembly
 * 
 * All formatters handle edge cases and provide fallback values
 * for missing or incomplete data.
 */

/**
 * @function formatDate
 * 
 * Formats a date string into a human-readable format
 * 
 * @param dateString - ISO date string or any valid date format
 * @returns Formatted date string (e.g., "January 15, 2024")
 * 
 * @example
 * ```ts
 * formatDate('2024-01-15')
 * // Returns: "January 15, 2024"
 * ```
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * @function formatTime
 * 
 * Formats a time string for display
 * 
 * @param timeString - Time string in any format
 * @returns The time string as-is (currently a pass-through)
 * 
 * @remarks
 * Currently returns the time string unchanged. Future enhancements
 * could include 12/24 hour format conversion or localization.
 * 
 * @example
 * ```ts
 * formatTime('14:30')
 * // Returns: "14:30"
 * ```
 */
export function formatTime(timeString: string): string {
  return timeString
}

/**
 * @function formatVenue
 * 
 * Formats venue information into a readable string
 * 
 * @param venueDetails - Object containing venue location details
 * @param fallbackVenue - Optional fallback string if venueDetails is incomplete
 * @returns Formatted venue string (e.g., "Aman Tower, Room 301") or fallback
 * 
 * @remarks
 * Combines building and room information when both are available.
 * Falls back to provided fallbackVenue or 'TBA' if venue details are incomplete.
 * 
 * @example
 * Complete venue details:
 * ```ts
 * formatVenue({ building: 'Aman Tower', room: 'Room 301' })
 * // Returns: "Aman Tower, Room 301"
 * ```
 * 
 * @example
 * Missing details with fallback:
 * ```ts
 * formatVenue({ building: 'Aman Tower' }, 'Main Campus')
 * // Returns: "Main Campus"
 * ```
 * 
 * @example
 * No venue information:
 * ```ts
 * formatVenue(undefined)
 * // Returns: "TBA"
 * ```
 */
export function formatVenue(venueDetails?: {
  building?: string
  room?: string
  address?: string
}, fallbackVenue?: string): string {
  if (venueDetails?.building && venueDetails?.room) {
    return `${venueDetails.building}, ${venueDetails.room}`
  }
  return fallbackVenue || 'TBA'
}

/**
 * @function formatDateRange
 * 
 * Formats a date range for display, handling single-day events
 * 
 * @param startDate - Start date string
 * @param endDate - End date string
 * @returns Formatted date range string
 * 
 * @remarks
 * Smart formatting that:
 * - Shows single date if start and end are the same
 * - Shows date range with hyphen if dates differ
 * - Uses formatDate() for consistent formatting
 * 
 * @example
 * Single-day event:
 * ```ts
 * formatDateRange('2024-01-15', '2024-01-15')
 * // Returns: "January 15, 2024"
 * ```
 * 
 * @example
 * Multi-day event:
 * ```ts
 * formatDateRange('2024-01-15', '2024-01-17')
 * // Returns: "January 15, 2024 - January 17, 2024"
 * ```
 */
export function formatDateRange(startDate: string, endDate: string): string {
  if (startDate === endDate) {
    return formatDate(startDate)
  }
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

/**
 * @testSuite Event Formatters
 * 
 * Test suite for event formatting utilities
 * 
 * @remarks
 * Comprehensive tests covering:
 * - Date formatting (single dates)
 * - Time formatting
 * - Venue formatting with various inputs
 * - Date range formatting (single-day and multi-day)
 * 
 * @testCoverage
 * - **formatDate**: Converts date strings to readable format
 * - **formatTime**: Time string handling
 * - **formatVenue**: Venue details assembly with fallbacks
 * - **formatDateRange**: Smart date range formatting
 * 
 * @edgeCases
 * - Missing venue details (fallback to TBA)
 * - Same start and end dates (single date display)
 * - Partial venue information
 * 
 * @expectedValues
 * **formatDate:**
 * - '2024-01-15': 'January 15, 2024'
 * 
 * **formatVenue:**
 * - Complete details: 'Building, Room'
 * - Missing details: 'TBA' or fallback value
 * 
 * **formatDateRange:**
 * - Same dates: Single date display
 * - Different dates: 'Date1 - Date2'
 */

import {
  formatDate,
  formatTime,
  formatVenue,
  formatDateRange,
} from './formatters'

describe('Event Formatters', () => {
  describe('formatDate', () => {
    it('should format date string to readable format', () => {
      expect(formatDate('2024-01-15')).toBe('January 15, 2024')
      expect(formatDate('2024-12-31')).toBe('December 31, 2024')
      expect(formatDate('2024-06-01')).toBe('June 1, 2024')
    })

    it('should handle different date formats', () => {
      expect(formatDate('2024/03/20')).toBe('March 20, 2024')
    })

    it('should format dates from Date objects', () => {
      const date = new Date('2024-05-10')
      expect(formatDate(date.toISOString())).toBe('May 10, 2024')
    })

    it('should handle dates at year boundaries', () => {
      expect(formatDate('2024-01-01')).toBe('January 1, 2024')
      expect(formatDate('2024-12-31')).toBe('December 31, 2024')
    })
  })

  describe('formatTime', () => {
    it('should return time string as-is', () => {
      expect(formatTime('14:30')).toBe('14:30')
      expect(formatTime('09:00')).toBe('09:00')
      expect(formatTime('23:59')).toBe('23:59')
    })

    it('should handle various time formats', () => {
      expect(formatTime('2:30 PM')).toBe('2:30 PM')
      expect(formatTime('10:00:00')).toBe('10:00:00')
    })

    it('should handle empty time string', () => {
      expect(formatTime('')).toBe('')
    })
  })

  describe('formatVenue', () => {
    it('should format complete venue details', () => {
      const venueDetails = {
        building: 'Aman Tower',
        room: 'Room 301',
      }
      expect(formatVenue(venueDetails)).toBe('Aman Tower, Room 301')
    })

    it('should format venue with different building names', () => {
      expect(formatVenue({ building: 'Tabba Academic Block', room: 'Room 202' }))
        .toBe('Tabba Academic Block, Room 202')
      
      expect(formatVenue({ building: 'City Campus', room: 'Hall A' }))
        .toBe('City Campus, Hall A')
    })

    it('should return TBA when venue details are incomplete', () => {
      expect(formatVenue({ building: 'Aman Tower' })).toBe('TBA')
      expect(formatVenue({ room: 'Room 301' })).toBe('TBA')
      expect(formatVenue({})).toBe('TBA')
    })

    it('should return TBA when venue details are undefined', () => {
      expect(formatVenue(undefined)).toBe('TBA')
      expect(formatVenue()).toBe('TBA')
    })

    it('should use fallback venue when provided and details incomplete', () => {
      expect(formatVenue({ building: 'Aman Tower' }, 'Main Campus')).toBe('Main Campus')
      expect(formatVenue({}, 'Online Event')).toBe('Online Event')
      expect(formatVenue(undefined, 'To Be Announced')).toBe('To Be Announced')
    })

    it('should prefer complete venue details over fallback', () => {
      const venueDetails = {
        building: 'Aman Tower',
        room: 'Room 301',
      }
      expect(formatVenue(venueDetails, 'Fallback Venue')).toBe('Aman Tower, Room 301')
    })

    it('should handle venue with address field', () => {
      const venueDetails = {
        building: 'Aman Tower',
        room: 'Room 301',
        address: 'Main Campus, IBA Karachi',
      }
      expect(formatVenue(venueDetails)).toBe('Aman Tower, Room 301')
    })

    it('should return fallback when only address is provided', () => {
      const venueDetails = {
        address: 'Main Campus, IBA Karachi',
      }
      expect(formatVenue(venueDetails, 'Campus Event')).toBe('Campus Event')
    })
  })

  describe('formatDateRange', () => {
    it('should return single date when start and end dates are the same', () => {
      expect(formatDateRange('2024-01-15', '2024-01-15')).toBe('January 15, 2024')
      expect(formatDateRange('2024-06-20', '2024-06-20')).toBe('June 20, 2024')
    })

    it('should format date range when dates are different', () => {
      expect(formatDateRange('2024-01-15', '2024-01-17'))
        .toBe('January 15, 2024 - January 17, 2024')
      
      expect(formatDateRange('2024-03-10', '2024-03-15'))
        .toBe('March 10, 2024 - March 15, 2024')
    })

    it('should handle date ranges across months', () => {
      expect(formatDateRange('2024-01-28', '2024-02-02'))
        .toBe('January 28, 2024 - February 2, 2024')
    })

    it('should handle date ranges across years', () => {
      expect(formatDateRange('2024-12-30', '2025-01-02'))
        .toBe('December 30, 2024 - January 2, 2025')
    })

    it('should handle multi-day events', () => {
      expect(formatDateRange('2024-05-01', '2024-05-05'))
        .toBe('May 1, 2024 - May 5, 2024')
    })

    it('should handle consecutive days', () => {
      expect(formatDateRange('2024-07-15', '2024-07-16'))
        .toBe('July 15, 2024 - July 16, 2024')
    })
  })

  describe('Integration tests', () => {
    it('should format complete event information', () => {
      const startDate = '2024-03-15'
      const endDate = '2024-03-17'
      const time = '14:00'
      const venueDetails = {
        building: 'Aman Tower',
        room: 'Conference Room',
      }

      expect(formatDateRange(startDate, endDate)).toBe('March 15, 2024 - March 17, 2024')
      expect(formatTime(time)).toBe('14:00')
      expect(formatVenue(venueDetails)).toBe('Aman Tower, Conference Room')
    })

    it('should handle single-day event with TBA venue', () => {
      const date = '2024-06-20'
      const time = '10:00'

      expect(formatDateRange(date, date)).toBe('June 20, 2024')
      expect(formatTime(time)).toBe('10:00')
      expect(formatVenue()).toBe('TBA')
    })
  })
})

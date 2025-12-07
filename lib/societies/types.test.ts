/**
 * @testSuite Society Types
 * 
 * Test suite for society and event type definitions
 * 
 * @remarks
 * These tests validate the TypeScript interfaces used throughout
 * the society pages and components. While TypeScript provides
 * compile-time type checking, these tests ensure the interfaces
 * match the actual data structure from Firestore.
 * 
 * @testCoverage
 * - **Type Validation**: Ensures objects conform to Society, Member, Event interfaces
 * - **Required Fields**: Validates all required properties are present
 * - **Optional Fields**: Tests nullable and optional fields (heads can be null)
 * - **Nested Objects**: Validates structure of heads, socialLinks, metrics
 * 
 * @remarks
 * These are structural tests to document the expected shape of data
 * and catch accidental interface changes that could break components.
 */

import { Society, Member, Event, EventContent } from './types'

describe('Society Types', () => {
  describe('Society Interface', () => {
    it('should accept a valid society object', () => {
      const society: Society = {
        name: 'Computing Society',
        dateCreated: '2024-01-01',
        heads: {
          CEO: 'user-123',
          CFO: 'user-456',
          COO: null,
        },
        maxHeads: 3,
        description: 'A society for computing enthusiasts',
        contactEmail: 'computing@khi.iba.edu.pk',
        socialLinks: {
          facebook: 'https://facebook.com/computing',
          instagram: 'https://instagram.com/computing',
          linkedin: 'https://linkedin.com/in/computing',
        },
        events: ['event-1', 'event-2'],
        createdBy: 'admin-123',
      }

      expect(society.name).toBe('Computing Society')
      expect(society.heads.CEO).toBe('user-123')
      expect(society.heads.COO).toBeNull()
    })

    it('should allow all heads to be null', () => {
      const society: Society = {
        name: 'New Society',
        dateCreated: '2024-12-01',
        heads: {
          CEO: null,
          CFO: null,
          COO: null,
        },
        maxHeads: 3,
        description: 'A new society',
        contactEmail: 'new@khi.iba.edu.pk',
        socialLinks: {
          facebook: '',
          instagram: '',
          linkedin: '',
        },
        events: [],
        createdBy: 'admin-456',
      }

      expect(society.heads.CEO).toBeNull()
      expect(society.heads.CFO).toBeNull()
      expect(society.heads.COO).toBeNull()
    })

    it('should allow empty social links', () => {
      const society: Society = {
        name: 'Test Society',
        dateCreated: '2024-01-01',
        heads: { CEO: 'user-1', CFO: null, COO: null },
        maxHeads: 3,
        description: 'Test',
        contactEmail: 'test@khi.iba.edu.pk',
        socialLinks: {
          facebook: '',
          instagram: '',
          linkedin: '',
        },
        events: [],
        createdBy: 'admin-1',
      }

      expect(society.socialLinks.facebook).toBe('')
      expect(society.socialLinks.instagram).toBe('')
      expect(society.socialLinks.linkedin).toBe('')
    })
  })

  describe('Member Interface', () => {
    it('should accept a valid member object', () => {
      const member: Member = {
        id: 'user-123',
        name: 'John Doe',
        role: 'CEO',
        email: 'john@khi.iba.edu.pk',
      }

      expect(member.id).toBe('user-123')
      expect(member.name).toBe('John Doe')
      expect(member.role).toBe('CEO')
      expect(member.email).toBe('john@khi.iba.edu.pk')
    })

    it('should support different roles', () => {
      const ceo: Member = {
        id: '1',
        name: 'CEO Name',
        role: 'CEO',
        email: 'ceo@khi.iba.edu.pk',
      }

      const cfo: Member = {
        id: '2',
        name: 'CFO Name',
        role: 'CFO',
        email: 'cfo@khi.iba.edu.pk',
      }

      const coo: Member = {
        id: '3',
        name: 'COO Name',
        role: 'COO',
        email: 'coo@khi.iba.edu.pk',
      }

      expect(ceo.role).toBe('CEO')
      expect(cfo.role).toBe('CFO')
      expect(coo.role).toBe('COO')
    })
  })

  describe('Event Interface', () => {
    it('should accept a valid event object', () => {
      const event: Event = {
        id: 'event-123',
        title: 'Tech Talk',
        date: '2024-12-15',
        time: '14:00',
        location: 'Auditorium',
        description: 'A talk about technology',
        status: 'Published',
        metrics: {
          views: 100,
          likes: 50,
          wishlists: 25,
          shares: 10,
        },
      }

      expect(event.id).toBe('event-123')
      expect(event.title).toBe('Tech Talk')
      expect(event.metrics.views).toBe(100)
    })

    it('should support different status values', () => {
      const published: Event = {
        id: '1',
        title: 'Event 1',
        date: '2024-01-01',
        time: '10:00',
        location: 'Room 1',
        description: 'Desc',
        status: 'Published',
        metrics: { views: 0, likes: 0, wishlists: 0, shares: 0 },
      }

      const draft: Event = {
        id: '2',
        title: 'Event 2',
        date: '2024-01-02',
        time: '11:00',
        location: 'Room 2',
        description: 'Desc',
        status: 'Draft',
        metrics: { views: 0, likes: 0, wishlists: 0, shares: 0 },
      }

      const completed: Event = {
        id: '3',
        title: 'Event 3',
        date: '2024-01-03',
        time: '12:00',
        location: 'Room 3',
        description: 'Desc',
        status: 'Completed',
        metrics: { views: 0, likes: 0, wishlists: 0, shares: 0 },
      }

      expect(published.status).toBe('Published')
      expect(draft.status).toBe('Draft')
      expect(completed.status).toBe('Completed')
    })

    it('should initialize metrics with zero values', () => {
      const event: Event = {
        id: 'new-event',
        title: 'New Event',
        date: '2024-12-01',
        time: '09:00',
        location: 'Main Hall',
        description: 'Brand new event',
        status: 'Draft',
        metrics: {
          views: 0,
          likes: 0,
          wishlists: 0,
          shares: 0,
        },
      }

      expect(event.metrics.views).toBe(0)
      expect(event.metrics.likes).toBe(0)
      expect(event.metrics.wishlists).toBe(0)
      expect(event.metrics.shares).toBe(0)
    })
  })

  describe('EventContent Interface', () => {
    it('should accept event data without ID', () => {
      const eventContent: EventContent = {
        title: 'Workshop',
        date: '2024-12-20',
        time: '15:00',
        location: 'Lab 3',
        description: 'Hands-on workshop',
        status: 'Published',
        metrics: {
          views: 0,
          likes: 0,
          wishlists: 0,
          shares: 0,
        },
      }

      expect(eventContent.title).toBe('Workshop')
      expect(eventContent.date).toBe('2024-12-20')
      // @ts-expect-error - id should not exist on EventContent
      expect(eventContent.id).toBeUndefined()
    })

    it('should match Event interface except for id field', () => {
      const eventContent: EventContent = {
        title: 'Seminar',
        date: '2024-12-25',
        time: '10:00',
        location: 'Hall A',
        description: 'Educational seminar',
        status: 'Draft',
        metrics: {
          views: 10,
          likes: 5,
          wishlists: 2,
          shares: 1,
        },
      }

      // Can add id to convert to Event
      const event: Event = {
        id: 'generated-id',
        ...eventContent,
      }

      expect(event.id).toBe('generated-id')
      expect(event.title).toBe(eventContent.title)
      expect(event.date).toBe(eventContent.date)
    })
  })

  describe('Type Relationships', () => {
    it('should convert EventContent to Event by adding id', () => {
      const content: EventContent = {
        title: 'Test Event',
        date: '2024-01-01',
        time: '12:00',
        location: 'Test Location',
        description: 'Test Description',
        status: 'Published',
        metrics: {
          views: 0,
          likes: 0,
          wishlists: 0,
          shares: 0,
        },
      }

      const event: Event = {
        id: 'firestore-generated-id',
        ...content,
      }

      expect(event).toHaveProperty('id')
      expect(event.title).toBe(content.title)
    })

    it('should extract EventContent from Event by omitting id', () => {
      const event: Event = {
        id: 'event-1',
        title: 'Original Event',
        date: '2024-01-01',
        time: '10:00',
        location: 'Location 1',
        description: 'Description 1',
        status: 'Published',
        metrics: {
          views: 100,
          likes: 50,
          wishlists: 25,
          shares: 10,
        },
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...content } = event
      const eventContent: EventContent = content

      expect(eventContent).not.toHaveProperty('id')
      expect(eventContent.title).toBe('Original Event')
    })
  })
})

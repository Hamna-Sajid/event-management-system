/**
 * @component EditEventModal
 * 
 * Modal dialog for editing existing event details
 * 
 * @remarks
 * This component provides a form for editing event information:
 * - Event title, date, time, location
 * - Event description
 * - Event status (Upcoming, Ongoing, Completed)
 * - Metrics preserved during edit (views, likes, wishlists, shares)
 * 
 * Features:
 * - Themed styling based on society theme
 * - Form validation and submission
 * - Modal overlay with backdrop
 * - Cancel and save actions
 * - Auto-populates with current event data
 * 
 * @example
 * Basic usage:
 * ```tsx
 * const [isModalOpen, setIsModalOpen] = useState(false)
 * const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
 * 
 * const handleEditSubmit = (updatedEvent: Event) => {
 *   // Update event in database
 *   updateEvent(updatedEvent)
 *   setIsModalOpen(false)
 * }
 * 
 * <EditEventModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onSubmit={handleEditSubmit}
 *   event={selectedEvent}
 *   theme="blue"
 * />
 * ```
 */

"use client"

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Select } from '../ui/select'
import { Event } from '@/lib/societies/types'

interface EditEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (eventData: Event) => void
  event: Event
  theme: string
}

export default function EditEventModal({ isOpen, onClose, onSubmit, event, theme }: EditEventModalProps) {
  const [eventData, setEventData] = useState<Event>(event)

  useEffect(() => {
    setEventData(event)
  }, [event])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEventData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(eventData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="glass rounded-2xl p-8 w-full max-w-lg border border-border">
        <h2 className="text-2xl font-bold mb-6" style={{ color: `var(--text-primary-${theme})` }}>Edit Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1 text-muted-foreground">Event Title</label>
            <input type="text" id="title" name="title" value={eventData?.title || ''} onChange={handleChange} required className="w-full input-style" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1 text-muted-foreground">Date</label>
              <input type="date" id="date" name="date" value={eventData?.date || ''} onChange={handleChange} required className="w-full input-style" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-1 text-muted-foreground">Time</label>
              <input type="time" id="time" name="time" value={eventData?.time || ''} onChange={handleChange} required className="w-full input-style" />
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1 text-muted-foreground">Location</label>
            <input type="text" id="location" name="location" value={eventData?.location || ''} onChange={handleChange} required className="w-full input-style" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1 text-muted-foreground">Description</label>
            <textarea id="description" name="description" value={eventData?.description || ''} onChange={handleChange} required rows={4} className="w-full input-style"></textarea>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1 text-muted-foreground">Status</label>
            <Select
              id="status"
              value={eventData?.status || 'draft'}
              onChange={(value) => setEventData(prev => ({ ...prev, status: value }))}
              options={[
                { value: "draft", label: "draft" },
                { value: "published", label: "published" },
                { value: "concluded", label: "concluded" },
              ]}
              className="w-full input-style"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-white">Cancel</Button>
            <Button type="submit" className="glow-button text-white font-semibold">Save Changes</Button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .input-style {
          background-color: hsl(var(--input));
          border: 1px solid hsl(var(--border));
          color: white;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          width: 100%;
          transition: border-color 0.2s;
          appearance: none;
        }
        .input-style::placeholder {
          color: hsl(var(--muted-foreground));
        }
        .input-style:focus {
          outline: none;
          border-color: hsl(var(--ring));
        }
      `}</style>
    </div>
  )
}

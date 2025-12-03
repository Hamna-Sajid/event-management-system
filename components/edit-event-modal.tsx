"use client"

import { useState, useEffect } from 'react'
import { Button } from './ui/button'

// EventContent and Event interfaces for type safety
interface EventContent {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: string;
  metrics: {
    views: number;
    likes: number;
    wishlists: number;
    shares: number;
  };
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: string;
  metrics: {
    views: number;
    likes: number;
    wishlists: number;
    shares: number;
  };
}

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="p-8 rounded-2xl w-full max-w-lg" style={{ backgroundColor: `var(--bg-secondary-${theme})`, border: `1px solid var(--border-${theme})` }}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: `var(--text-primary-${theme})` }}>Edit Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: `var(--text-secondary-${theme})` }}>Event Title</label>
            <input type="text" name="title" value={eventData?.title || ''} onChange={handleChange} required className="w-full input-style" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: `var(--text-secondary-${theme})` }}>Date</label>
              <input type="date" name="date" value={eventData?.date || ''} onChange={handleChange} required className="w-full input-style" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: `var(--text-secondary-${theme})` }}>Time</label>
              <input type="time" name="time" value={eventData?.time || ''} onChange={handleChange} required className="w-full input-style" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: `var(--text-secondary-${theme})` }}>Location</label>
            <input type="text" name="location" value={eventData?.location || ''} onChange={handleChange} required className="w-full input-style" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: `var(--text-secondary-${theme})` }}>Description</label>
            <textarea name="description" value={eventData?.description || ''} onChange={handleChange} required rows={4} className="w-full input-style"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: `var(--text-secondary-${theme})` }}>Status</label>
            <select name="status" value={eventData?.status || 'Draft'} onChange={handleChange} className="w-full input-style">
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Concluded">Concluded</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} style={{ color: `var(--text-secondary-${theme})` }}>Cancel</Button>
            <Button type="submit" style={{ backgroundColor: `var(--accent-1-${theme})`, color: 'white' }}>Save Changes</Button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .input-style {
          background-color: var(--glass-default);
          border: 1px solid var(--border-default);
          color: var(--text-primary-default);
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          width: 100%;
          transition: border-color 0.2s;
        }
        .input-style:focus {
          outline: none;
          border-color: var(--accent-1-default);
        }
      `}</style>
    </div>
  )
}

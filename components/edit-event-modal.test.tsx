import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import EditEventModal from './edit-event-modal'

const mockEvent = {
  id: 'event-1',
  title: 'Test Event',
  date: '2025-01-01',
  time: '12:00',
  location: 'Test Location',
  description: 'Test Description',
  status: 'draft',
  metrics: {
    views: 0,
    likes: 0,
    wishlists: 0,
    shares: 0,
  },
}

describe('EditEventModal', () => {
  it('should render with the correct initial values', () => {
    render(
      <EditEventModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
        event={mockEvent}
        theme="default"
      />
    )

    expect(screen.getByLabelText('Event Title')).toHaveValue('Test Event')
    expect(screen.getByLabelText('Date')).toHaveValue('2025-01-01')
    expect(screen.getByLabelText('Time')).toHaveValue('12:00')
    expect(screen.getByLabelText('Location')).toHaveValue('Test Location')
    expect(screen.getByLabelText('Description')).toHaveValue('Test Description')
    expect(screen.getByLabelText('Status')).toHaveTextContent('draft')
  })

  it('should have lowercase status options', () => {
    render(
      <EditEventModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
        event={mockEvent}
        theme="default"
      />
    )

    fireEvent.click(screen.getByLabelText('Status'))
    const options = screen.getAllByRole('button', { name: /draft|published|concluded/i })
    const optionValues = options.map(option => option.textContent)

    expect(optionValues).toEqual(['draft', 'published', 'concluded'])
  })

  it('should call onSubmit with updated data', () => {
    const handleSubmit = jest.fn()
    render(
      <EditEventModal
        isOpen={true}
        onClose={() => {}}
        onSubmit={handleSubmit}
        event={mockEvent}
        theme="default"
      />
    )

    fireEvent.change(screen.getByLabelText('Event Title'), {
      target: { value: 'Updated Title' },
    })

    fireEvent.click(screen.getByLabelText('Status'))
    fireEvent.click(screen.getByRole('button', { name: 'published' }))

    fireEvent.click(screen.getByText('Save Changes'))

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Updated Title',
        status: 'published',
      })
    )
  })
})

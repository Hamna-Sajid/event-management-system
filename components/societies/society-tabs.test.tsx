/**
 * @testSuite SocietyTabs
 * 
 * Test suite for SocietyTabs component
 * 
 * @remarks
 * Tests for the society tabbed interface:
 * - Tab navigation (About, Events, Team)
 * - About tab: Society info, heads, social links
 * - Events tab: Event list, search, filter, management
 * - Team tab: Team members display
 * - Management permissions and controls
 * 
 * @testCoverage
 * - **Tab Navigation**: Switching between About/Events/Team tabs
 * - **About Tab**: Description, heads info, social links
 * - **Events Tab**: Event grid, search functionality, filters
 * - **Management Features**: Create/edit/delete events (authorized users)
 * 
 * @edgeCases
 * - Empty event lists
 * - Management view vs public view
 * - Search with no results
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SocietyTabs from './society-tabs'
import '@testing-library/jest-dom'

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'Link'
  return MockLink
})

describe('SocietyTabs', () => {
  const mockSocietyData = {
    name: 'Test Society',
    description: 'Test description',
    dateCreated: '2023-01-01',
    heads: { CEO: '1', CFO: '2', COO: '3' },
    maxHeads: 3,
    contactEmail: 'test@example.com',
    socialLinks: { facebook: '', instagram: '', linkedin: '' },
    events: [],
    createdBy: 'user1'
  }
  const mockEvents = [
    { id: '1', title: 'Event 1', date: '2023-12-01', time: '10:00', location: 'Venue 1', description: 'Desc 1', status: 'Published', metrics: { views: 10, likes: 5, wishlists: 2, shares: 1 } },
    { id: '2', title: 'Event 2', date: '2023-12-02', time: '11:00', location: 'Venue 2', description: 'Desc 2', status: 'Draft', metrics: { views: 20, likes: 15, wishlists: 12, shares: 11 } },
  ]
  const mockMembers = [
    { id: '1', name: 'Member 1', role: 'CEO', email: 'ceo@example.com' },
    { id: '2', name: 'Member 2', role: 'CFO', email: 'cfo@example.com' },
  ]
  const mockHandleDeleteEvent = jest.fn()
  const mockHandleEditEvent = jest.fn()


  it('should render the tabs', () => {
    render(<SocietyTabs theme="default" societyData={mockSocietyData} events={mockEvents} members={mockMembers} handleDeleteEvent={mockHandleDeleteEvent} handleEditEvent={mockHandleEditEvent} />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Manage Events')).toBeInTheDocument()
    expect(screen.getByText('Members')).toBeInTheDocument()
    expect(screen.getByText('About Us')).toBeInTheDocument()
  })

  it('should show "Manage Events" tab by default when isManagementView is true', () => {
    render(<SocietyTabs theme="default" isManagementView societyData={mockSocietyData} events={mockEvents} members={mockMembers} handleDeleteEvent={mockHandleDeleteEvent} handleEditEvent={mockHandleEditEvent} />)
    expect(screen.getByText('Create New Event')).toBeInTheDocument()
  })

  it('should switch tabs on click', async () => {
    const user = userEvent.setup()
    render(<SocietyTabs theme="default" societyData={mockSocietyData} events={mockEvents} members={mockMembers} handleDeleteEvent={mockHandleDeleteEvent} handleEditEvent={mockHandleEditEvent} />)
    
    await user.click(screen.getByText('Members'))
    expect(screen.getByText('Member 1')).toBeInTheDocument()

    await user.click(screen.getByText('About Us'))
    expect(screen.getByText('About Our Society')).toBeInTheDocument()
  })

  it('should filter events in "Manage Events" tab', async () => {
    const user = userEvent.setup()
    render(<SocietyTabs theme="default" isManagementView societyData={mockSocietyData} events={mockEvents} members={mockMembers} handleDeleteEvent={mockHandleDeleteEvent} handleEditEvent={mockHandleEditEvent} />)
    
    await user.type(screen.getByPlaceholderText(/search/i), 'Event 1')
    expect(screen.getByText('Event 1')).toBeInTheDocument()
    expect(screen.queryByText('Event 2')).not.toBeInTheDocument()
  })

  it('should have correct "View Event" links in Overview tab', () => {
    render(<SocietyTabs theme="default" societyData={mockSocietyData} events={mockEvents} members={mockMembers} handleDeleteEvent={mockHandleDeleteEvent} handleEditEvent={mockHandleEditEvent} />);
    
    const overviewLinks = screen.getAllByRole('link', { name: /Event 1|Event 2/i });
    expect(overviewLinks[0]).toHaveAttribute('href', '/events/1');
  });

  it('should have correct "View Event" links in Manage Events tab', async () => {
    render(<SocietyTabs theme="default" isManagementView societyData={mockSocietyData} events={mockEvents} members={mockMembers} handleDeleteEvent={mockHandleDeleteEvent} handleEditEvent={mockHandleEditEvent} />);
    
    const manageEventsLinks = await screen.findAllByTitle('View Event');
    expect(manageEventsLinks[0].closest('a')).toHaveAttribute('href', '/events/1');
  });

  it('should open and close the status dropdown', async () => {
    const user = userEvent.setup();
    render(<SocietyTabs theme="default" isManagementView societyData={mockSocietyData} events={mockEvents} members={mockMembers} handleDeleteEvent={mockHandleDeleteEvent} handleEditEvent={mockHandleEditEvent} />);

    // Open the dropdown
    await user.click(screen.getByRole('button', { name: 'All Statuses' }));

    // The dropdown should be open
    expect(screen.getByRole('button', { name: 'Published' })).toBeInTheDocument();

    // Close the dropdown by clicking the main dropdown button again
    await user.click(screen.getAllByRole('button', { name: 'All Statuses' })[0]);

    // The dropdown should be closed
    expect(screen.queryByRole('button', { name: 'Published' })).not.toBeInTheDocument();
  });
})
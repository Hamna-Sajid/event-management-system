import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import SocietyPage from './page'
import '@testing-library/jest-dom'
import { getDoc, getDocs } from 'firebase/firestore'
import { useParams, useRouter } from 'next/navigation'

// Mock Firebase module
jest.mock('../../../firebase', () => ({
  app: {},
  firestore: {},
  storage: {},
  analytics: null,
}))

// Mock Firebase auth and firestore functions
let onAuthStateChangedCallback: ((user: { uid: string } | null) => void) | null = null;
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn((_auth, callback) => {
    onAuthStateChangedCallback = callback;
    return jest.fn(); // Unsubscribe function
  }),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}))

// Mock components
jest.mock('@/components/society-header', () => {
  const Mock = () => <div data-testid="society-header" />
  Mock.displayName = 'SocietyHeader'
  return Mock
})
jest.mock('@/components/society-hero', () => {
  const Mock = () => <div data-testid="society-hero" />
  Mock.displayName = 'SocietyHero'
  return Mock
})
jest.mock('@/components/society-tabs', () => {
  const Mock = () => <div data-testid="society-tabs" />
  Mock.displayName = 'SocietyTabs'
  return Mock
})

describe('SocietyPage', () => {
  const mockUseParams = useParams as jest.Mock
  const mockUseRouter = useRouter as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    onAuthStateChangedCallback = null; // Reset callback
    mockUseParams.mockReturnValue({ id: '123' }) // Default mock for useParams
    mockUseRouter.mockReturnValue({ push: jest.fn() })
  })

  it('should show loading state initially', () => {
    (getDoc as jest.Mock).mockResolvedValue({ exists: () => false })
    render(<SocietyPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should show error if no society ID is provided', async () => {
    mockUseParams.mockReturnValue({ id: undefined }) // Override for this specific test
    render(<SocietyPage />)
    await waitFor(() => {
      expect(screen.getByText('No society ID provided.')).toBeInTheDocument()
    })
  })
  
  it('should show error if society is not found', async () => {
    (getDoc as jest.Mock).mockResolvedValue({ exists: () => false });
    // Trigger onAuthStateChanged callback after render
    render(<SocietyPage />)
    if (onAuthStateChangedCallback) {
        await act(async () => { // Await the act call
            onAuthStateChangedCallback!({ uid: 'test-user' })
        })
    }
    await waitFor(() => {
      expect(screen.getByText('Society not found.')).toBeInTheDocument()
    })
  })

  it('should render the page with society data', async () => {
    const mockSocietyData = {
      name: 'Test Society',
      heads: { CEO: 'user1' },
      events: ['event1'],
    }
    const mockUserData = {
        id: "user1",
        fullName: "Test User",
        societyRole: "CEO",
        email: "test@test.com"
    }
    const mockEventData = {
        id: "event1",
        title: "Test Event"
    }

    ;(getDoc as jest.Mock).mockImplementationOnce(() => Promise.resolve({
      exists: () => true,
      data: () => mockSocietyData,
    }))
    .mockImplementationOnce(() => Promise.resolve({
        exists: () => true,
        data: () => mockSocietyData,
    }));
    ;(getDocs as jest.Mock).mockImplementationOnce(() => Promise.resolve({
        docs: [
            { id: "user1", data: () => mockUserData },
        ]
    }))
    .mockImplementationOnce(() => Promise.resolve({
        docs: [
            { id: "event1", data: () => mockEventData },
        ]
    }));
    // Trigger onAuthStateChanged callback after render
    render(<SocietyPage />)
    if (onAuthStateChangedCallback) {
        await act(async () => { // Await the act call
            onAuthStateChangedCallback!({ uid: 'user1' })
        })
    }
    await waitFor(() => {
      expect(screen.getByTestId('society-header')).toBeInTheDocument()
      expect(screen.getByTestId('society-hero')).toBeInTheDocument()
      expect(screen.getByTestId('society-tabs')).toBeInTheDocument()
    })
  })
})

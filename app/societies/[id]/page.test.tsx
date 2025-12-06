import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import SocietyPage from './page'
import '@testing-library/jest-dom'
import { getDoc, getDocs, deleteDoc, updateDoc, arrayRemove, doc } from 'firebase/firestore'
import { useParams, useRouter } from 'next/navigation'
import SocietyHero from '@/components/society-hero'
import { getUserPrivilege } from '@/lib/privileges'
import SocietyTabs from '@/components/society-tabs'

// Mock Firebase module
jest.mock('../../../firebase', () => ({
  app: {},
  firestore: {},
  storage: {},
  analytics: null,
}))

// Mock Firebase auth and firestore functions
let onAuthStateChangedCallback: ((user: { uid:string } | null) => void) | null = null;
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
  arrayRemove: jest.fn(),
}))

// Mock Next.js router
jest.mock('@/lib/privileges', () => ({
  getUserPrivilege: jest.fn(),
  UserPrivilege: {
    NORMAL_USER: 0,
    SOCIETY_HEAD: 1,
    ADMIN: 2,
  },
}));

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(() => ({ push: mockPush })),
}))

// Mock components
jest.mock('@/components/society-header', () => {
    const Mock = () => <div data-testid="society-header" />
    Mock.displayName = 'SocietyHeader'
    return Mock
})
jest.mock('@/components/society-hero')
jest.mock('@/components/society-tabs')


const mockUseParams = useParams as jest.Mock
const mockUseRouter = useRouter as jest.Mock
const mockGetDoc = getDoc as jest.Mock
const mockGetDocs = getDocs as jest.Mock
const mockUpdateDoc = updateDoc as jest.Mock
const mockDeleteDoc = deleteDoc as jest.Mock
const mockArrayRemove = arrayRemove as jest.Mock
const mockDoc = doc as jest.Mock


const mockSocietyData = {
  name: 'Test Society',
  heads: { CEO: 'head-uid' },
  events: ['event-to-delete'],
}
const mockUserData = {
    id: "user1",
    fullName: "Test User",
    societyRole: "CEO",
    email: "test@test.com"
}
const mockEventData = {
    id: "event1",
    title: "Test Event",
    status: "Published",
}

describe('SocietyPage', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    (SocietyHero as jest.Mock).mockImplementation(() => <div data-testid="society-hero" />);
    (SocietyTabs as jest.Mock).mockImplementation(() => <div data-testid="society-tabs" />);
    onAuthStateChangedCallback = null;
    mockUseParams.mockReturnValue({ id: 'society-123' })
    mockUseRouter.mockReturnValue({ push: mockPush })
    
    // Default happy path mock
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockSocietyData,
    })
    mockGetDocs.mockResolvedValue({
        docs: [
            { id: "user1", data: () => mockUserData },
            { id: "event1", data: () => mockEventData },
        ]
    })
    // Default to normal user for privilege checks
    ;(getUserPrivilege as jest.Mock).mockResolvedValue(0)
  })

  it('should show loading state initially', () => {
    mockGetDoc.mockResolvedValue({ exists: () => false })
    render(<SocietyPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should show error if no society ID is provided', async () => {
    mockUseParams.mockReturnValue({ id: undefined })
    render(<SocietyPage />)
    expect(await screen.findByText('No society ID provided.')).toBeInTheDocument()
  })
  
  it('should show error if society is not found', async () => {
    mockGetDoc.mockResolvedValue({ exists: () => false });
    render(<SocietyPage />)
    expect(await screen.findByText('Society not found.')).toBeInTheDocument()
  })

  it('should render the page with society data for an admin', async () => {
    ;(getUserPrivilege as jest.Mock).mockResolvedValue(2) // Admin
    render(<SocietyPage />)

    act(() => {
      if (onAuthStateChangedCallback) {
        onAuthStateChangedCallback({ uid: 'admin-uid' });
      }
    });
    
    expect(await screen.findByTestId('society-header')).toBeInTheDocument()
    expect(await screen.findByTestId('society-hero')).toBeInTheDocument()
    expect(await screen.findByTestId('society-tabs')).toBeInTheDocument()
  })

  describe('Event Handlers', () => {
    beforeEach(() => {
        ;(getUserPrivilege as jest.Mock).mockResolvedValue(2) // Assume admin for these tests
        render(<SocietyPage />)
        act(() => {
            if (onAuthStateChangedCallback) {
              onAuthStateChangedCallback({ uid: 'admin-uid' });
            }
        });
    })

    it('handleDeleteEvent should call deleteDoc and updateDoc', async () => {
      await waitFor(() => expect(SocietyTabs as jest.Mock).toHaveBeenCalled())

      // Get the handleDeleteEvent prop from the mocked component
      const { handleDeleteEvent } = (SocietyTabs as jest.Mock).mock.calls[0][0]
      
      const eventId = 'event-to-delete'
      await act(async () => {
        await handleDeleteEvent(eventId)
      })

      // Check firestore calls
      expect(mockDeleteDoc).toHaveBeenCalledWith(mockDoc(undefined, 'events', eventId))
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        mockDoc(undefined, 'societies', 'society-123'),
        { events: mockArrayRemove(eventId) }
      )
    })

    it('handleEditEvent should call updateDoc with lowercase status', async () => {
      await waitFor(() => expect(SocietyTabs as jest.Mock).toHaveBeenCalled())

      const { handleEditEvent } = (SocietyTabs as jest.Mock).mock.calls[0][0]

      const eventToUpdate = { id: 'event-to-edit', title: 'Updated Title', status: 'PublisheD' }
      await act(async () => {
        await handleEditEvent(eventToUpdate)
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...dataToUpdate } = eventToUpdate;
      dataToUpdate.status = dataToUpdate.status.toLowerCase(); // a ssert lowercase
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        mockDoc(undefined, 'events', eventToUpdate.id),
        dataToUpdate
      )
    })
  })

  describe('Management View and Redirects', () => {
    it('should pass isManagementView=true when user is a society head', async () => {
        ;(getUserPrivilege as jest.Mock).mockResolvedValue(1) // Society Head
        render(<SocietyPage />);
    
        await screen.findByTestId('society-hero');
    
        act(() => {
          if (onAuthStateChangedCallback) {
            onAuthStateChangedCallback({ uid: 'head-uid' });
          }
        });
    
        await waitFor(() => {
          const lastHeroCallArgs = (SocietyHero as jest.Mock).mock.calls.slice(-1)[0];
          expect(lastHeroCallArgs[0]).toHaveProperty('isManagementView', true);

          const lastTabsCallArgs = (SocietyTabs as jest.Mock).mock.calls.slice(-1)[0];
          expect(lastTabsCallArgs[0]).toHaveProperty('isManagementView', true);
          expect(mockPush).not.toHaveBeenCalled()
        });
      });
    
      it('should pass isManagementView=true when user is an admin', async () => {
        ;(getUserPrivilege as jest.Mock).mockResolvedValue(2) // Admin
        render(<SocietyPage />);
    
        await screen.findByTestId('society-hero');
    
        act(() => {
          if (onAuthStateChangedCallback) {
            onAuthStateChangedCallback({ uid: 'admin-uid' });
          }
        });
    
        await waitFor(() => {
          const lastHeroCallArgs = (SocietyHero as jest.Mock).mock.calls.slice(-1)[0];
          expect(lastHeroCallArgs[0]).toHaveProperty('isManagementView', true);

          const lastTabsCallArgs = (SocietyTabs as jest.Mock).mock.calls.slice(-1)[0];
          expect(lastTabsCallArgs[0]).toHaveProperty('isManagementView', true);
          expect(mockPush).not.toHaveBeenCalled()
        });
      });

      it('should redirect when user is not a society head or admin', async () => {
        ;(getUserPrivilege as jest.Mock).mockResolvedValue(0) // Normal user
        render(<SocietyPage />);
    
        await screen.findByTestId('society-hero');
    
        act(() => {
          if (onAuthStateChangedCallback) {
            onAuthStateChangedCallback({ uid: 'not-a-head' });
          }
        });
    
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/coming-soon')
        });
      });
    
      it('should redirect when user is not logged in', async () => {
        render(<SocietyPage />);
    
        await screen.findByTestId('society-hero');
    
        act(() => {
          if (onAuthStateChangedCallback) {
            onAuthStateChangedCallback(null);
          }
        });
    
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/coming-soon')
        });
      });
  });
})
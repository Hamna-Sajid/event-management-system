import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import SocietyPage from './page'
import '@testing-library/jest-dom'
import { getDoc, getDocs, deleteDoc, updateDoc, arrayRemove, doc } from 'firebase/firestore'
import { useParams, useRouter } from 'next/navigation'
import SocietyHero from '@/components/societies/society-hero'
import { getUserPrivilege } from '@/lib/privileges'
import SocietyTabs from '@/components/societies/society-tabs'

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
jest.mock('@/components/societies/society-header', () => {
    const Mock = () => <div data-testid="society-header" />
    Mock.displayName = 'SocietyHeader'
    return Mock
})
jest.mock('@/components/societies/society-hero')
jest.mock('@/components/societies/society-tabs')


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

/**
 * @testSuite SocietyPage
 * 
 * Test suite for the main society page located at `app/societies/[id]/page.tsx`.
 * 
 * @remarks
 * This suite tests the behavior of the SocietyPage component, focusing on data fetching,
 * rendering logic, role-based access control, and event management handlers.
 * 
 * Mocks are used for:
 * - Firebase services (`firestore`, `auth`) to simulate database interactions and user authentication.
 * - Next.js navigation (`useParams`, `useRouter`) to control URL parameters and routing.
 * - Child components (`SocietyHeader`, `SocietyHero`, `SocietyTabs`) to isolate the page component.
 * - Library functions (`getUserPrivilege`) to simulate user permission checks.
 * 
 * @testCoverage
 * - **Rendering**: Covers initial loading state, error states (no ID, society not found), and successful data rendering.
 * - **Authorization**: Ensures the `isManagementView` prop is correctly passed based on user privilege (Admin/Society Head).
 * - **Redirects**: Verifies that unauthorized users (normal users or unauthenticated visitors) are redirected away from the page.
 * - **Event Handlers**: Confirms that `handleDeleteEvent` and `handleEditEvent` correctly call the appropriate Firestore functions with the right parameters.
 * 
 * @edgeCases
 * - URL does not contain a society ID.
 * - The requested society ID does not exist in Firestore.
 * - A user is not logged in when viewing the page.
 * - A logged-in user does not have Admin or Society Head privileges.
 * 
 * @expectedValues
 * **Authorization & Redirects:**
 * - User Privilege >= 2 (Admin): `isManagementView` is true, no redirect.
 * - User is a Society Head: `isManagementView` is true, no redirect.
 * - User Privilege < 2 (Normal User): Redirect to `/coming-soon`.
 * - No authenticated user: Redirect to `/coming-soon`.
 * 
 * **Event Deletion:**
 * - `handleDeleteEvent('event-id')` calls `deleteDoc` with the event's path and `updateDoc` to remove the ID from the society's event list.
 * 
 * **Event Editing:**
 * - `handleEditEvent({...})` calls `updateDoc` with the event's path and ensures the `status` field is lowercased.
 */
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
    mockGetDoc.mockImplementation(() => new Promise(() => {})) // Never resolves to keep loading
    const { container } = render(<SocietyPage />)
    // LoadingScreen renders with a fixed inset-0 div containing loading content
    const loadingDiv = container.querySelector('.fixed.inset-0')
    expect(loadingDiv).toBeInTheDocument()
  })

  it('should show error if no society ID is provided', async () => {
    mockUseParams.mockReturnValue({ id: undefined })
    const { container } = await act(async () => {
      return render(<SocietyPage />)
    })
    // Page returns null for error states, so container should be empty
    expect(container.firstChild).toBeNull()
  })
  
  it('should show error if society is not found', async () => {
    mockGetDoc.mockResolvedValue({ exists: () => false });
    const { container } = await act(async () => {
      return render(<SocietyPage />)
    })
    // Page returns null for error states, so container should be empty
    expect(container.firstChild).toBeNull()
  })

  it('should render the page with society data for an admin', async () => {
    ;(getUserPrivilege as jest.Mock).mockResolvedValue(2) // Admin
    await act(async () => {
      render(<SocietyPage />)
    })

    await act(async () => {
      if (onAuthStateChangedCallback) {
        onAuthStateChangedCallback({ uid: 'admin-uid' });
      }
    });
    
    expect(await screen.findByTestId('society-header')).toBeInTheDocument()
    expect(await screen.findByTestId('society-hero')).toBeInTheDocument()
    expect(await screen.findByTestId('society-tabs')).toBeInTheDocument()
  })

  describe('Event Handlers', () => {
    beforeEach(async () => {
        ;(getUserPrivilege as jest.Mock).mockResolvedValue(2) // Assume admin for these tests
        await act(async () => {
          render(<SocietyPage />)
        })
        await act(async () => {
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
        
        await act(async () => {
          render(<SocietyPage />);
        });
    
        await screen.findByTestId('society-hero');
    
        await act(async () => {
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
        
        await act(async () => {
          render(<SocietyPage />);
        });
    
        await screen.findByTestId('society-hero');
    
        await act(async () => {
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
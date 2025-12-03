import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DefaultProfileSociety from './page';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getDocs, collection, query } from 'firebase/firestore';

// Mock Firebase modules
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn(),
  deleteDoc: jest.fn(),
  arrayRemove: jest.fn(),
}));

// Mock components
jest.mock('@/components/society-header', () => {
  const MockSocietyHeader = () => <div data-testid="society-header">Society Header</div>;
  MockSocietyHeader.displayName = 'MockSocietyHeader';
  return MockSocietyHeader;
});
jest.mock('@/components/society-hero', () => {
  const MockSocietyHero = ({ societyName }: { societyName: string }) => <div data-testid="society-hero">Society Hero: {societyName}</div>;
  MockSocietyHero.displayName = 'MockSocietyHero';
  return MockSocietyHero;
});
jest.mock('@/components/society-tabs', () => {
  const MockSocietyTabs = () => <div data-testid="society-tabs">Society Tabs</div>;
  MockSocietyTabs.displayName = 'MockSocietyTabs';
  return MockSocietyTabs;
});


describe('DefaultProfileSociety Page', () => {
  const mockGetAuth = getAuth as jest.Mock;
  const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;
  const mockGetDoc = getDoc as jest.Mock;
  const mockGetDocs = getDocs as jest.Mock;
  const mockDoc = doc as jest.Mock;
  const mockCollection = collection as jest.Mock;
  const mockQuery = query as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuth.mockReturnValue({}); // Return a dummy auth object
    mockDoc.mockImplementation((_, path, ...segments) => `mock/path/${path}/${segments.join('/')}`);
    mockCollection.mockReturnValue('mock-collection');
    mockQuery.mockReturnValue('mock-query');
  });

  it('should display loading state initially', () => {
    mockOnAuthStateChanged.mockImplementation((_auth, _callback) => {
      // Don't call the callback to stay in loading state
      return () => {}; // Return an unsubscribe function
    });
    render(<DefaultProfileSociety />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display error if user is not signed in', async () => {
    mockOnAuthStateChanged.mockImplementation((_auth, _callback) => {
      _callback(null); // Simulate user not logged in
      return () => {};
    });
    render(<DefaultProfileSociety />);
    await waitFor(() => {
      expect(screen.getByText('Please sign in to view this page.')).toBeInTheDocument();
    });
  });

  it('should display error if user has no society', async () => {
    const user = { uid: 'test-user-id' };
    mockOnAuthStateChanged.mockImplementation((_auth, _callback) => {
      _callback(user);
      return () => {};
    });
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ fullName: 'Test User', societyId: null }), // No societyId
    });

    render(<DefaultProfileSociety />);
    await waitFor(() => {
      expect(screen.getByText('No society associated with this user.')).toBeInTheDocument();
    });
  });
  
  it('should display error if society is not found', async () => {
    const user = { uid: 'test-user-id' };
    mockOnAuthStateChanged.mockImplementation((_auth, _callback) => {
      _callback(user);
      return () => {};
    });
    mockGetDoc.mockImplementation(path => {
      if (path.includes('users')) {
        return Promise.resolve({
          exists: () => true,
          data: () => ({ fullName: 'Test User', societyId: 'test-society-id' }),
        });
      }
      if (path.includes('societies')) {
        return Promise.resolve({ exists: () => false }); // Society not found
      }
      return Promise.resolve({ exists: () => false });
    });

    render(<DefaultProfileSociety />);
    await waitFor(() => {
      expect(screen.getByText('Society not found.')).toBeInTheDocument();
    });
  });

  it('should fetch and display society data correctly', async () => {
    const user = { uid: 'test-user-id' };
    const societyData = {
      name: 'Test Society',
      description: 'A society for testing',
      heads: { CEO: 'head1', CFO: null, COO: null },
      events: [],
    };
    const headUserData = {
      fullName: 'John Doe',
      societyRole: 'CEO',
      email: 'john.doe@example.com',
    };

    mockOnAuthStateChanged.mockImplementation((_auth, _callback) => {
      _callback(user);
      return () => {};
    });
    
    // Mock getDoc for user and society
    mockGetDoc.mockImplementation(path => {
      if (path.includes('users/test-user-id')) {
        return Promise.resolve({
          exists: () => true,
          data: () => ({ fullName: 'Test User', societyId: 'test-society-id' }),
        });
      }
      if (path.includes('societies/test-society-id')) {
        return Promise.resolve({
          exists: () => true,
          data: () => societyData,
        });
      }
      return Promise.resolve({ exists: () => false });
    });

    // Mock getDocs for members
    mockGetDocs.mockResolvedValue({
      docs: [{ id: 'head1', data: () => headUserData }],
    });

    render(<DefaultProfileSociety />);

    await waitFor(() => {
      expect(screen.getByText('Society Hero: Test Society')).toBeInTheDocument();
      expect(screen.getByTestId('society-header')).toBeInTheDocument();
      expect(screen.getByTestId('society-hero')).toBeInTheDocument();
      expect(screen.getByTestId('society-tabs')).toBeInTheDocument();
    });
  });
});

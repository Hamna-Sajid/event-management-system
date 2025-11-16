# Testing Documentation

## Overview

The IBA Event Management System (IEMS) uses **Jest** as its testing framework with **React Testing Library** for component testing. This document provides comprehensive information about all test suites, testing strategies, and CI/CD integration.

---

## Table of Contents

- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Test Suites Overview](#test-suites-overview)
  - [Component Tests](#component-tests)
  - [Page Tests](#page-tests)
  - [Library Tests](#library-tests)
- [Testing Patterns](#testing-patterns)
- [Mocking Strategies](#mocking-strategies)
- [CI/CD Integration](#cicd-integration)
- [Writing New Tests](#writing-new-tests)

---

## Testing Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **Jest** | ^30.2.0 | Test runner and assertion library |
| **React Testing Library** | ^16.3.0 | Component testing utilities |
| **@testing-library/jest-dom** | ^6.9.1 | Custom DOM matchers |
| **@testing-library/user-event** | ^14.6.1 | User interaction simulation |
| **jest-environment-jsdom** | ^30.2.0 | DOM environment for tests |
| **ts-jest** | ^29.4.5 | TypeScript support for Jest |

---

## Running Tests

### Basic Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Jest Configuration

Location: `jest.config.ts`

```typescript
{
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**'
  ]
}
```

---

## Test Coverage

Current test coverage as of latest build:

- **Total Test Suites**: 9
- **Total Tests**: 131+
- **Components Coverage**: 100% of public components
- **Pages Coverage**: Critical authentication and admin flows
- **Library Coverage**: 100% of privilege management utilities

### Coverage Breakdown by Module

| Module | Test Files | Test Cases | Coverage |
|--------|-----------|------------|----------|
| Components | 5 | 75 | Complete |
| Pages | 3 | 46 | Critical paths |
| Library (Utilities) | 1 | 10 | Complete |

---

## Test Suites Overview

### Component Tests

#### 1. Header Component (`components/header.test.tsx`)

**Total Tests: 11**

Tests the main navigation header with authentication controls.

**Key Test Cases:**
- Logo and brand name rendering
- Search button rendering
- Login/Sign up button rendering
- Sticky positioning and backdrop blur
- Button click handlers
- Proper button variant styling
- Glassmorphism effects

**Mocks Used:**
- Next.js `useRouter`

**Example Test:**
```typescript
it('should render the logo and brand name', () => {
  render(<Header />)
  expect(screen.getByText('IE')).toBeInTheDocument()
  expect(screen.getByText('IEMS')).toBeInTheDocument()
})
```

---

#### 2. Hero Component (`components/hero.test.tsx`)

**Total Tests: 9**

Tests the landing page hero section with CTAs and statistics.

**Key Test Cases:**
- Main headline rendering
- "Coming Soon" badge display
- Statistics display (500+ Events, 50+ Societies, 5K+ Students)
- Join Waitlist and Sign In buttons
- Correct link destinations (`/signup`, `/signin`)
- Glassmorphism styling
- Early access messaging

**Notable Approach:**
Uses `getAllByText` for duplicate text elements (e.g., "IBA Events" appears in both headline and description).

---

#### 3. Footer Component (`components/footer.test.tsx`)

**Total Tests: 15**

Tests the site-wide footer with navigation and contact information.

**Key Test Cases:**
- Brand logo and description
- Quick Links section (Browse Events, My Registrations, About IBA, Contact Us)
- Resources section (Help Center, Privacy Policy, Terms of Service, FAQ)
- Contact information (email, phone, location)
- Social media links (Twitter, LinkedIn, Facebook)
- Copyright notice
- Proper link attributes (`mailto:`, `tel:`)
- Grid layout (4 columns on desktop)
- Hover effects on links
- Border styling

---

#### 4. Upcoming Events Component (`components/upcoming-events.test.tsx`)

**Total Tests: 13**

Tests the event listing component with registration capabilities.

**Key Test Cases:**
- Section header rendering
- All three event cards displayed
- Event dates formatting (March 15, March 22, April 5, 2025)
- Event locations (Karachi, Lahore, Islamabad)
- Attendee counts with formatting (2,500 / 1,200 / 800)
- Register buttons for each event
- "View All Events" button
- Button click handling
- Event images with alt text
- Calendar, map pin, and user icons
- Glassmorphism effects
- Grid layout (3 columns on desktop)

---

#### 5. Call to Action Component (`components/call-to-action.test.tsx`)

**Total Tests: 10**

Tests the waitlist signup CTA section.

**Key Test Cases:**
- Main headline ("Ready to Transform Your IBA Experience")
- Description text
- "Join Waitlist Now" button
- Trust badges (No credit card, Free to join, Early access)
- Sparkles icon rendering
- Link to `/signup`
- Glassmorphism effects
- Button styling (primary red)
- Large button size
- Center alignment

---

### Page Tests

#### 6. Forgot Password Page (`app/forgot-password/page.test.tsx`)

**Total Tests: 27**

Comprehensive testing of password reset flow.

**Test Categories:**

**UI Rendering (8 tests):**
- Reset password heading
- Descriptive text
- Mail icon
- Email input field (type, placeholder)
- Send reset link button
- Back to sign in link
- Arrow icon
- Glassmorphic card styling

**Form Validation (3 tests):**
- Email input required
- Email input acceptance
- Email cleared on successful submission

**Password Reset Functionality (5 tests):**
- `sendPasswordResetEmail` called with correct params
- Success message after sending
- Loading state ("Sending...")
- Button disabled while sending
- Form submission handling

**Error Handling (5 tests):**
- User not found error
- Invalid email error
- Generic network errors
- Previous errors cleared on new submission
- Previous success messages cleared

**Success/Error State UI (2 tests):**
- Green styling for success messages
- Red styling for error messages

**Accessibility (4 tests):**
- Proper label for email input
- Form structure
- Default form submission prevented
- Input attributes (id, name)

**Mocks Used:**
- Firebase `getAuth`, `sendPasswordResetEmail`
- Next.js `Link`
- Lucide icons

---

#### 7. Email Verification Page (`app/verify-email/page.test.tsx`)

**Total Tests: 10**

Tests the email verification flow with privilege-based routing.

**Test Categories:**

**User Not Signed In (1 test):**
- Redirect to `/signup` when user is null

**User Signed Up but Not Verified (2 tests):**
- Display verification page with email and instructions
- Allow user to resend verification link

**User Not Verified Clicks Verify Button (1 test):**
- Display error when email not verified yet

**User with Privilege < 2 (3 tests):**
- Redirect to `/waitlist` for privilege 0
- Redirect to `/waitlist` for privilege 1 (society head)
- Redirect to `/waitlist` if already verified user revisits page

**User with Privilege >= 2 (2 tests):**
- Redirect to `/admin` when verified admin user
- Redirect to `/admin` if already verified admin revisits page

**Special Features:**
- Updates `emailVerified` flag in Firestore
- Fetches user privilege to determine routing
- 2-second delay before redirect for UX
- Handles reload of user authentication state

**Mocks Used:**
- Firebase `getAuth`, `onAuthStateChanged`, `sendEmailVerification`
- Firestore `doc`, `updateDoc`, `getDoc`
- Next.js `useRouter`
- Lucide icons

---

#### 8. Admin Dashboard (`app/admin/page.test.tsx`)

**Total Tests: 10**

Tests the comprehensive admin dashboard with society and head management.

**Test Categories:**

**Authentication and Authorization (3 tests):**
- Redirect to `/signin` if not logged in
- Redirect to `/waitlist` if privilege < 2
- Load dashboard for admin user (privilege >= 2)

**Society Creation (3 tests):**
- Prevent creating duplicate societies (same name)
- Create society with unique name
- Generate unique society ID from name (lowercase-with-hyphens)

**Society Head Assignment (4 tests):**
- Only allow `@khi.iba.edu.pk` email domain
- Require user to have verified email
- Prevent user from being head of multiple societies
- Not allow duplicate role assignment in same society

**Key Validations Tested:**
1. **Email Domain**: Must end with `@khi.iba.edu.pk`
2. **Email Verification**: User must have `emailVerified: true`
3. **Single Society Constraint**: User can only be head of one society
4. **Unique Roles**: Each role (CEO/CFO/COO) can only be assigned once per society

**Toast Notifications:**
Tests verify that appropriate error messages are shown via `showToast()`:
- Duplicate society error
- Invalid email domain
- Unverified email
- Multi-society head prevention
- Role already taken

**Mocks Used:**
- Firebase `getAuth`, `onAuthStateChanged`
- Firestore `doc`, `getDoc`, `setDoc`, `getDocs`, `updateDoc`
- Next.js `useRouter`
- Toast notification system
- Lucide icons
- UI Button component

---

### Library Tests

#### 9. Privileges Utility (`lib/privileges.test.ts`)

**Total Tests: 50**

Comprehensive testing of user privilege management system.

**Test Categories:**

**UserPrivilege Enum (1 test):**
- Correct privilege level values (0, 1, 2)

**getUserPrivilege Function (7 tests):**
- Return privilege level when user exists
- Return 0 when user doesn't exist
- Return 0 when privilege field is missing
- Return 0 when error occurs
- Handle privilege level 0 (normal user)
- Handle privilege level 2 (admin)
- Error logging verification

**updateUserPrivilege Function (6 tests):**
- Update privilege to society head (1)
- Update privilege to admin (2)
- Update privilege to normal user - downgrade (0)
- Include timestamp when updating
- Throw error when update fails
- Error logging verification

**isNormalUser Function (3 tests):**
- Return true for privilege 0
- Return false for privilege 1
- Return false for privilege 2

**isSocietyHead Function (3 tests):**
- Return true for privilege 1
- Return false for privilege 0
- Return false for privilege 2

**isAdmin Function (3 tests):**
- Return true for privilege 2
- Return false for privilege 0
- Return false for privilege 1

**canManageSociety Function (4 tests):**
- Return true for privilege 1 (society head)
- Return true for privilege 2 (admin)
- Return false for privilege 0
- Return false for non-existent user

**getPrivilegeName Function (5 tests):**
- Return "Normal User" for privilege 0
- Return "Society Head" for privilege 1
- Return "Admin" for privilege 2
- Return "Unknown" for invalid privilege levels
- Handle edge cases (NaN, Infinity)

**Mocks Used:**
- Firestore `doc`, `getDoc`, `updateDoc`
- Firebase app

---

## Testing Patterns

### 1. Component Testing Pattern

```typescript
describe('ComponentName', () => {
  it('should render required elements', () => {
    render(<ComponentName />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
  
  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    render(<ComponentName />)
    
    const button = screen.getByRole('button', { name: /Click Me/i })
    await user.click(button)
    
    expect(button).toBeInTheDocument()
  })
})
```

### 2. Async Testing Pattern

```typescript
it('should handle async operations', async () => {
  ;(mockAsyncFunction as jest.Mock).mockResolvedValue({ data: 'test' })
  
  render(<Component />)
  
  await waitFor(() => {
    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
```

### 3. Error Handling Pattern

```typescript
it('should display error messages', async () => {
  ;(mockFunction as jest.Mock).mockRejectedValue(new Error('Test error'))
  
  render(<Component />)
  
  fireEvent.click(screen.getByRole('button'))
  
  await waitFor(() => {
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })
})
```

### 4. Authentication Testing Pattern

```typescript
it('should redirect based on auth state', async () => {
  let authCallback: ((user: unknown) => void) | null = null
  ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
    authCallback = callback
    return jest.fn()
  })
  
  render(<ProtectedPage />)
  
  act(() => {
    authCallback!(mockUser)
  })
  
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/expected-route')
  })
})
```

---

## Mocking Strategies

### Firebase Authentication

```typescript
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}))
```

### Firebase Firestore

```typescript
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
}))
```

### Next.js Router

```typescript
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
}))
```

### Next.js Link

```typescript
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'Link'
  return MockLink
})
```

### Lucide Icons

```typescript
jest.mock('lucide-react', () => ({
  IconName: () => <div data-testid="icon-name">Icon</div>,
}))
```

### Custom Components (Toast)

```typescript
jest.mock('@/components/ui/toast', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  showToast: jest.fn(),
}))
```

---

## CI/CD Integration

### GitHub Actions Workflow

**File:** `.github/workflows/pr-tests.yml`

The project uses GitHub Actions for continuous integration on pull requests to `main` and `dev` branches.

#### Workflow Configuration

```yaml
name: Pull Request Tests

on:
  pull_request:
    branches:
      - main
      - dev

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Build project
        run: npm run build
      
      - name: Run tests
        run: npm test
```

#### Workflow Steps Explained

1. **Checkout Code** - Uses `actions/checkout@v4` to clone the repository
2. **Setup Node.js** - Installs Node.js v24 with npm caching
3. **Install Dependencies** - Runs `npm ci` for clean dependency installation
4. **Run ESLint** - Checks code quality and style
5. **Build Project** - Compiles Next.js application
6. **Run Tests** - Executes entire Jest test suite

#### When Tests Run

- On every pull request to `main` branch
- On every pull request to `dev` branch
- On every push to an open PR

#### Merge Requirements

Pull requests **cannot be merged** if:
- ESLint fails
- Build fails
- Any test fails

---

## Writing New Tests

### Guidelines

1. **File Naming Convention**
   - Component tests: `ComponentName.test.tsx`
   - Page tests: `page.test.tsx`
   - Utility tests: `utilityName.test.ts`

2. **Test Structure**
   ```typescript
   describe('Component/Feature Name', () => {
     // Setup
     beforeEach(() => {
       jest.clearAllMocks()
     })
     
     describe('Category of tests', () => {
       it('should do something specific', () => {
         // Arrange
         // Act
         // Assert
       })
     })
   })
   ```

3. **Naming Conventions**
   - Use descriptive test names: `it('should render error message when API fails')`
   - Group related tests: `describe('Form Validation', () => { ... })`
   - Use action-based naming: "should...", "when...", "if..."

4. **AAA Pattern**
   - **Arrange**: Set up test data and mocks
   - **Act**: Execute the code being tested
   - **Assert**: Verify expected outcomes

5. **Coverage Requirements**
   - All components should have tests
   - All critical user flows should be tested
   - All utility functions should have 100% coverage
   - Error states must be tested

### Example: Adding a New Component Test

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyNewComponent from './MyNewComponent'

// Mock any dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('MyNewComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  describe('Rendering', () => {
    it('should render the component with correct content', () => {
      render(<MyNewComponent title="Test Title" />)
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })
  })
  
  describe('User Interactions', () => {
    it('should handle button click', async () => {
      const user = userEvent.setup()
      const mockHandler = jest.fn()
      
      render(<MyNewComponent onClick={mockHandler} />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockHandler).toHaveBeenCalledTimes(1)
    })
  })
  
  describe('Error States', () => {
    it('should display error message when prop is invalid', () => {
      render(<MyNewComponent error="Something went wrong" />)
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })
  })
})
```

---

## Best Practices

### Do's

- **Clear test names**: Describe what is being tested
- **One assertion per test**: Keep tests focused
- **Use `waitFor` for async**: Wait for state changes
- **Mock external dependencies**: Isolate units under test
- **Test user behavior**: Not implementation details
- **Clean up after tests**: Use `beforeEach` and `afterEach`
- **Use semantic queries**: `getByRole`, `getByLabelText`, etc.
- **Test accessibility**: Use accessible queries

### Don'ts

- **Don't test implementation details**: Test behavior, not code
- **Don't use hardcoded waits**: Use `waitFor` instead of `setTimeout`
- **Don't skip error cases**: Test both success and failure
- **Don't ignore warnings**: Fix console warnings in tests
- **Don't test third-party libraries**: Trust they work
- **Don't share state between tests**: Each test should be independent

---

## Common Testing Utilities

### Query Priority (React Testing Library)

1. **Accessible to everyone**:
   - `getByRole`
   - `getByLabelText`
   - `getByPlaceholderText`
   - `getByText`

2. **Semantic queries**:
   - `getByAltText`
   - `getByTitle`

3. **Test IDs** (last resort):
   - `getByTestId`

### User Event vs FireEvent

**Prefer `userEvent`** (more realistic):
```typescript
const user = userEvent.setup()
await user.click(button)
await user.type(input, 'text')
```

**Use `fireEvent`** only for non-user events:
```typescript
fireEvent.change(input, { target: { value: 'text' } })
fireEvent.submit(form)
```

---

## Troubleshooting

### Common Issues

**1. Tests timing out**
```typescript
// Solution: Increase timeout
jest.setTimeout(10000)
```

**2. Act warnings**
```typescript
// Solution: Wrap state updates in act()
act(() => {
  callback!(mockData)
})
```

**3. Module not found errors**
```typescript
// Solution: Check moduleNameMapper in jest.config.ts
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1'
}
```

**4. Async tests failing**
```typescript
// Solution: Use waitFor and await
await waitFor(() => {
  expect(element).toBeInTheDocument()
})
```

---

## Summary

- **Total Test Coverage**: 131+ tests across 9 test suites
- **Framework**: Jest + React Testing Library
- **CI/CD**: GitHub Actions on PR to `main`/`dev`
- **Coverage Goals**: 100% for components and utilities, critical paths for pages
- **Test Execution**: Automated on every pull request
- **Quality Gates**: Lint + Build + Tests must pass before merge

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [GitHub Actions](https://docs.github.com/en/actions)

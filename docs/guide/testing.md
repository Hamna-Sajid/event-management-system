# Testing

## Overview

The IBA Event Management System uses **Jest** as its testing framework with **React Testing Library** for component testing. This guide covers testing practices, patterns, and CI/CD integration.

For detailed test suite documentation including all test cases, see the [Test Suites Reference](/api/tests).

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

Current test coverage:

- **Total Test Suites**: 9
- **Total Tests**: 131+
- **Components Coverage**: 100% of public components
- **Pages Coverage**: Critical authentication and admin flows
- **Library Coverage**: 100% of privilege management utilities

### Coverage Breakdown

| Module | Test Files | Test Cases | Coverage |
|--------|-----------|------------|----------|
| Components | 5 | 75 | Complete |
| Pages | 3 | 46 | Critical paths |
| Library (Utilities) | 1 | 10 | Complete |

Coverage reports are generated in the `coverage/` directory. View the HTML report at `coverage/lcov-report/index.html`.

---

## Testing Strategy

We follow a **behavior-driven testing** approach that focuses on:

1. **User-facing behavior**: Test what users see and do, not implementation details
2. **Async handling**: Proper handling of async operations using `waitFor`
3. **Mocking**: External dependencies (Firebase, routing) are mocked appropriately
4. **Accessibility**: Use semantic queries that reflect how users interact with the UI

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

## Writing New Tests

### File Naming Convention

- Component tests: `ComponentName.test.tsx`
- Page tests: `page.test.tsx`
- Utility tests: `utilityName.test.ts`

### Test Suite Documentation

All test files **must** include a `@testSuite` tag at the top for proper documentation generation:

```typescript
/**
 * @testSuite ComponentName
 * 
 * Test suite for ComponentName component/page/utility
 * 
 * @remarks
 * Comprehensive tests covering:
 * - Feature category 1
 * - Feature category 2
 * - Feature category 3
 * 
 * @testCoverage
 * - **Category 1**: What's being tested
 * - **Category 2**: What's being tested
 * 
 * @edgeCases
 * - Edge case 1 and expected behavior
 * - Edge case 2 and expected behavior
 * 
 * @expectedValues
 * **Feature 1:**
 * - Input A: Expected output B
 * - Condition X: Expected result Y
 */

describe('ComponentName', () => {
  // tests
})
```

### Test Structure

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

### Naming Conventions

- Use descriptive test names: `it('should render error message when API fails')`
- Group related tests: `describe('Form Validation', () => { ... })`
- Use action-based naming: "should...", "when...", "if..."

### AAA Pattern

- **Arrange**: Set up test data and mocks
- **Act**: Execute the code being tested
- **Assert**: Verify expected outcomes

### Coverage Requirements

- All components should have tests
- All test files should have `@testSuite` documentation
- All critical user flows should be tested
- All utility functions should have 100% coverage
- Error states must be tested

### Example: Adding a New Component Test

```typescript
/**
 * @testSuite MyNewComponent
 * 
 * Test suite for MyNewComponent
 * 
 * @remarks
 * Tests cover:
 * - Component rendering with various props
 * - User interactions (clicks, form submissions)
 * - Error state handling
 * 
 * @testCoverage
 * - **Rendering**: Component displays correct content
 * - **Interactions**: Button clicks trigger handlers
 * - **Errors**: Error messages display appropriately
 * 
 * @edgeCases
 * - Empty props handled gracefully
 * - Invalid props show error messages
 * 
 * @expectedValues
 * - Valid title prop: renders in heading
 * - Click handler: called once per click
 * - Error prop: displays in red text
 */

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

## Query Priority (React Testing Library)

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

## CI/CD Integration

### GitHub Actions Workflow

The project uses GitHub Actions for continuous integration on pull requests to `main` and `dev` branches.

**File:** `.github/workflows/pr-tests.yml`

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

### Workflow Steps

1. **Checkout Code** - Clone the repository
2. **Setup Node.js** - Install Node.js v24 with npm caching
3. **Install Dependencies** - Run `npm ci` for clean install
4. **Run ESLint** - Check code quality and style
5. **Build Project** - Compile Next.js application
6. **Run Tests** - Execute entire Jest test suite

### When Tests Run

- On every pull request to `main` branch
- On every pull request to `dev` branch
- On every push to an open PR

### Merge Requirements

Pull requests **cannot be merged** if:
- ESLint fails
- Build fails
- Any test fails

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [GitHub Actions](https://docs.github.com/en/actions)

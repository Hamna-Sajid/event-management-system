# Documentation Standards

This document outlines the documentation standards for the IBA Event Management System project.

## Overview

We use a **custom JSDoc parser** to generate API reference documentation from JSDoc comments in the source code. Documentation is generated as markdown files for easy viewing and version control.

## JSDoc Tags and Grouping

### Tag Priority

The documentation generator uses specific tags to group and organize documentation. Tags are checked in the following priority order:

1. `@library` - For library/utility files (highest priority)
2. `@testSuite` - For test suite files
3. `@component` - For React component files
4. `@file` - For explicit file-level grouping
5. Filename - Fallback if no tag is found (will generate warning)

### When to Use Each Tag

#### `@library` Tag - For Utility Libraries

Use `@library` for files containing utility functions, helpers, or core business logic.

```typescript
/**
 * @library Privileges
 * 
 * User privilege management utilities for role-based access control.
 * 
 * @remarks
 * The system uses a hierarchical privilege model with three levels:
 * - Level 0 (Normal User): Can browse and register for events
 * - Level 1 (Society Head): Can manage their society's events
 * - Level 2 (Admin): Full system access
 */

/**
 * @function getUserPrivilege
 * Retrieves a user's privilege level from Firestore.
 * 
 * @param userId - The user's unique identifier
 * @returns Promise resolving to the user's privilege level
 */
export async function getUserPrivilege(userId: string): Promise<number> {
  // implementation
}
```

**Result:** Creates section `## Privileges` with multiple functions grouped underneath.

---

#### `@testSuite` Tag - For Test Files

Use `@testSuite` for test files to describe what's being tested.

```typescript
/**
 * @testSuite AdminDashboard
 * 
 * Test suite for Admin Dashboard page
 * 
 * @remarks
 * Comprehensive tests for the admin dashboard covering:
 * - Authentication and authorization (admin privilege level 2 required)
 * - Society management (create, list, unique names)
 * - Society head assignment (email validation, verification)
 * 
 * @testCoverage
 * - **Authentication Tests**: Redirects for unauthenticated users
 * - **Society Creation**: Unique names, ID generation
 * - **Email Validation**: Only @khi.iba.edu.pk domain allowed
 * 
 * @edgeCases
 * - Unauthenticated user redirects to signin
 * - Non-admin (privilege < 2) redirects to waitlist
 * - Duplicate society names prevented
 * 
 * @expectedValues
 * **Authentication:**
 * - Unauthenticated: redirect to /signin
 * - Privilege < 2: redirect to /waitlist
 * - Privilege >= 2: dashboard loads
 */

describe('Admin Dashboard', () => {
  // test cases
})
```

**Result:** Creates heading `### AdminDashboard` (no duplicate section if single test suite per file).

---

#### `@component` Tag - For React Components

Use `@component` for React components with their name.

```typescript
/**
 * @component CallToAction
 * 
 * Call-to-action section encouraging users to join the waitlist
 * 
 * @remarks
 * This component displays a prominent CTA section with:
 * - Eye-catching gradient icon (Sparkles)
 * - Compelling headline and description
 * - Primary action button linking to signup
 * - Trust indicators (free, no credit card, early access)
 * 
 * Design features:
 * - Centered layout with max-width constraint
 * - Responsive padding (mobile to desktop)
 * - Glassmorphism styling with hover effects
 * 
 * @example
 * ```tsx
 * import CallToAction from '@/components/call-to-action'
 * 
 * export default function LandingPage() {
 *   return (
 *     <>
 *       <Hero />
 *       <CallToAction />
 *       <Footer />
 *     </>
 *   )
 * }
 * ```
 */
export default function CallToAction() {
  // implementation
}
```

**Result:** Creates heading `### CallToAction` (no duplicate section if single component per file).

---

#### `@function` Tag - For Individual Functions

Use `@function` for individual function documentation within libraries.

```typescript
/**
 * @function getTotalEvents
 * 
 * Fetches the total number of events created in the system.
 * 
 * @returns Promise resolving to the count of events in the database.
 *          Returns 0 if an error occurs during the fetch operation.
 * 
 * @throws Never throws - errors are caught, logged to console, and 0 is returned
 * 
 * @example
 * Using all statistics functions together:
 * ```tsx
 * const [stats, setStats] = useState({ events: 0, societies: 0, users: 0 });
 * 
 * useEffect(() => {
 *   async function fetchAllStats() {
 *     const [events, societies, users] = await Promise.all([
 *       getTotalEvents(),
 *       getTotalSocieties(),
 *       getTotalUsers(),
 *     ]);
 *     setStats({ events, societies, users });
 *   }
 *   fetchAllStats();
 * }, []);
 * ```
 */
export async function getTotalEvents(): Promise<number> {
  // implementation
}
```

---

#### `@file` Tag - For Explicit File Grouping

Use `@file` when you want explicit control over the grouping name.

```typescript
/**
 * @file Event Utilities
 * 
 * Helper functions for event management and formatting
 */
```

---

### Warning Messages

If no grouping tag is found, the generator will display a warning:

```
! Using filename as heading for lib\stats.ts: No @library, @testSuite, @component, or @file tag found
```

**To fix:** Add the appropriate tag to the file's first JSDoc comment.

---

## JSDoc Comment Style

### General Guidelines

- All public functions, classes, and components **must** have JSDoc comments
- Use the appropriate tag (`@library`, `@function`, `@component`, `@testSuite`) for proper grouping
- Use TypeScript types instead of documenting types in comments
- Include `@example` blocks for complex functions
- Document error handling and edge cases with `@throws`
- Use `@remarks` for detailed explanations and implementation notes

### Function Documentation Template

```typescript
/**
 * @function myFunction
 * 
 * Brief one-line description of what the function does.
 * 
 * @param paramName - Description of the parameter
 * @param anotherParam - Description of another parameter
 * @returns Description of what is returned
 * 
 * @throws {ErrorType} Description of when this error is thrown
 * 
 * @remarks
 * Additional context, implementation notes, or important details.
 * Can span multiple lines.
 * 
 * @example
 * Basic usage:
 * ```ts
 * const result = await myFunction(arg1, arg2);
 * console.log(result);
 * ```
 * 
 * @example
 * Advanced usage with error handling:
 * ```ts
 * try {
 *   const result = await myFunction(arg1, arg2);
 * } catch (error) {
 *   console.error('Failed:', error);
 * }
 * ```
 */
export async function myFunction(paramName: string, anotherParam: number): Promise<Result> {
  // implementation
}
```

### Component Documentation Template

```tsx
/**
 * @component MyComponent
 * 
 * Brief one-line description of the component.
 * 
 * @remarks
 * Detailed description of what the component does:
 * - First key feature or behavior
 * - Second key feature or behavior
 * - Third key feature or behavior
 * 
 * Technical notes about implementation, state management, or side effects.
 * 
 * @example
 * Basic usage:
 * ```tsx
 * <MyComponent prop1="value" prop2={123} />
 * ```
 * 
 * @example
 * With all optional props:
 * ```tsx
 * <MyComponent 
 *   prop1="value" 
 *   prop2={123}
 *   onEvent={handleEvent}
 * />
 * ```
 */
export default function MyComponent({ prop1, prop2 }: Props) {
  // implementation
}
```

### Test Suite Documentation Template

```typescript
/**
 * @testSuite ComponentName
 * 
 * Test suite for ComponentName component/page/utility
 * 
 * @remarks
 * Comprehensive tests covering:
 * - Feature or behavior category 1
 * - Feature or behavior category 2
 * - Feature or behavior category 3
 * 
 * @testCoverage
 * - **Category 1**: Description of what's tested
 * - **Category 2**: Description of what's tested
 * - **Category 3**: Description of what's tested
 * 
 * @edgeCases
 * - Edge case 1 and expected behavior
 * - Edge case 2 and expected behavior
 * - Edge case 3 and expected behavior
 * 
 * @expectedValues
 * **Feature 1:**
 * - Input A: Expected output B
 * - Input C: Expected output D
 * 
 * **Feature 2:**
 * - Condition X: Expected result Y
 * - Condition Z: Expected result W
 */

describe('ComponentName', () => {
  // test cases
})
```

### Props Interface Documentation

```typescript
/**
 * Props for the MyComponent component.
 */
interface MyComponentProps {
  /** Brief description of prop1 */
  prop1: string;
  
  /** Brief description of prop2 */
  prop2: number;
  
  /** 
   * Optional callback fired when event occurs
   * @param data - The event data
   */
  onEvent?: (data: EventData) => void;
  
  /**
   * Children elements to render
   * @default undefined
   */
  children?: React.ReactNode;
}
```

### Enum Documentation

```typescript
/**
 * Brief description of what this enum represents.
 * 
 * @remarks
 * Additional context about when to use each value.
 */
export enum MyEnum {
  /** Description of VALUE_ONE */
  VALUE_ONE = 0,
  
  /** Description of VALUE_TWO */
  VALUE_TWO = 1,
  
  /** Description of VALUE_THREE */
  VALUE_THREE = 2,
}
```

## Documentation Configuration

Documentation generation is controlled by `docs.config.json`:

```json
{
  "outputDir": "docs/api",
  "createIndex": true,
  "docs": [
    {
      "name": "libs.md",
      "title": "Library Functions",
      "description": "Utility functions for privileges, statistics, and more",
      "include": ["lib/**/*.{ts,tsx}"],
      "exclude": ["lib/**/*.test.{ts,tsx}", "lib/utils.ts"],
      "isTest": false
    },
    {
      "name": "components.md",
      "title": "Components",
      "description": "React components for the application",
      "include": ["components/**/*.{ts,tsx}"],
      "exclude": ["components/**/*.test.{ts,tsx}", "components/ui/**"],
      "isTest": false
    },
    {
      "name": "tests.md",
      "title": "Test Suites",
      "description": "Comprehensive test documentation",
      "include": ["components/**/*.test.{ts,tsx}", "lib/**/*.test.{ts,tsx}", "app/**/*.test.{ts,tsx}"],
      "exclude": [],
      "isTest": true
    }
  ],
  "indexLinks": [
    { "title": "Testing Guide", "link": "/guide/testing" }
  ]
}
```

## Documentation Commands

### Generate API Documentation

```bash
# Generate documentation
npm run docs

# Generate and start dev server
npm run docs:dev
```

Documentation is generated to `docs/api/` directory.

## Best Practices

### Do's

- **Do** write documentation as you code, not after
- **Do** use the correct tag (`@library`, `@function`, `@component`, `@testSuite`) for proper grouping
- **Do** include practical examples that users can copy-paste
- **Do** document error cases and edge cases with `@throws`
- **Do** use `@remarks` for implementation notes and context
- **Do** use `@testCoverage`, `@edgeCases`, and `@expectedValues` for test documentation
- **Do** keep descriptions concise and actionable
- **Do** update documentation when you change code
- **Do** use TypeScript types instead of describing types in comments

### Don'ts

- **Don't** omit grouping tags (`@library`, `@component`, `@testSuite`) - they prevent filename warnings
- **Don't** state the obvious (e.g., "Returns a number" for a function typed as `(): number`)
- **Don't** document private functions (use `@internal` if you must)
- **Don't** duplicate information available from types
- **Don't** write novels - keep it concise
- **Don't** forget to update docs when changing code
- **Don't** use vague descriptions like "does stuff" or "handles things"
- **Don't** use `@category` tags - use `@library`, `@component`, or `@testSuite` instead


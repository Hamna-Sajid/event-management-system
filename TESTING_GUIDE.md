# Testing Guide

## Overview

All new features and bug fixes must include automated tests before merging to `main`. This guide provides templates, examples, and best practices for writing tests using Jest and React Testing Library.

---

## Test Requirements

### What Must Be Tested

| Code Type | Requirement | Test Location |
|-----------|-------------|---------------|
| Functions in `lib/` | Unit tests required | `lib/yourFile.test.ts` |
| React Components in `components/` | Component tests required | `components/YourComponent.test.tsx` |
| Bug Fixes | Regression test required | Same file as original test |
| API Routes | Integration tests recommended | `app/api/route.test.ts` |

### What Should NOT Be Tested

- Configuration files (tsconfig.json, next.config.ts, etc.)
- Type definitions only
- Third-party library code
- Simple type exports

---

## File Naming Convention

Tests must be placed in the same directory as the code being tested, with the `.test.ts` or `.test.tsx` extension.

| Code File | Test File |
|-----------|-----------|
| `lib/utils.ts` | `lib/utils.test.ts` |
| `lib/auth/login.ts` | `lib/auth/login.test.ts` |
| `components/ui/Button.tsx` | `components/ui/Button.test.tsx` |
| `app/api/users/route.ts` | `app/api/users/route.test.ts` |

---

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (automatically re-run on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

---

## Unit Test Template (Functions)

Use this template when testing utility functions, business logic, or data transformations in `lib/`.

### Basic Template

```typescript
// lib/yourFunction.test.ts
import { yourFunction } from './yourFunction'

describe('yourFunction', () => {
  it('should handle the basic case', () => {
    const result = yourFunction(input)
    expect(result).toBe(expectedOutput)
  })

  it('should handle edge case: empty input', () => {
    const result = yourFunction('')
    expect(result).toBe(expectedValue)
  })

  it('should throw error for invalid input', () => {
    expect(() => yourFunction(invalidInput)).toThrow('Error message')
  })
})
```

### Real Example: Testing a Calculation Function

```typescript
// lib/pricing.ts
export function calculateDiscount(price: number, discountPercent: number): number {
  if (price < 0) throw new Error('Price cannot be negative')
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount must be between 0 and 100')
  }
  return price - (price * discountPercent / 100)
}
```

```typescript
// lib/pricing.test.ts
import { calculateDiscount } from './pricing'

describe('calculateDiscount', () => {
  it('should calculate discount correctly', () => {
    expect(calculateDiscount(100, 10)).toBe(90)
    expect(calculateDiscount(50, 20)).toBe(40)
  })

  it('should return full price when discount is 0', () => {
    expect(calculateDiscount(100, 0)).toBe(100)
  })

  it('should return 0 when discount is 100', () => {
    expect(calculateDiscount(100, 100)).toBe(0)
  })

  it('should throw error for negative price', () => {
    expect(() => calculateDiscount(-10, 10)).toThrow('Price cannot be negative')
  })

  it('should throw error for invalid discount percentage', () => {
    expect(() => calculateDiscount(100, -5)).toThrow('Discount must be between 0 and 100')
    expect(() => calculateDiscount(100, 150)).toThrow('Discount must be between 0 and 100')
  })
})
```

---

## Component Test Template (React)

Use this template when testing React components in `components/`.

### Basic Template

```typescript
// components/YourComponent.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { YourComponent } from './YourComponent'

describe('YourComponent', () => {
  it('should render with default props', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interaction', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<YourComponent onClick={handleClick} />)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should apply custom className', () => {
    render(<YourComponent className="custom-class" />)
    expect(screen.getByTestId('your-component')).toHaveClass('custom-class')
  })
})
```

### Real Example: Testing a Form Component

```typescript
// components/LoginForm.tsx
export function LoginForm({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = React.useState('')

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(email) }}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

```typescript
// components/LoginForm.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('should render email input and submit button', () => {
    render(<LoginForm onSubmit={jest.fn()} />)
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('should update email input when user types', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={jest.fn()} />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    await user.type(emailInput, 'test@example.com')
    
    expect(emailInput).toHaveValue('test@example.com')
  })

  it('should call onSubmit with email when form is submitted', async () => {
    const handleSubmit = jest.fn()
    const user = userEvent.setup()
    
    render(<LoginForm onSubmit={handleSubmit} />)
    
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    expect(handleSubmit).toHaveBeenCalledWith('test@example.com')
  })
})
```

---

## Common Jest Matchers

### Value Comparisons

```typescript
expect(value).toBe(expected)              // Exact equality (===)
expect(value).toEqual(expected)           // Deep equality (for objects/arrays)
expect(value).not.toBe(unexpected)        // Negation
expect(value).toBeNull()                  // Null check
expect(value).toBeUndefined()             // Undefined check
expect(value).toBeDefined()               // Defined check
expect(value).toBeTruthy()                // Truthy value
expect(value).toBeFalsy()                 // Falsy value
```

### Numbers

```typescript
expect(value).toBeGreaterThan(3)
expect(value).toBeLessThan(10)
expect(value).toBeGreaterThanOrEqual(3.5)
expect(value).toBeCloseTo(0.3, 1)        // Floating point comparison
```

### Strings

```typescript
expect(string).toMatch(/pattern/)
expect(string).toContain('substring')
```

### Arrays

```typescript
expect(array).toContain(item)
expect(array).toHaveLength(3)
expect(array).toEqual(expect.arrayContaining([item1, item2]))
```

### Objects

```typescript
expect(object).toHaveProperty('key')
expect(object).toHaveProperty('key', value)
expect(object).toMatchObject({ key: value })
```

### Functions

```typescript
expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledTimes(2)
expect(fn).toHaveBeenCalledWith(arg1, arg2)
expect(fn).toThrow()
expect(fn).toThrow('Error message')
```

### DOM (React Testing Library)

```typescript
expect(element).toBeInTheDocument()
expect(element).toHaveClass('className')
expect(element).toHaveAttribute('attr', 'value')
expect(element).toBeDisabled()
expect(element).toBeEnabled()
expect(element).toHaveValue('value')
expect(element).toBeChecked()
```

---

## Common Testing Patterns

### Testing Async Functions

```typescript
it('should fetch data successfully', async () => {
  const data = await fetchData()
  expect(data).toEqual(expectedData)
})
```

### Testing Errors

```typescript
it('should throw error for invalid input', () => {
  expect(() => dangerousFunction()).toThrow()
  expect(() => dangerousFunction()).toThrow('Specific error message')
  expect(() => dangerousFunction()).toThrow(CustomError)
})
```

### Mocking Functions

```typescript
it('should call callback with correct arguments', () => {
  const mockCallback = jest.fn()
  
  processData(data, mockCallback)
  
  expect(mockCallback).toHaveBeenCalledWith(expectedArg)
})
```

### Testing Multiple Cases

```typescript
describe('formatCurrency', () => {
  test.each([
    [100, '$100.00'],
    [99.99, '$99.99'],
    [0, '$0.00'],
    [1000.5, '$1,000.50'],
  ])('formatCurrency(%i) should return %s', (input, expected) => {
    expect(formatCurrency(input)).toBe(expected)
  })
})
```

---

## Best Practices

### DO

- Write tests for all new functions and components
- Test edge cases and error conditions
- Use descriptive test names that explain the behavior
- Keep tests simple and focused (one assertion per test when possible)
- Run tests before pushing code
- Ensure tests pass before creating a PR

### DO NOT

- Test implementation details (test behavior, not internals)
- Write tests that depend on other tests (each test should be independent)
- Commit code with failing tests
- Skip writing tests because "it's simple code"
- Test third-party libraries (assume they work)

---

## Getting Help

- **Existing Examples:** See `lib/utils.test.ts` and `components/ui/button.test.tsx`
- **Jest Documentation:** https://jestjs.io/docs/getting-started
- **React Testing Library:** https://testing-library.com/react
- **Ask for Review:** If unsure about test coverage, ask during PR review

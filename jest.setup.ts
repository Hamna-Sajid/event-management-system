// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Suppress React 18 act() warnings in tests
// These warnings are expected for async state updates in component tests
const originalError = console.error
beforeAll(() => {
    console.error = (...args: any[]) => {
        if (
            typeof args[0] === 'string' &&
            (args[0].includes('Warning: An update to') ||
                args[0].includes('inside a test was not wrapped in act'))
        ) {
            return
        }
        originalError.call(console, ...args)
    }
})

afterAll(() => {
    console.error = originalError
})

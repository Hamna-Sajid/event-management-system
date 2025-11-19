/**
 * @testSuite Footer
 * Test suite for Footer component
 * 
 * @remarks
 * Tests for the minimalist footer section covering:
 * - Semantic HTML structure (footer element)
 * - Copyright text display with current year
 * 
 * @testCoverage
 * - **Structure Tests**: Validates footer element exists
 * - **Content Tests**: Ensures copyright text with year 2025 renders
 * 
 * @edgeCases
 * - Copyright text must include year 2025
 * - Text must be in a paragraph element
 * 
 * @expectedValues
 * - 1 footer element
 * - 1 paragraph containing "2025"
 * - Copyright text: "© 2025 IBA Event Management System"
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import Footer from './footer'

describe('Footer', () => {
  it('should render as footer element', () => {
    const { container } = render(<Footer />)
    
    const footer = container.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })

  it('should render copyright text', () => {
    render(<Footer />)
    
    const paragraph = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && content.includes('2025')
    })
    expect(paragraph).toBeInTheDocument()
  })
})

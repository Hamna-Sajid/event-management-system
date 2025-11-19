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

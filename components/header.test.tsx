import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from './header'

describe('Header', () => {
  it('should render the logo and brand name', () => {
    render(<Header />)
    
    expect(screen.getByText('IE')).toBeInTheDocument()
    expect(screen.getByText('IEMS')).toBeInTheDocument()
  })

  it('should render search button', () => {
    const { container } = render(<Header />)
    
    // Search button doesn't have accessible name, check by class
    const searchButton = container.querySelector('button.glass')
    expect(searchButton).toBeInTheDocument()
  })

  it('should render login button', () => {
    render(<Header />)
    
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('should render sign up button', () => {
    render(<Header />)
    
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('should have sticky positioning', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    
    expect(header).toHaveClass('sticky', 'top-0', 'z-50')
  })

  it('should have backdrop blur effect', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    
    expect(header).toHaveClass('backdrop-blur-md')
  })

  it('should handle login button click', async () => {
    const user = userEvent.setup()
    render(<Header />)
    
    const loginButton = screen.getByRole('button', { name: /login/i })
    await user.click(loginButton)
    
    // Button should still be in the document after click
    expect(loginButton).toBeInTheDocument()
  })

  it('should handle sign up button click', async () => {
    const user = userEvent.setup()
    render(<Header />)
    
    const signUpButton = screen.getByRole('button', { name: /sign up/i })
    await user.click(signUpButton)
    
    // Button should still be in the document after click
    expect(signUpButton).toBeInTheDocument()
  })

  it('should apply correct button variants', () => {
    render(<Header />)
    
    const loginButton = screen.getByRole('button', { name: /login/i })
    const signUpButton = screen.getByRole('button', { name: /sign up/i })
    
    // Login should have ghost variant styling
    expect(loginButton).toHaveClass('text-[rgba(255,255,255,0.8)]')
    
    // Sign up should have primary styling
    expect(signUpButton).toHaveClass('bg-[#d02243]')
  })
})

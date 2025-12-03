import React from 'react'
import { render, screen } from '@testing-library/react'
import EditSocietyProfile from './page'

describe('EditSocietyProfile', () => {
  it('should render the placeholder text', () => {
    render(<EditSocietyProfile />)
    expect(screen.getByText('Edit Society Profile Page (Placeholder)')).toBeInTheDocument()
  })
})

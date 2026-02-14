import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LandingPage from './page'

// Mock the LandingLayout since it might have deeper dependencies
vi.mock('@/components/layout/LandingLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

describe('LandingPage', () => {
  it('renders the main heading', () => {
    render(<LandingPage />)
    expect(screen.getByText(/Women in Film, Television & Media/i)).toBeDefined()
  })

  it('renders the verification badge', () => {
    render(<LandingPage />)
    expect(screen.getByText(/Verified Film Professionals/i)).toBeDefined()
  })
})

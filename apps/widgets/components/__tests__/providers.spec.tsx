/**
 * Tests for Providers component.
 * Framework: Vitest
 * Library: React Testing Library
 *
 * Note: We import a local setup file rather than relying on a global config.
 */
import '../__tests__/setupTests'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Hoist mocks before importing the component module under test.
vi.mock('convex/react', () => ({
  ConvexProvider: ({ children, client }: any) => (
    <div data-testid="convex-provider" data-client-url={client?.url ?? ''}>{children}</div>
  ),
  ConvexReactClient: vi.fn().mockImplementation((url: string) => ({ url, _mock: true })),
}))

vi.mock('jotai', () => ({
  Provider: ({ children }: any) => <div data-testid="jotai-provider">{children}</div>,
}))

// Helper to import the component accounting for either providers.tsx or providers.test.tsx filename.
// We try providers first (common), then fallback to providers.test.
async function importProviders() {
  try {
    // Prefer conventional component filename
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('../providers')
  } catch {
    // Fallback to the filename from the diff if the repo has it that way
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('../providers.test')
  }
}

describe('Providers', () => {
  const originalEnv = process.env
  beforeEach(() => {
    process.env = { ...originalEnv }
    vi.clearAllMocks()
    vi.resetModules()
  })
  afterEach(() => {
    process.env = originalEnv
  })

  it('renders children', async () => {
    const { Providers } = await importProviders()
    render(
      <Providers>
        <div>Child Content</div>
      </Providers>
    )
    expect(screen.getByText('Child Content')).toBeInTheDocument()
  })

  it('wraps children with ConvexProvider and Jotai Provider', async () => {
    const { Providers } = await importProviders()
    render(
      <Providers>
        <div data-testid="kid">Kid</div>
      </Providers>
    )
    const convex = screen.getByTestId('convex-provider')
    const jotai = screen.getByTestId('jotai-provider')
    const kid = screen.getByTestId('kid')
    expect(convex).toBeInTheDocument()
    expect(jotai).toBeInTheDocument()
    expect(convex).toContainElement(jotai)
    expect(jotai).toContainElement(kid)
  })

  it('uses NEXT_PUBLIC_CONVEX_URL when defined', async () => {
    process.env.NEXT_PUBLIC_CONVEX_URL = 'https://my.convex.cloud'
    const convexModule = await import('convex/react')
    const { ConvexReactClient } = convexModule as any

    await importProviders() // import triggers client construction

    expect(ConvexReactClient).toHaveBeenCalledTimes(1)
    expect(ConvexReactClient).toHaveBeenCalledWith('https://my.convex.cloud')
  })

  it('falls back to empty string when NEXT_PUBLIC_CONVEX_URL is undefined', async () => {
    delete process.env.NEXT_PUBLIC_CONVEX_URL
    const convexModule = await import('convex/react')
    const { ConvexReactClient } = convexModule as any

    await importProviders()

    expect(ConvexReactClient).toHaveBeenCalledTimes(1)
    expect(ConvexReactClient).toHaveBeenCalledWith('')
  })

  it('does not recreate ConvexReactClient on multiple renders', async () => {
    const convexModule = await import('convex/react')
    const { ConvexReactClient } = convexModule as any
    const callsBefore = ConvexReactClient.mock.calls.length

    const { Providers } = await importProviders()
    render(<Providers><div>First</div></Providers>)
    render(<Providers><div>Second</div></Providers>)

    expect(ConvexReactClient.mock.calls.length).toBe(callsBefore)
  })

  it('accepts null/undefined and arrays of children', async () => {
    const { Providers } = await importProviders()
    expect(() => render(<Providers>{null}</Providers>)).not.toThrow()
    expect(() => render(<Providers>{undefined}</Providers>)).not.toThrow()

    render(
      <Providers>
        <div>One</div>
        <div>Two</div>
      </Providers>
    )
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.getByText('Two')).toBeInTheDocument()
  })

  it('exposes Convex client URL via mock attribute for sanity check', async () => {
    process.env.NEXT_PUBLIC_CONVEX_URL = 'invalid-url'
    const { Providers } = await importProviders()
    render(<Providers><div>Ok</div></Providers>)
    const convex = screen.getByTestId('convex-provider')
    expect(convex.getAttribute('data-client-url')).toBe('invalid-url')
  })
})
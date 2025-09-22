/**
 * Lightweight integration scenarios for Providers.
 * Framework: Vitest
 * Library: React Testing Library
 */
import '../__tests__/setupTests'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mocks
vi.mock('convex/react', () => ({
  ConvexProvider: ({ children, client }: any) => (
    <div data-testid="convex-provider" data-client-url={client?.url ?? ''}>{children}</div>
  ),
  ConvexReactClient: vi.fn().mockImplementation((url: string) => ({ url })),
}))
vi.mock('jotai', () => ({
  Provider: ({ children }: any) => <div data-testid="jotai-provider">{children}</div>,
}))

async function importProviders() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('../providers')
  } catch {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('../providers.test')
  }
}

describe('Providers integration', () => {
  it('supports React.Suspense boundaries', async () => {
    const { Providers } = await importProviders()
    const Lazy = React.lazy(() => Promise.resolve({ default: () => <div>Lazy OK</div> }))

    render(
      <Providers>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Lazy />
        </React.Suspense>
      </Providers>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('Lazy OK')).toBeInTheDocument())
  })

  it('mounts and unmounts cleanly', async () => {
    const { Providers } = await importProviders()
    const { unmount } = render(<Providers><div>Mount</div></Providers>)
    expect(screen.getByText('Mount')).toBeInTheDocument()
    expect(() => unmount()).not.toThrow()
  })
})
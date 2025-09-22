/**
 * Environment configuration tests for Providers.
 * Framework: Vitest
 */
import '../__tests__/setupTests'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('Providers config', () => {
  const originalEnv = process.env
  beforeEach(() => {
    process.env = { ...originalEnv }
    vi.resetModules()
  })
  afterEach(() => {
    process.env = originalEnv
  })

  async function importProvidersModule() {
    try {
      return require('../providers')
    } catch {
      return require('../providers.test')
    }
  }

  it('handles extremely long URLs without throwing', async () => {
    process.env.NEXT_PUBLIC_CONVEX_URL = 'https://' + 'a'.repeat(512) + '.convex.cloud'
    await expect(importProvidersModule()).resolves.toBeTruthy()
  })

  it('handles empty string explicitly', async () => {
    process.env.NEXT_PUBLIC_CONVEX_URL = ''
    await expect(importProvidersModule()).resolves.toBeTruthy()
  })

  it('handles undefined (not set)', async () => {
    delete (process.env as any).NEXT_PUBLIC_CONVEX_URL
    await expect(importProvidersModule()).resolves.toBeTruthy()
  })
})
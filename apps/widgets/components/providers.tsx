"use client"

import * as React from "react"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { Provider } from "jotai" 

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "")

/**
 * Wraps children with Convex and Jotai providers.
 *
 * Provides a ConvexReactClient context (using the shared `convex` client) and a Jotai Provider
 * so descendant components can use Convex hooks and Jotai atoms.
 *
 * @param children - React nodes to render inside both providers
 * @returns A JSX element that nests `children` inside `ConvexProvider` and `jotai`'s `Provider`
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <Provider>
        {children}
      </Provider>
    </ConvexProvider>
  )
}

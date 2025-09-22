Planned tests for Providers:
- Assumes React Testing Library with either Jest or Vitest (both compatible for the used APIs).
- Uses dynamic import and runner-agnostic resets (vi.resetModules or jest.resetModules) to handle top-level client creation based on env.
- Verifies: rendering children, resilience without NEXT_PUBLIC_CONVEX_URL, and Jotai Provider availability via an atom-based child.

After the repository context scripts run, we will align imports/paths and runner-specific utilities (e.g., jest.isolateModules) precisely to the project's setup and append any missing expectations (like toHaveTextContent/toBeInTheDocument setup).
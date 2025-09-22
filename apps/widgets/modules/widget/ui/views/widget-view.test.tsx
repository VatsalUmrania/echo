/**
 * WidgetView tests
 *
 * Framework & library: Jest + React Testing Library (RTL).
 * If this project uses Vitest, these tests should also run unchanged under Vitest,
 * since they rely on RTL and standard global expect/describe syntax.
 *
 * Coverage goals:
 * - Renders correct screen for each screenAtom value (happy paths).
 * - Renders nothing for unknown screen keys (edge case).
 * - Ensures the main container is present with expected classes.
 * - Mocks WidgetAuthScreen to isolate WidgetView.
 * - Validates that organizationId prop is accepted (even if not directly used).
 */

import React from "react"
import { render, screen } from "@testing-library/react"

// Mock Jotai's useAtomValue to control the screen state
jest.mock("jotai", () => {
  const actual = jest.requireActual("jotai")
  return {
    ...actual,
    useAtomValue: jest.fn(),
  }
})

// Mock the screenAtom import to avoid needing the actual atom module resolution
jest.mock("@/modules/widget/atoms/widget-atoms", () => ({
  screenAtom: {},
}))

// Mock WidgetAuthScreen to avoid rendering its internals
jest.mock("@/modules/widget/ui/screens/widget-auth-screen", () => ({
  WidgetAuthScreen: () => <div data-testid="widget-auth-screen">MockAuthScreen</div>,
}))

// Import after mocks so they take effect
import { useAtomValue } from "jotai"
import { WidgetView } from "@/modules/widget/ui/views/widget-view"

const castUseAtomValue = useAtomValue as unknown as jest.Mock

describe("WidgetView", () => {
  const organizationId = "org_123"

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders a main container with expected classes", () => {
    castUseAtomValue.mockReturnValue("loading")
    const { container } = render(<WidgetView organizationId={organizationId} />)

    const main = container.querySelector("main")
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass(
      "min-h-screen",
      "min-w-screen",
      "flex",
      "h-full",
      "w-full",
      "flex-col",
      "overflow-hidden",
      "rounded-xl",
      "border",
      "bg-muted"
    )
  })

  it("renders loading screen when screenAtom is 'loading'", () => {
    castUseAtomValue.mockReturnValue("loading")
    render(<WidgetView organizationId={organizationId} />)
    expect(screen.getByText(/TODO : Loading/i)).toBeInTheDocument()
  })

  it("renders error screen when screenAtom is 'error'", () => {
    castUseAtomValue.mockReturnValue("error")
    render(<WidgetView organizationId={organizationId} />)
    expect(screen.getByText(/TODO : ERROR/i)).toBeInTheDocument()
  })

  it("renders auth screen when screenAtom is 'auth'", () => {
    castUseAtomValue.mockReturnValue("auth")
    render(<WidgetView organizationId={organizationId} />)
    expect(screen.getByTestId("widget-auth-screen")).toBeInTheDocument()
    expect(screen.getByText("MockAuthScreen")).toBeInTheDocument()
  })

  it("renders voice screen when screenAtom is 'voice'", () => {
    castUseAtomValue.mockReturnValue("voice")
    render(<WidgetView organizationId={organizationId} />)
    expect(screen.getByText(/TODO : VOICE/i)).toBeInTheDocument()
  })

  it("renders inbox screen when screenAtom is 'inbox'", () => {
    castUseAtomValue.mockReturnValue("inbox")
    render(<WidgetView organizationId={organizationId} />)
    expect(screen.getByText(/TODO : INBOX/i)).toBeInTheDocument()
  })

  it("renders selection screen when screenAtom is 'selection'", () => {
    castUseAtomValue.mockReturnValue("selection")
    render(<WidgetView organizationId={organizationId} />)
    expect(screen.getByText(/TODO : SECLECTION/i)).toBeInTheDocument()
  })

  it("renders chat screen when screenAtom is 'chat'", () => {
    castUseAtomValue.mockReturnValue("chat")
    render(<WidgetView organizationId={organizationId} />)
    expect(screen.getByText(/TODO : CHAT/i)).toBeInTheDocument()
  })

  it("renders contact screen when screenAtom is 'contact'", () => {
    castUseAtomValue.mockReturnValue("contact")
    render(<WidgetView organizationId={organizationId} />)
    expect(screen.getByText(/TODO : CONTACT/i)).toBeInTheDocument()
  })

  it("renders nothing for an unknown screen key (edge case)", () => {
    castUseAtomValue.mockReturnValue("unknown-key")
    const { container } = render(<WidgetView organizationId={organizationId} />)
    // main exists, but it contains no text nodes from screenComponents
    const main = container.querySelector("main")
    expect(main).toBeInTheDocument()
    expect(main?.textContent?.trim()).toBe("")
  })

  it("accepts organizationId prop even if not directly used", () => {
    castUseAtomValue.mockReturnValue("loading")
    render(<WidgetView organizationId="org_test" />)
    // No assertion against org id in UI (not used), but ensures render doesn't throw.
    expect(screen.getByText(/TODO : Loading/i)).toBeInTheDocument()
  })
})
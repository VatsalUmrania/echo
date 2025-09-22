/**
 * Tests for WidgetView
 *
 * Framework/Libraries:
 * - Jest (test runner/mock) and Testing Library for React (rendering/assertions).
 * - If this repo uses Vitest, swap `jest` for `vi` and adjust config/imports.
 *
 * Coverage goals:
 * - Renders container consistently.
 * - Renders correct screen content for each possible screenAtom value.
 * - Renders WidgetAuthScreen when screen === "auth" (mocked to avoid heavy deps).
 * - Handles unexpected/unknown screen values gracefully (renders nothing inside <main>).
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";

// Mock Jotai's useAtomValue to control the current screen without real store/provider.
jest.mock("jotai", () => ({
  __esModule: true,
  useAtomValue: jest.fn(),
}));

// The component under test imports "@/modules/widget/atoms/widget-atoms" for screenAtom.
// To avoid path alias resolution issues in tests, provide a trivial mock export.
jest.mock("@/modules/widget/atoms/widget-atoms", () => ({
  __esModule: true,
  screenAtom: {}, // only identity is used; value is supplied by mocked useAtomValue
}));

// Mock the WidgetAuthScreen to a lightweight test double we can assert on.
jest.mock("@/modules/widget/ui/screens/widget-auth-screen", () => ({
  __esModule: true,
  WidgetAuthScreen: () => <div data-testid="widget-auth-screen">MockAuth</div>,
}));

// Import after mocks so the component gets mocked dependencies.
import { WidgetView } from "./widget-view";
import { useAtomValue } from "jotai";

const mockedUseAtomValue = useAtomValue as unknown as jest.MockedFunction<typeof useAtomValue>;

describe("WidgetView", () => {
  const renderView = (screenValue: string, organizationId = "org_123") => {
    mockedUseAtomValue.mockReturnValue(screenValue as any);
    return render(<WidgetView organizationId={organizationId} />);
  };

  it("renders the main container with expected classes", () => {
    renderView("loading");
    const main = screen.getByRole("main");
    // Spot-check critical classes; avoid over-coupling to exact full class string.
    expect(main).toHaveClass("min-h-screen");
    expect(main).toHaveClass("flex");
    expect(main).toHaveClass("rounded-xl");
    expect(main).toHaveClass("bg-muted");
  });

  it("renders loading state when screen is 'loading'", () => {
    renderView("loading");
    const main = screen.getByRole("main");
    expect(within(main).getByText(/TODO\s*:\s*Loading/i)).toBeInTheDocument();
  });

  it("renders error state when screen is 'error'", () => {
    renderView("error");
    const main = screen.getByRole("main");
    expect(within(main).getByText(/TODO\s*:\s*ERROR/i)).toBeInTheDocument();
  });

  it("renders auth screen when screen is 'auth' (WidgetAuthScreen)", () => {
    renderView("auth");
    expect(screen.getByTestId("widget-auth-screen")).toBeInTheDocument();
    expect(screen.getByTestId("widget-auth-screen")).toHaveTextContent("MockAuth");
  });

  it("renders voice placeholder when screen is 'voice'", () => {
    renderView("voice");
    expect(screen.getByText(/TODO\s*:\s*VOICE/i)).toBeInTheDocument();
  });

  it("renders inbox placeholder when screen is 'inbox'", () => {
    renderView("inbox");
    expect(screen.getByText(/TODO\s*:\s*INBOX/i)).toBeInTheDocument();
  });

  it("renders selection placeholder when screen is 'selection'", () => {
    renderView("selection");
    expect(screen.getByText(/TODO\s*:\s*SECLECTION/i)).toBeInTheDocument();
  });

  it("renders chat placeholder when screen is 'chat'", () => {
    renderView("chat");
    expect(screen.getByText(/TODO\s*:\s*CHAT/i)).toBeInTheDocument();
  });

  it("renders contact placeholder when screen is 'contact'", () => {
    renderView("contact");
    expect(screen.getByText(/TODO\s*:\s*CONTACT/i)).toBeInTheDocument();
  });

  it("renders no inner content for unknown screen values (graceful fallback)", () => {
    renderView("unknown_value");
    const main = screen.getByRole("main");
    // Should not find any of the known placeholders or the auth screen.
    const unexpected = [/ERROR/i, /Loading/i, /VOICE/i, /INBOX/i, /SECLECTION/i, /CHAT/i, /CONTACT/i];
    unexpected.forEach((re) => {
      expect(within(main).queryByText(re)).toBeNull();
    });
    expect(within(main).queryByTestId("widget-auth-screen")).toBeNull();
  });

  it("accepts and ignores organizationId prop safely (no crash)", () => {
    renderView("loading", "org_custom_999");
    // If it renders, prop handling is safe even if unused.
    expect(screen.getByText(/TODO\s*:\s*Loading/i)).toBeInTheDocument();
  });
});
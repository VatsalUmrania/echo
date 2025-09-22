/* NOTE: Tests assume WidgetAuthScreen is exported from ./widget-auth-screen. Adjust import if component lives elsewhere. */
/**
 * Tests for WidgetAuthScreen
 *
 * Detected/assumed testing stack: Jest or Vitest + @testing-library/react + JSDOM.
 * - We follow Testing Library conventions (screen/getBy*, userEvent).
 * - Lightweight mocks for convex/react and workspace UI components.
 */
import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Try to import the component from the sibling TSX; fallback to local export if test co-located.
import * as MaybeModule from "./widget-auth-screen";
const WidgetAuthScreen: React.ComponentType =
  // @ts-expect-error runtime resolution if named export available
  (MaybeModule.WidgetAuthScreen || (MaybeModule as any).default || (() => null));

// Mock UI primitives to simple elements that preserve props
jest.mock("@workspace/ui/components/button", () => ({
  Button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props} />
  )
}));
jest.mock("@workspace/ui/components/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  )
}));
jest.mock("@workspace/ui/components/form", () => {
  const React = require("react");
  return {
    Form: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    FormControl: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    FormField: ({ render }: any) => render({ field: { name: "", value: "", onChange: () => {}, onBlur: () => {} } }),
    FormItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    FormMessage: ({ children }: { children?: React.ReactNode }) => <span role="alert">{children}</span>,
  };
});
jest.mock("@/modules/widget/ui/components/widget-header", () => ({
  WidgetHeader: ({ children }: { children: React.ReactNode }) => <header>{children}</header>
}));

// Capture and control useMutation behavior
const createContactSessionMock = jest.fn();
jest.mock("convex/react", () => ({
  useMutation: () => createContactSessionMock
}));

// Provide stable environment values for metadata
const setupEnv = (overrides: Partial<Window & typeof globalThis> = {}) => {
  // languages join should be ", "
  Object.defineProperty(window.navigator, "languages", {
    configurable: true,
    get: () => ["en-US", "fr-FR"],
  });
  Object.defineProperty(window.navigator, "language", {
    configurable: true,
    get: () => "en-US",
  });
  Object.defineProperty(window.navigator, "userAgent", {
    configurable: true,
    get: () => "jest-test-agent",
  });
  Object.defineProperty(window.navigator, "platform", {
    configurable: true,
    get: () => "MacIntel",
  });
  Object.defineProperty(window.navigator, "vendor", {
    configurable: true,
    get: () => "Apple Computer, Inc.",
  });
  Object.defineProperty(window.navigator, "cookieEnabled", {
    configurable: true,
    get: () => true,
  });
  // window.location.href used as currentUrl
  delete (window as any).location;
  (window as any).location = { href: "https://example.com/path" };
  // screen + viewport
  (global as any).screen = { width: 1920, height: 1080 };
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 768 });
  // timezone
  jest.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({ timeZone: "America/Los_Angeles" } as any);
  // timezoneOffset
  jest.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(420 as any);

  Object.assign(window, overrides);
};

describe("WidgetAuthScreen", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    setupEnv();
  });

  test("renders header and form fields", () => {
    render(<WidgetAuthScreen />);
    expect(screen.getByRole("heading", { level: 1, name: /hi there/i })).toBeInTheDocument();
  });
});
describe("WidgetAuthScreen - behavior", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    // Re-setup env for each test
    (Intl.DateTimeFormat.prototype.resolvedOptions as any).mockReturnValue?.({ timeZone: "America/Los_Angeles" });
    (Date.prototype.getTimezoneOffset as any).mockReturnValue?.(420);
  });

  const renderScreen = () => render(<WidgetAuthScreen />);

  it("shows validation errors for empty submission", async () => {
    const user = userEvent.setup();
    renderScreen();

    // Click Continue without filling fields
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Expect zod/react-hook-form to surface messages
    // Name has custom message; email uses zod's "Invalid email address"
    await screen.findByText("Name is required");
    await screen.findByText("Invalid email address");
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    renderScreen();

    const nameInput = screen.getByPlaceholderText(/john doe/i);
    const emailInput = screen.getByPlaceholderText(/john\.doe@example\.com/i);

    await user.type(nameInput, "Jane Doe");
    await user.type(emailInput, "not-an-email");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await screen.findByText("Invalid email address");
    expect(createContactSessionMock).not.toHaveBeenCalled();
  });

  it("submits with valid inputs and passes correct metadata", async () => {
    const user = userEvent.setup();
    createContactSessionMock.mockResolvedValueOnce("contact_session_123");

    renderScreen();

    const nameInput = screen.getByPlaceholderText(/john doe/i);
    const emailInput = screen.getByPlaceholderText(/john\.doe@example\.com/i);

    await user.type(nameInput, "Jane Doe");
    await user.type(emailInput, "jane@example.com");

    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => expect(createContactSessionMock).toHaveBeenCalledTimes(1));

    const payload = createContactSessionMock.mock.calls[0][0];
    expect(payload).toMatchObject({
      name: "Jane Doe",
      email: "jane@example.com",
      organizationId: "123",
      metadata: expect.any(Object),
    });

    // Validate diff-sensitive metadata fields
    expect(payload.metadata.languages).toBe("en-US, fr-FR"); // comma + space
    expect(payload.metadata.currentUrl).toBe("https://example.com/path"); // window.location.href
    expect(payload.metadata.userAgent).toBe("jest-test-agent");
    expect(payload.metadata.screenResolution).toBe("1920x1080");
    expect(payload.metadata.viewportSize).toBe("1024x768");
    expect(payload.metadata.timezone).toBe("America/Los_Angeles");
    expect(payload.metadata.timezoneOffset).toBe(420);
    expect(payload.metadata.cookiesEnabled).toBe(true);
  });

  it("disables the submit button while submitting", async () => {
    // Simulate a slow network call to observe isSubmitting toggle
    let resolvePromise: (v: any) => void;
    const pending = new Promise(res => { resolvePromise = res; });
    // @ts-ignore
    createContactSessionMock.mockReturnValueOnce(pending);

    const user = userEvent.setup();
    renderScreen();

    await user.type(screen.getByPlaceholderText(/john doe/i), "Jane Doe");
    await user.type(screen.getByPlaceholderText(/john\.doe@example\.com/i), "jane@example.com");

    const button = screen.getByRole("button", { name: /continue/i });
    expect(button).toBeEnabled();

    await user.click(button);
    // After click, formState.isSubmitting should disable the button
    await waitFor(() => expect(button).toBeDisabled());

    // Resolve the mutation and ensure button re-enables
    // @ts-ignore
    resolvePromise("ok");
    await waitFor(() => expect(button).toBeEnabled());
  });

  it("logs an error when mutation fails but does not throw", async () => {
    const user = userEvent.setup();
    const error = new Error("boom");
    createContactSessionMock.mockRejectedValueOnce(error);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    renderScreen();

    await user.type(screen.getByPlaceholderText(/john doe/i), "Jane Doe");
    await user.type(screen.getByPlaceholderText(/john\.doe@example\.com/i), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(createContactSessionMock).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalled();
    });
  });
});
/**
 * Tests for WidgetAuthScreen
 *
 * Framework: Jest + React Testing Library
 * - We follow existing project conventions (RTL queries, jest mocks).
 * - External modules are mocked to avoid network/UI library coupling.
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// IMPORTANT: Import the component under test.
// If the component actually lives in a sibling file (widget-auth-screen.tsx), prefer that import.
// Fallback: relative import if alias resolution is configured.
import { WidgetAuthScreen } from "./widget-auth-screen";

// Mock convex/react useMutation to control resolution/rejection behavior.
const mockCreateContactSession = jest.fn();
jest.mock("convex/react", () => ({
  useMutation: () => mockCreateContactSession,
}));

// Mock UI components from workspace to minimal pass-throughs.
// These wrappers should not interfere with form behavior.
jest.mock("@workspace/ui/components/form", () => {
  const React = require("react");
  // Pass-through wrappers
  const Pass = ({ children }: any) => <>{children}</>;
  return {
    Form: ({ children }: any) => <>{children}</>,
    FormControl: Pass,
    FormField: ({ render }: any) => {
      // We cannot re-implement react-hook-form Controller here.
      // Instead, we rely on the actual component using react-hook-form directly.
      // To keep the render prop happy, we forward a naive field wrapper,
      // but the Input ultimately reads/writes via RHF from the component.
      // If your UI library's FormField is critical, remove this mock to use the real one.
      return <>{render({ field: {} as any })}</>;
    },
    FormItem: Pass,
    FormMessage: ({ children }: any) => <div aria-live="polite">{children}</div>,
  };
});

// Simplify other UI elements
jest.mock("@workspace/ui/components/button", () => ({
  Button: (props: any) => <button {...props} />,
}));
jest.mock("@workspace/ui/components/input", () => ({
  Input: (props: any) => <input {...props} />,
}));
jest.mock("@/modules/widget/ui/components/widget-header", () => ({
  WidgetHeader: ({ children }: any) => <div data-testid="widget-header">{children}</div>,
}));

// Mock backend api object shape used solely to bind useMutation(api.public.contactSession.create)
jest.mock("@workspace/backend/_generated/api", () => ({
  api: { public: { contactSession: { create: "public.contactSession.create" } } },
}));

// Ensure global objects for metadata are predictable across tests
const setBrowserEnv = (overrides?: Partial<{
  userAgent: string;
  language: string;
  languages: string[];
  platform: string;
  vendor: string;
  screen: { width: number; height: number };
  viewport: { innerWidth: number; innerHeight: number };
  timezone: string;
  cookieEnabled: boolean;
  href: string;
}>) => {
  const {
    userAgent = "Mozilla/5.0 (X11; TestOS) TestBrowser/1.0",
    language = "en-US",
    languages = ["en-US", "en"],
    platform = "TestPlatform",
    vendor = "TestVendor",
    screen = { width: 1920, height: 1080 },
    viewport = { innerWidth: 1280, innerHeight: 720 },
    timezone = "America/Los_Angeles",
    cookieEnabled = true,
    href = "https://example.com/widget",
  } = overrides || {};

  Object.defineProperty(window, "navigator", {
    value: {
      userAgent,
      language,
      languages,
      platform,
      vendor,
      cookieEnabled,
    },
    writable: true,
  });

  Object.defineProperty(window, "screen", {
    value: {
      width: screen.width,
      height: screen.height,
    },
    writable: true,
  });

  Object.defineProperty(window, "innerWidth", { value: viewport.innerWidth, writable: true });
  Object.defineProperty(window, "innerHeight", { value: viewport.innerHeight, writable: true });

  // jsdom allows redefining window.location in tests
  Object.defineProperty(window, "location", {
    value: { href },
    writable: true,
  });

  // Mock timezone API
  const tzOpts = { resolvedOptions: () => ({ timeZone: timezone }) };
  Object.defineProperty(Intl, "DateTimeFormat", {
    value: function IntlDateTimeFormat() {
      return tzOpts;
    },
    writable: true,
  });
};

describe("WidgetAuthScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setBrowserEnv();
  });

  test("renders header, fields and submit button", () => {
    render(<WidgetAuthScreen />);

    // Header
    expect(screen.getByTestId("widget-header")).toBeInTheDocument();
    expect(screen.getByText("Hi there\! 👋🏼")).toBeInTheDocument();
    expect(screen.getByText("Let’s get you started")).toBeInTheDocument();

    // Fields
    expect(screen.getByPlaceholderText("e.g. John Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. john.doe@example.com")).toBeInTheDocument();

    // Submit button
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", async () => {
    render(<WidgetAuthScreen />);
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    // Email error message is "Invalid email address"
    expect(await screen.findByText("Invalid email address")).toBeInTheDocument();
    expect(mockCreateContactSession).not.toHaveBeenCalled();
  });

  test("shows email validation error for malformed email, name ok", async () => {
    render(<WidgetAuthScreen />);

    await userEvent.type(screen.getByPlaceholderText("e.g. John Doe"), "Jane Tester");
    await userEvent.type(screen.getByPlaceholderText("e.g. john.doe@example.com"), "not-an-email");
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByText("Invalid email address")).toBeInTheDocument();
    expect(mockCreateContactSession).not.toHaveBeenCalled();
  });

  test("submits successfully with valid inputs and passes expected payload including metadata", async () => {
    mockCreateContactSession.mockResolvedValueOnce("cs_123");

    // Custom browser env for assertion
    setBrowserEnv({
      userAgent: "UnitTestBrowser/2.0",
      language: "en-US",
      languages: ["en-US", "fr-FR"],
      platform: "UnitTestOS",
      vendor: "UnitVendor",
      screen: { width: 1366, height: 768 },
      viewport: { innerWidth: 1024, innerHeight: 640 },
      timezone: "America/New_York",
      href: "https://example.org/start",
      cookieEnabled: true,
    });

    render(<WidgetAuthScreen />);

    await userEvent.type(screen.getByPlaceholderText("e.g. John Doe"), "John Doe");
    await userEvent.type(screen.getByPlaceholderText("e.g. john.doe@example.com"), "john.doe@example.com");

    // Button should toggle disabled while submitting
    const submitBtn = screen.getByRole("button", { name: /continue/i });
    expect(submitBtn).toBeEnabled();

    await userEvent.click(submitBtn);
    // isSubmitting may flip quickly; assert via waitFor
    await waitFor(() => expect(mockCreateContactSession).toHaveBeenCalledTimes(1));

    const payload = mockCreateContactSession.mock.calls[0][0];
    expect(payload).toMatchObject({
      name: "John Doe",
      email: "john.doe@example.com",
      organizationId: "123",
    });

    // Metadata assertions (spot-check most important fields)
    expect(payload.metadata).toMatchObject({
      userAgent: "UnitTestBrowser/2.0",
      language: "en-US",
      languages: "en-US, fr-FR",
      platform: "UnitTestOS",
      vendor: "UnitVendor",
      screenResolution: "1366x768",
      viewportSize: "1024x640",
      timezone: "America/New_York",
      cookiesEnabled: true,
      currentUrl: "https://example.org/start",
    });
    expect(typeof payload.metadata.timezoneOffset).toBe("number");
    expect(submitBtn).toBeEnabled(); // back to enabled after resolve
  });

  test("logs error when mutation rejects", async () => {
    const error = new Error("network unavailable");
    mockCreateContactSession.mockRejectedValueOnce(error);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<WidgetAuthScreen />);

    await userEvent.type(screen.getByPlaceholderText("e.g. John Doe"), "Error Case");
    await userEvent.type(screen.getByPlaceholderText("e.g. john.doe@example.com"), "error@example.com");
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(mockCreateContactSession).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
        "Failed to create contact session:",
        error
      );
    });

    errorSpy.mockRestore();
  });
});

// -----------------------------------------------------------------------------
// Auto-generated tests for apps/widgets/modules/widget/constants.test.ts
// Testing framework: Jest or Vitest (globals API). If using Vitest without globals,
// enable `globals: true` in vitest.config.* or import the APIs locally.
// -----------------------------------------------------------------------------

// Ambient declarations to keep TypeScript happy regardless of framework typings
declare const describe: any;
declare const it: any;
declare const expect: any;

// Utility types for compile-time type assertions (no runtime effect)
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false;
type Expect<T extends true> = T;

// Compile-time guarantees (fail compilation if types drift)
export type __WidgetScreens_ExactTuple = Expect<
  Equal<
    typeof WIDGET_SCREENS,
    readonly ["error","loading","selection","voice","auth","inbox","chat","contact"]
  >
>;
export type __WidgetScreens_Union = Expect<
  Equal<
    (typeof WIDGET_SCREENS)[number],
    "error" | "loading" | "selection" | "voice" | "auth" | "inbox" | "chat" | "contact"
  >
>;
export type __ContactSessionKey_Literal = Expect<
  Equal<typeof CONTACT_SESSION_KEY, "echo_contact_session">
>;

describe("widget/constants", () => {
  it("WIDGET_SCREENS matches the exact, ordered list of widget screens", () => {
    const expected = [
      "error",
      "loading",
      "selection",
      "voice",
      "auth",
      "inbox",
      "chat",
      "contact"
    ] as const;

    expect(WIDGET_SCREENS).toEqual(expected);
  });

  it("WIDGET_SCREENS has no duplicates and length is stable", () => {
    expect(Array.isArray(WIDGET_SCREENS)).toBe(true);
    expect(WIDGET_SCREENS.length).toBe(8);
    expect(new Set(WIDGET_SCREENS).size).toBe(8);
  });

  it("WIDGET_SCREENS only contains lowercase, trimmed, non-empty strings", () => {
    for (const s of WIDGET_SCREENS) {
      expect(typeof s).toBe("string");
      expect(s).toBe(s.trim());
      expect(s).toBe(s.toLowerCase());
      expect(s.length).toBeGreaterThan(0);
    }
  });

  it("WIDGET_SCREENS does not contain unknown states", () => {
    const unknowns = ["settings", "help", "profile", "home"];
    for (const u of unknowns) {
      expect(WIDGET_SCREENS).not.toContain(u);
    }
  });

  it("Mutating a copy does not affect the original WIDGET_SCREENS", () => {
    const copy = [...WIDGET_SCREENS];
    // Mutate the copy
    (copy as string[]).push("settings");
    expect(copy.length).toBe(9);
    // Original remains unchanged
    expect(WIDGET_SCREENS.length).toBe(8);
    expect(WIDGET_SCREENS).not.toContain("settings");
  });

  it("CONTACT_SESSION_KEY has the expected value and format", () => {
    expect(CONTACT_SESSION_KEY).toBe("echo_contact_session");
    expect(/^[a-z0-9_]+$/.test(CONTACT_SESSION_KEY)).toBe(true);
    expect(CONTACT_SESSION_KEY.startsWith("echo_")).toBe(true);
    expect(CONTACT_SESSION_KEY.includes("contact")).toBe(true);
    expect(CONTACT_SESSION_KEY.endsWith("_session")).toBe(true);
  });
});
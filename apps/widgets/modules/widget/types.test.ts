
// ---------------------------------------------------------------------------
// Generated tests (2025-09-22):
// Testing library/framework note:
// - These tests use Jest/Vitest-style globals (describe/it/expect) and avoid
//   framework-specific helpers, so they run under either Jest or Vitest as-is.
// - If your setup does not expose globals, enable them (Vitest: globals: true)
//   or import from the respective test framework in your project-wide test setup.
// ---------------------------------------------------------------------------

describe("WIDGET_SCREENS constant and type", () => {
  it("is an array with at least one entry", () => {
    expect(Array.isArray(WIDGET_SCREENS)).toBe(true);
    expect(WIDGET_SCREENS.length).toBeGreaterThan(0);
  });

  it("contains only non-empty, trimmed primitive strings", () => {
    for (const s of WIDGET_SCREENS) {
      // runtime type checks
      expect(typeof s).toBe("string");
      // no blank strings
      expect(s).not.toBe("");
      // no leading/trailing whitespace
      expect(s.trim()).toBe(s);
      // ensure it's a primitive string, not a String object
      expect(Object.prototype.toString.call(s)).toBe("[object String]");
    }
  });

  it("has no duplicate entries", () => {
    const unique = new Set(WIDGET_SCREENS);
    expect(unique.size).toBe(WIDGET_SCREENS.length);
  });

  it("is stable across operations that should not mutate the source", () => {
    const snapshot = [...WIDGET_SCREENS];
    // Non-mutating operations shouldn't alter the source reference
    // (This guards against inadvertent in-place mutations in code using this constant.)
    const mapped = WIDGET_SCREENS.map((x) => x);
    expect(mapped).toEqual(snapshot);
    expect(WIDGET_SCREENS).toEqual(snapshot);
  });
});

// ---------------- Type-level safety checks (compile-time only) ----------------
// These checks do not run at runtime; they ensure the exported type alias
// continues to mirror the runtime constant's element union.
//
// DO NOT remove: if the alias stops reflecting the constant, TypeScript will fail.
type _ValueUnion = (typeof WIDGET_SCREENS)[number];

// Minimal type equality helper
type _Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false;

// Compile-time assertion utility
type _Assert<T extends true> = T;

// Ensures the exported alias `WIDGET_SCREENS` (type) remains in sync with the
// value-derived union type from the constant.
type _WidgetScreensTypeIsSynced = _Assert<_Equal<WIDGET_SCREENS, _ValueUnion>>;
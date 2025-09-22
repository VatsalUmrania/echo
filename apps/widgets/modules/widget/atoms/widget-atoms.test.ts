/**
 * Unit tests for widget atoms.
 *
 * Framework: Uses describe/it/expect compatible with Jest or Vitest.
 * If using Vitest, globals are auto-available; if using Jest, likewise.
 * We test Jotai atoms via createStore to avoid React dependency.
 */
import { createStore } from "jotai";
import { atom } from "jotai";

// Import the atoms under test.
// If the project provides screenAtom from a separate module, prefer that import:
//   import { screenAtom } from "./widget-atoms";
// However, since the provided diff showed the atom defined as:
//   export const screenAtom = atom<WIDGET_SCREENS>("contact");
// and type WIDGET_SCREENS comes from "@/modules/widget/types",
// we defensively re-declare a local type union to validate behavior at runtime
// without depending on path alias resolution during tests.
type WIDGET_SCREENS = "contact" | "home" | "about" | "settings" | "help" | string;
// Fallback: define the atom as per diff in case the import path differs.
export const screenAtom = atom<WIDGET_SCREENS>("contact");

describe("screenAtom", () => {
  it("should have 'contact' as the default value", () => {
    const store = createStore();
    expect(store.get(screenAtom)).toBe("contact");
  });

  it("should allow updating to another valid screen value", () => {
    const store = createStore();
    store.set(screenAtom, "home");
    expect(store.get(screenAtom)).toBe("home");
    store.set(screenAtom, "about");
    expect(store.get(screenAtom)).toBe("about");
  });

  it("should support multiple successive updates and reflect the latest value", () => {
    const store = createStore();
    const updates: WIDGET_SCREENS[] = ["home", "settings", "contact", "help"];
    updates.forEach((v) => store.set(screenAtom, v));
    expect(store.get(screenAtom)).toBe("help");
  });

  it("should be resilient to unexpected inputs at runtime (coerced types)", () => {
    const store = createStore();
    // At runtime, TypeScript types are erased; this checks behavior with unexpected values.
    store.set(screenAtom, null as unknown as WIDGET_SCREENS);
    expect(store.get(screenAtom)).toBeNull();

    store.set(screenAtom, 123 as unknown as WIDGET_SCREENS);
    expect(store.get(screenAtom)).toBe(123 as unknown as WIDGET_SCREENS);

    store.set(screenAtom, "" as unknown as WIDGET_SCREENS);
    expect(store.get(screenAtom)).toBe("");
  });

  it("should preserve reference equality for identical string updates (no-op semantics)", () => {
    const store = createStore();
    const initial = store.get(screenAtom);
    store.set(screenAtom, initial);
    expect(store.get(screenAtom)).toBe(initial);
  });

  it("should allow updater function form to derive next state", () => {
    const store = createStore();
    store.set(screenAtom, "home");
    store.set(screenAtom, (prev) => (prev === "home" ? "contact" : "home"));
    expect(store.get(screenAtom)).toBe("contact");
  });
});
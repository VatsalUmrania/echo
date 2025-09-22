/** Jotai atoms are framework-agnostic and work in Node without a DOM; no React renderer is needed for these tests. */
/**
 * Testing framework: Vitest
 * This project appears to use Vitest. Tests import describe/it/expect from "vitest".
 */
import { describe, it, expect } from "vitest";

/**
 * Test Target: screenAtom (Jotai)
 * File: apps/widgets/modules/widget/atoms/widget-atoms.ts
 *
 * Scenarios:
 *  - Initializes to default value "contact"
 *  - Updates to another value and notifies subscribers
 *  - Store isolation: changes in one store do not affect another
 *  - Can be set back to default value
 *
 * Note: Testing library/framework detected: Vitest.
 */

import { createStore } from "jotai";
import { screenAtom } from "./widget-atoms";

// Use a helper to subscribe and capture changes
function subscribeAndCollect<T>(store: ReturnType<typeof createStore>, anAtom: any) {
  const values: T[] = [];
  const unsub = store.sub(anAtom, () => {
    values.push(store.get(anAtom));
  });
  return { values, unsub };
}

describe("widget-atoms: screenAtom", () => {
  it("should initialize with default value \"contact\"", () => {
    const store = createStore();
    const val = store.get(screenAtom);
    expect(val).toBe("contact");
  });

  it("should update value and notify subscribers", () => {
    const store = createStore();
    const { values, unsub } = subscribeAndCollect<string>(store, screenAtom);

    const initial = store.get(screenAtom);
    expect(initial).toBe("contact");

    // Update to a different screen value; we use a string to validate runtime behavior.
    // If the WIDGET_SCREENS type is stricter, the source module enforces it at compile-time.
    store.set(screenAtom, "home" as unknown as any);

    // Latest value should be reflected
    expect(store.get(screenAtom)).toBe("home");
    // Subscriber should have been notified at least once
    expect(values.length).toBeGreaterThanOrEqual(1);
    expect(values[values.length - 1]).toBe("home");

    unsub();
  });

  it("should maintain isolation across independent stores", () => {
    const storeA = createStore();
    const storeB = createStore();

    // Sanity: both start at default
    expect(storeA.get(screenAtom)).toBe("contact");
    expect(storeB.get(screenAtom)).toBe("contact");

    // Change only in storeA
    storeA.set(screenAtom, "support" as unknown as any);

    expect(storeA.get(screenAtom)).toBe("support");
    // storeB should remain unaffected
    expect(storeB.get(screenAtom)).toBe("contact");
  });

  it("should reset back to default value by explicit set", () => {
    const store = createStore();
    store.set(screenAtom, "faq" as unknown as any);
    expect(store.get(screenAtom)).toBe("faq");

    // Explicitly set back to default
    store.set(screenAtom, "contact" as unknown as any);
    expect(store.get(screenAtom)).toBe("contact");
  });
});

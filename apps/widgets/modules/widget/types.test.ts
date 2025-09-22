/**
 * Tests for WIDGET_SCREENS constant and related type behavior.
 *
 * Testing library/framework note:
 * - These tests are written in a style compatible with Vitest/Jest:
 *   - If using Vitest, import { describe, it, expect } from 'vitest'.
 *   - If using Jest with globals, you may remove the import and rely on globals.
 * Adjust the import below to match the repository's standard if different.
 */
import { describe, it, expect } from "vitest";
import { WIDGET_SCREENS as SCREENS } from "@/modules/widget/constants";

// Helper to get type/shape at runtime
const isStringArray = (val: unknown): val is string[] =>
  Array.isArray(val) && val.every(v => typeof v === "string");

describe("WIDGET_SCREENS constant", () => {
  it("should be defined and be an array of strings", () => {
    expect(SCREENS).toBeDefined();
    expect(Array.isArray(SCREENS)).toBe(true);
    expect(isStringArray(SCREENS)).toBe(true);
  });

  it("should contain at least one screen", () => {
    expect(SCREENS.length).toBeGreaterThan(0);
  });

  it("should not contain duplicates (all screen names are unique)", () => {
    const set = new Set(SCREENS);
    expect(set.size).toBe(SCREENS.length);
  });

  it("should not contain empty or whitespace-only entries", () => {
    const invalid = SCREENS.filter(s => s.trim().length === 0);
    expect(invalid).toHaveLength(0);
  });

  it("should have stable, sorted order if the project expects sorted lists", () => {
    // If the project relies on stable order, this test will guard against accidental reordering.
    // If order is intentionally unsorted, adjust/remove this test.
    const sorted = [...SCREENS].sort((a, b) => a.localeCompare(b));
    expect(SCREENS).toEqual(sorted);
  });

  it("should only include allowed token format (slug-like: lowercase, alphanumerics, dashes/underscores)", () => {
    const regex = new RegExp('^[a-z0-9]+(?:[-_][a-z0-9]+)*$');
    const bad = SCREENS.filter(s => !regex.test(s));
    expect(bad).toHaveLength(0);
  });
});

describe("WIDGET_SCREENS regressions and invariants", () => {
  it("should not exceed reasonable length per entry (guard against accidentally dumping large strings)", () => {
    const tooLong = SCREENS.filter(s => s.length > 64);
    expect(tooLong).toHaveLength(0);
  });

  it("should not include obvious placeholder values", () => {
    const placeholders = new Set(["todo", "tbd", "placeholder", "lorem", "ipsum"]);
    const found = SCREENS.filter(s => placeholders.has(s.toLowerCase()));
    expect(found).toHaveLength(0);
  });
});

/**
 * Note about type-level coverage:
 * Runtime tests cannot directly assert TS types. The project may use type tests (e.g., tsd).
 * If such tooling exists, consider adding compile-time assertions separately.
 */
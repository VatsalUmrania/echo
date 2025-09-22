// Tests for widget constants
// Framework: Vitest (replace with Jest's @jest/globals if repository uses Jest)
import { describe, it, expect } from "vitest";

// Import the constants from the source module
// Adjust the import path if this file is relocated or if path aliases are configured.
import { WIDGET_SCREENS, CONTACT_SESSION_KEY } from "../constants";
describe("widget/constants", () => {
  describe("WIDGET_SCREENS", () => {
    it("should be defined and an array-like iterable", () => {
      expect(WIDGET_SCREENS).toBeDefined();
      // Array.isArray is true at runtime even for readonly tuples
      expect(Array.isArray(WIDGET_SCREENS)).toBe(true);
    });

    it("should contain the expected screens in the exact order", () => {
      const expected = [
        "error",
        "loading",
        "selection",
        "voice",
        "auth",
        "inbox",
        "chat",
        "contact",
      ];
      expect(WIDGET_SCREENS).toEqual(expected);
      // Spot-check first and last for order-sensitivity
      expect(WIDGET_SCREENS[0]).toBe("error");
      expect(WIDGET_SCREENS[WIDGET_SCREENS.length - 1]).toBe("contact");
      expect(WIDGET_SCREENS).toHaveLength(8);
    });

    it("should contain only unique, lowercase string values", () => {
      const seen = new Set<string>();
      for (const s of WIDGET_SCREENS as readonly string[]) {
        expect(typeof s).toBe("string");
        expect(s).toBe(s.toLowerCase());
        expect(seen.has(s)).toBe(false);
        seen.add(s);
      }
    });

    it("should not include unexpected values", () => {
      const unexpected = ["home", "settings", "profile", "search"];
      for (const u of unexpected) {
        expect((WIDGET_SCREENS as readonly string[]).includes(u)).toBe(false);
      }
    });

    it("should be stable across shallow copies (defensive checks)", () => {
      const copy = [...(WIDGET_SCREENS as readonly string[])];
      expect(copy).toEqual(WIDGET_SCREENS);
      // Mutating the copy should not change the original
      copy.reverse();
      expect(copy).not.toEqual(WIDGET_SCREENS);
    });
  });

  describe("CONTACT_SESSION_KEY", () => {
    it('should equal the exact key "echo_contact_session"', () => {
      expect(CONTACT_SESSION_KEY).toBe("echo_contact_session");
      expect(typeof CONTACT_SESSION_KEY).toBe("string");
      expect(CONTACT_SESSION_KEY.length).toBeGreaterThan(0);
    });

    it("should be namespaced with 'echo_' prefix convention", () => {
      expect(CONTACT_SESSION_KEY.startsWith("echo_")).toBe(true);
    });

    it("should be safe as a storage key (no whitespace or uppercase)", () => {
      expect(/\s/.test(CONTACT_SESSION_KEY)).toBe(false);
      expect(CONTACT_SESSION_KEY).toBe(CONTACT_SESSION_KEY.toLowerCase());
    });
  });
});

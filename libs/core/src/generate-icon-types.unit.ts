import { describe, expect, it, vi } from "vitest";
import { DEFAULT_PACKS, sanitizeIconName } from "./generate-icon-types";

// Mock fs module
vi.mock("node:fs", () => ({
  writeFileSync: vi.fn()
}));

describe("generate-icon-types", () => {
  describe("sanitizeIconName", () => {
    it("should convert kebab-case to PascalCase", () => {
      expect(sanitizeIconName("a-arrow-down")).toBe("AArrowDown");
      expect(sanitizeIconName("check-circle")).toBe("CheckCircle");
      expect(sanitizeIconName("heart")).toBe("Heart");
    });

    it("should handle single character names", () => {
      expect(sanitizeIconName("a")).toBe("A");
    });

    it("should handle multiple hyphens", () => {
      expect(sanitizeIconName("align-horizontal-distribute-center")).toBe(
        "AlignHorizontalDistributeCenter"
      );
    });

    it("should handle numbers", () => {
      expect(sanitizeIconName("2fa")).toBe("Icon2fa");
    });

    it("should handle empty string", () => {
      expect(sanitizeIconName("")).toBe("");
    });
  });

  describe("DEFAULT_PACKS", () => {
    it("should contain expected packs", () => {
      expect(DEFAULT_PACKS).toHaveProperty("Lucide");
      expect(DEFAULT_PACKS).toHaveProperty("Heroicons");
      expect(DEFAULT_PACKS).toHaveProperty("Tabler");
    });

    it("should have correct iconify prefixes", () => {
      expect(DEFAULT_PACKS.Lucide.iconifyPrefix).toBe("lucide");
      expect(DEFAULT_PACKS.Heroicons.iconifyPrefix).toBe("heroicons");
      expect(DEFAULT_PACKS.Tabler.iconifyPrefix).toBe("tabler");
    });
  });
});

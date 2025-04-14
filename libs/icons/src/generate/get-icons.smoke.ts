import { getIconSets } from "./get-icons";
import { describe, it, expect, beforeAll } from "vitest";
import type { IconifyJSON, IconifyIcon } from "@iconify/types";

// Smoke test to ensure the icon sets are loaded correctly
describe("getIconSets", () => {
  let iconSets: Record<string, IconifyJSON>;

  beforeAll(async () => {
    iconSets = await getIconSets();
  });

  it("should return a valid object", () => {
    expect(iconSets).toBeDefined();
    expect(typeof iconSets).toBe("object");
  });

  it("should load at least one icon set when @iconify/json is installed", () => {
    const setCount = Object.keys(iconSets).length;

    expect(setCount).toBeGreaterThan(0);
  });

  describe("icon structure", () => {
    let firstPrefix: string;
    let firstSet: IconifyJSON;

    beforeAll(() => {
      if (Object.keys(iconSets).length === 0) return;

      firstPrefix = Object.keys(iconSets)[0];
      firstSet = iconSets[firstPrefix];
    });

    it("should have valid IconifyJSON structure", () => {
      if (!firstSet) return;

      expect(firstSet).toHaveProperty("prefix");
      expect(firstSet).toHaveProperty("icons");
      expect(firstSet.prefix).toBe(firstPrefix);
    });

    it("should contain at least one icon", () => {
      if (!firstSet) return;

      const iconKeys = Object.keys(firstSet.icons);
      expect(iconKeys.length).toBeGreaterThan(0);
    });

    it("should have valid icon data format", () => {
      if (!firstSet) return;

      const iconKeys = Object.keys(firstSet.icons);
      const sampleIconKey = iconKeys[0];
      const sampleIcon = firstSet.icons[sampleIconKey] as IconifyIcon;

      expect(sampleIcon).toHaveProperty("body");
      expect(typeof sampleIcon.body).toBe("string");
      expect(sampleIcon.body.length).toBeGreaterThan(0);
      expect(sampleIcon.body).toContain("<");
    });

    it("should have width/height dimensions", () => {
      if (!firstSet) return;

      const iconKeys = Object.keys(firstSet.icons);
      const sampleIconKey = iconKeys[0];
      const sampleIcon = firstSet.icons[sampleIconKey] as IconifyIcon;

      const width = sampleIcon.width || firstSet.width;
      const height = sampleIcon.height || firstSet.height;

      expect(width || height).toBeDefined();
    });
  });
});

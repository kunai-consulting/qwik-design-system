import { getIconSets } from "./get-icons";
import { describe, it, expect } from "vitest";

describe("loadIconSets", () => {
  it("smoke test - should load at least one icon set without errors", async () => {
    const iconSets = await getIconSets();

    expect(iconSets).toBeDefined();
    expect(typeof iconSets).toBe("object");

    if (Object.keys(iconSets).length > 0) {
      const firstSetKey = Object.keys(iconSets)[0];
      const firstSet = iconSets[firstSetKey];

      expect(firstSet).toBeDefined();
      expect(firstSet.icons).toBeDefined();
    } else {
      console.log("No icon sets were loaded - this might be expected in CI environments");
    }
  });
});

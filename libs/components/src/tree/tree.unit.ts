import { describe, test, expect } from "vitest";
import { useTree } from "./use-tree";

describe("useTree", () => {
  test("getCurrentLevel returns correct level", () => {
    const { getCurrentLevel } = useTree();

    expect(getCurrentLevel(undefined)).toBe(1);
    expect(getCurrentLevel(0)).toBe(1);

    expect(getCurrentLevel(1)).toBe(1);
    expect(getCurrentLevel(2)).toBe(2);
    expect(getCurrentLevel(5)).toBe(5);
  });
});

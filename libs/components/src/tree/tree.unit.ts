// import { describe, test, expect, vi } from "vitest";
// import { useTree } from "./use-tree";

// describe("useTree", () => {
//   test("getCurrentLevel returns correct level", () => {
//     const { getCurrentLevel } = useTree();

//     // Should return 1 when level is undefined
//     expect(getCurrentLevel(undefined)).toBe(1);

//     // Should return 1 when level is 0 (falsy)
//     expect(getCurrentLevel(0)).toBe(1);

//     // Should return the provided level when it's a positive number
//     expect(getCurrentLevel(1)).toBe(1);
//     expect(getCurrentLevel(2)).toBe(2);
//     expect(getCurrentLevel(5)).toBe(5);
//   });
// });

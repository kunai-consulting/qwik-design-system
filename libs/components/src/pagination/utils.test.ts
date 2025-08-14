import { describe, expect, test } from "vitest";
import { createPaginationItems } from "./utils";

describe("createPaginationItems", () => {
  describe("input validation", () => {
    test("throws error for totalPages < 1", () => {
      expect(() => createPaginationItems({ centerPage: 1, totalPages: 0 })).toThrow(
        "Total pages must be at least 1"
      );
    });

    test("throws error for negative siblingCount", () => {
      expect(() =>
        createPaginationItems({ centerPage: 1, totalPages: 10, siblingCount: -1 })
      ).toThrow("Sibling count must be non-negative");
    });

    test("throws error for centerPage < 1", () => {
      expect(() => createPaginationItems({ centerPage: 0, totalPages: 10 })).toThrow(
        "Center page 0 is out of range [1, 10]"
      );
    });

    test("throws error for centerPage > totalPages", () => {
      expect(() => createPaginationItems({ centerPage: 11, totalPages: 10 })).toThrow(
        "Center page 11 is out of range [1, 10]"
      );
    });
  });

  describe("single page", () => {
    test("returns single page item when totalPages is 1", () => {
      const result = createPaginationItems({ centerPage: 1, totalPages: 1 });

      expect(result).toEqual([{ type: "page", page: 1, key: "page-1" }]);
    });
  });

  describe("small page counts (no separators needed)", () => {
    test("shows all pages for totalPages <= threshold with siblingCount 1", () => {
      const result = createPaginationItems({
        centerPage: 2,
        totalPages: 4,
        siblingCount: 1
      });

      expect(result).toEqual([
        { type: "page", page: 1, key: "page-1" },
        { type: "page", page: 2, key: "page-2" },
        { type: "page", page: 3, key: "page-3" },
        { type: "page", page: 4, key: "page-4" }
      ]);
    });

    test("shows all pages for totalPages = 5 with siblingCount 1", () => {
      const result = createPaginationItems({
        currentPage: 3,
        totalPages: 5,
        siblingCount: 1
      });

      expect(result).toEqual([
        { type: "page", page: 1, isCurrent: false, key: "page-1" },
        { type: "page", page: 2, isCurrent: false, key: "page-2" },
        { type: "page", page: 3, isCurrent: true, key: "page-3" },
        { type: "page", page: 4, isCurrent: false, key: "page-4" },
        { type: "page", page: 5, isCurrent: false, key: "page-5" }
      ]);
    });
  });

  describe("large page counts with separators", () => {
    test("shows left separator when current page is far from start", () => {
      const result = createPaginationItems({
        currentPage: 10,
        totalPages: 20,
        siblingCount: 1
      });

      expect(result).toEqual([
        { type: "page", page: 1, isCurrent: false, key: "page-1" },
        { type: "separator", key: "separator-left" },
        { type: "page", page: 9, isCurrent: false, key: "page-9" },
        { type: "page", page: 10, isCurrent: true, key: "page-10" },
        { type: "page", page: 11, isCurrent: false, key: "page-11" },
        { type: "separator", key: "separator-right" },
        { type: "page", page: 20, isCurrent: false, key: "page-20" }
      ]);
    });

    test("shows right separator when current page is far from end", () => {
      const result = createPaginationItems({
        currentPage: 3,
        totalPages: 20,
        siblingCount: 1
      });

      expect(result).toEqual([
        { type: "page", page: 1, isCurrent: false, key: "page-1" },
        { type: "page", page: 2, isCurrent: false, key: "page-2" },
        { type: "page", page: 3, isCurrent: true, key: "page-3" },
        { type: "page", page: 4, isCurrent: false, key: "page-4" },
        { type: "separator", key: "separator-right" },
        { type: "page", page: 20, isCurrent: false, key: "page-20" }
      ]);
    });

    test("shows both separators when current page is in middle", () => {
      const result = createPaginationItems({
        currentPage: 10,
        totalPages: 20,
        siblingCount: 1
      });

      expect(result).toEqual([
        { type: "page", page: 1, isCurrent: false, key: "page-1" },
        { type: "separator", key: "separator-left" },
        { type: "page", page: 9, isCurrent: false, key: "page-9" },
        { type: "page", page: 10, isCurrent: true, key: "page-10" },
        { type: "page", page: 11, isCurrent: false, key: "page-11" },
        { type: "separator", key: "separator-right" },
        { type: "page", page: 20, isCurrent: false, key: "page-20" }
      ]);
    });

    test("no left separator when pages are adjacent", () => {
      const result = createPaginationItems({
        currentPage: 3,
        totalPages: 10,
        siblingCount: 1
      });

      expect(result).toEqual([
        { type: "page", page: 1, isCurrent: false, key: "page-1" },
        { type: "page", page: 2, isCurrent: false, key: "page-2" },
        { type: "page", page: 3, isCurrent: true, key: "page-3" },
        { type: "page", page: 4, isCurrent: false, key: "page-4" },
        { type: "separator", key: "separator-right" },
        { type: "page", page: 10, isCurrent: false, key: "page-10" }
      ]);
    });

    test("no right separator when pages are adjacent", () => {
      const result = createPaginationItems({
        currentPage: 8,
        totalPages: 10,
        siblingCount: 1
      });

      expect(result).toEqual([
        { type: "page", page: 1, isCurrent: false, key: "page-1" },
        { type: "separator", key: "separator-left" },
        { type: "page", page: 7, isCurrent: false, key: "page-7" },
        { type: "page", page: 8, isCurrent: true, key: "page-8" },
        { type: "page", page: 9, isCurrent: false, key: "page-9" },
        { type: "page", page: 10, isCurrent: false, key: "page-10" }
      ]);
    });
  });

  describe("different siblingCount values", () => {
    test("siblingCount = 0 shows only current page in middle", () => {
      const result = createPaginationItems({
        currentPage: 5,
        totalPages: 10,
        siblingCount: 0
      });

      expect(result).toEqual([
        { type: "page", page: 1, isCurrent: false, key: "page-1" },
        { type: "separator", key: "separator-left" },
        { type: "page", page: 5, isCurrent: true, key: "page-5" },
        { type: "separator", key: "separator-right" },
        { type: "page", page: 10, isCurrent: false, key: "page-10" }
      ]);
    });

    test("siblingCount = 2 shows more pages around current", () => {
      const result = createPaginationItems({
        currentPage: 10,
        totalPages: 20,
        siblingCount: 2
      });

      expect(result).toEqual([
        { type: "page", page: 1, isCurrent: false, key: "page-1" },
        { type: "separator", key: "separator-left" },
        { type: "page", page: 8, isCurrent: false, key: "page-8" },
        { type: "page", page: 9, isCurrent: false, key: "page-9" },
        { type: "page", page: 10, isCurrent: true, key: "page-10" },
        { type: "page", page: 11, isCurrent: false, key: "page-11" },
        { type: "page", page: 12, isCurrent: false, key: "page-12" },
        { type: "separator", key: "separator-right" },
        { type: "page", page: 20, isCurrent: false, key: "page-20" }
      ]);
    });
  });

  describe("edge cases", () => {
    test("first page selected", () => {
      const result = createPaginationItems({ currentPage: 1, totalPages: 10 });

      expect(result).toEqual([
        { type: "page", page: 1, isCurrent: true, key: "page-1" },
        { type: "page", page: 2, isCurrent: false, key: "page-2" },
        { type: "separator", key: "separator-right" },
        { type: "page", page: 10, isCurrent: false, key: "page-10" }
      ]);
    });

    test("last page selected", () => {
      const result = createPaginationItems({ currentPage: 10, totalPages: 10 });

      expect(result).toEqual([
        { type: "page", page: 1, isCurrent: false, key: "page-1" },
        { type: "separator", key: "separator-left" },
        { type: "page", page: 9, isCurrent: false, key: "page-9" },
        { type: "page", page: 10, isCurrent: true, key: "page-10" }
      ]);
    });

    test("two pages total", () => {
      const result = createPaginationItems({ currentPage: 2, totalPages: 2 });

      expect(result).toEqual([
        { type: "page", page: 1, isCurrent: false, key: "page-1" },
        { type: "page", page: 2, isCurrent: true, key: "page-2" }
      ]);
    });
  });

  describe("unique keys", () => {
    test("all items have unique keys", () => {
      const result = createPaginationItems({
        currentPage: 10,
        totalPages: 20,
        siblingCount: 2
      });
      const keys = result.map((item) => item.key);
      const uniqueKeys = new Set(keys);

      expect(keys.length).toBe(uniqueKeys.size);
    });
  });
});

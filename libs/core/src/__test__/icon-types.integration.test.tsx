import { describe, expect, it } from "vitest";

// This test verifies that the generated icon types work correctly
// It imports the types and verifies they have the expected structure

describe("Icon Types Integration", () => {
  it("should be able to import Lucide namespace", () => {
    // This is a compile-time test - if the import fails, the test will not compile
    const { Lucide } = require("../../lib-types/virtual-qds-icons");
    expect(Lucide).toBeDefined();
  });

  it("should be able to import Heroicons namespace", () => {
    const { Heroicons } = require("../../lib-types/virtual-qds-icons");
    expect(Heroicons).toBeDefined();
  });

  it("should be able to import Tabler namespace", () => {
    const { Tabler } = require("../../lib-types/virtual-qds-icons");
    expect(Tabler).toBeDefined();
  });

  it("should have Check icon in Lucide namespace", () => {
    const { Lucide } = require("../../lib-types/virtual-qds-icons");
    expect(Lucide.Check).toBeDefined();
  });

  it("should have Heart icon in Lucide namespace", () => {
    const { Lucide } = require("../../lib-types/virtual-qds-icons");
    expect(Lucide.Heart).toBeDefined();
  });

  it("should have Star icon in Lucide namespace", () => {
    const { Lucide } = require("../../lib-types/virtual-qds-icons");
    expect(Lucide.Star).toBeDefined();
  });
});

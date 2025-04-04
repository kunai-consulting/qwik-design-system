import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { readFile, readdir, rm, mkdir } from "node:fs/promises";
import { run } from "../generate/generate-icons";

const TEST_OUTPUT_DIR = "test-output";
const TEST_ICON_LIMIT = 2;

describe("Icon Generation", () => {
  beforeAll(async () => {
    process.env.ICON_LIMIT = TEST_ICON_LIMIT.toString();
    process.env.TEST_MODE = "true";

    await mkdir(TEST_OUTPUT_DIR, { recursive: true });

    await run();
  });

  afterAll(async () => {
    await rm(TEST_OUTPUT_DIR, { recursive: true, force: true });
  });

  describe("Icon Pack Generation", () => {
    it("should generate icon packs with limited icons", async () => {
      const iconDirs = await readdir("test-output/icons");
      expect(iconDirs).toContain("lucide");

      const lucideIcons = await readdir("test-output/icons/lucide");
      const iconFiles = lucideIcons.filter(
        (file) => file.endsWith(".js") && !file.endsWith("lucide.js")
      );
      expect(iconFiles.length).toBeLessThanOrEqual(TEST_ICON_LIMIT);
    });

    it("should generate valid icon components", async () => {
      const iconPath = "test-output/icons/lucide/activity.js";
      const content = await readFile(iconPath, "utf-8");

      expect(content).toContain("viewBox");
      expect(content).toContain('fill="none"');
      expect(content).toContain('stroke="currentColor"');

      expect(content).toContain("export const");
      expect(content).toContain("props");
    });
  });

  describe("Configuration Generation", () => {
    it("should generate configs.ts with correct metadata", async () => {
      const configsPath = "test-output/page/configs.ts";
      const content = await readFile(configsPath, "utf-8");

      expect(content).toContain("license");
      expect(content).toContain("licenseUrl");
      expect(content).toContain("name");
      expect(content).toContain("prefix");
    });
  });
});

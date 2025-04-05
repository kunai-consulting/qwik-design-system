import { describe, it, expect, beforeAll, vi } from "vitest";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "../generate/generate-icons";

const __dirname = dirname(fileURLToPath(import.meta.url));
const basePath = join(__dirname, "..");

vi.mock("../generate/download-icons", () => ({
  downloadIcons: vi.fn().mockResolvedValue(undefined)
}));

const TEST_ICON_LIMIT = 2;

describe("Icon Generation", () => {
  beforeAll(async () => {
    process.env.ICON_LIMIT = TEST_ICON_LIMIT.toString();
    await run();
  });

  describe("Icon Pack Generation", () => {
    it("should generate icon packs with limited icons", async () => {
      const iconDirs = await readdir(join(basePath, "icons"));
      expect(iconDirs).toContain("lucide");

      const lucideIcons = await readdir(join(basePath, "icons", "lucide"));
      const iconFiles = lucideIcons.filter(
        (file) => file.endsWith(".js") && !file.endsWith("lucide.js")
      );
      expect(iconFiles.length).toBeLessThanOrEqual(TEST_ICON_LIMIT);
    });

    it("should generate valid icon components", async () => {
      const iconPath = join(basePath, "icons", "lucide", "activity.js");
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
      const configsPath = join(basePath, "page", "configs.ts");
      const content = await readFile(configsPath, "utf-8");

      expect(content).toContain("license");
      expect(content).toContain("licenseUrl");
      expect(content).toContain("name");
      expect(content).toContain("prefix");
    });
  });
});

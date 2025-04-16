import { mkdir, rm, writeFile } from "node:fs/promises";
import type { IconifyIcon } from "@iconify/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateIcon, generateIcons } from "./generate-icons";
import { getIconSets } from "./get-icons";

vi.mock("node:fs/promises", () => ({
  mkdir: vi.fn().mockResolvedValue(undefined),
  writeFile: vi.fn().mockResolvedValue(undefined),
  rm: vi.fn().mockResolvedValue(undefined)
}));

vi.mock("@iconify/utils", () => ({
  iconToSVG: vi.fn((iconData) => {
    if (iconData?.__trigger_error) {
      throw new Error("Test error in iconToSVG");
    }
    return {
      attributes: {
        width: iconData?.width || 24,
        height: iconData?.height || 24,
        viewBox: `0 0 ${iconData?.width || 24} ${iconData?.height || 24}`
      },
      body: iconData?.body || ""
    };
  })
}));

vi.mock("./get-icons");

describe("generate-icons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getIconSets).mockResolvedValue({
      mdi: {
        prefix: "mdi",
        icons: {
          account: {
            body: '<path d="M12 4a4 4 0 014 4a4 4 0 01-4 4a4 4 0 01-4-4a4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"/>',
            width: 24,
            height: 24
          }
        }
      }
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("generateIcon (unit)", () => {
    it("should generate an icon component file", async () => {
      const mockIcon: IconifyIcon = {
        body: '<path d="M12 4a4 4 0 014 4a4 4 0 01-4 4a4 4 0 01-4-4a4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"/>',
        width: 24,
        height: 24
      };

      const result = await generateIcon("mdi", "account", mockIcon);

      expect(mkdir).toHaveBeenCalled();
      expect(writeFile).toHaveBeenCalled();

      expect(result).toMatchObject({
        camelCaseName: "mdiAccount",
        kebabCaseName: "mdi-account",
        symbolName: expect.any(String)
      });

      const writeCall = vi.mocked(writeFile).mock.calls[0];
      const content = writeCall[1];
      expect(content).toContain("<path d=");
      expect(content).toContain("data-qds-icon");
    });

    it("should handle special characters in icon names", async () => {
      const mockIcon: IconifyIcon = {
        body: '<path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z"/>',
        width: 24,
        height: 24
      };

      const result = await generateIcon("mdi", "home-variant", mockIcon);

      expect(result.pascalCaseName).toBe("MdiHomeVariant");
      expect(result.kebabCaseName).toBe("mdi-home-variant");
    });
  });

  describe("generateIcons (integration)", () => {
    it("should process icon sets from getIconSets", async () => {
      vi.mocked(getIconSets).mockResolvedValue({
        mdi: {
          prefix: "mdi",
          icons: {
            account: {
              body: '<path d="M12 4a4 4 0 014 4a4 4 0 01-4 4a4 4 0 01-4-4a4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"/>',
              width: 24,
              height: 24
            }
          }
        }
      });

      vi.spyOn(process, "env", "get").mockReturnValue({ ICON_LIMIT: "1" });

      await generateIcons();

      expect(rm).toHaveBeenCalled();
      expect(mkdir).toHaveBeenCalled();
      expect(writeFile).toHaveBeenCalled();

      const indexCalls = vi
        .mocked(writeFile)
        .mock.calls.filter((call) => (call[0] as string).endsWith("all.ts"));
      expect(indexCalls.length).toBe(1);
    }, 10000);

    it("should use PascalCase for exports in the root index file", async () => {
      vi.mocked(getIconSets).mockResolvedValue({
        "rivet-icons": {
          prefix: "rivet-icons",
          icons: {
            "some-icon": {
              body: '<path d="M10 10h4v4h-4z"/>',
              width: 24,
              height: 24
            }
          }
        },
        "material-symbols": {
          prefix: "material-symbols",
          icons: {
            "home": {
              body: '<path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z"/>',
              width: 24,
              height: 24
            }
          }
        }
      });

      await generateIcons();

      const indexCall = vi
        .mocked(writeFile)
        .mock.calls.find((call) => (call[0] as string).endsWith("all.ts"));

      expect(indexCall).toBeDefined();
      const content = indexCall?.[1] as string;

      // Check for PascalCase exports
      expect(content).toContain("export * as RivetIcons from");
      expect(content).toContain("export * as MaterialSymbols from");
      expect(content).not.toContain("export * as rivet-icons from");
      expect(content).not.toContain("export * as material-symbols from");

      // Check for PascalCase type exports
      expect(content).toContain("export type RivetIconsIcons =");
      expect(content).toContain("export type MaterialSymbolsIcons =");
      expect(content).not.toContain("export type rivet-iconsIcons =");
      expect(content).not.toContain("export type material-symbolsIcons =");
    });
  });

  describe("generateIcons with controlled data", () => {
    it("should handle empty icon sets gracefully", async () => {
      vi.mocked(getIconSets).mockResolvedValue({});

      await generateIcons();

      expect(mkdir).toHaveBeenCalled();
      expect(rm).toHaveBeenCalled();
      expect(writeFile).toHaveBeenCalled();

      const indexCall = vi
        .mocked(writeFile)
        .mock.calls.find((call) => (call[0] as string).endsWith("all.ts"));
      expect(indexCall).toBeDefined();
    });

    it("should handle errors when generating individual icons", async () => {
      vi.mocked(getIconSets).mockResolvedValue({
        test: {
          prefix: "test",
          icons: {
            "error-icon": {
              __trigger_error: true,
              body: "invalid",
              width: 24,
              height: 24
            } as unknown as IconifyIcon
          }
        }
      });

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await generateIcons();

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(writeFile).toHaveBeenCalled();
    });
  });
});

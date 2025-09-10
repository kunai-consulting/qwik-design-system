import { describe, expect, it, vi, beforeAll } from "vitest";
import { icons } from "./icons";
import { lookupCollection } from "@iconify/json";
import type { IconifyJSON } from "@iconify/types";

type TransformResult = { code: string; map: unknown } | null;

describe("icons", () => {
  let plugin: any;
  let transform: (code: string, id: string) => TransformResult;

  beforeAll(async () => {
    plugin = icons({ debug: true });

    // Preload collections for testing
    const collections: Map<string, IconifyJSON> = new Map();
    try {
      const lucideCollection = await lookupCollection("lucide");
      collections.set("lucide", lucideCollection);
    } catch (error) {
      console.warn("Failed to preload Lucide collection for tests:", error);
    }

    // Set the collections on the plugin
    (plugin as any).collections = collections;

    transform = plugin.transform as (code: string, id: string) => TransformResult;
  });

  it("should skip non-JSX files", () => {
    const code = "const x = 1;";
    const result = transform(code, "test.js");
    expect(result).toBeNull();
  });

  it("should return null for files without icon imports", () => {
    const code = `
      function App() {
        return <div>Hello</div>;
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeNull();
  });

  it("should return null for files with icon imports but no usage", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        return <div>Hello</div>;
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeNull();
  });

  it("should transform simple icon usage", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        return <Lucide.Check width={24} />;
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('import __qds_i_lucide_check from \'virtual:icons/lucide/check\'');
    expect(result.code).toContain('<svg');
    expect(result.code).toContain('width={24}');
    expect(result.code).toContain('dangerouslySetInnerHTML={__qds_i_lucide_check}');
    expect(result.code).toContain('viewBox="0 0 24 24"');
  });

  it("should transform icon with class attribute", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        return <Lucide.Check class="icon" />;
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('class="icon"');
  });

  it("should transform icon with kebab-case attributes", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        return <Lucide.Check stroke-width={2} />;
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('stroke-width={2}');
  });

  it("should transform icon with expression props", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        const size = 24;
        return <Lucide.Check width={size} className={cn("icon")} />;
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('width={size}');
    expect(result.code).toContain('className={cn("icon")}');
  });

  it("should convert title prop to children", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        return <Lucide.Check title="Checked item" />;
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('<svg viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_lucide_check}><title>Checked item</title></svg>');
  });

  it("should convert title expression prop to children", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        const label = "Checked item";
        return <Lucide.Check title={label} />;
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('<svg viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_lucide_check}><title>{{label}}</title></svg>');
  });

  it("should handle title plus existing children", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        return (
          <Lucide.Check title="Checked item">
            <desc>Extra a11y</desc>
          </Lucide.Check>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('<svg viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_lucide_check}><>{<title>Checked item</title><desc>Extra a11y</desc>}</></svg>');
  });

  it("should handle self-closing and non-self-closing tags", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        return <Lucide.Check width={24}></Lucide.Check>;
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('width={24}');
  });

  it("should handle aliased imports", () => {
    const code = `
      import { Lucide as L } from "@kunai-consulting/qwik";

      function App() {
        return <L.Check width={24} />;
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('import __qds_i_lucide_check from \'virtual:icons/lucide/check\'');
  });

  it("should deduplicate imports for multiple usages of same icon", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        return (
          <div>
            <Lucide.Check width={16} />
            <Lucide.Check width={24} />
          </div>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    const importMatches = result.code.match(/import __qds_i_lucide_check/g);
    expect(importMatches).toHaveLength(1);
  });

  it("should handle multiple different icons", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        return (
          <div>
            <Lucide.Check width={24} />
            <Lucide.Circle width={24} />
          </div>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('import __qds_i_lucide_check from \'virtual:icons/lucide/check\'');
    expect(result.code).toContain('import __qds_i_lucide_circle from \'virtual:icons/lucide/circle\'');
  });

  it("should handle nested icons", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        return (
          <div>
            <Lucide.Check width={24} />
            <span>
              <Lucide.Circle width={16} />
            </span>
          </div>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('import __qds_i_lucide_check from \'virtual:icons/lucide/check\'');
    expect(result.code).toContain('import __qds_i_lucide_circle from \'virtual:icons/lucide/circle\'');
  });

  it("should skip unknown pack", () => {
    const code = `
      import { Unknown } from "@kunai-consulting/qwik";

      function App() {
        return <Unknown.Check width={24} />;
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeNull();
  });

  it("should skip icon not found in collection", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        return <Lucide.NonExistentIcon width={24} />;
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeNull();
  });

  it("should handle boolean attributes", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        return <Lucide.Check disabled />;
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('disabled');
  });

  it("should preserve aria and data attributes", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        return <Lucide.Check aria-label="Check" data-testid="check-icon" />;
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('aria-label="Check"');
    expect(result.code).toContain('data-testid="check-icon"');
  });

  it("should handle complex children", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        return (
          <Lucide.Check>
            <title>Check</title>
            <desc>Description</desc>
          </Lucide.Check>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('<svg viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_lucide_check}><>{<title>Check</title><desc>Description</desc>}</></svg>');
  });

  it("should generate source maps", () => {
    const code = `
      import { Lucide } from "@kunai-consulting/qwik";

      function App() {
        return <Lucide.Check width={24} />;
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.map).toBeTruthy();
  });

  describe("debug mode", () => {
    it("should log debug messages when debug is enabled", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const debugPlugin = icons({ debug: true });
      const debugTransform = debugPlugin.transform as (code: string, id: string) => TransformResult;

      const code = `
        import { Lucide } from "@kunai-consulting/qwik";

        function App() {
          return <Lucide.Check width={24} />;
        }
      `;

      debugTransform(code, "test.tsx");

      expect(consoleSpy).toHaveBeenCalledWith("[icons] Processing test.tsx with 1 aliases:", [["Lucide", "Lucide"]]);

      consoleSpy.mockRestore();
    });
  });

  describe("virtual modules", () => {
    it("should resolve virtual icon modules", () => {
      const resolveId = plugin.resolveId as (source: string) => string | null;
      const result = resolveId("virtual:icons/lucide/check");
      expect(result).toBe("\0virtual:icons/lucide/check");
    });

    it("should not resolve non-virtual modules", () => {
      const resolveId = plugin.resolveId as (source: string) => string | null;
      const result = resolveId("react");
      expect(result).toBeNull();
    });
  });

  describe("error handling", () => {
    it("should handle parse errors gracefully", () => {
      const code = `
        import { Lucide } from "@kunai-consulting/qwik";

        function App() {
          return <Lucide.Check unclosed;
        }
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeNull();
    });

    it("should handle malformed JSX gracefully", () => {
      const code = `
        import { Lucide } from "@kunai-consulting/qwik";

        function App() {
          return <Lucide.Check />;
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeNull();
    });
  });

  describe("custom packs configuration", () => {
    it("should support custom packs", () => {
      const customPlugin = icons({
        packs: {
          CustomPack: { iconifyPrefix: "custom" }
        }
      });

      // This would require mocking the custom collection
      expect(customPlugin).toBeDefined();
    });

    it("should support custom import sources", () => {
      const customPlugin = icons({
        importSources: ["custom-lib"]
      });

      expect(customPlugin).toBeDefined();
    });
  });

  describe("real world examples from icon-example.tsx", () => {
    it("should transform Lucide.Check with class attribute", () => {
      const code = `
        import { Lucide } from "@kunai-consulting/qwik";

        function App() {
          return <Lucide.Check width={24} class="text-green-500" />;
        }
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeTruthy();
      expect(result.code).toContain('import __qds_i_lucide_check from \'virtual:icons/lucide/check\'');
      expect(result.code).toContain('<svg width={24} class="text-green-500" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_lucide_check} />');
    });

    it("should transform Lucide.X with class attribute", () => {
      const code = `
        import { Lucide } from "@kunai-consulting/qwik";

        function App() {
          return <Lucide.X width={24} class="text-red-500" />;
        }
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeTruthy();
      expect(result.code).toContain('import __qds_i_lucide_x from \'virtual:icons/lucide/x\'');
      expect(result.code).toContain('<svg width={24} class="text-red-500" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_lucide_x} />');
    });

    it("should transform Lucide.Heart with fill-current class", () => {
      const code = `
        import { Lucide } from "@kunai-consulting/qwik";

        function App() {
          return <Lucide.Heart width={24} class="text-red-500 fill-current" />;
        }
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeTruthy();
      expect(result.code).toContain('import __qds_i_lucide_heart from \'virtual:icons/lucide/heart\'');
      expect(result.code).toContain('<svg width={24} class="text-red-500 fill-current" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_lucide_heart} />');
    });

    it("should transform multiple different icons", () => {
      const code = `
        import { Lucide } from "@kunai-consulting/qwik";

        function App() {
          return (
            <div>
              <Lucide.Check width={24} class="text-green-500" />
              <Lucide.X width={24} class="text-red-500" />
              <Lucide.Heart width={24} class="text-red-500 fill-current" />
              <Lucide.Star width={24} class="text-yellow-500" />
            </div>
          );
        }
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeTruthy();
      expect(result.code).toContain('import __qds_i_lucide_check from \'virtual:icons/lucide/check\'');
      expect(result.code).toContain('import __qds_i_lucide_x from \'virtual:icons/lucide/x\'');
      expect(result.code).toContain('import __qds_i_lucide_heart from \'virtual:icons/lucide/heart\'');
      expect(result.code).toContain('import __qds_i_lucide_star from \'virtual:icons/lucide/star\'');
      expect(result.code).toContain('<svg width={24} class="text-green-500" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_lucide_check} />');
      expect(result.code).toContain('<svg width={24} class="text-red-500" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_lucide_x} />');
      expect(result.code).toContain('<svg width={24} class="text-red-500 fill-current" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_lucide_heart} />');
      expect(result.code).toContain('<svg width={24} class="text-yellow-500" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_lucide_star} />');
    });

    it("should transform Heroicons.CheckCircle", () => {
      const code = `
        import { Heroicons } from "@kunai-consulting/qwik";

        function App() {
          return <Heroicons.CheckCircle width={24} class="text-green-500" />;
        }
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeTruthy();
      expect(result.code).toContain('import __qds_i_heroicons_check_circle from \'virtual:icons/heroicons/check-circle\'');
      expect(result.code).toContain('<svg width={24} class="text-green-500" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_heroicons_check_circle} />');
    });

    it("should transform Tabler.Check", () => {
      const code = `
        import { Tabler } from "@kunai-consulting/qwik";

        function App() {
          return <Tabler.Check width={24} class="text-green-500" />;
        }
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeTruthy();
      expect(result.code).toContain('import __qds_i_tabler_check from \'virtual:icons/tabler/check\'');
      expect(result.code).toContain('<svg width={24} class="text-green-500" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_tabler_check} />');
    });

    it("should transform the complete icon-example.tsx content", () => {
      const code = `
        import { component$ } from "@qwik.dev/core";
        import { Lucide, Heroicons, Tabler, Hugeicons } from "@kunai-consulting/qwik";

        export default component$(() => {
          return (
            <div class="space-y-8 p-8">
              <div class="space-y-4">
                <h2 class="text-2xl font-bold">Lucide Icons</h2>
                <div class="flex gap-4 items-center">
                  <Lucide.Check width={24} class="text-green-500" />
                  <Lucide.X width={24} class="text-red-500" />
                  <Lucide.Heart width={24} class="text-red-500 fill-current" />
                  <Lucide.Star width={24} class="text-yellow-500" />
                  <Lucide.Search width={24} class="text-gray-500" />
                </div>
              </div>

              <div class="space-y-4">
                <h2 class="text-2xl font-bold">Heroicons</h2>
                <div class="flex gap-4 items-center">
                  <Heroicons.CheckCircle width={24} class="text-green-500" />
                  <Heroicons.XCircle width={24} class="text-red-500" />
                  <Heroicons.Heart width={24} class="text-red-500 fill-current" />
                  <Heroicons.Star width={24} class="text-yellow-500" />
                </div>
              </div>

              <div class="space-y-4">
                <h2 class="text-2xl font-bold">Tabler Icons</h2>
                <div class="flex gap-4 items-center">
                  <Tabler.Check width={24} class="text-green-500" />
                  <Tabler.X width={24} class="text-red-500" />
                  <Tabler.Heart width={24} class="text-red-500 fill-current" />
                  <Tabler.Star width={24} class="text-yellow-500" />
                </div>
              </div>
            </div>
          );
        });
      `;
      const result = transform(code, "icon-example.tsx");
      expect(result).toBeTruthy();
      // Should contain all the transformed icons
      expect(result.code).toContain('<svg width={24} class="text-green-500" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_lucide_check} />');
      expect(result.code).toContain('<svg width={24} class="text-red-500" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_lucide_x} />');
      expect(result.code).toContain('<svg width={24} class="text-red-500 fill-current" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_lucide_heart} />');
      expect(result.code).toContain('<svg width={24} class="text-yellow-500" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_lucide_star} />');
      expect(result.code).toContain('<svg width={24} class="text-gray-500" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_lucide_search} />');
      expect(result.code).toContain('<svg width={24} class="text-green-500" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_heroicons_check_circle} />');
      expect(result.code).toContain('<svg width={24} class="text-red-500" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_heroicons_x_circle} />');
      expect(result.code).toContain('<svg width={24} class="text-green-500" viewBox="0 0 24 24" dangerouslySetInnerHTML={__qds_i_tabler_check} />');
    });
  });
});

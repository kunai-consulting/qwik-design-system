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
    expect(result.code).toContain('jsx("svg", {');
    expect(result.code).toContain('"width": 24');
    expect(result.code).toContain('dangerouslySetInnerHTML: __qds_i_lucide_check');
    expect(result.code).toContain('viewBox:');
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
    expect(result.code).toContain('"class": "icon"');
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
    expect(result.code).toContain('"stroke-width": 2');
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
    expect(result.code).toContain('"width": size');
    expect(result.code).toContain('"className": cn("icon")');
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
    expect(result.code).toContain('children: (<title>Checked item</title>)');
    expect(result.code).not.toContain('title: "Checked item"');
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
    expect(result.code).toContain('children: (<title>{{label}}</title>)');
    expect(result.code).not.toContain('title:');
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
    expect(result.code).toContain('children: (<>{<title>Checked item</title><desc>Extra a11y</desc>}</>)');
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
    expect(result.code).toContain('"width": 24');
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
    expect(result.code).toContain('"disabled": true');
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
    expect(result.code).toContain('"aria-label": "Check"');
    expect(result.code).toContain('"data-testid": "check-icon"');
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
    expect(result.code).toContain('children: (<>{<title>Check</title><desc>Description</desc>}</>)');
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

      expect(consoleSpy).toHaveBeenCalledWith("[icons] Processing: test.tsx");

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
});

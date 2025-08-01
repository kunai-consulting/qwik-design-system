import { resolve } from "pathe";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@kunai-consulting/qwik-utils": resolve(__dirname, "libs/utils/src"),
      "@kunai-consulting/qwik": resolve(__dirname, "libs/components/src")
    }
  },
  test: {
    projects: [
      {
        test: {
          include: ["**/*.unit.ts"],
          name: "unit",
          environment: "node"
        }
      },
      {
        test: {
          include: ["**/*.dom.ts"],
          name: "dom",
          browser: {
            enabled: true,
            instances: [{ browser: "chromium" }]
          }
        }
      }
    ]
  }
});

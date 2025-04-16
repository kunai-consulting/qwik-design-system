import { resolve } from "pathe";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@kunai-consulting/qwik-utils": resolve(__dirname, "libs/utils/src"),
      "@kunai-consulting/qwik-components": resolve(__dirname, "libs/components/src"),
      "@kunai-consulting/qwik-icons": resolve(__dirname, "libs/icons/src")
    }
  },
  test: {
    include: ["**/*.unit.ts", "**/*.smoke.ts"]
  }
});

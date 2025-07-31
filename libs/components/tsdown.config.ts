import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  external: [
    "@qwik.dev/core",
    "@qwik.dev/core/internal",
    "@playwright/test",
    "@axe-core/playwright",
    /^node:/,
    "@oddbird/css-anchor-positioning"
  ],
  format: ["esm"]
});

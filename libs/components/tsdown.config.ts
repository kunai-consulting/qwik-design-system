import { qwikRollup } from "@qwik.dev/core/optimizer";
import { defineConfig } from "tsdown";

export default defineConfig({
  plugins: [
    qwikRollup({
      target: "lib",
      buildMode: "production"
    })
  ],
  entry: ["src/**/index.ts"],
  external: [
    "@playwright/test",
    "@axe-core/playwright",
    /^node:/,
    "@oddbird/css-anchor-positioning"
  ],
  format: ["esm"]
});

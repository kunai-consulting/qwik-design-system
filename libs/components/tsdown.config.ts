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
  format: ["esm"]
});

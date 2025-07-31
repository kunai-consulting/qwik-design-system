import { defineConfig } from "tsdown";

// test

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  external: [/^node:.*/]
});

import { defineConfig } from "tsdown";

// test

export default defineConfig({
  target: "es2020",
  entry: ["src/index.ts"],
  format: ["esm"],
  external: [/^node:.*/]
});

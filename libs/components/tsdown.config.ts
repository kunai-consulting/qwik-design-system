import { defineConfig } from "tsdown";

export default defineConfig({
  target: "es2020",
  entry: ["src/**/index.ts"],
  format: ["esm"],
  external: [/^node:.*/, /^@qwik\.dev\/.*/],
  outExtensions: () => {
    return {
      js: ".qwik.mjs"
    };
  },
  unbundle: true,
  skipNodeModulesBundle: true
});

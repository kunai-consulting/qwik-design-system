import { defineConfig } from "tsdown";

export default defineConfig({
  target: "es2020",
  entry: ["src/index.ts"],
  format: ["esm"],
  external: [/^node:.*/],
  outExtensions: () => {
    return {
      js: ".qwik.mjs"
    };
  },
  outputOptions: (options) => {
    return {
      ...options,
      preserveModules: true,
      preserveModulesRoot: "src"
    };
  }
});

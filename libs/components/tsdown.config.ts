import { defineConfig } from "tsdown";

export default defineConfig({
  target: "es2020",
  entry: ["src/**/index.ts"],
  format: ["esm"],
  external: [/^node:.*/, /^@qwik\.dev\/.*/, "@kunai-consulting/qwik-utils"],
  unbundle: true,

  outputOptions: (options) => ({
    ...options,
    preserveModules: true,
    preserveModulesRoot: "src",
    minifyInternalExports: false,
    hoistTransitiveImports: false,
    entryFileNames: (chunk) => `${chunk.name}.qwik.mjs`,
    chunkFileNames: (chunk) => `${chunk.name}.qwik.mjs`
  }),

  outExtensions: () => ({
    js: ".qwik.mjs"
  })
});

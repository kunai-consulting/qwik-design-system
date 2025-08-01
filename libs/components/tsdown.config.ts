import { defineConfig } from "tsdown";

// 🎯 SIMPLIFIED LIBRARY MODE CONFIG (matching Vite library mode)
export default defineConfig({
  // LIBRARY MODE ESSENTIALS (like Vite's build.lib)
  entry: ["src/index.ts"], // Single entry point like Vite library mode
  format: "esm", // Single format like Vite library mode
  target: "es2020",

  // EXTERNALS (like Vite's rollupOptions.external)
  external: [/^@qwik\.dev\/.*/, /^@kunai-consulting\/.*/, /^node:.*/],

  // LIBRARY OUTPUT (like Vite's rollupOptions.output)
  outputOptions: {
    // Preserve individual modules (like Vite library mode)
    preserveModules: true,
    preserveModulesRoot: "src",

    // Library-style file naming (consistent with Vite)
    entryFileNames: "[name].qwik.mjs",
    chunkFileNames: "[name].qwik.mjs",

    // Library optimizations (matching Vite)
    minifyInternalExports: false,
    externalLiveBindings: false
  },

  // CLEAN BUILD (remove complexity that might break Qwik)
  treeshake: false, // Like Vite library mode
  minify: false, // Like Vite library mode
  platform: "browser",

  // FILE EXTENSIONS
  outExtensions: () => {
    return {
      js: ".qwik.mjs"
    };
  }
});

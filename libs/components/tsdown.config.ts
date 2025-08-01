import { qwikRollup } from "@qwik.dev/core/optimizer";
import { defineConfig } from "tsdown";

// 🎯 QWIK LIBRARY MODE CONFIG with Optimizer
export default defineConfig({
  // LIBRARY MODE ESSENTIALS (like Vite's build.lib)
  entry: ["src/index.ts"], // Single entry point like Vite library mode
  format: "esm", // Single format like Vite library mode
  target: "es2020",

  // EXTERNALS (like Vite's rollupOptions.external)
  external: [/^@qwik\.dev\/.*/, /^@kunai-consulting\/.*/, /^node:.*/],

  // QWIK OPTIMIZER PLUGIN (critical for proper component processing)
  plugins: [
    qwikRollup({
      buildMode: "production", // Production build mode
      target: "lib", // Library build target
      lint: false, // Skip linting during build
      debug: true // Disable debug output
    })
  ],

  // LIBRARY OUTPUT (like Vite's rollupOptions.output)
  outputOptions: {
    // Preserve individual modules (like Vite library mode)
    preserveModules: true,
    preserveModulesRoot: "src",

    // Library-style file naming (consistent with Vite)
    entryFileNames: "[name].qwik.mjs",
    chunkFileNames: "[name].qwik.mjs"
  },

  // FILE EXTENSIONS
  outExtensions: () => {
    return {
      js: ".qwik.mjs"
    };
  }
});

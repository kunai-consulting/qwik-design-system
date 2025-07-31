import * as fs from "node:fs";
import { defineConfig } from "tsdown";

export default defineConfig({
  target: "es2020",
  entry: ["src/**/index.ts"],
  format: ["esm"],
  external: [/^node:.*/, /^@qwik\.dev\/.*/, "@kunai-consulting/qwik-utils"],

  // 🔧 KEY ADDITIONS:

  // Prevent bundling workspace dependencies
  noExternal: [], // Start with empty array to external everything not in external
  skipNodeModulesBundle: true,

  // Browser platform for Qwik components
  platform: "browser",

  // Disable optimizations that might break Qwik symbols
  treeshake: false,
  minify: false,

  // Fix import path resolution
  makeAbsoluteExternalsRelative: true,

  // Preserve Qwik's special handling
  shimMissingExports: false,

  unbundle: true,

  outputOptions: (options) => ({
    ...options,
    preserveModules: true,
    preserveModulesRoot: "src",
    minifyInternalExports: false,
    hoistTransitiveImports: false,
    entryFileNames: (chunk) => `${chunk.name}.qwik.mjs`,
    chunkFileNames: (chunk) => `${chunk.name}.qwik.mjs`,

    // Additional output options that might help
    externalLiveBindings: false,
    topLevelVar: false
  }),

  // Transform options to preserve Qwik code
  transform: {
    // Disable transforms that might break Qwik
    decoratorVersion: "2022-03"
  },

  outExtensions: () => ({
    js: ".qwik.mjs"
  }),

  // Debug options (temporary)
  experimental: {
    attachDebugInfo: "simple"
  },

  // 🕵️ ADD DEBUGGING HOOKS:
  hooks: {
    "build:before": (ctx) => {
      console.log("🔍 Starting tsdown build...");
    },
    "build:done": (ctx) => {
      console.log("✅ tsdown build complete, checking for s1...");

      // Log all generated files
      const distDir = "dist";
      if (fs.existsSync(distDir)) {
        const files = fs.readdirSync(distDir, { recursive: true });
        files.forEach((file) => {
          const filePath = `${distDir}/${file}`;
          if (file.endsWith(".qwik.mjs")) {
            const content = fs.readFileSync(filePath, "utf8");
            console.log(`📄 ${file}:`);

            // Check for s1 symbol
            if (content.includes("s1")) {
              console.log(`🚨 FOUND s1 in ${file}!`);
              console.log(content.substring(0, 500)); // First 500 chars
            }

            // Log imports
            const imports = content.match(/import .* from ['"](.*)['"]/g) || [];
            console.log(`📥 Imports: ${imports.join(", ")}`);
          }
        });
      }
    }
  }
});

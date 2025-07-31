import * as fs from "node:fs";
import { asChild } from "@kunai-consulting/core/vite";
import { qwikVite } from "@qwik.dev/core/optimizer";
import { qwikRouter } from "@qwik.dev/router/vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "pathe";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

/**
 * This is the base config for vite.
 * When building, the adapter config is used which loads this file and extends it.
 */
import { type UserConfig, defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json";

type PkgDep = Record<string, string>;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const { dependencies = {}, devDependencies = {} } = pkg as any as {
  dependencies: PkgDep;
  devDependencies: PkgDep;
  [key: string]: unknown;
};
errorOnDuplicatesPkgDeps(devDependencies, dependencies);

/**
 * Note that Vite normally starts from `index.html` but the qwikCity plugin makes start at `src/entry.ssr.tsx` instead.
 */
export default defineConfig(({ command, mode }): UserConfig => {
  const mainQuality = {
    quality: 80
  };

  return {
    plugins: [
      asChild(),
      tailwindcss(),
      qwikRouter({
        mdx: {
          providerImportSource: "~/mdx/provider"
        }
      }),
      qwikVite({ lint: false }),
      ViteImageOptimizer({
        includePublic: true,
        png: mainQuality,
        jpeg: mainQuality,
        jpg: mainQuality,
        webp: mainQuality,
        avif: mainQuality
      }),
      tsconfigPaths(),

      // 🕵️ Manifest logger plugin for debugging s1 symbol in Cloudflare
      {
        name: "manifest-logger",
        writeBundle(options, bundle) {
          // Log during CF build
          if (process.env.CF_PAGES) {
            console.log("🔍 Checking for q-manifest.json...");

            const manifestPath = "dist/q-manifest.json";
            if (fs.existsSync(manifestPath)) {
              const manifest = fs.readFileSync(manifestPath, "utf8");
              console.log("📋 CLOUDFLARE MANIFEST SIZE:", manifest.length);

              // Check for s1 symbol
              if (manifest.includes('"s1"')) {
                console.log("🚨 FOUND s1 in Cloudflare manifest!");
                console.log(
                  "🚨 Manifest around s1:",
                  manifest.substring(
                    manifest.indexOf('"s1"') - 100,
                    manifest.indexOf('"s1"') + 100
                  )
                );
              }

              // Log first 500 chars of mapping section
              const mappingStart = manifest.indexOf('"mapping"');
              if (mappingStart > -1) {
                console.log(
                  "📥 CLOUDFLARE MAPPING START:",
                  manifest.substring(mappingStart, mappingStart + 500)
                );
              }

              // Log any suspiciously short symbols
              try {
                const manifestObj = JSON.parse(manifest);
                if (manifestObj.mapping) {
                  const shortSymbols = Object.keys(manifestObj.mapping).filter(
                    (k) => k.length < 5
                  );
                  if (shortSymbols.length > 0) {
                    console.log("⚠️ SHORT SYMBOLS FOUND:", shortSymbols);
                  }
                }
              } catch (e) {
                console.log("❌ Failed to parse manifest:", e);
              }
            }
          }
        }
      }
    ],
    // This tells Vite which dependencies to pre-build in dev mode.
    optimizeDeps: {
      // Put problematic deps that break bundling here, mostly those with binaries.
      // For example ['better-sqlite3'] if you use that in server functions.
      exclude: []
    },
    ssr:
      command === "build" && mode === "production"
        ? {
            // All dev dependencies should be bundled in the server build
            noExternal: Object.keys(devDependencies),
            // Anything marked as a dependency will not be bundled
            // These should only be production binary deps (including deps of deps), CLI deps, and their module graph
            // If a dep-of-dep needs to be external, add it here
            // For example, if something uses `bcrypt` but you don't have it as a dep, you can write
            // external: [...Object.keys(dependencies), 'bcrypt']
            external: Object.keys(dependencies)
          }
        : undefined,

    server: {
      headers: {
        // Don't cache the server response in dev mode
        "Cache-Control": "public, max-age=0"
      },
      fs: {
        allow: ["../.."]
      }
    },
    preview: {
      headers: {
        // Do cache the server response in preview (non-adapter production build)
        "Cache-Control": "public, max-age=600"
      }
    },
    resolve: {
      alias: {
        "@kunai-consulting/qwik": resolve(__dirname, "../../libs/components/src"),
        "@kunai-consulting/qwik-utils": resolve(__dirname, "../../libs/utils/src"),
        "@kunai-consulting/qwik-icons": resolve(__dirname, "../../libs/icons/src"),
        "@kunai-consulting/core": resolve(__dirname, "../../libs/core/src"),
        "~": resolve(__dirname, "src")
      },
      dedupe: ["@qwik.dev/core", "@qwik.dev/router"]
    }
  };
});

// *** utils ***

/**
 * Function to identify duplicate dependencies and throw an error
 * @param {Object} devDependencies - List of development dependencies
 * @param {Object} dependencies - List of production dependencies
 */
function errorOnDuplicatesPkgDeps(devDependencies: PkgDep, dependencies: PkgDep) {
  let msg = "";
  // Create an array 'duplicateDeps' by filtering devDependencies.
  // If a dependency also exists in dependencies, it is considered a duplicate.
  const duplicateDeps = Object.keys(devDependencies).filter((dep) => dependencies[dep]);

  // include any known qwik packages
  const qwikPkg = Object.keys(dependencies).filter((value) => /qwik/i.test(value));

  // any errors for missing "qwik-city-plan"
  // [PLUGIN_ERROR]: Invalid module "@qwik-router-config" is not a valid package
  msg = `Move qwik packages ${qwikPkg.join(", ")} to devDependencies`;

  if (qwikPkg.length > 0) {
    throw new Error(msg);
  }

  // Format the error message with the duplicates list.
  // The `join` function is used to represent the elements of the 'duplicateDeps' array as a comma-separated string.
  msg = `
    Warning: The dependency "${duplicateDeps.join(", ")}" is listed in both "devDependencies" and "dependencies".
    Please move the duplicated dependencies to "devDependencies" only and remove it from "dependencies"
  `;

  // Throw an error with the constructed message.
  if (duplicateDeps.length > 0) {
    throw new Error(msg);
  }
}

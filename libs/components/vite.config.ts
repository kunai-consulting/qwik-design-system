import { isDev } from "@qwik.dev/core/build";
import { qwikVite } from "@qwik.dev/core/optimizer";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

type PackageJson = {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

// Use require to avoid TypeScript module resolution issues
const pkg = require("./package.json") as PackageJson;
const { dependencies = {}, peerDependencies = {} } = pkg;
const makeRegex = (dep: string) => new RegExp(`^${dep}(/.*)?$`);
const excludeAll = (obj: Record<string, string>) => Object.keys(obj).map(makeRegex);

export default defineConfig(() => {
  return {
    build: {
      target: "es2020",
      lib: {
        entry: "./src/index.ts",
        formats: ["es", "cjs"],
        fileName: (format, entryName) =>
          `${entryName}.qwik.${format === "es" ? "mjs" : "cjs"}`
      },
      rollupOptions: {
        ...(!isDev
          ? {
              output: {
                preserveModules: true,
                preserveModulesRoot: "src"
              }
            }
          : {}),
        // externalize deps that shouldn't be bundled into the library
        external: [
          /^node:.*/,
          ...excludeAll(dependencies),
          ...excludeAll(peerDependencies)
        ]
      }
    },
    plugins: [qwikVite({ lint: false }), tsconfigPaths()],
    server: {
      fs: {
        allow: ["../.."]
      }
    }
  };
});

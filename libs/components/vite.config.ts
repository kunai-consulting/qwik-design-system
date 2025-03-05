import { isDev } from "@builder.io/qwik/build";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json";

type PackageJson = {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

const { dependencies = {}, peerDependencies = {} } = pkg as PackageJson;
const makeRegex = (dep) => new RegExp(`^${dep}(/.*)?$`);
const excludeAll = (obj) => Object.keys(obj).map(makeRegex);

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

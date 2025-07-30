import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "vite/as-child.ts"],
  external: ["oxc-parser", "magic-string", "@oxc-project/types"],
  dts: {
    isolatedDeclarations: true
  }
});

import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "vite/index.ts", "utils/index.ts"],
  external: ["oxc-parser", "oxc-walker", "magic-string", "@oxc-project/types"],
  tsconfig: "tsconfig.json",
  dts: true
});

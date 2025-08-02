import { qwikVite } from "@qwik.dev/core/optimizer";
import { resolve } from "pathe";
import { type TestProjectConfiguration, defineConfig } from "vitest/config";

const unitConfig: TestProjectConfiguration = {
  test: {
    include: ["**/*.unit.ts"],
    name: "unit",
    environment: "node"
  }
};

// TODO: once multiple frameworks are supported, each framework should have its own config
const domConfig: TestProjectConfiguration = {
  plugins: [qwikVite()],
  test: {
    include: ["**/*.browser.ts", "**/*.browser.tsx"],
    name: "dom",
    browser: {
      provider: "playwright",
      enabled: true,
      instances: [{ browser: "chromium" }]
    }
  }
};

export default defineConfig({
  resolve: {
    alias: {
      "@kunai-consulting/qwik-utils": resolve(__dirname, "libs/utils/src"),
      "@kunai-consulting/qwik": resolve(__dirname, "libs/components/src")
    }
  },
  test: {
    projects: [unitConfig, domConfig]
  }
});

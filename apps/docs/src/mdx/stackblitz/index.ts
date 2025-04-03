import sdk from "@stackblitz/sdk";
import { STACKBLITZ_CONFIG, getHeadlessAppContent } from "./stackblitz-config";

export const createStackblitzProject = async (
  appContent: string,
  parentContainerId: string,
  containerId: string
) => {
  const headlessAppContent = getHeadlessAppContent(appContent);
  const parentElement = document.getElementById(parentContainerId);
  const stackblitzContainer = document.getElementById(containerId);

  if (parentElement?.querySelector("iframe")) {
    return;
  }
  await sdk.embedProject(
    stackblitzContainer as HTMLElement,
    {
      title: "Qwik Design System Example",
      description: "Qwik Design System Example",
      template: "node",
      files: {
        "index.html": STACKBLITZ_CONFIG.indexHtml,
        "package.json": STACKBLITZ_CONFIG.packageJson,
        "src/root.tsx": STACKBLITZ_CONFIG.rootTsx,
        "src/app.tsx": headlessAppContent,
        "src/vite-env.d.ts": STACKBLITZ_CONFIG.viteEnvTs,
        "tsconfig.json": STACKBLITZ_CONFIG.tsconfigJson,
        "tsconfig.app.json": STACKBLITZ_CONFIG.tsconfigAppJson,
        "tsconfig.node.json": STACKBLITZ_CONFIG.tsconfigNodeJson,
        "vite.config.ts": STACKBLITZ_CONFIG.viteConfigTs,
        "src/entry.dev.tsx": STACKBLITZ_CONFIG.entryDevTsx,
        "src/entry.ssr.tsx": STACKBLITZ_CONFIG.entrySsrTsx
      }
    },
    {
      height: 500,
      startScript: "dev",
      terminalHeight: 30,
      openFile: "src/app.tsx"
    }
  );
};

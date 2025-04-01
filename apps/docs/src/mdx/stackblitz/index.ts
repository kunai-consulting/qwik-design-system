// import { Project } from "@stackblitz/sdk";
import sdk from "@stackblitz/sdk";
import { getUnstyledAppContent, STACKBLITZ_CONFIG } from "./stackblitz-config";

export const createStackblitzProject = async (
  appContent: string,
  containerId: string
) => {
  const headlessAppContent = getUnstyledAppContent(appContent);
  const containerParent = document.getElementById(`${containerId}-parent`);

  if (containerParent?.querySelector("iframe")) {
    return;
  }

  // This approach seems to require the user to save the file we overwrite which is not ideal

  // const vm = await sdk.embedGithubProject(
  //   "qds-example",
  //   "benjamin-kunai/qds-example-test",
  //   {
  //     openFile: "index.html"
  //   }
  // );
  // await vm.applyFsDiff({
  //   create: {
  //     "src/components/app/app.tsx": headlessAppContent
  //   },
  //   destroy: []
  // });

  await sdk.embedProject(
    containerId,
    {
      title: "Qwik Design System Example",
      description: "Qwik Design System Example",
      template: "node",
      files: {
        "index.html": STACKBLITZ_CONFIG.indexHtml,
        "package.json": STACKBLITZ_CONFIG.packageJson,
        "src/main.tsx": STACKBLITZ_CONFIG.mainTsx,
        "src/app.tsx": headlessAppContent,
        "src/vite-env.d.ts": STACKBLITZ_CONFIG.viteEnvTs,
        "tsconfig.json": STACKBLITZ_CONFIG.tsconfigJson,
        "tsconfig.app.json": STACKBLITZ_CONFIG.tsconfigAppJson,
        "tsconfig.node.json": STACKBLITZ_CONFIG.tsconfigNodeJson,
        "vite.config.ts": STACKBLITZ_CONFIG.viteConfigTs
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

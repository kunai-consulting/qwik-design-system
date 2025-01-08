import { isDev } from "@builder.io/qwik/build";
const fs = isDev ? await import("node:fs") : undefined as any;
// const { resolve } = isDev ? await import("node:path") : { resolve: undefined as any };
import type { AnatomyItem, ComponentParts, SubComponents } from "./types";
import { parseComponentAnatomy, parseSingleComponentFromDir } from "./utils";
import { resolve } from "node:path";

export function loopOnAllChildFiles(filePath: string) {
  const childComponentMatch = /[\\/](\w[\w-]*)\.tsx$/.exec(filePath);
  if (!childComponentMatch) {
    return;
  }
  const parentDir = filePath.replace(childComponentMatch[0], "");
  const componentMatch = /[\\/](\w+)$/.exec(parentDir);
  if (!componentMatch) return;
  if (!fs.existsSync(parentDir)) return;
  const componentName = componentMatch[1];

  // Add anatomy parsing
  const indexPath = resolve(parentDir, "index.ts");
  let anatomy: AnatomyItem[] = [];

  if (fs.existsSync(indexPath)) {
    anatomy = parseComponentAnatomy(indexPath, componentName);
  }

  const allParts: SubComponents = [];
  const store: ComponentParts = {
    [componentName]: allParts,
    anatomy: anatomy,
    keyboardInteractions: [],
    features: []
  };

  for (const fileName of fs.readdirSync(parentDir)) {
    if (fileName === "metadata.json" && fs.existsSync(resolve(parentDir, fileName))) {
      const metadataContent = fs.readFileSync(resolve(parentDir, fileName), "utf-8");
      const metadata = JSON.parse(metadataContent);
      store.keyboardInteractions = metadata.keyboard || [];
      store.features = metadata.features || [];
    }
    if (/\.tsx$/.test(fileName)) {
      const fullPath = resolve(parentDir, fileName);
      parseSingleComponentFromDir(fullPath, allParts);
    }
  }

  writeToDocs(filePath, componentName, store);
}

export default function autoAPI() {
  return {
    name: "watch-monorepo-changes",
    watchChange(file: string) {
      const watchPath = resolve(__dirname, "../../../libs/components");
      if (file.startsWith(watchPath)) {
        console.log("looping on all child files", file);
        loopOnAllChildFiles(file);
      }
    }
  };
}

function writeToDocs(fullPath: string, componentName: string, api: ComponentParts) {
  if (fullPath.includes("components")) {
    const relDocPath = `../src/routes/${componentName}`;
    const fullDocPath = resolve(__dirname, relDocPath);
    const dirPath = resolve(fullDocPath, "auto-api");

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    const json = JSON.stringify(api, null, 2);
    const exportedApi = `export const api = ${json};`;

    try {
      fs.writeFileSync(resolve(dirPath, "api.ts"), exportedApi);
      console.log("auto-api: successfully generated new JSON!");
    } catch (err) {
      console.error("Error writing API file:", err);
    }
  }
}

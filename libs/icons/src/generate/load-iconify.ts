import { loadCollectionFromFS } from "@iconify/utils/lib/loader/fs";
import { getIcons } from "@iconify/utils";
import type { IconifyJSON } from "@iconify/types";
import { log } from "./config";
import { readdir } from "node:fs/promises";

export async function loadIconSets(): Promise<Record<string, IconifyJSON>> {
  const collections = await scanIconifyPackages();
  log(`Found ${collections.length} Iconify collections`);

  const iconSets: Record<string, IconifyJSON> = {};

  for (const name of collections) {
    try {
      const collection = await loadCollectionFromFS(name);

      if (!collection) {
        console.error(`Failed to load collection: ${name}`);
        continue;
      }

      log(`Loaded ${name} with ${Object.keys(collection.icons).length} icons`);
      iconSets[name] = collection;
    } catch (error) {
      console.error(`Error loading ${name}:`, error);
    }
  }

  return iconSets;
}

async function scanIconifyPackages(): Promise<string[]> {
  try {
    const modulesPath = new URL("../../node_modules/@iconify", import.meta.url);
    log(`Scanning for Iconify packages in: ${modulesPath.pathname}`);

    const collections = await readdir(modulesPath);
    return collections;
  } catch (error) {
    console.error("Error scanning for Iconify packages:", error);
    return [];
  }
}

export function createIconSubset(
  collection: IconifyJSON,
  iconNames: string[]
): IconifyJSON {
  if (iconNames.includes("*")) return collection;
  const result = getIcons(collection, iconNames);
  if (!result) {
    log(`No icons found in ${collection.prefix} matching the requested names`);
    return {
      prefix: collection.prefix,
      icons: {}
    };
  }
  return result;
}

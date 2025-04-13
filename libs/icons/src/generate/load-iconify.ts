import { loadCollectionFromFS } from "@iconify/utils/lib/loader/fs";
import { getIcons } from "@iconify/utils";
import type { IconifyJSON } from "@iconify/types";
import { log } from "./config";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

export async function loadIconifyCollections(): Promise<Record<string, IconifyJSON>> {
  const collections = await findInstalledCollections();
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

async function findInstalledCollections(): Promise<string[]> {
  try {
    const nodeModulesPath = join(process.cwd(), "node_modules/@iconify-json");
    const collections = await readdir(nodeModulesPath);
    return collections;
  } catch (error) {
    console.error("Error reading iconify collections:", error);
    return [];
  }
}

export function getIconsFromCollection(
  collection: IconifyJSON,
  iconNames: string[]
): IconifyJSON {
  if (iconNames.includes("*")) return collection;
  const result = getIcons(collection, iconNames);
  if (!result) {
    log(`No icons grabbed from ${collection.prefix} in getIconsFromCollection`);
    return {
      prefix: collection.prefix,
      icons: {}
    };
  }
  return result;
}

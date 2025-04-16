import { lookupCollection, lookupCollections } from "@iconify/json";
import type { IconifyJSON } from "@iconify/types";
import { debug } from "../../config";

export async function getIconSets(): Promise<Record<string, IconifyJSON>> {
  const iconSets: Record<string, IconifyJSON> = {};

  const collections = await lookupCollections();
  debug(`Found ${Object.keys(collections).length} icon sets in @iconify/json`);

  for (const prefix in collections) {
    try {
      const collection = await lookupCollection(prefix);
      if (collection) {
        iconSets[prefix] = collection;
        debug(`Loaded ${prefix} with ${Object.keys(collection.icons).length} icons`);
      }
    } catch (error) {
      console.error(`Error loading ${prefix}:`, error);
    }
  }

  return iconSets;
}

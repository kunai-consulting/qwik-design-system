import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Convert kebab-case or snake_case to PascalCase
 * @param str - Input string
 * @returns PascalCase string
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Discover all available iconify collections from node_modules
 * @returns Record of collection names to their configurations
 */
export function discoverAllIconifyCollections(): Record<string, { iconifyPrefix: string }> {
  try {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const iconifyPath = join(currentDir, '../node_modules/@iconify/json/json');
    console.log('[icons] Looking for iconify collections at:', iconifyPath);

    const collections: Record<string, { iconifyPrefix: string }> = {};

    // Read all .json files in the iconify collections directory
    const files = readdirSync(iconifyPath).filter(file => file.endsWith('.json'));
    console.log(`[icons] Found ${files.length} .json files in iconify directory`);

    for (const file of files) {
      const prefix = file.replace('.json', '');
      const collectionName = toPascalCase(prefix);

      // Skip if collection name is not valid (contains special chars, etc.)
      if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(collectionName)) {
        console.log(`[icons] Skipping invalid collection name: ${collectionName} (from ${prefix})`);
        continue;
      }

      collections[collectionName] = { iconifyPrefix: prefix };
      console.log(`[icons] Added collection: ${collectionName} -> ${prefix}`);
    }

    console.log(`[icons] Discovered ${Object.keys(collections).length} iconify collections`);
    return collections;
  } catch (error) {
    console.error('[icons] Error discovering iconify collections:', error);
    console.log('[icons] Falling back to default packs');
    return getDefaultPacks(); // Fallback to default packs
  }
}

/**
 * Default icon packs configuration
 * @returns Record of default pack names to their configurations
 */
export function getDefaultPacks(): Record<string, { iconifyPrefix: string }> {
  return {
    Lucide: { iconifyPrefix: "lucide" },
    Heroicons: { iconifyPrefix: "heroicons" },
    Tabler: { iconifyPrefix: "tabler" }
  };
}

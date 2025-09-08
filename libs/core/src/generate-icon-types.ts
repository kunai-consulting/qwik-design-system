#!/usr/bin/env node

import { writeFileSync } from "node:fs";

// Export for testing
export { DEFAULT_PACKS, sanitizeIconName, generateIconTypes };

// Default icon packs configuration
const DEFAULT_PACKS: Record<string, { iconifyPrefix: string }> = {
  Lucide: { iconifyPrefix: "lucide" },
  Heroicons: { iconifyPrefix: "heroicons" },
  Tabler: { iconifyPrefix: "tabler" }
};

/**
 * Convert kebab-case to PascalCase
 * @param str - kebab-case string
 * @returns PascalCase string
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Sanitize icon name (handle leading digits, etc.)
 * @param name - Icon name in kebab-case
 * @returns Sanitized PascalCase name
 */
function sanitizeIconName(name: string): string {
  // Handle leading digits by prefixing with "Icon"
  if (/^\d/.test(name)) {
    return `Icon${toPascalCase(name)}`;
  }
  return toPascalCase(name);
}

/**
 * Generate type declarations for all icons in configured packs
 */
async function generateIconTypes() {
  console.log("Generating icon type declarations...");

  const outputPath = "../components/lib-types/virtual-qds-icons.d.ts";
  const declarations: string[] = [];
  const iconCounts: Record<string, number> = {};

  // Header
  declarations.push(`import type { Component, PropsOf } from "@qwik.dev/core";`);
  declarations.push(``);
  declarations.push(`export type Icon = Component<PropsOf<"svg">>;`);
  declarations.push(``);

  // Generate declarations for each pack
  for (const [packName, packConfig] of Object.entries(DEFAULT_PACKS)) {
    const { iconifyPrefix } = packConfig;

    console.log(`Loading ${packName} collection (${iconifyPrefix})...`);

    try {
      // Use direct import instead of lookupCollection
      const collectionModule = await import(`@iconify/json/json/${iconifyPrefix}.json`);
      const collection = collectionModule.default;

      if (!collection) {
        console.warn(`Collection not found: ${iconifyPrefix}`);
        continue;
      }

      console.log(`Collection loaded, checking icons...`);
      if (!collection.icons) {
        console.warn(`Collection ${iconifyPrefix} has no icons property`);
        continue;
      }

      const icons = collection.icons;
      const iconNames = Object.keys(icons).sort();

      console.log(`Found ${iconNames.length} icons in ${packName}`);

      declarations.push(`// ${packName} icons (${iconifyPrefix})`);
      declarations.push(`export namespace ${packName} {`);

      for (const iconName of iconNames) {
        const pascalName = sanitizeIconName(iconName);
        declarations.push(`  export const ${pascalName}: Icon;`);
      }

      declarations.push(`}`);
      declarations.push(``);

      iconCounts[packName] = iconNames.length;
      console.log(`✓ ${packName}: ${iconNames.length} icons`);

    } catch (error) {
      console.error(`Error loading ${packName} collection:`, error);
      continue;
    }
  }


  const output = declarations.join('\n');

  writeFileSync(outputPath, output, 'utf-8');

  console.log("✓ Generated type declarations:");
  for (const [packName, count] of Object.entries(iconCounts)) {
    console.log(`  - ${packName}: ${count} icons`);
  }
  console.log(`✓ Output: ${outputPath}`);
}

// Run the generator
generateIconTypes().catch(console.error);


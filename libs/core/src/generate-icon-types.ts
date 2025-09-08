#!/usr/bin/env node

import { writeFileSync } from "node:fs";
import { lookupCollection } from "@iconify/json";
import type { IconifyJSON } from "@iconify/types";

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
  declarations.push(`// Ambient module declaration for the virtual icons module`);
  declarations.push(`// Auto-generated from Iconify collections - DO NOT EDIT MANUALLY`);
  declarations.push(`declare module "virtual:qds-icons" {`);
  declarations.push(`  import type { Component, PropsOf } from "@qwik.dev/core";`);
  declarations.push(``);
  declarations.push(`  export type Icon = Component<PropsOf<"svg">>;`);
  declarations.push(``);
  declarations.push(`  // Type declarations generated from Iconify collections`);
  declarations.push(`  // Only actually used icons will be exported at runtime`);
  declarations.push(``);

  // Generate declarations for each pack
  for (const [packName, packConfig] of Object.entries(DEFAULT_PACKS)) {
    const { iconifyPrefix } = packConfig;

    console.log(`Loading ${packName} collection (${iconifyPrefix})...`);

    try {
      const collection = lookupCollection(iconifyPrefix);
      if (!collection) {
        console.warn(`Collection not found: ${iconifyPrefix}`);
        continue;
      }

      const icons = collection.icons;
      const iconNames = Object.keys(icons).sort();

      declarations.push(`  // ${packName} icons (${iconifyPrefix})`);
      declarations.push(`  export const ${packName}: {`);

      for (const iconName of iconNames) {
        const pascalName = sanitizeIconName(iconName);
        declarations.push(`    readonly ${pascalName}: Icon;`);
      }

      declarations.push(`  };`);
      declarations.push(``);

      iconCounts[packName] = iconNames.length;
      console.log(`✓ ${packName}: ${iconNames.length} icons`);

    } catch (error) {
      console.error(`Error loading ${packName} collection:`, error);
      continue;
    }
  }

  declarations.push(`}`);
  declarations.push(``);

  // Generate namespace exports
  declarations.push(`// Namespace exports for direct usage`);
  declarations.push(``);

  for (const [packName, packConfig] of Object.entries(DEFAULT_PACKS)) {
    const { iconifyPrefix } = packConfig;

    try {
      const collection = lookupCollection(iconifyPrefix);
      if (!collection) continue;

      const icons = collection.icons;
      const iconNames = Object.keys(icons).sort();

      declarations.push(`export namespace ${packName} {`);

      for (const iconName of iconNames) {
        const pascalName = sanitizeIconName(iconName);
        declarations.push(`  export const ${pascalName}: Icon;`);
      }

      declarations.push(`}`);
      declarations.push(``);

    } catch (error) {
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

// Run the generator if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateIconTypes().catch(console.error);
}

export { generateIconTypes };

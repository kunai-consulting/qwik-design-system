#!/usr/bin/env node

import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Export for testing
export { sanitizeIconName, generateIconTypes, generateRuntimeProxies };

// Import shared utilities
import { discoverAllIconifyCollections, toPascalCase } from "../utils/icons";

// Export shared utilities for convenience
export { discoverAllIconifyCollections, toPascalCase };

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
 * @param packs - Icon packs to generate types for (defaults to all discovered packs)
 */
async function generateIconTypes(packs?: Record<string, { iconifyPrefix: string }>) {
  console.log("Generating icon type declarations...");

  const packsToUse = packs || discoverAllIconifyCollections();
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const outputPath = join(scriptDir, "../../components/lib-types/virtual-qds-icons.d.ts");
  const declarations: string[] = [];
  const iconCounts: Record<string, number> = {};

  // Header
  declarations.push('import type { Component, PropsOf } from "@qwik.dev/core";');
  declarations.push("");
  declarations.push('export type Icon = Component<PropsOf<"svg">>;');
  declarations.push("");

  // Generate declarations for each pack
  for (const [packName, packConfig] of Object.entries(packsToUse)) {
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

      console.log("Collection loaded, checking icons...");
      if (!collection.icons) {
        console.warn(`Collection ${iconifyPrefix} has no icons property`);
        continue;
      }

      const icons = collection.icons;
      const iconNames = Object.keys(icons).sort();

      console.log(`Found ${iconNames.length} icons in ${packName}`);

      // Skip collections with no icons
      if (iconNames.length === 0) {
        console.log(`⚠ Skipping ${packName}: no icons found`);
        continue;
      }

      declarations.push(`// ${packName} icons (${iconifyPrefix})`);
      declarations.push(`export namespace ${packName} {`);

      for (const iconName of iconNames) {
        const pascalName = sanitizeIconName(iconName);
        declarations.push(`  export const ${pascalName}: Icon;`);
      }

      declarations.push("}");
      declarations.push("");

      iconCounts[packName] = iconNames.length;
      console.log(`✓ ${packName}: ${iconNames.length} icons`);
    } catch (error) {
      console.error(`Error loading ${packName} collection:`, error);
    }
  }

  const output = declarations.join("\n");

  if (existsSync(outputPath)) {
    writeFileSync(outputPath, output, "utf-8");
  }

  console.log("✓ Generated type declarations:");
  for (const [packName, count] of Object.entries(iconCounts)) {
    console.log(`  - ${packName}: ${count} icons`);
  }
  console.log(`✓ Output: ${outputPath}`);
}

/**
 * Generate runtime proxy exports for all icon packs
 * @param outputPath - Path to write the generated file
 * @param packs - Icon packs to generate proxies for (defaults to all discovered packs)
 */
async function generateRuntimeProxies(
  outputPath?: string,
  packs?: Record<string, { iconifyPrefix: string }>
) {
  console.log("Generating runtime proxy exports...");

  const packsToUse = packs || discoverAllIconifyCollections();
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const defaultOutputPath = join(scriptDir, "../../components/src/icons-runtime.ts");
  const finalOutputPath = outputPath || defaultOutputPath;
  const declarations: string[] = [];

  // Header
  declarations.push("// Runtime exports for icon namespaces");
  declarations.push(
    "// These are dummy exports that provide TypeScript with runtime values"
  );
  declarations.push(
    "// The actual functionality comes from the Vite plugin transformation at build time"
  );
  declarations.push("");
  declarations.push('import type { Component, PropsOf } from "@qwik.dev/core";');
  declarations.push(
    'import type * as GeneratedTypes from "../lib-types/virtual-qds-icons";'
  );
  declarations.push("");
  declarations.push('type IconComponent = Component<PropsOf<"svg">>;');
  declarations.push("");
  declarations.push("const proxyHandler = {");
  declarations.push(
    "  // biome-ignore lint/suspicious/noExplicitAny: need any type here"
  );
  declarations.push("  get(target: any, prop: string | symbol) {");
  declarations.push(
    "    // This will never be called at runtime - the Vite plugin transforms the JSX"
  );
  declarations.push(
    "    throw new Error(`Icon components should be transformed by the Vite plugin. Tried to access: ${String(prop)}`);"
  );
  declarations.push("  }");
  declarations.push("};");
  declarations.push("");

  // Generate proxy exports for each pack (skip packs with 0 icons)
  const packNames = Object.keys(packsToUse).sort();

  // First, check which collections actually have icons by trying to load them
  const packsWithIcons: string[] = [];

  for (const packName of packNames) {
    const packConfig = packsToUse[packName];
    try {
      const collectionModule = await import(
        `@iconify/json/json/${packConfig.iconifyPrefix}.json`
      );
      const collection = collectionModule.default;
      if (collection?.icons && Object.keys(collection.icons).length > 0) {
        packsWithIcons.push(packName);
      }
    } catch (error) {
      console.log(`⚠ Skipping ${packName}: failed to load or no icons`);
    }
  }

  for (const packName of packsWithIcons) {
    declarations.push("// Use the generated types from the .d.ts file");
    declarations.push(
      `export const ${packName}: typeof GeneratedTypes.${packName} = new Proxy({}, proxyHandler);`
    );
  }

  const output = declarations.join("\n");

  if (existsSync(finalOutputPath)) {
    writeFileSync(finalOutputPath, output, "utf-8");
  }

  console.log(`✓ Generated runtime proxies for ${packNames.length} packs:`);
  for (const name of packNames) {
    console.log(`  - ${name}`);
  }
  console.log(`✓ Output: ${finalOutputPath}`);
}

// Run the generators
async function main() {
  try {
    console.log("🚀 Starting icon generation process...\n");

    // Discover all available packs first
    const allPacks = discoverAllIconifyCollections();

    // Generate type declarations first
    await generateIconTypes(allPacks);

    console.log(`\n${"=".repeat(50)}\n`);

    // Generate runtime proxies
    await generateRuntimeProxies(undefined, allPacks);

    console.log("\n✅ Icon generation completed successfully!");
  } catch (error) {
    console.error("❌ Error during icon generation:", error);
    process.exit(1);
  }
}

main();

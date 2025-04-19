import { mkdir, rm, writeFile, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { IconifyIcon } from "@iconify/types";
import { iconToSVG } from "@iconify/utils";
import { createSymbolName } from "@kunai-consulting/qwik-utils";
import { kebabCase, pascalCase } from "change-case";
import { transform } from "esbuild";
import { config, debug } from "../../config";
import { getIconSets } from "./get-icons";

interface GeneratedIcon {
  path: string;
  pascalCaseName: string;
  kebabCaseName: string;
  symbolName: string;
}

export async function generateIcon(
  prefix: string,
  iconName: string,
  iconData: IconifyIcon
) {
  const result = iconToSVG(iconData);

  let pascalCaseName = pascalCase(iconName);

  // TODO: fix icons starting with numbers
  if (/^\d/.test(pascalCaseName)) {
    pascalCaseName = `Icon${pascalCaseName}`;
  }

  const kebabCaseName = kebabCase(pascalCaseName);
  const symbolName = createSymbolName(pascalCaseName);

  const jsxSource = `
  import { jsx } from "@builder.io/qwik/jsx-runtime";
  
  export const ${symbolName} = props => jsx('svg', {
    ...${JSON.stringify(result.attributes)},
    "data-qds-icon": "",
    ...props,
    dangerouslySetInnerHTML: ${JSON.stringify(result.body)}
  });
  `;

  const compiled = await transform(jsxSource, {
    loader: "jsx",
    jsxFactory: "jsx",
    jsxImportSource: "@builder.io/qwik",
    target: "es2020",
    format: "esm"
  });

  const outputPath = join(config.iconsDir, prefix.toLowerCase(), `${kebabCaseName}.js`);

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, compiled.code);

  return {
    path: outputPath,
    pascalCaseName,
    kebabCaseName,
    symbolName
  };
}

async function generateIndexFile(prefix: string, icons: GeneratedIcon[]) {
  const indexPath = join(
    config.iconsDir,
    prefix.toLowerCase(),
    `${prefix.toLowerCase()}.js`
  );

  const qrlExports = icons.map((icon) => {
    const relativePath = `./${icon.kebabCaseName}`;
    return `export const ${icon.pascalCaseName}Qrl = /* @__PURE__ */ qrl(() => import('./${relativePath}.js'), "${icon.symbolName}");`;
  });

  const indexContent = ['import { qrl } from "@builder.io/qwik";', ...qrlExports].join(
    "\n"
  );

  await writeFile(indexPath, indexContent);
  debug(`Created index file for ${prefix} with direct QRL exports`);
}

async function generateDeclarationFile(prefix: string, icons: GeneratedIcon[]) {
  const declarationPath = join(
    config.iconsDir,
    prefix.toLowerCase(),
    `${prefix.toLowerCase()}.d.ts`
  );

  const qrlDeclarations = icons.map(
    (icon) =>
      `export declare const ${icon.pascalCaseName}Qrl: QRL<Component<ComponentProps<'svg'>>>;`
  );

  const declarationContent = [
    "import type { Component, ComponentProps, QRL } from '@builder.io/qwik';",
    ...qrlDeclarations,
    ""
  ].join("\n");

  await writeFile(declarationPath, declarationContent);
  debug(`Created declaration file for ${prefix} with direct QRL type exports`);
}

async function generateRootIndex(
  prefixes: string[],
  iconsByPrefix: Record<string, GeneratedIcon[]>
) {
  const indexPath = join(config.iconsDir, "all.js");
  const rootIndexPath = join(config.iconsDir, "..", "index.qwik.mjs");

  const imports: string[] = [
    'import { componentQrl } from "@builder.io/qwik";' // Need componentQrl
  ];
  const exports: string[] = [];

  for (const prefix of prefixes) {
    const icons = iconsByPrefix[prefix];
    if (!icons || icons.length === 0) continue; // Skip empty packs

    const packPascalCase = pascalCase(prefix);
    // Import the QRLs for this pack
    imports.push(
      `import * as ${packPascalCase}Qrls from './${prefix.toLowerCase()}/${prefix.toLowerCase()}.js';`
    );

    // Build the object properties string with inline componentQrl wrapping
    const packObjectProperties = icons
      .map(
        (icon) =>
          // Wrap the QRL directly within the object property definition
          `  ${icon.pascalCaseName}: /* @__PURE__ */ componentQrl(${packPascalCase}Qrls.${icon.pascalCaseName}Qrl)`
      )
      .join(",\n"); // Join properties with comma and newline

    // Export the complete object directly
    const packObjectExport = `export const ${packPascalCase} = {\n${packObjectProperties}\n};`;

    exports.push(packObjectExport, ""); // Add blank line after each object export
  }

  const allJsContent = [...imports, "", ...exports].join("\n");

  await writeFile(indexPath, allJsContent);
  debug("Created root all.js with inline QRL wrapping in exported objects");

  const indexContent = `export * from './icons/all.js';`;
  await writeFile(rootIndexPath, indexContent);
  debug("Created final index.qwik.mjs re-exporting all.js");
}

async function generateRootDeclaration(
  prefixes: string[],
  iconsByPrefix: Record<string, GeneratedIcon[]>
) {
  const declarationPath = join(config.iconsDir, "all.d.ts");
  const rootDeclarationPath = join(config.iconsDir, "..", "index.d.ts");
  const iconTypesPath = join(config.iconsDir, "..", "icon-types.d.ts");

  const imports: string[] = [
    "import type { Component, ComponentProps } from '@builder.io/qwik';" // Need component types here
  ];
  const exports: string[] = [];

  for (const prefix of prefixes) {
    const icons = iconsByPrefix[prefix];
    if (!icons || icons.length === 0) continue;

    const packPascalCase = pascalCase(prefix);

    // Generate property declarations for the pack type
    const properties = icons
      .map((icon) => `  ${icon.pascalCaseName}: Component<ComponentProps<'svg'>>;`)
      .join("\n");

    // Declare the final exported pack type
    const packTypeExport = `export declare const ${packPascalCase}: {\n${properties}\n};`;

    exports.push(packTypeExport, ""); // Add blank line
  }

  const allDtsContent = [...imports, "", ...exports].join("\n");

  await writeFile(declarationPath, allDtsContent);
  debug("Created root all.d.ts declaring final pack object types");

  const indexDtsContent = [
    "export type { Icon } from './icon-types';",
    "export * from './icons/all';"
  ].join("\n");
  await writeFile(rootDeclarationPath, indexDtsContent);
  debug("Created final index.d.ts re-exporting all.d.ts and Icon type");

  const iconTypeSource = join(__dirname, "..", "icon-types.d.ts");
  try {
    await copyFile(iconTypeSource, iconTypesPath);
    debug(`Copied icon-types.d.ts to ${iconTypesPath}`);
  } catch (err) {
    console.error(
      `Error copying icon-types.d.ts: ${err}. Please ensure it exists at ${iconTypeSource}`
    );
  }
}

export async function generateIcons() {
  debug("Starting icon generation...");

  await rm(config.iconsDir, { recursive: true, force: true });
  await mkdir(config.iconsDir, { recursive: true });

  const iconSets = await getIconSets();
  const prefixes = Object.keys(iconSets); // Get initial prefixes
  debug(`Processing ${prefixes.length} icon sets initially`);

  const iconsByPrefix: Record<string, GeneratedIcon[]> = {};

  for (const prefix of prefixes) {
    debug(`Processing icon set: ${prefix}`);

    const collection = iconSets[prefix];
    const iconNames = Object.keys(collection.icons);

    const iconLimit = config.iconLimit;
    const limitedIconNames = iconLimit ? iconNames.slice(0, iconLimit) : iconNames;

    debug(`Generating ${limitedIconNames.length} icons for ${prefix}`);

    const generatedIcons = await Promise.all(
      limitedIconNames.map(async (iconName) => {
        try {
          return await generateIcon(prefix, iconName, collection.icons[iconName]);
        } catch (error) {
          console.error(`Error generating icon ${prefix}:${iconName}:`, error);
          return null;
        }
      })
    );

    const validIcons = generatedIcons.filter(
      (icon): icon is GeneratedIcon => icon !== null
    );

    iconsByPrefix[prefix] = validIcons;

    if (validIcons.length > 0) {
      await generateIndexFile(prefix, validIcons);
      await generateDeclarationFile(prefix, validIcons);
    }

    debug(`Completed ${prefix}: ${validIcons.length} icons generated`);
  }

  // Filter out 'carbon' (temporary test from previous step, keep for now)
  const filteredPrefixes = prefixes.filter((p) => p.toLowerCase() !== "carbon");
  debug(
    `Generating root files for ${filteredPrefixes.length} prefixes (excluding carbon)`
  );

  // Pass iconsByPrefix to the root generation functions
  await generateRootIndex(filteredPrefixes, iconsByPrefix);
  await generateRootDeclaration(filteredPrefixes, iconsByPrefix);

  debug("Icon generation complete");
}

export async function run() {
  await generateIcons();
}

run().catch(console.error);

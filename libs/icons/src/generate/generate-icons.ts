import { mkdir, writeFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { iconToSVG } from "@iconify/utils";
import { transform } from "esbuild";
import { camelCase, kebabCase, pascalCase } from "change-case";
import { getIconSets } from "./get-icons";
import { debug, config } from "../../config";
import type { IconifyIcon } from "@iconify/types";
import { createSymbolName } from "@kunai-consulting/qwik-utils";

const baseOutputPath = join(process.cwd(), "src", "icons");

interface GeneratedIcon {
  path: string;
  camelCaseName: string;
  kebabCaseName: string;
  symbolName: string;
}

export async function generateIcon(
  prefix: string,
  iconName: string,
  iconData: IconifyIcon
) {
  const result = iconToSVG(iconData);

  const formattedName = prefix + pascalCase(iconName);
  const camelCaseName = camelCase(formattedName);
  const kebabCaseName = kebabCase(camelCaseName);
  const symbolName = createSymbolName(camelCaseName);

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

  const outputPath = join(baseOutputPath, prefix.toLowerCase(), `${kebabCaseName}.js`);

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, compiled.code);

  return {
    path: outputPath,
    camelCaseName,
    kebabCaseName,
    symbolName
  };
}

async function generateIndexFile(prefix: string, icons: GeneratedIcon[]) {
  const indexPath = join(
    baseOutputPath,
    prefix.toLowerCase(),
    `${prefix.toLowerCase()}.js`
  );

  const indexContent = [
    'import { componentQrl, qrl } from "@builder.io/qwik";',
    ...icons.map((icon) => {
      const relativePath = `./${icon.kebabCaseName}`;
      return `export const ${icon.camelCaseName} = /* @__PURE__ */ componentQrl(/* @__PURE__ */ qrl(() => import('${relativePath}.js'), "${icon.symbolName}"));`;
    })
  ].join("\n");

  await writeFile(indexPath, indexContent);
  debug(`Created index file for ${prefix} with ${icons.length} icons`);
}

async function generateRootIndex(prefixes: string[]) {
  const rootIndexPath = join(baseOutputPath, "all.js");

  const content = [
    ...prefixes.flatMap((prefix) => [
      "/**",
      ` * ${prefix} icon collection`,
      " * @typedef {import('@builder.io/qwik').Component<import('@builder.io/qwik').PropsOf<'svg'>>} IconComponent",
      " * @type {Object.<string, IconComponent>}",
      " */",
      `export * as ${pascalCase(prefix)} from './${prefix.toLowerCase()}/${prefix.toLowerCase()}.js';`
    ]),
    "",
    ...prefixes.map(
      (prefix) =>
        `/**\n * @typedef {Object.<string, IconComponent>} ${pascalCase(prefix)}Icons\n */`
    )
  ].join("\n");

  await writeFile(rootIndexPath, content);
  debug("Created root index file");
}

export async function generateIcons() {
  debug("Starting icon generation...");

  await rm(baseOutputPath, { recursive: true, force: true });
  await mkdir(baseOutputPath, { recursive: true });

  const iconSets = await getIconSets();
  const prefixes = Object.keys(iconSets);
  debug(`Processing ${prefixes.length} icon sets`);

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

    if (validIcons.length > 0) {
      await generateIndexFile(prefix, validIcons);
    }

    debug(`Completed ${prefix}: ${validIcons.length} icons generated`);
  }

  await generateRootIndex(prefixes);

  debug("Icon generation complete");
}

export async function run() {
  await generateIcons();
}

run().catch(console.error);

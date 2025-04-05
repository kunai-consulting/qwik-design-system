import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { optimize } from "svgo";
import type { IconPackConfig } from "./config.interface";
import { configs } from "./configs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconLimit = process.env.ICON_LIMIT;
const basePath = join(__dirname, "..", "..");
const baseOutputPath = join(basePath, "src", "icons");
const pageOutputPath = join(basePath, "src", "page");

const getOutputPath = (pack: IconPackConfig, name: string, ext: string) =>
  join(baseOutputPath, pack.prefix.toLowerCase(), `${name}${ext}`);

const ext = ".tsx";

function getIndexPath(pack: IconPackConfig, ext: string) {
  return getOutputPath(pack, pack.prefix.toLowerCase(), ext);
}

function getVariantPath(iconDashCase: string, pack: IconPackConfig) {
  return getOutputPath(pack, iconDashCase, ext);
}

function dashCase(input: string) {
  return input
    .replace(/(?<!^)[A-Z]/g, (match) => `-${match.toLowerCase()}`)
    .replace(/ /g, "-")
    .replace(/--+/g, "-")
    .toLowerCase();
}

export function camelCase(input: string) {
  return input
    .replace(/(?:^|[- _])+([a-z0-9])/g, (result) => {
      return result.replace(/^[- _]+/, "").toUpperCase();
    })
    .replace(/[0-9][a-z]/g, (match) => match.toUpperCase());
}

function getIconVariantNames(path: string, pack: IconPackConfig) {
  const { name, ...variants } = pack.contents.extract(path);

  if (!name) {
    throw new Error(`Cannot resolve icon name for "${path}".`);
  }

  const variantSuffix = Object.values(variants)
    .filter(Boolean)
    .map((value) => `-${value}`)
    .join("");
  const formatted = pack.prefix + camelCase(name) + variantSuffix;

  return {
    camelCase: camelCase(formatted),
    dashCase: dashCase(camelCase(formatted))
  };
}

async function generateIconVariant(file: string, pack: IconPackConfig) {
  const names = getIconVariantNames(file, pack);

  const otherColoring = pack.coloring === "fill" ? "stroke" : "fill";
  const keepColoring = pack.coloring === "keep";

  const colorAttributes = keepColoring
    ? {}
    : { [pack.coloring]: "currentColor", [otherColoring]: "none" };

  const content = (await readFile(file)).toString();
  const replaced = pack.replaceColor
    ? content.replace(new RegExp(pack.replaceColor, "g"), "currentColor")
    : content;

  const optimized = optimize(replaced, {
    plugins: [
      "removeComments",
      "removeDimensions",
      {
        name: "addAttributesToSVGElement",
        params: {
          attributes: Object.entries({
            ...colorAttributes,
            width: "1em",
            height: "1em",
            "data-qds-icon": undefined
          }).map(([key, value]) => ({ [key]: value }))
        }
      }
    ]
  }).data;

  const svgElement = optimized
    .match(/<svg[\w\W]*<\/svg>/gm)
    ?.toString()
    .replace(">", " {...props} >")
    .replace(/<!--.*?-->/g, "");

  const fileContent = [
    `import { component$, type PropsOf } from '@builder.io/qwik';`,
    `export const ${names.camelCase} = component$((props: PropsOf<"svg">) => {`,
    `  return (${svgElement});`,
    "});"
  ].join("\n");

  const path = getVariantPath(names.dashCase, pack);

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, fileContent);
  return { path, symbolName: names.camelCase, names };
}

export async function generateIcons(pack: IconPackConfig) {
  console.log(`[${pack.name}] Starting icon generation...`);
  console.time(`[${pack.name}] Total generation time`);

  const packDir = dirname(getIndexPath(pack, ".ts"));
  console.log(`[${pack.name}] Cleaning directory: ${packDir}`);
  await rm(packDir, { recursive: true, force: true });
  await mkdir(packDir, { recursive: true });

  const fileLimit = iconLimit ? Number.parseInt(iconLimit) : undefined;
  console.log(`[${pack.name}] Getting files (limit: ${fileLimit})...`);
  const files = (await pack.contents.files).slice(0, fileLimit);
  console.log(`[${pack.name}] Found ${files.length} files to process`);

  console.log(`[${pack.name}] Starting icon generation...`);
  console.time(`[${pack.name}] Icon generation time`);
  const variantsResult = await Promise.all(
    files.map(async (file, index) => {
      console.log(`[${pack.name}] Processing icon ${index + 1}/${files.length}`);
      try {
        return {
          file,
          ...(await generateIconVariant(file, pack))
        };
      } catch (error) {
        console.error(`[${pack.name}] Failed to generate variant for ${file}:`, error);
        return null;
      }
    })
  ).then((results) => results.filter(Boolean));
  console.timeEnd(`[${pack.name}] Icon generation time`);

  if (variantsResult.length === 0) {
    console.warn(`[${pack.name}] No variants generated. Skipping index creation.`);
    return;
  }

  console.log(`[${pack.name}] Creating index file...`);
  const indexContent = [
    ...variantsResult.map((variant) => {
      const relative = `./${variant.names.dashCase}`;
      return `export { ${variant.symbolName} } from '${relative}';`;
    })
  ].join("\n");

  await writeFile(getIndexPath(pack, ".js"), indexContent);
  console.log(`[${pack.name}] Index file created`);

  console.timeEnd(`[${pack.name}] Total generation time`);
  console.log(`[${pack.name}] Generated ${variantsResult.length} icons`);
}

async function createConfigs(packs: IconPackConfig[]) {
  const configs = JSON.stringify(
    packs.map(
      ({ license, licenseUrl, name, prefix, projectUrl, variants, defaultVariants }) => ({
        license,
        licenseUrl,
        name,
        prefix,
        projectUrl,
        variants,
        defaultVariants
      })
    )
  );
  const content = `export const configs = ${configs};`;

  await writeFile(join(pageOutputPath, "configs.ts"), content);
}

async function createRootIndex(packs: IconPackConfig[]) {
  const content = packs
    .map(
      (pack) =>
        `export * from './${pack.prefix.toLowerCase()}/${pack.prefix.toLowerCase()}';
`
    )
    .join("\n");

  await writeFile(join(baseOutputPath, "all.ts"), content);
}

async function cleanup() {
  await mkdir(dirname(baseOutputPath), { recursive: true });
  await mkdir(dirname(pageOutputPath), { recursive: true });

  await rm(baseOutputPath, { force: true, recursive: true });
  await rm(pageOutputPath, { force: true, recursive: true });
  await mkdir(baseOutputPath, { recursive: true });
  await mkdir(pageOutputPath, { recursive: true });
  await writeFile(join(baseOutputPath, ".gitkeep"), "");
  await writeFile(join(pageOutputPath, ".gitkeep"), "");
}

export async function run() {
  await cleanup();
  return Promise.all([
    ...configs.map(generateIcons),
    createRootIndex(configs),
    createConfigs(configs)
  ]);
}

run();

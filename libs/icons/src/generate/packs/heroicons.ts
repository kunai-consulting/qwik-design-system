import glob from "fast-glob";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

const extractRegex = /heroicons\/(?<res>[0-9]+)\/(?<style>[a-z]+)\/(?<name>[^/]+)\.svg$/;

function heroiconsExtract(path: string) {
  const { res, style, name } = extractor(extractRegex)(path);

  // For 20px icons, we treat them as mini variant
  if (res === "20") {
    return { variant: "mini", name, res };
  }

  // For other resolutions, we use the style as the variant
  if (style === "solid" || style === "outline") {
    return { variant: style, name, res };
  }

  throw new Error(`Unsupported Heroicons variant: ${style} in ${path}`);
}

export const heroiconsPack = definePack({
  name: "HeroIcons",
  prefix: "Hi",
  variants: { variant: ["solid", "outline", "mini"], res: ["20", "24"] },
  defaultVariants: { variant: "solid", res: "24" },
  contents: {
    files: glob("node_modules/heroicons/*/*/*.svg"),
    extract: heroiconsExtract
  },
  projectUrl: "https://github.com/tailwindlabs/heroicons",
  license: "MIT",
  licenseUrl: "https://opensource.org/licenses/MIT",
  coloring: "keep"
});

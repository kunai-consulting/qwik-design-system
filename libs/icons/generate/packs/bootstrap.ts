import { glob } from "node:fs/promises";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

const extractRegex = /^.*\/(?<name>.+?)(-(?<variant>fill))?\.svg/;

export const bootstrapPack = definePack({
  name: "Bootstrap",
  prefix: "Bs",
  variants: {
    variant: ["solid", "outline"]
  },
  defaultVariants: { variant: "outline" },
  contents: {
    files: Array.fromAsync(glob("node_modules/bootstrap-icons/icons/*.svg")),
    extract: extractor(extractRegex, { variant: "" })
  },
  projectUrl: "https://icons.getbootstrap.com/",
  license: "MIT",
  licenseUrl: "https://github.com/twbs/icons/blob/main/LICENSE.md",
  coloring: "keep"
});

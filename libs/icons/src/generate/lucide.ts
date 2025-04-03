import { glob } from "node:fs/promises";
import { definePack } from "./define-pack";
import { extractor } from "./extractor";

export const lucideConfig = definePack({
  name: "Lucide",
  prefix: "Lu",
  variants: {},
  defaultVariants: {},
  contents: {
    files: Array.fromAsync(glob("node_modules/lucide-static/icons/*.svg")),
    extract: extractor(/^.*\/(?<name>.+?).svg/)
  },
  projectUrl: "https://lucide.dev/",
  license: "ISC",
  licenseUrl: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
  coloring: "stroke"
});

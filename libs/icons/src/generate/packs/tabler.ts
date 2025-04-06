import glob from "fast-glob";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

const extractRegex = /^.*\/(?<variant>.+?)\/(?<name>.+?)\.svg/;

function tablerExtract(path: string) {
  const { variant, name } = extractor(extractRegex)(path);
  return {
    name,
    variant: variant === "filled" ? "filled" : "outline"
  };
}

export const tablerIconsPack = definePack({
  name: "TablerIcons",
  prefix: "Tb",
  variants: { variant: ["filled", "outline"] },
  defaultVariants: { variant: "outline" },
  download: {
    zip: "https://github.com/tabler/tabler-icons/archive/refs/heads/main.zip",
    folder: "tabler-icons-main/icons"
  },
  contents: {
    files: glob("download/TablerIcons/*/*.svg"),
    extract: tablerExtract
  },
  projectUrl: "https://tabler.io/",
  license: "MIT",
  licenseUrl: "https://github.com/tabler/tabler-icons/blob/main/LICENSE",
  coloring: "keep"
});

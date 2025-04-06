import glob from "fast-glob";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

const extractRegex = /^.*\/(?<variant>.+?)\/(?<name>.+?)\.svg/;

function iconoirExtract(path: string) {
  const { variant, name } = extractor(extractRegex)(path);
  return {
    name,
    variant: variant === "solid" ? "solid" : undefined
  };
}

export const iconoirPack = definePack({
  name: "Iconoir",
  prefix: "In",
  variants: { variant: ["solid", "regular"] },
  defaultVariants: { variant: "regular" },
  download: {
    zip: "https://github.com/iconoir-icons/iconoir/archive/refs/heads/main.zip",
    folder: "iconoir-main/icons"
  },
  contents: {
    files: glob("src/downloads/in/**/*.svg"),
    extract: iconoirExtract
  },
  projectUrl: "https://iconoir.com/",
  license: "MIT",
  licenseUrl: "https://github.com/iconoir-icons/iconoir/blob/main/LICENSE",
  coloring: "keep"
});

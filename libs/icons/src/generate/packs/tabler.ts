import { glob } from "node:fs/promises";
import { definePack } from "../define-pack";
import { extractor } from "../extractor";

export const tablerIconsPack = definePack({
  name: "TablerIcons",
  prefix: "Tb",
  variants: {},
  defaultVariants: {},
  download: {
    zip: "https://github.com/tabler/tabler-icons/archive/refs/heads/master.zip",
    folder: "tabler-icons-master/icons"
  },
  contents: {
    files: Array.fromAsync(glob("download/TablerIcons/*.svg")),
    extract: extractor(/^.*\/(?<name>.+?)\.svg/)
  },
  projectUrl: "https://tabler.io/",
  license: "MIT",
  licenseUrl: "https://github.com/tabler/tabler-icons/blob/master/LICENSE",
  coloring: "keep"
});

import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import StreamZip from "node-stream-zip";
import { join } from "node:path";
import type { IconPackConfig } from "./config.interface";
import { pipeline } from "node:stream/promises";

const basePath = "download";

export async function downloadIcons(pack: IconPackConfig) {
  if (!pack.download) {
    throw new Error("Download key required in pack for downloading.");
  }

  const outputPath = join(basePath, pack.name);
  const zipName = `${pack.name}.zip`;
  const zipPath = join(basePath, zipName);
  await mkdir(outputPath, { recursive: true });

  const response = await fetch(pack.download.zip);
  const fileStream = createWriteStream(zipPath);
  await pipeline(response.body, fileStream);

  const zip = new StreamZip.async({ file: zipPath });
  await zip.extract(pack.download.folder, outputPath);
  await zip.close();
}

import { createWriteStream } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import StreamZip from "node-stream-zip";
import { join } from "node:path";
import type { IconPackConfig } from "./config.interface";
import { pipeline } from "node:stream/promises";

export async function downloadIcons(pack: IconPackConfig, downloadsPath: string) {
  if (!pack.download) {
    throw new Error("Download key required in pack for downloading.");
  }

  console.log(`Downloading ${pack.name} icons...`);
  console.log(`Downloads path: ${downloadsPath}`);
  console.log(`Download URL: ${pack.download.zip}`);

  const outputPath = join(downloadsPath, pack.prefix.toLowerCase());
  const zipName = `${pack.prefix.toLowerCase()}.zip`;
  const zipPath = join(downloadsPath, zipName);

  console.log(`Output path: ${outputPath}`);
  console.log(`Zip path: ${zipPath}`);

  // Clean up existing files
  await rm(outputPath, { recursive: true, force: true });
  await rm(zipPath, { force: true });

  // Create directory
  await mkdir(outputPath, { recursive: true });
  console.log(`Created directory: ${outputPath}`);

  // Download and extract
  const response = await fetch(pack.download.zip);
  console.log(`Download response status: ${response.status}`);

  const fileStream = createWriteStream(zipPath);
  await pipeline(response.body, fileStream);
  console.log(`Downloaded zip file to: ${zipPath}`);

  const zip = new StreamZip.async({ file: zipPath });
  await zip.extract(pack.download.folder, outputPath);
  await zip.close();
  console.log(`Extracted files to: ${outputPath}`);

  // Clean up zip file
  await rm(zipPath);
  console.log(`Cleaned up zip file: ${zipPath}`);
}

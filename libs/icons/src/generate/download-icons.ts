#!/usr/bin/env node
import { mkdir, rm, writeFile } from "node:fs/promises";
import StreamZip from "node-stream-zip";
import { join } from "node:path";
import type { IconPackConfig } from "./config.interface";
import { configs } from "./configs";

const basePath = "src/downloads";

export async function downloadIcons(pack: IconPackConfig) {
  console.log(`[${pack.name}] Starting download process...`);

  if (!pack.download) {
    console.log(`[${pack.name}] No download configuration, skipping...`);
    return;
  }

  const outputPath = join(basePath, pack.prefix.toLowerCase());
  const zipName = `${pack.prefix.toLowerCase()}.zip`;
  const zipPath = join(basePath, zipName);

  console.log(`[${pack.name}] Cleaning up existing files...`);
  await rm(outputPath, { recursive: true, force: true });
  await rm(zipPath, { force: true });

  console.log(`[${pack.name}] Creating output directory...`);
  await mkdir(outputPath, { recursive: true });

  console.log(`[${pack.name}] Downloading from ${pack.download.zip}...`);
  const response = await fetch(pack.download.zip);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
  }

  console.log(`[${pack.name}] Writing to ${zipPath}...`);
  const blob = await response.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());
  await writeFile(zipPath, buffer);

  console.log(`[${pack.name}] Extracting to ${outputPath}...`);
  const zip = new StreamZip.async({ file: zipPath });
  await zip.extract(pack.download.folder, outputPath);
  await zip.close();

  console.log(`[${pack.name}] Cleaning up zip file...`);
  await rm(zipPath);
  console.log(`[${pack.name}] Download complete!`);
}

export async function run() {
  console.log("Starting icon download process...");
  const packsToDownload = configs.filter((pack) => pack.download);
  console.log(`Found ${packsToDownload.length} packs to download`);

  if (packsToDownload.length === 0) {
    console.log("No packs with download configuration found!");
    return;
  }

  await Promise.all(packsToDownload.map(downloadIcons));
  console.log("All downloads completed!");
}

// Run the script
run().catch((error) => {
  console.error("Error downloading icons:", error);
  process.exit(1);
});

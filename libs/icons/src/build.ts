import { mkdir, copyFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { resolver, debug } from "../config";

const libDir = resolver("./lib");
const typesDir = resolver("./lib-types");
const srcIconsDir = resolver("./src/icons");
const libIconsDir = resolver("./lib/icons");

async function cleanDir(dir: string) {
  debug(`Cleaning directory: ${dir}`);
  if (existsSync(dir)) {
    await rm(dir, { recursive: true, force: true });
  }
  await mkdir(dir, { recursive: true });
}

async function copyDirectories(src: string, dest: string) {
  const entries = await readdir(src, { withFileTypes: true });
  debug(`Copying ${entries.length} items from ${src} to ${dest}`);
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      debug(`Creating directory: ${destPath}`);
      await mkdir(destPath, { recursive: true });
      await copyDirectories(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

async function buildLib() {
  debug("Starting icon library build...");

  debug("Cleaning output directories");
  await cleanDir(libDir);
  await cleanDir(typesDir);

  debug("Generating ES module");
  await writeFile(join(libDir, "index.qwik.mjs"), `export * from "./icons/all.js";`);

  debug("Generating CommonJS module");
  await writeFile(
    join(libDir, "index.qwik.cjs"),
    `"use strict";\nObject.assign(exports, require("./icons/all.js"));`
  );

  debug("Generating type definitions");
  await writeFile(join(typesDir, "index.d.ts"), `export * from "./icons/all";`);

  debug("Copying icon files");
  await mkdir(libIconsDir, { recursive: true });
  await copyDirectories(srcIconsDir, libIconsDir);

  debug("Build complete! ✅");
}

buildLib().catch((error) => {
  console.error("Build failed:", error);
});

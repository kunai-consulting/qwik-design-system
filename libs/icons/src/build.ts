import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { debug, resolver } from "../config";

const libDir = resolver("./lib");
const typesDir = resolver("./lib-types");
const srcIconsDir = resolver("./src/icons");
const libIconsDir = resolver("./lib/icons");
const typesIconsDir = resolver("./lib-types/icons");

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

async function copyTypeDefinitions(src: string, dest: string) {
  const entries = await readdir(src, { withFileTypes: true });
  debug(`Copying type definitions from ${src} to ${dest}`);

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      debug(`Creating directory: ${destPath}`);
      await mkdir(destPath, { recursive: true });

      const dirEntries = await readdir(srcPath, { withFileTypes: true });
      for (const dirEntry of dirEntries) {
        if (dirEntry.isFile() && dirEntry.name.endsWith(".d.ts")) {
          const dirSrcPath = join(srcPath, dirEntry.name);
          const dirDestPath = join(destPath, dirEntry.name);
          await copyFile(dirSrcPath, dirDestPath);
        }
      }

      await copyTypeDefinitions(srcPath, destPath);
    } else if (entry.name.endsWith(".d.ts")) {
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

  debug("Creating types directory structure");
  await mkdir(typesIconsDir, { recursive: true });

  debug("Generating type definitions");
  await writeFile(join(typesDir, "index.d.ts"), `export * from "./icons/all";`);

  debug("Copying icon files to lib directory");
  await mkdir(libIconsDir, { recursive: true });
  await copyDirectories(srcIconsDir, libIconsDir);

  debug("Copying type definitions to lib-types directory");
  await copyTypeDefinitions(srcIconsDir, typesIconsDir);

  // Ensure all.d.ts is copied to the lib-types/icons directory
  if (existsSync(join(srcIconsDir, "all.d.ts"))) {
    await copyFile(join(srcIconsDir, "all.d.ts"), join(typesIconsDir, "all.d.ts"));
    debug("Copied all.d.ts to lib-types/icons directory");
  } else {
    console.error("Warning: all.d.ts not found in the source directory");
  }

  debug("Build complete! ✅");
}

buildLib().catch((error) => {
  console.error("Build failed:", error);
});

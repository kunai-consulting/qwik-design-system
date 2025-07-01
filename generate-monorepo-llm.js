import fs from "node:fs";
import path from "node:path";
import { parseSync } from "oxc-parser";

const EXCLUDED_PATHS = [
  path.normalize("apps/docs/dist/build"),
  path.normalize("apps/docs/server"),
  path.normalize("apps/component-tests"),
  path.normalize("apps/docs/src/docs-widgets"),
  path.normalize("apps/docs/src/mdx")
];

function isExcluded(filepath) {
  return EXCLUDED_PATHS.some((excluded) => filepath.includes(excluded));
}

function getAllFiles(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  // biome-ignore lint/complexity/noForEach: <explanation>
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    if (isExcluded(filepath)) return;
    if (
      fs.statSync(filepath).isDirectory() &&
      !file.startsWith(".") &&
      file !== "node_modules"
    ) {
      getAllFiles(filepath, filelist);
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      filelist.push(filepath);
    }
  });
  return filelist;
}

function extractExportsWithOxc(content, filepath = "") {
  try {
    const ast = parseSync(filepath, content);
    const program = ast?.body ?? ast?.program?.body;

    if (!Array.isArray(program)) {
      throw new Error("ast.body is not iterable");
    }

    const exports = [];

    for (const node of program) {
      if (node.type === "ExportNamedDeclaration" && node.declaration) {
        const decl = node.declaration;
        if (decl.type === "FunctionDeclaration" || decl.type === "ClassDeclaration") {
          exports.push(decl.id?.name);
        } else if (decl.type === "VariableDeclaration") {
          for (const v of decl.declarations) {
            if (v.id.type === "Identifier") {
              exports.push(v.id.name);
            }
          }
        }
      } else if (
        node.type === "FunctionDeclaration" ||
        node.type === "ClassDeclaration"
      ) {
        if (node.id?.name) {
          exports.push(node.id.name);
        }
      }
    }

    return exports.filter(Boolean);
  } catch (e) {
    console.warn(`Failed to parse ${filepath}: ${e.message}`);
    return [];
  }
}

function getDescription(folderPath) {
  const pkgPath = path.join(folderPath, "package.json");
  const readmePath = path.join(folderPath, "README.md");

  if (fs.existsSync(pkgPath)) {
    try {
      const json = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      if (json.description) return json.description;
    } catch {}
  }

  if (fs.existsSync(readmePath)) {
    const readme = fs.readFileSync(readmePath, "utf-8").split("\n");
    return readme.find((line) => line.trim()) || "";
  }

  return "";
}

function generateSummary(rootDir) {
  const folders = fs
    .readdirSync(rootDir)
    .filter(
      (f) =>
        fs.statSync(path.join(rootDir, f)).isDirectory() &&
        !f.startsWith(".") &&
        f !== "node_modules"
    );

  let output = `<!-- @source https://qwik.design/llms.txt -->

# Monorepo Overview

## Docs
https://github.com/kunai-consulting/qwik-design-system/tree/main/apps/docs

## Components Library
https://github.com/kunai-consulting/qwik-design-system/tree/main/libs/components

## Icons Library
https://github.com/kunai-consulting/qwik-design-system/tree/main/libs/icons

## Utils Library
https://github.com/kunai-consulting/qwik-design-system/tree/main/libs/utils

## Root package.json
https://github.com/kunai-consulting/qwik-design-system/blob/main/package.json

## Linter and Formatter - Biome
https://github.com/kunai-consulting/qwik-design-system/blob/main/biome.json

We use [pnpm](https://pnpm.io/) for package management.

We use [Vitest](https://github.com/kunai-consulting/qwik-design-system/blob/main/vitest.config.ts) for testing.

----

`;

  for (const folder of folders) {
    const fullPath = path.join(rootDir, folder);
    output += `## ${folder}\n`;
    const desc = getDescription(fullPath);
    if (desc) output += `- Description: ${desc}\n`;

    const files = getAllFiles(fullPath);
    const fileSummaries = [];

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8");
      const exports = extractExportsWithOxc(content, file);
      if (exports.length > 0) {
        fileSummaries.push(`  - ${path.relative(rootDir, file)}: ${exports.join(", ")}`);
      }
    }

    if (fileSummaries.length) {
      output += `- Key functions/classes:\n${fileSummaries.join("\n")}\n`;
    }

    output += "\n";
  }

  return output;
}

const summary = generateSummary(process.cwd());
fs.writeFileSync(".llm.txt", summary);
console.log("✅ .llm.txt generated successfully.");

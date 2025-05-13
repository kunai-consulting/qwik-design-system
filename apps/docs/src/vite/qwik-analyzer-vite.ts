import fs from "node:fs";
import oxc from "oxc-parser";
import type { PluginOption } from "vite";
import { generate as astringGenerate } from "astring";

import type { JSXElement } from "@oxc-project/types";

import { updateStaticProps } from "./jsx-transform";
import {
  checkImportsFromPackage,
  findComponentWithinParent,
  resolveImportSources,
  findIndirectComponents
} from "./component-analyzer";

let isDebugMode = false;

export function debug(message: string): void {
  if (isDebugMode) {
    console.log(`[qwik-ds] ${message}`);
  }
}

/**
 * Component that may wrap our target component in its JSX.
 */
export interface CandidateComponent {
  componentName: string;
  astNode: JSXElement;
  importSource?: string;
  resolvedPath?: string;
  providesDescription?: boolean;
}

const analysisResults = new Map<string, boolean>();

export function qwikAnalyzer(options?: { debug?: boolean }): PluginOption {
  isDebugMode = options?.debug ?? false;

  return {
    name: "qwik-analyzer",
    enforce: "pre",
    async load(id) {
      const cleanedId = id.split("?")[0];
      const targetPathPrefix =
        "/Users/jackshelton/dev/kunai/qwik-design-system/apps/docs/src/routes/";

      if (cleanedId.endsWith(".tsx") && cleanedId.startsWith(targetPathPrefix)) {
        try {
          const rawCode = fs.readFileSync(cleanedId, "utf-8");
          const parseResult = oxc.parseSync(cleanedId, rawCode, { sourceType: "module" });
          if (parseResult.errors && parseResult.errors.length > 0) {
            console.error(`[qwik-ds] Errors parsing ${cleanedId}:`, parseResult.errors);
          }
          const ast = parseResult.program;

          const importsFromPackage = checkImportsFromPackage(
            ast,
            "@kunai-consulting/qwik"
          );

          if (!importsFromPackage) {
            analysisResults.set(cleanedId, false);
            return null;
          }

          debug(`Processing route file: ${cleanedId}`);

          const { foundDirectly: foundDescriptionInRoot, candidateComponents } =
            findComponentWithinParent(ast, "Checkbox.Root", "Checkbox.Description");

          resolveImportSources(ast, candidateComponents);

          let indirectDescriptionFound = false;
          if (candidateComponents.length > 0) {
            indirectDescriptionFound = await findIndirectComponents(
              candidateComponents,
              cleanedId,
              this
            );
          }

          const hasDescription = foundDescriptionInRoot || indirectDescriptionFound;
          analysisResults.set(cleanedId, hasDescription);
          debug(`Stored analysis for ${cleanedId}: ${hasDescription}`);

          if (hasDescription) {
            if (foundDescriptionInRoot) {
              debug("Found Checkbox.Description directly within a Checkbox.Root!");
            } else {
              debug("Found Checkbox.Description indirectly via an imported component!");
              for (const c of candidateComponents) {
                if (c.providesDescription) {
                  debug(`  - Via: ${c.componentName} (from ${c.importSource})`);
                }
              }
            }
          } else {
            debug("Did NOT find Checkbox.Description directly or indirectly.");
          }
        } catch (e) {
          console.error(`[qwik-ds] Error reading file ${cleanedId}:`, e);
        }
      }
      return null;
    },
    transform(code, id) {
      const cleanedId = id.split("?")[0];
      const targetPathPrefix =
        "/Users/jackshelton/dev/kunai/qwik-design-system/apps/docs/src/routes/";

      if (cleanedId.endsWith(".tsx") && cleanedId.startsWith(targetPathPrefix)) {
        const hasDescription = analysisResults.get(cleanedId);

        if (typeof hasDescription !== "boolean") {
          console.warn(
            `[qwik-ds] No analysis result for ${cleanedId}, skipping transform.`
          );
          return null;
        }

        debug(`Transforming ${cleanedId}, hasDescription: ${hasDescription}`);

        try {
          const parseResult = oxc.parseSync(cleanedId, code, { sourceType: "module" });
          if (parseResult.errors && parseResult.errors.length > 0) {
            console.error(`[qwik-ds] Errors parsing ${cleanedId}:`, parseResult.errors);
          }
          const ast = parseResult.program;

          const isFileModified = updateStaticProps(ast, hasDescription, cleanedId);

          if (isFileModified) {
            debug(`Attempting to generate code with astring for ${ast}`);
            const outputCode = astringGenerate(ast);
            debug(`Code after transformation: ${outputCode.substring(0, 100)}...`);
            return {
              code: outputCode,
              map: null
            };
          }
        } catch (e) {
          console.error(`[qwik-ds] Error transforming ${cleanedId}:`, e);
          return null;
        }
      }
      return null;
    }
  };
}

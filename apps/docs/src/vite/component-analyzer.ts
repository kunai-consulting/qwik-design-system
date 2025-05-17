import fs from "node:fs";
import oxc from "oxc-parser";
import { walk } from "oxc-walker";
import type { Node, Program, JSXElement, ImportDeclaration } from "@oxc-project/types";

import { getJsxElementName } from "./ast-utils";
import { debug, type CandidateComponent } from "./qwik-analyzer-vite";

/**
 * Checks if the AST contains imports from a specific package.
 *
 * @param ast Program AST to analyze
 * @param packageName Name of the package to check for
 * @returns true if the package is imported
 */
export function checkImportsFromPackage(ast: Program, packageName: string): boolean {
  let importsFromPackage = false;

  walk(ast, {
    enter: (node: Node) => {
      if (importsFromPackage) return false;
      if (node.type === "ImportDeclaration") {
        const importDecl = node as ImportDeclaration;
        if (importDecl.source.value === packageName) {
          importsFromPackage = true;
          return false;
        }
      }
    }
  });

  return importsFromPackage;
}

/**
 * Finds a specific child component within a parent component.
 * Tracks parent component instances and searches for child components within them.
 *
 * @param ast Program AST to analyze
 * @param parentComponent Name of the parent component to look within
 * @param childComponent Name of the child component to find
 * @returns Object with results of the search
 */
export function findComponentWithinParent(
  ast: Program,
  parentComponent: string,
  childComponent: string
): {
  foundDirectly: boolean;
  candidateComponents: CandidateComponent[];
} {
  let foundDirectly = false;
  const candidateComponents: CandidateComponent[] = [];
  const parentComponentStack: boolean[] = [];

  walk(ast, {
    enter: (node: Node) => {
      if (node.type === "JSXElement") {
        if (foundDirectly && parentComponentStack.length === 0) return;

        const jsxNode = node as JSXElement;
        const elementName = getJsxElementName(jsxNode.openingElement.name);

        if (elementName === parentComponent) {
          parentComponentStack.push(true);
        } else if (
          elementName === childComponent &&
          parentComponentStack.length > 0 &&
          parentComponentStack[parentComponentStack.length - 1]
        ) {
          foundDirectly = true;
        } else if (
          parentComponentStack.length > 0 &&
          parentComponentStack[parentComponentStack.length - 1] &&
          jsxNode.openingElement.name.type === "JSXIdentifier"
        ) {
          if (
            elementName &&
            !elementName.startsWith(`${parentComponent.split(".")[0]}.`)
          ) {
            candidateComponents.push({
              componentName: elementName,
              astNode: jsxNode
            });
          }
        }
      }
    },
    leave: (node: Node) => {
      if (node.type === "JSXElement") {
        const jsxNode = node as JSXElement;
        const elementName = getJsxElementName(jsxNode.openingElement.name);
        if (elementName === parentComponent) {
          if (parentComponentStack.length > 0) {
            parentComponentStack.pop();
          }
        }
      }
    }
  });

  return { foundDirectly, candidateComponents };
}

/**
 * Resolves import sources for component names.
 *
 * @param ast Program AST to analyze
 * @param candidateComponents List of components to resolve
 */
export function resolveImportSources(
  ast: Program,
  candidateComponents: CandidateComponent[]
): void {
  walk(ast, {
    enter: (node: Node) => {
      if (node.type === "ImportDeclaration") {
        const importDecl = node as ImportDeclaration;
        for (const specifier of importDecl.specifiers || []) {
          let localName: string | undefined;
          if (
            specifier.type === "ImportSpecifier" ||
            specifier.type === "ImportDefaultSpecifier" ||
            specifier.type === "ImportNamespaceSpecifier"
          ) {
            localName = specifier.local.name;
          }

          if (localName) {
            for (const candidate of candidateComponents) {
              if (candidate.componentName === localName) {
                candidate.importSource = importDecl.source.value;
              }
            }
          }
        }
      }
    }
  });
}

/**
 * Finds components that indirectly include a target component through imports.
 *
 * @param candidateComponents Components to check for imported target components
 * @param importer Path of the importing file (needed for resolution)
 * @param pluginContext Vite plugin context with resolve method
 * @returns True if any indirect component was found
 */
export async function findIndirectComponents(
  candidateComponents: CandidateComponent[],
  importer: string,
  pluginContext: {
    resolve: (id: string, importer: string) => Promise<{ id: string } | null>;
  }
): Promise<boolean> {
  let indirectComponentFound = false;

  debug("Analyzing candidate components for indirect Checkbox.Description...");

  for (const candidate of candidateComponents) {
    if (candidate.importSource) {
      const resolved = await pluginContext.resolve(candidate.importSource, importer);
      if (resolved?.id) {
        candidate.resolvedPath = resolved.id;
        candidate.providesDescription = await analyzeImports(resolved.id);
        if (candidate.providesDescription) {
          indirectComponentFound = true;
        }
      } else {
        debug(
          `Could not resolve import source: ${candidate.importSource} for component ${candidate.componentName}`
        );
      }
    }
  }

  return indirectComponentFound;
}

/**
 * Scans a component file to check if it contains Checkbox.Description.
 *
 * @param filePath File to analyze
 * @returns true if Checkbox.Description is found
 */
export async function analyzeImports(filePath: string): Promise<boolean> {
  debug(`Analyzing imported component: ${filePath}`);
  let foundDescription = false;
  try {
    const rawCode = fs.readFileSync(filePath, "utf-8");
    const parseResult = oxc.parseSync(filePath, rawCode, { sourceType: "module" });
    if (parseResult.errors && parseResult.errors.length > 0) {
      console.error(`[qwik-ds] Errors parsing ${filePath}:`, parseResult.errors);
    }
    const ast = parseResult.program;

    walk(ast, {
      enter: (node: Node) => {
        if (node.type === "JSXElement") {
          const jsxNode = node;
          const elementName = getJsxElementName(jsxNode.openingElement.name);
          if (elementName === "Checkbox.Description") {
            foundDescription = true;
            return false;
          }
        }
      }
    });

    if (foundDescription) {
      debug(`Found Checkbox.Description in ${filePath}`);
    } else {
      debug(`Did NOT find Checkbox.Description in ${filePath}`);
    }
    return foundDescription;
  } catch (error) {
    console.error(`[qwik-ds] Error analyzing ${filePath}:`, error);
    return foundDescription;
  }
}

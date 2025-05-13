import fs from "node:fs";
import oxc from "oxc-parser";
import { walk } from "oxc-walker";
import type { PluginOption } from "vite";
import { generate as astringGenerate } from "astring";

import type {
  Node,
  JSXElement,
  JSXIdentifier,
  JSXMemberExpression,
  ObjectExpression,
  ObjectProperty,
  BooleanLiteral,
  IdentifierName,
  CallExpression,
  MemberExpression,
  ImportDeclaration,
  Expression,
  Program
} from "@oxc-project/types";

let isDebugMode = false;

function debug(message: string): void {
  if (isDebugMode) {
    console.log(`[qwik-ds] ${message}`);
  }
}

/**
 * Extracts component/element name from JSX AST nodes.
 * Handles standard elements (<div />), components (<Button />),
 * and namespaced components (<Checkbox.Description />).
 *
 * @param nameNode JSX name node
 * @returns Component name string or null
 */
function getJsxElementName(
  nameNode: JSXIdentifier | JSXMemberExpression | Node | null | undefined
): string | null {
  if (!nameNode) {
    return null;
  }
  if (nameNode.type === "JSXIdentifier") {
    return nameNode.name;
  }
  if (nameNode.type === "JSXMemberExpression") {
    const jsxMemberNode = nameNode;
    const objectName = getJsxElementName(jsxMemberNode.object);
    const propertyName = jsxMemberNode.property.name;
    return objectName && propertyName ? `${objectName}.${propertyName}` : null;
  }
  return null;
}

/**
 * Extracts component name from standard JS AST nodes (non-JSX).
 * Handles identifiers and member expressions in compiled code.
 *
 * @param node AST node
 * @returns Component name string or null
 */
function getStandardElementName(node: Node | null | undefined): string | null {
  if (!node) {
    return null;
  }
  if (node.type === "Identifier") {
    return node.name;
  }
  if (node.type === "MemberExpression") {
    const memberNode = node as MemberExpression;
    const objectName = getStandardElementName(memberNode.object);
    let propertyName: string | undefined;
    if (memberNode.property.type === "Identifier") {
      propertyName = (memberNode.property as IdentifierName).name;
    } else if (memberNode.property.type === "PrivateIdentifier") {
      propertyName = memberNode.property.name;
    }

    if (objectName && propertyName) {
      return `${objectName}.${propertyName}`;
    }
    return null;
  }
  return null;
}

/**
 * Component that may wrap our target component in its JSX.
 * Example: If <MyWrapper> contains <Checkbox.Description>, MyWrapper is a candidate.
 */
interface CandidateComponent {
  componentName: string;
  astNode: JSXElement;
  importSource?: string;
  resolvedPath?: string;
  providesDescription?: boolean;
}

const analysisResults = new Map<string, boolean>();

/**
 * Scans a component file to check if it contains Checkbox.Description.
 *
 * @param filePath File to analyze
 * @returns true if Checkbox.Description is found
 */
async function analyzeImports(filePath: string): Promise<boolean> {
  debug(`Analyzing imported component: ${filePath}`);
  let foundDescription = false;
  try {
    const rawCode = fs.readFileSync(filePath, "utf-8");
    const parseResult = oxc.parseSync(filePath, rawCode, { sourceType: "module" });
    if (parseResult.errors && parseResult.errors.length > 0) {
      console.error(
        `[qwik-ds ANALYZE Oxc] Errors parsing ${filePath}:`,
        parseResult.errors
      );
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
    console.error(`[qwik-ds ANALYZE] Error analyzing ${filePath}:`, error);
    return foundDescription;
  }
}

/**
 * Checks if the AST contains imports from a specific package.
 *
 * @param ast Program AST to analyze
 * @param packageName Name of the package to check for
 * @returns true if the package is imported
 */
function checkImportsFromPackage(ast: Program, packageName: string): boolean {
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
function findComponentWithinParent(
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
function resolveImportSources(
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
 * @param targetComponent Name of the component we're looking for in imports
 * @returns True if any indirect component was found
 */
async function findIndirectComponents(
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
 * Finds a property in an object expression by name
 *
 * @param propsObject Object expression to search
 * @param propName Name of the property to find
 * @returns Index of the property or -1 if not found
 */
function findPropertyByName(propsObject: ObjectExpression, propName: string): number {
  if (!propsObject.properties) {
    return -1;
  }

  for (let i = 0; i < propsObject.properties.length; i++) {
    const prop = propsObject.properties[i];
    if (prop.type === "Property") {
      const objectProp = prop as ObjectProperty;
      const key = objectProp.key;
      if (key.type === "Identifier" && (key as IdentifierName).name === propName) {
        return i;
      }
    }
  }

  return -1;
}

/**
 * Creates or updates a static boolean property in an object expression
 *
 * @param propsObject Object expression to modify
 * @param propName Name of the property to set
 * @param value Boolean value to set
 * @returns Whether the object was modified
 */
function setStaticBooleanProp(
  propsObject: ObjectExpression,
  propName: string,
  value: boolean
): boolean {
  if (!propsObject.properties) {
    propsObject.properties = [];
  }

  const existingPropIndex = findPropertyByName(propsObject, propName);

  const newPropValueLiteral: BooleanLiteral = {
    type: "Literal",
    value: value,
    raw: value ? "true" : "false",
    start: 0,
    end: 0
  };

  if (existingPropIndex !== -1) {
    const existingProperty = propsObject.properties[existingPropIndex];
    if (existingProperty.type === "Property") {
      (existingProperty as ObjectProperty).value =
        newPropValueLiteral as unknown as Expression;
      return true;
    }
    return false;
  }

  const identifierKey: IdentifierName = {
    type: "Identifier",
    name: propName,
    start: 0,
    end: 0
  };

  const newProperty: ObjectProperty = {
    type: "Property",
    method: false,
    shorthand: false,
    computed: false,
    key: identifierKey,
    value: newPropValueLiteral as unknown as Expression,
    kind: "init",
    start: 0,
    end: 0
  };

  propsObject.properties.push(newProperty);
  return true;
}

/**
 * Processes a _jsxC call for a specific component
 *
 * @param callNode Call expression node
 * @param componentName Target component name to look for
 * @param staticProps Object with static props to set
 * @param filePath File path for debugging
 * @returns Whether the node was modified
 */
function processJSXTransformCall(
  callNode: CallExpression,
  componentName: string,
  staticProps: { [key: string]: boolean },
  filePath: string
): boolean {
  let modified = false;

  let calleeName: string | null = null;
  if (callNode.callee.type === "Identifier") {
    calleeName = (callNode.callee as IdentifierName).name;
  }

  if (calleeName === "_jsxC" && callNode.arguments && callNode.arguments.length >= 2) {
    const componentArg = callNode.arguments[0];
    const propsArg = callNode.arguments[1];
    const renderedComponentName = getStandardElementName(componentArg as Node);

    if (renderedComponentName === componentName && propsArg.type === "ObjectExpression") {
      debug(`Found _jsxC call for ${componentName} in ${filePath}`);
      const propsObject = propsArg as ObjectExpression;

      for (const [propName, value] of Object.entries(staticProps)) {
        const propModified = setStaticBooleanProp(propsObject, propName, value);
        if (propModified) {
          modified = true;
          const action =
            findPropertyByName(propsObject, propName) !== -1 ? "Updated" : "Added";
          debug(`${action} ${propName} to ${value} in _jsxC props for ${filePath}`);
        }
      }
    }
  }

  return modified;
}

/**
 * Updates static properties in _jsxC calls for components
 *
 * @param ast The AST to transform
 * @param hasDescription Whether the component has description
 * @param filePath File path for debugging
 * @returns Whether the AST was modified
 */
function updateStaticProps(
  ast: Program,
  hasDescription: boolean,
  filePath: string
): boolean {
  let modified = false;

  debug(`Starting AST walk for ${filePath}`);

  walk(ast, {
    enter: (node: Node) => {
      if (node.type === "CallExpression") {
        const nodeModified = processJSXTransformCall(
          node as CallExpression,
          "Checkbox.Root",
          { _staticHasDescription: hasDescription },
          filePath
        );

        if (nodeModified) {
          modified = true;
        }
      }
    }
  });

  debug(`AST walk finished for ${filePath}. Modified: ${modified}`);

  return modified;
}

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

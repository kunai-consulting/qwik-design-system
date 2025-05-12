import fs from "node:fs";
import { Parser, type Node as AcornNode } from "acorn";
import jsx from "acorn-jsx";
import { recursive as recursiveWalk, base as baseVisitor } from "acorn-walk";
import type { PluginOption } from "vite";
import { generate as astringGenerate } from "astring";

// Define types for JSX-related AST nodes
interface JSXIdentifier extends AcornNode {
  type: "JSXIdentifier";
  name: string;
}
interface JSXMemberExpression extends AcornNode {
  type: "JSXMemberExpression";
  object: JSXIdentifier | JSXMemberExpression;
  property: JSXIdentifier;
}
interface JSXOpeningElement extends AcornNode {
  type: "JSXOpeningElement";
  name: JSXIdentifier | JSXMemberExpression;
  attributes: AcornNode[];
}
interface JSXElement extends AcornNode {
  type: "JSXElement";
  openingElement: JSXOpeningElement;
  children: AcornNode[];
  closingElement: AcornNode | null;
}

// Helper function to get the full name of a JSX element
function getJsxElementName(
  nameNode: JSXIdentifier | JSXMemberExpression | null | undefined
): string | null {
  if (!nameNode) {
    return null;
  }
  if (nameNode.type === "JSXIdentifier") {
    return nameNode.name;
  }
  if (nameNode.type === "JSXMemberExpression") {
    const objectName = getJsxElementName(
      nameNode.object as JSXIdentifier | JSXMemberExpression
    );
    const propertyName = nameNode.property.name;
    return objectName && propertyName ? `${objectName}.${propertyName}` : null;
  }
  return null;
}

// Helper function to get the full name of a standard JS element from an AST node
function getStandardElementName(node: AcornNode | null | undefined): string | null {
  if (!node) {
    // console.log("[qwik-ds getStandardElementName] Node is null or undefined");
    return null;
  }

  // biome-ignore lint/suspicious/noExplicitAny: Acorn node structure
  const nodeAny = node as any;

  // console.log(`[qwik-ds getStandardElementName] Node type: ${nodeAny.type}, Name: ${nodeAny.name || 'N/A'}`);

  if (nodeAny.type === "Identifier") {
    return nodeAny.name;
  }
  if (nodeAny.type === "MemberExpression") {
    const objectName = getStandardElementName(nodeAny.object);
    const propertyName = nodeAny.property?.name; // property should be an Identifier
    if (objectName && propertyName) {
      return `${objectName}.${propertyName}`;
    }
    // console.log(`[qwik-ds getStandardElementName] MemberExpression parts: objectName=${objectName}, propertyName=${propertyName}`);
    return null;
  }
  // console.log(`[qwik-ds getStandardElementName] Node type ${nodeAny.type} not handled or fell through`);
  return null;
}

interface CandidateComponent {
  componentName: string;
  astNode: JSXElement;
  importSource?: string;
  resolvedPath?: string;
  providesDescription?: boolean;
}

const VIRTUAL_MODULE_ID = "virtual:checkbox-analysis";
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

// Store analysis results: Map<filePath, hasDescription>
const analysisResults = new Map<string, boolean>();

async function analyzeImportedComponentForDescription(
  filePath: string,
  // biome-ignore lint/suspicious/noExplicitAny: <Vite plugin context type can be complex>
  pluginContext: any
): Promise<boolean> {
  console.log(`[qwik-ds ANALYZE] Analyzing imported component: ${filePath}`);
  try {
    const rawCode = fs.readFileSync(filePath, "utf-8");
    const JsxParser = Parser.extend(jsx());
    const ast = JsxParser.parse(rawCode, {
      sourceType: "module",
      ecmaVersion: "latest",
      locations: true
    }) as AcornNode & { type: "Program"; body: AcornNode[] };

    let foundDescription = false;

    const findDescriptionVisitor = {
      JSXElement: (
        node: AcornNode,
        state: { found: boolean },
        c: (node: AcornNode, state: { found: boolean }) => void
      ) => {
        const jsxNode = node as JSXElement;
        const elementName = getJsxElementName(jsxNode.openingElement.name);
        if (elementName === "Checkbox.Description") {
          state.found = true;
          foundDescription = true; // Also set outer flag to stop further processing if needed
          return; // Stop walking this branch
        }
        // Continue walking children if description not found yet
        if (!state.found) {
          for (const child of jsxNode.children) {
            if (state.found) break; // Stop if found by a sibling call
            c(child, state);
          }
        }
      },
      // Add other necessary JSX node handlers for robust traversal, similar to extendedBaseRecursiveVisitors
      JSXExpressionContainer: (
        node: AcornNode,
        state: { found: boolean },
        c: (node: AcornNode, state: { found: boolean }) => void
      ) => {
        // biome-ignore lint/suspicious/noExplicitAny: <AcornNode for .expression might be too generic>
        const expressionNode = node as any;
        if (expressionNode.expression && !state.found) {
          c(expressionNode.expression, state);
        }
      }
    };

    const baseForImportAnalysis = {
      // biome-ignore lint/suspicious/noExplicitAny: <acorn-walk base visitor type>
      ...(baseVisitor as any),
      JSXElement: (
        node: AcornNode,
        state: { found: boolean },
        c: (node: AcornNode, state: { found: boolean }) => void
      ) => {
        const jsxNode = node as JSXElement;
        if (!state.found) {
          for (const child of jsxNode.children) {
            if (state.found) break;
            c(child, state);
          }
        }
      },
      JSXFragment: (
        node: AcornNode,
        state: { found: boolean },
        c: (node: AcornNode, state: { found: boolean }) => void
      ) => {
        // biome-ignore lint/suspicious/noExplicitAny: <Assuming JSXFragment has children>
        const fragmentNode = node as any;
        if (fragmentNode.children && !state.found) {
          for (const child of fragmentNode.children) {
            if (state.found) break;
            c(child, state);
          }
        }
      },
      JSXExpressionContainer: (
        node: AcornNode,
        state: { found: boolean },
        c: (node: AcornNode, state: { found: boolean }) => void
      ) => {
        // biome-ignore lint/suspicious/noExplicitAny: <AcornNode for .expression might be too generic>
        const expressionNode = node as any;
        if (expressionNode.expression && !state.found) {
          c(expressionNode.expression, state);
        }
      },
      JSXAttribute: (
        node: AcornNode,
        state: { found: boolean },
        c: (node: AcornNode, state: { found: boolean }) => void
      ) => {
        // biome-ignore lint/suspicious/noExplicitAny: <JSXAttribute might have .value which could be JSXExpressionContainer>
        const attrNode = node as any;
        if (attrNode.value && !state.found) {
          c(attrNode.value, state);
        }
      },
      JSXText: () => {},
      JSXOpeningElement: () => {},
      JSXClosingElement: () => {},
      JSXMemberExpression: () => {},
      JSXNamespacedName: () => {},
      JSXEmptyExpression: () => {},
      JSXSpreadChild: () => {}
    };

    // We need to walk through exported components
    for (const topNode of ast.body) {
      if (foundDescription) break; // If already found by a previous export, stop

      let componentBody: AcornNode | null = null;
      if (
        topNode.type === "ExportNamedDeclaration" ||
        topNode.type === "ExportDefaultDeclaration"
      ) {
        // biome-ignore lint/suspicious/noExplicitAny: <AST node structure is dynamic>
        const exportNode = topNode as any; // AcornNode with declaration
        if (exportNode.declaration) {
          if (exportNode.declaration.type === "FunctionDeclaration") {
            componentBody = exportNode.declaration.body;
          } else if (exportNode.declaration.type === "VariableDeclaration") {
            // biome-ignore lint/suspicious/noExplicitAny: <AST node structure>
            const variableDeclarator = exportNode.declaration.declarations[0] as any;
            if (variableDeclarator?.init) {
              if (
                variableDeclarator.init.type === "ArrowFunctionExpression" ||
                variableDeclarator.init.type === "FunctionExpression"
              ) {
                componentBody = variableDeclarator.init.body;
              } else if (variableDeclarator.init.type === "CallExpression") {
                // Handle component$(() => { ... })
                // biome-ignore lint/suspicious/noExplicitAny: <AST node structure>
                const callExpression = variableDeclarator.init as any;
                if (callExpression.arguments && callExpression.arguments.length > 0) {
                  const firstArg = callExpression.arguments[0];
                  if (
                    firstArg.type === "ArrowFunctionExpression" ||
                    firstArg.type === "FunctionExpression"
                  ) {
                    componentBody = firstArg.body;
                  }
                }
              }
            }
          } else if (
            exportNode.type === "ExportDefaultDeclaration" &&
            exportNode.declaration.type === "ArrowFunctionExpression"
          ) {
            // Handle export default () => { ... }
            componentBody = exportNode.declaration.body;
          } else if (
            exportNode.type === "ExportDefaultDeclaration" &&
            exportNode.declaration.type === "CallExpression"
          ) {
            // Handle export default component$(() => { ... })
            // biome-ignore lint/suspicious/noExplicitAny: <AST node structure>
            const callExpression = exportNode.declaration as any;
            if (callExpression.arguments && callExpression.arguments.length > 0) {
              const firstArg = callExpression.arguments[0];
              if (
                firstArg.type === "ArrowFunctionExpression" ||
                firstArg.type === "FunctionExpression"
              ) {
                componentBody = firstArg.body;
              }
            }
          }
        }
      }

      if (componentBody) {
        const walkState = { found: false };
        recursiveWalk(
          componentBody,
          walkState,
          // biome-ignore lint/suspicious/noExplicitAny: <acorn-walk dynamic visitor map structure>
          findDescriptionVisitor as any,
          // biome-ignore lint/suspicious/noExplicitAny: <acorn-walk dynamic visitor map structure>
          baseForImportAnalysis as any
        );
        if (walkState.found) {
          foundDescription = true;
        }
      }
    }

    if (foundDescription) {
      console.log(`[qwik-ds ANALYZE] Found Checkbox.Description in ${filePath}`);
    } else {
      console.log(`[qwik-ds ANALYZE] Did NOT find Checkbox.Description in ${filePath}`);
    }
    return foundDescription;
  } catch (error) {
    console.error(`[qwik-ds ANALYZE] Error analyzing ${filePath}:`, error);
    return false; // On error, assume not found
  }
}

// biome-ignore lint/suspicious/noExplicitAny: <acorn-walk base visitor type>
const comprehensiveBaseVisitor: any = {
  ...(baseVisitor as any),
  JSXElement: (
    node: AcornNode,
    state: unknown,
    c: (n: AcornNode, s: unknown) => void
  ) => {
    const jsxNode = node as JSXElement;
    if (jsxNode.openingElement) {
      // Check if openingElement exists
      c(jsxNode.openingElement, state);
    }
    for (const child of jsxNode.children) {
      c(child, state);
    }
    if (jsxNode.closingElement) {
      // Check if closingElement exists
      c(jsxNode.closingElement, state);
    }
  },
  JSXFragment: (
    node: AcornNode & { children: AcornNode[] },
    state: unknown,
    c: (n: AcornNode, s: unknown) => void
  ) => {
    if (node.children) {
      for (const child of node.children) {
        c(child, state);
      }
    }
  },
  JSXOpeningElement: (
    node: AcornNode,
    state: unknown,
    c: (n: AcornNode, s: unknown) => void
  ) => {
    const openingElNode = node as JSXOpeningElement;
    c(openingElNode.name, state);
    for (const attr of openingElNode.attributes) {
      c(attr, state);
    }
  },
  JSXClosingElement: () => {},
  JSXAttribute: (
    node: AcornNode & { value?: AcornNode | null },
    state: unknown,
    c: (n: AcornNode, s: unknown) => void
  ) => {
    if (node.value) {
      c(node.value, state);
    }
  },
  JSXExpressionContainer: (
    node: AcornNode & { expression: AcornNode },
    state: unknown,
    c: (n: AcornNode, s: unknown) => void
  ) => {
    if (node.expression) {
      c(node.expression, state);
    }
  },
  JSXIdentifier: () => {},
  JSXMemberExpression: (
    node: AcornNode & { object: AcornNode; property: AcornNode },
    state: unknown,
    c: (n: AcornNode, s: unknown) => void
  ) => {
    c(node.object, state);
    c(node.property, state);
  },
  JSXNamespacedName: () => {},
  JSXEmptyExpression: () => {},
  JSXSpreadAttribute: (
    node: AcornNode & { argument: AcornNode },
    state: unknown,
    c: (n: AcornNode, s: unknown) => void
  ) => {
    if (node.argument) {
      c(node.argument, state);
    }
  },
  JSXText: () => {},
  JSXSpreadChild: (
    node: AcornNode & { expression: AcornNode },
    state: unknown,
    c: (n: AcornNode, s: unknown) => void
  ) => {
    if (node.expression) {
      c(node.expression, state);
    }
  },
  // Add ParenthesizedExpression handler
  ParenthesizedExpression: (
    node: AcornNode & { expression: AcornNode },
    state: unknown,
    c: (n: AcornNode, s: unknown) => void
  ) => {
    if (node.expression) {
      c(node.expression, state);
    }
  }
};

export function qwikDesignSystemVitePlugin(): PluginOption {
  return {
    name: "qwik-design-system",
    enforce: "pre",
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
      return null; // Let other plugins handle it
    },
    async load(id) {
      // Handle the virtual module
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return `export default ${JSON.stringify(Object.fromEntries(analysisResults))};`;
      }

      const cleanedId = id.split("?")[0];
      const targetPathPrefix =
        "/Users/jackshelton/dev/kunai/qwik-design-system/apps/docs/src/routes/";

      // Filter for .tsx files within the target routes directory
      if (cleanedId.endsWith(".tsx") && cleanedId.startsWith(targetPathPrefix)) {
        try {
          const rawCode = fs.readFileSync(cleanedId, "utf-8");
          const JsxParser = Parser.extend(jsx());
          const ast = JsxParser.parse(rawCode, {
            sourceType: "module",
            ecmaVersion: "latest",
            locations: true
          }) as AcornNode & { type: "Program"; body: AcornNode[] };

          let importsFromKunaiQwik = false;
          for (const node of ast.body) {
            if (node.type === "ImportDeclaration") {
              const importDecl = node as AcornNode & { source: { value: string } };
              if (
                importDecl.source &&
                importDecl.source.value === "@kunai-consulting/qwik"
              ) {
                importsFromKunaiQwik = true;
                break;
              }
            }
          }

          if (!importsFromKunaiQwik) {
            // console.log(`[qwik-ds LOAD] Skipping analysis for ${cleanedId}, no import from @kunai-consulting/qwik.`);
            analysisResults.set(cleanedId, false); // Ensure transform hook knows it's handled
            return null;
          }

          console.log(`[qwik-ds LOAD] Processing route file: ${cleanedId}`);

          // Existing analysis logic
          try {
            let foundDescriptionInRoot = false;
            const candidateComponents: CandidateComponent[] = [];
            const initialState: { inCheckboxRoot: boolean; found: boolean } = {
              inCheckboxRoot: false,
              found: false
            };
            console.log("[qwik-ds LOAD] MATCHED hero.tsx:", cleanedId);
            console.log(
              "[qwik-ds LOAD] Raw code for hero.tsx (first 300 chars):",
              rawCode.substring(0, 300)
            );
            console.log("[qwik-ds LOAD] Successfully parsed AST for hero.tsx");

            const customRecursiveVisitors = {
              JSXElement: (
                node: AcornNode,
                state: typeof initialState,
                c: (node: AcornNode, state: typeof initialState) => void
              ) => {
                const jsxNode = node as JSXElement;
                const elementName = getJsxElementName(jsxNode.openingElement.name);
                const originalInCheckboxRoot = state.inCheckboxRoot;
                if (elementName === "Checkbox.Root") {
                  state.inCheckboxRoot = true;
                } else if (
                  elementName === "Checkbox.Description" &&
                  state.inCheckboxRoot
                ) {
                  state.found = true;
                  foundDescriptionInRoot = true;
                  return;
                } else if (
                  state.inCheckboxRoot &&
                  jsxNode.openingElement.name.type === "JSXIdentifier"
                ) {
                  if (elementName && !elementName.startsWith("Checkbox.")) {
                    candidateComponents.push({
                      componentName: elementName,
                      astNode: jsxNode
                    });
                  }
                }
                for (const child of jsxNode.children) {
                  if (
                    state.found &&
                    state.inCheckboxRoot &&
                    elementName === "Checkbox.Root"
                  )
                    break;
                  c(child, state);
                }
                if (elementName === "Checkbox.Root") {
                  state.inCheckboxRoot = originalInCheckboxRoot;
                  if (state.found) state.found = false;
                }
              },
              JSXExpressionContainer: (
                node: AcornNode,
                state: typeof initialState,
                c: (node: AcornNode, state: typeof initialState) => void
              ) => {
                // biome-ignore lint/suspicious/noExplicitAny: <AcornNode for .expression might be too generic>
                const expressionNode = node as any;
                if (expressionNode.expression) {
                  c(expressionNode.expression, state);
                }
              }
            };

            const extendedBaseRecursiveVisitors = {
              // biome-ignore lint/suspicious/noExplicitAny: <acorn-walk base visitor type>
              ...(baseVisitor as any),
              JSXElement: (
                node: AcornNode,
                state: typeof initialState,
                c: (node: AcornNode, state: typeof initialState) => void
              ) => {
                const jsxNode = node as JSXElement;
                for (const child of jsxNode.children) {
                  c(child, state);
                }
              },
              JSXFragment: (
                node: AcornNode,
                state: typeof initialState,
                c: (node: AcornNode, state: typeof initialState) => void
              ) => {
                // biome-ignore lint/suspicious/noExplicitAny: <Assuming JSXFragment has children>
                const fragmentNode = node as any;
                if (fragmentNode.children) {
                  for (const child of fragmentNode.children) {
                    c(child, state);
                  }
                }
              },
              JSXExpressionContainer: (
                node: AcornNode,
                state: typeof initialState,
                c: (node: AcornNode, state: typeof initialState) => void
              ) => {
                // biome-ignore lint/suspicious/noExplicitAny: <AcornNode for .expression might be too generic>
                const expressionNode = node as any;
                if (expressionNode.expression) {
                  c(expressionNode.expression, state);
                }
              },
              JSXAttribute: (
                node: AcornNode,
                state: typeof initialState,
                c: (node: AcornNode, state: typeof initialState) => void
              ) => {
                // biome-ignore lint/suspicious/noExplicitAny: <JSXAttribute might have .value which could be JSXExpressionContainer>
                const attrNode = node as any;
                if (attrNode.value) {
                  c(attrNode.value, state);
                }
              },
              JSXText: () => {},
              JSXOpeningElement: () => {},
              JSXClosingElement: () => {},
              JSXMemberExpression: () => {},
              JSXNamespacedName: () => {},
              JSXEmptyExpression: () => {},
              JSXSpreadChild: () => {}
            };

            recursiveWalk(
              ast,
              initialState,
              // biome-ignore lint/suspicious/noExplicitAny: <acorn-walk dynamic visitor map structure>
              customRecursiveVisitors as any,
              // biome-ignore lint/suspicious/noExplicitAny: <acorn-walk dynamic visitor map structure>
              extendedBaseRecursiveVisitors as any
            );

            let indirectDescriptionFound = false;

            if (candidateComponents.length > 0) {
              for (const astBodyNode of ast.body) {
                if (astBodyNode.type === "ImportDeclaration") {
                  const importDeclarationNode = astBodyNode as AcornNode & {
                    specifiers: (AcornNode & {
                      local: { name: string };
                      imported?: { name: string };
                      type: string;
                    })[];
                    source: { value: string; raw: string };
                  };
                  for (const specifier of importDeclarationNode.specifiers) {
                    const localName = specifier.local.name;
                    for (const candidate of candidateComponents) {
                      if (candidate.componentName === localName) {
                        candidate.importSource = importDeclarationNode.source.value;
                      }
                    }
                  }
                }
              }

              // Phase 2: Analyze imported components
              console.log(
                "[qwik-ds LOAD hero.tsx] Analyzing candidate components for indirect Checkbox.Description..."
              );
              for (const candidate of candidateComponents) {
                if (candidate.importSource) {
                  // `this` refers to the Vite plugin context, which has `this.resolve`
                  const resolved = await this.resolve(candidate.importSource, cleanedId);
                  if (resolved?.id) {
                    candidate.resolvedPath = resolved.id;
                    // Ensure `this` (plugin context) is passed to the analysis function if it needs to call `this.resolve` further
                    // For now, assuming analyzeImportedComponentForDescription doesn't need pluginContext to call resolve again.
                    candidate.providesDescription =
                      await analyzeImportedComponentForDescription(resolved.id, this);
                    if (candidate.providesDescription) {
                      indirectDescriptionFound = true;
                    }
                  } else {
                    console.log(
                      `[qwik-ds LOAD hero.tsx] Could not resolve import source: ${candidate.importSource} for component ${candidate.componentName}`
                    );
                  }
                }
              }
            }

            const hasDescription = foundDescriptionInRoot || indirectDescriptionFound;
            analysisResults.set(cleanedId, hasDescription);
            console.log(
              `[qwik-ds-plugin LOAD hero.tsx] Stored analysis for ${cleanedId}: ${hasDescription}`
            );

            if (hasDescription) {
              if (foundDescriptionInRoot) {
                console.log(
                  "[qwik-ds-plugin LOAD hero.tsx] Found Checkbox.Description directly within a Checkbox.Root!"
                );
              } else {
                console.log(
                  "[qwik-ds-plugin LOAD hero.tsx] Found Checkbox.Description indirectly via an imported component!"
                );
                // Log which components provided it
                for (const c of candidateComponents) {
                  if (c.providesDescription) {
                    console.log(`  - Via: ${c.componentName} (from ${c.importSource})`);
                  }
                }
              }
            } else {
              console.log(
                "[qwik-ds-plugin LOAD hero.tsx] Did NOT find Checkbox.Description directly or indirectly."
              );
            }

            if (candidateComponents.length > 0) {
              console.log(
                "[qwik-ds LOAD hero.tsx] Candidate child components (with sources):"
              );
              for (const c of candidateComponents) {
                console.log(
                  `  - Name: ${c.componentName}, Source: ${c.importSource || "Not found/Local/Built-in"}`
                );
              }
            }
          } catch (parseError) {
            console.error(
              `[qwik-ds] Error during AST processing for ${cleanedId}:`,
              parseError
            );
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

      // Filter for .tsx files within the target routes directory
      if (cleanedId.endsWith(".tsx") && cleanedId.startsWith(targetPathPrefix)) {
        const hasDescription = analysisResults.get(cleanedId);

        if (typeof hasDescription !== "boolean") {
          console.warn(
            `[qwik-ds TRANSFORM] No analysis result for ${cleanedId}, skipping transform.`
          );
          return null;
        }

        console.log(
          `[qwik-ds TRANSFORM] Transforming ${cleanedId}, hasDescription: ${hasDescription}`
        );

        try {
          const JsxParser = Parser.extend(jsx());
          // We need to parse with location info if we were to do precise string manipulation
          // but for AST manipulation and regeneration, it's less critical for this step.
          const ast = JsxParser.parse(code, {
            sourceType: "module",
            ecmaVersion: "latest"
            // locations: true, // Useful for debugging AST nodes
          }) as AcornNode & { type: "Program"; body: AcornNode[] };

          let modified = false;

          console.log(`[qwik-ds TRANSFORM] Starting AST walk for ${cleanedId}`);
          recursiveWalk(
            ast,
            null,
            {
              Program: (
                node: AcornNode & { body: AcornNode[] },
                state: null,
                c: (n: AcornNode, s: null) => void
              ) => {
                console.log("[qwik-ds TRANSFORM AST-WALK] Visiting Program node");
                for (const child of node.body) {
                  c(child, state);
                }
              },
              ExportDefaultDeclaration: (
                node: AcornNode & { declaration: AcornNode },
                state: null,
                c: (n: AcornNode, s: null) => void
              ) => {
                console.log(
                  "[qwik-ds TRANSFORM AST-WALK] Visiting ExportDefaultDeclaration node"
                );
                c(node.declaration, state);
              },
              // FunctionDeclaration, ArrowFunctionExpression, VariableDeclaration -> leading to component
              FunctionDeclaration: (
                node: AcornNode & { body: AcornNode },
                state: null,
                c: (n: AcornNode, s: null) => void
              ) => {
                console.log(
                  "[qwik-ds TRANSFORM AST-WALK] Visiting FunctionDeclaration node"
                );
                c(node.body, state); // Walk into the function body (BlockStatement)
              },
              ArrowFunctionExpression: (
                node: AcornNode & { body: AcornNode },
                state: null,
                c: (n: AcornNode, s: null) => void
              ) => {
                console.log(
                  "[qwik-ds TRANSFORM AST-WALK] Visiting ArrowFunctionExpression node"
                );
                c(node.body, state); // Walk into the body
              },
              VariableDeclaration: (
                node: AcornNode & { declarations: (AcornNode & { init: AcornNode })[] },
                state: null,
                c: (n: AcornNode, s: null) => void
              ) => {
                console.log(
                  "[qwik-ds TRANSFORM AST-WALK] Visiting VariableDeclaration node"
                );
                for (const decl of node.declarations) {
                  if (decl.init) c(decl.init, state); // Walk into initializers
                }
              },
              CallExpression: (
                node: AcornNode & { callee: AcornNode; arguments: AcornNode[] },
                state: null,
                c: (n: AcornNode, s: null) => void
              ) => {
                // biome-ignore lint/suspicious/noExplicitAny: <AST node structure is dynamic>
                const callNode = node as any;
                let calleeName: string | null = null;

                if (callNode.callee?.type === "Identifier") {
                  calleeName = callNode.callee.name;
                }
                // No need to log all CallExpressions here again, already done in ReturnStatement if it's the return value.
                // console.log(
                //   `[qwik-ds TRANSFORM AST-WALK] Visiting CallExpression node (Callee: ${calleeName || 'Complex'})`
                // );

                if (
                  calleeName === "_jsxC" &&
                  callNode.arguments &&
                  callNode.arguments.length >= 2
                ) {
                  const componentArg = callNode.arguments[0];
                  const propsArg = callNode.arguments[1];

                  const renderedComponentName = getStandardElementName(componentArg);
                  // console.log(`[qwik-ds TRANSFORM _jsxC] componentArg type: ${componentArg?.type}, renderedComponentName: ${renderedComponentName}`);

                  if (
                    renderedComponentName === "Checkbox.Root" &&
                    // biome-ignore lint/suspicious/noExplicitAny: <AST node structure is dynamic>
                    (propsArg as any).type === "ObjectExpression"
                  ) {
                    console.log(
                      `[qwik-ds TRANSFORM] Found _jsxC call for Checkbox.Root in ${cleanedId}`
                    );

                    // biome-ignore lint/suspicious/noExplicitAny: <AST node structure for ObjectExpression>
                    const propsObject = propsArg as any;
                    if (!propsObject.properties) {
                      propsObject.properties = [];
                    }

                    let existingPropIndex = -1;
                    for (let i = 0; i < propsObject.properties.length; i++) {
                      const prop = propsObject.properties[i];
                      if (
                        prop.key &&
                        prop.key.type === "Identifier" &&
                        prop.key.name === "_staticHasDescription"
                      ) {
                        existingPropIndex = i;
                        break;
                      }
                    }

                    const newPropValueLiteral = {
                      type: "Literal",
                      value: hasDescription, // from outer transform scope
                      raw: String(hasDescription)
                    };

                    if (existingPropIndex !== -1) {
                      propsObject.properties[existingPropIndex].value =
                        newPropValueLiteral;
                      console.log(
                        `[qwik-ds TRANSFORM] Updated _staticHasDescription to ${hasDescription} in _jsxC props for ${cleanedId}`
                      );
                    } else {
                      const newProperty = {
                        type: "Property",
                        key: {
                          type: "Identifier",
                          name: "_staticHasDescription"
                        },
                        value: newPropValueLiteral,
                        kind: "init",
                        method: false,
                        shorthand: false,
                        computed: false
                      };
                      // biome-ignore lint/suspicious/noExplicitAny: <Pushing new AST Property node>
                      propsObject.properties.push(newProperty as any);
                      console.log(
                        `[qwik-ds TRANSFORM] Added _staticHasDescription={${hasDescription}} to _jsxC props for ${cleanedId}`
                      );
                    }
                    modified = true; // from outer transform scope
                  }
                }

                // Default traversal for callee and arguments
                if (callNode.callee) {
                  c(callNode.callee, state);
                }
                if (callNode.arguments) {
                  for (const arg of callNode.arguments) {
                    if (arg) c(arg, state);
                  }
                }
              },
              BlockStatement: (
                node: AcornNode & { body: AcornNode[] },
                state: null,
                c: (n: AcornNode, s: null) => void
              ) => {
                console.log("[qwik-ds TRANSFORM AST-WALK] Visiting BlockStatement node");
                for (const child of node.body) {
                  c(child, state);
                }
              },
              ReturnStatement: (
                node: AcornNode & { argument: AcornNode | null },
                state: null,
                c: (n: AcornNode, s: null) => void
              ) => {
                console.log("[qwik-ds TRANSFORM AST-WALK] Visiting ReturnStatement node");
                if (node.argument) {
                  console.log(
                    `[qwik-ds TRANSFORM AST-WALK] ReturnStatement argument type: ${node.argument.type}`
                  );
                  if (node.argument.type === "CallExpression") {
                    // biome-ignore lint/suspicious/noExplicitAny: <debugging AST>
                    const callExpr = node.argument as any;
                    let calleeName = "Unknown Callee";
                    if (callExpr.callee) {
                      // Ensure callee exists
                      if (callExpr.callee.type === "Identifier") {
                        calleeName = callExpr.callee.name;
                      } else if (callExpr.callee.type === "MemberExpression") {
                        calleeName =
                          getJsxElementName(callExpr.callee as JSXMemberExpression) ||
                          "Complex MemberExpression";
                      } else {
                        calleeName = `Non-standard callee type: ${callExpr.callee.type}`;
                      }
                    }
                    console.log(
                      `[qwik-ds TRANSFORM AST-WALK]   CallExpression Callee: ${calleeName}`
                    );
                    if (callExpr.arguments && Array.isArray(callExpr.arguments)) {
                      console.log(
                        `[qwik-ds TRANSFORM AST-WALK]   CallExpression Arguments types: ${
                          // biome-ignore lint/suspicious/noExplicitAny: <Acorn AST node array>
                          (callExpr.arguments as AcornNode[])
                            .map((arg: AcornNode) => arg?.type || "undefined_arg")
                            .join(", ")
                        }`
                      );
                    } else {
                      console.log(
                        "[qwik-ds TRANSFORM AST-WALK]   CallExpression has no arguments or arguments is not an array."
                      );
                    }
                  }
                  c(node.argument, state);
                }
              }
              // JSXElement visitor is removed from here as we target _jsxC now.
              // The comprehensiveBaseVisitor will handle generic JSX traversal if needed.
            } as any,
            comprehensiveBaseVisitor // Use the comprehensive base visitor
          );

          console.log(
            `[qwik-ds TRANSFORM] AST walk finished for ${cleanedId}. Modified: ${modified}`
          );

          if (modified) {
            console.log(
              `[qwik-ds TRANSFORM] Attempting to generate code with astring for ${cleanedId}`
            );
            const outputCode = astringGenerate(ast);
            console.log(
              `[qwik-ds TRANSFORM] Code after transformation: ${outputCode.substring(0, 500)}...`
            );
            return {
              code: outputCode,
              map: null
            };
          }
        } catch (e) {
          console.error(`[qwik-ds TRANSFORM] Error transforming ${cleanedId}:`, e);
          return null; // On error, return null to not break the build
        }
      }
      return null; // For other files, no transformation
    }
  };
}

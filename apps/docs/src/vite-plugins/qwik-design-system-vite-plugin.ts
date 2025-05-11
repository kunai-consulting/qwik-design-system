import fs from "node:fs";
import { Parser, type Node as AcornNode } from "acorn";
import jsx from "acorn-jsx";
import { recursive as recursiveWalk, base as baseVisitor } from "acorn-walk";
import type { PluginOption } from "vite";

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

interface CandidateComponent {
  componentName: string;
  astNode: JSXElement;
  importSource?: string;
  resolvedPath?: string;
  providesDescription?: boolean;
}

export function qwikDesignSystemVitePlugin(): PluginOption {
  return {
    name: "qwik-design-system",
    enforce: "pre",
    async load(id) {
      const cleanedId = id.split("?")[0];
      if (cleanedId.includes("apps/docs/src/routes/base/checkbox/examples/hero.tsx")) {
        try {
          const rawCode = fs.readFileSync(cleanedId, "utf-8");
          try {
            const JsxParser = Parser.extend(jsx());
            const ast = JsxParser.parse(rawCode, {
              sourceType: "module",
              ecmaVersion: "latest",
              locations: true
            }) as AcornNode & { type: "Program"; body: AcornNode[] };

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
            }

            if (foundDescriptionInRoot) {
              console.log(
                "[qwik-ds-plugin LOAD hero.tsx] Found Checkbox.Description directly within a Checkbox.Root!"
              );
            } else {
              console.log(
                "[qwik-ds-plugin LOAD hero.tsx] Did NOT find Checkbox.Description directly within a Checkbox.Root."
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

      if (cleanedId.endsWith(".tsx")) {
        // console.log(`[qwik-ds-plugin TRANSFORM] SAW .tsx ID: ${id}`);
      }

      if (cleanedId.includes("apps/docs/src/routes/base/checkbox/examples/hero.tsx")) {
        // console.log(
        //   `[qwik-ds-plugin TRANSFORM hero.tsx] Transformed code (first 500 chars for ID ${id}):\n${
        //     code.substring(0, 500)
        //   }...`
        // );
      }
      return null;
    }
  };
}

import fs from "node:fs";
import oxc from "oxc-parser";
import { walk } from "oxc-walker";
import type { PluginOption } from "vite";
import { generate as astringGenerate } from "astring";

import type {
  Node as OxNode,
  JSXElement as OxcJSXElement,
  JSXIdentifier as OxcJSXIdentifier,
  JSXMemberExpression as OxcJSXMemberExpression,
  ObjectExpression,
  ObjectProperty,
  BooleanLiteral,
  IdentifierName,
  CallExpression,
  MemberExpression,
  ImportDeclaration,
  Expression
} from "@oxc-project/types";

function getJsxElementName(
  nameNode: OxcJSXIdentifier | OxcJSXMemberExpression | OxNode | null | undefined
): string | null {
  if (!nameNode) {
    return null;
  }
  if (nameNode.type === "JSXIdentifier") {
    return (nameNode as OxcJSXIdentifier).name;
  }
  if (nameNode.type === "JSXMemberExpression") {
    const jsxMemberNode = nameNode as OxcJSXMemberExpression;
    const objectName = getJsxElementName(jsxMemberNode.object);
    const propertyName = jsxMemberNode.property.name;
    return objectName && propertyName ? `${objectName}.${propertyName}` : null;
  }
  return null;
}

function getStandardElementName(node: OxNode | null | undefined): string | null {
  if (!node) {
    return null;
  }
  if (node.type === "Identifier") {
    return (node as IdentifierName).name;
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
 *  A candidate component is one that could potentially hold the component we're searching for within its JSX return parameter.
 *
 *  For example, if the consumer of a library wraps the target in <MyWrapper />, then MyWrapper has become a candidate component.
 */
interface CandidateComponent {
  componentName: string;
  astNode: OxcJSXElement;
  importSource?: string;
  resolvedPath?: string;
  providesDescription?: boolean;
}

const analysisResults = new Map<string, boolean>();

async function analyzeImportedComponentForDescription(
  filePath: string,
  _: unknown
): Promise<boolean> {
  console.log(`[qwik-ds ANALYZE] Analyzing imported component: ${filePath}`);
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

    try {
      walk(ast, {
        enter: (node: OxNode) => {
          if (foundDescription) {
            throw new Error("FoundDescription");
          }
          if (node.type === "JSXElement") {
            const jsxNode = node as OxcJSXElement;
            const elementName = getJsxElementName(jsxNode.openingElement.name);
            if (elementName === "Checkbox.Description") {
              foundDescription = true;
              throw new Error("FoundDescription");
            }
          }
        }
      });
    } catch (e) {
      if ((e as Error).message !== "FoundDescription") {
        throw e;
      }
    }

    if (foundDescription) {
      console.log(`[qwik-ds ANALYZE] Found Checkbox.Description in ${filePath}`);
    } else {
      console.log(`[qwik-ds ANALYZE] Did NOT find Checkbox.Description in ${filePath}`);
    }
    return foundDescription;
  } catch (error) {
    if (!((error as Error).message === "FoundDescription")) {
      console.error(`[qwik-ds ANALYZE] Error analyzing ${filePath}:`, error);
    }
    return foundDescription;
  }
}

export function qwikAnalyzer(): PluginOption {
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
            console.error(
              `[qwik-ds LOAD Oxc] Errors parsing ${cleanedId}:`,
              parseResult.errors
            );
          }
          const ast = parseResult.program;

          let importsFromKunaiQwik = false;
          walk(ast, {
            enter: (node: OxNode) => {
              if (importsFromKunaiQwik) return;
              if (node.type === "ImportDeclaration") {
                const importDecl = node as ImportDeclaration;
                if (importDecl.source.value === "@kunai-consulting/qwik") {
                  importsFromKunaiQwik = true;
                }
              }
            }
          });

          if (!importsFromKunaiQwik) {
            analysisResults.set(cleanedId, false);
            return null;
          }

          console.log(`[qwik-ds LOAD] Processing route file: ${cleanedId}`);

          let foundDescriptionInRoot = false;
          const candidateComponents: CandidateComponent[] = [];
          const inCheckboxRootStack: boolean[] = [];

          walk(ast, {
            enter: (node: OxNode) => {
              if (node.type === "JSXElement") {
                if (foundDescriptionInRoot && inCheckboxRootStack.length === 0) return;

                const jsxNode = node as OxcJSXElement;
                const elementName = getJsxElementName(jsxNode.openingElement.name);

                if (elementName === "Checkbox.Root") {
                  inCheckboxRootStack.push(true);
                } else if (
                  elementName === "Checkbox.Description" &&
                  inCheckboxRootStack.length > 0 &&
                  inCheckboxRootStack[inCheckboxRootStack.length - 1]
                ) {
                  foundDescriptionInRoot = true;
                } else if (
                  inCheckboxRootStack.length > 0 &&
                  inCheckboxRootStack[inCheckboxRootStack.length - 1] &&
                  jsxNode.openingElement.name.type === "JSXIdentifier"
                ) {
                  if (elementName && !elementName.startsWith("Checkbox.")) {
                    candidateComponents.push({
                      componentName: elementName,
                      astNode: jsxNode
                    });
                  }
                }
              }
            },
            leave: (node: OxNode) => {
              if (node.type === "JSXElement") {
                const jsxNode = node as OxcJSXElement;
                const elementName = getJsxElementName(jsxNode.openingElement.name);
                if (elementName === "Checkbox.Root") {
                  if (inCheckboxRootStack.length > 0) {
                    inCheckboxRootStack.pop();
                  }
                }
              }
            }
          });

          let indirectDescriptionFound = false;
          if (candidateComponents.length > 0) {
            walk(ast, {
              enter: (node: OxNode) => {
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

            console.log(
              "[qwik-ds LOAD with Oxc] Analyzing candidate components for indirect Checkbox.Description..."
            );
            for (const candidate of candidateComponents) {
              if (candidate.importSource) {
                const resolved = await this.resolve(candidate.importSource, cleanedId);
                if (resolved?.id) {
                  candidate.resolvedPath = resolved.id;
                  candidate.providesDescription =
                    await analyzeImportedComponentForDescription(resolved.id, this);
                  if (candidate.providesDescription) {
                    indirectDescriptionFound = true;
                  }
                } else {
                  console.log(
                    `[qwik-ds LOAD with Oxc] Could not resolve import source: ${candidate.importSource} for component ${candidate.componentName}`
                  );
                }
              }
            }
          }

          const hasDescription = foundDescriptionInRoot || indirectDescriptionFound;
          analysisResults.set(cleanedId, hasDescription);
          console.log(
            `[qwik-ds-plugin LOAD with Oxc] Stored analysis for ${cleanedId}: ${hasDescription}`
          );
          if (hasDescription) {
            if (foundDescriptionInRoot) {
              console.log(
                "[qwik-ds-plugin LOAD with Oxc] Found Checkbox.Description directly within a Checkbox.Root!"
              );
            } else {
              console.log(
                "[qwik-ds-plugin LOAD with Oxc] Found Checkbox.Description indirectly via an imported component!"
              );
              for (const c of candidateComponents) {
                if (c.providesDescription) {
                  console.log(`  - Via: ${c.componentName} (from ${c.importSource})`);
                }
              }
            }
          } else {
            console.log(
              "[qwik-ds-plugin LOAD with Oxc] Did NOT find Checkbox.Description directly or indirectly."
            );
          }
        } catch (e) {
          console.error(`[qwik-ds with Oxc] Error reading file ${cleanedId}:`, e);
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
            `[qwik-ds TRANSFORM with Oxc] No analysis result for ${cleanedId}, skipping transform.`
          );
          return null;
        }

        console.log(
          `[qwik-ds TRANSFORM with Oxc] Transforming ${cleanedId}, hasDescription: ${hasDescription}`
        );

        try {
          const parseResult = oxc.parseSync(cleanedId, code, { sourceType: "module" });
          if (parseResult.errors && parseResult.errors.length > 0) {
            console.error(
              `[qwik-ds TRANSFORM Oxc] Errors parsing ${cleanedId}:`,
              parseResult.errors
            );
          }
          const ast = parseResult.program;
          let modified = false;

          console.log(`[qwik-ds TRANSFORM with Oxc] Starting AST walk for ${cleanedId}`);

          walk(ast, {
            enter: (node: OxNode) => {
              if (node.type === "CallExpression") {
                const callNode = node as CallExpression;
                let calleeName: string | null = null;
                if (callNode.callee.type === "Identifier") {
                  calleeName = (callNode.callee as IdentifierName).name;
                }

                if (
                  calleeName === "_jsxC" &&
                  callNode.arguments &&
                  callNode.arguments.length >= 2
                ) {
                  const componentArg = callNode.arguments[0];
                  const propsArg = callNode.arguments[1];
                  const renderedComponentName = getStandardElementName(
                    componentArg as OxNode
                  );

                  if (
                    renderedComponentName === "Checkbox.Root" &&
                    propsArg.type === "ObjectExpression"
                  ) {
                    console.log(
                      `[qwik-ds TRANSFORM with Oxc] Found _jsxC call for Checkbox.Root in ${cleanedId}`
                    );
                    const propsObject = propsArg as ObjectExpression;

                    if (!propsObject.properties) {
                      propsObject.properties = [];
                    }

                    let existingPropIndex = -1;
                    for (let i = 0; i < propsObject.properties.length; i++) {
                      const prop = propsObject.properties[i];
                      if (prop.type === "Property") {
                        const objectProp = prop as ObjectProperty;
                        const key = objectProp.key;
                        if (
                          key.type === "Identifier" &&
                          (key as IdentifierName).name === "_staticHasDescription"
                        ) {
                          existingPropIndex = i;
                          break;
                        }
                      }
                    }

                    const dummySpan = { start: 0, end: 0 };

                    const newPropValueLiteral: BooleanLiteral = {
                      type: "Literal",
                      value: hasDescription,
                      raw: hasDescription ? "true" : "false",
                      start: 0,
                      end: 0
                    };

                    if (existingPropIndex !== -1) {
                      const existingProperty = propsObject.properties[existingPropIndex];
                      if (existingProperty.type === "Property") {
                        (existingProperty as ObjectProperty).value =
                          newPropValueLiteral as unknown as Expression;
                        modified = true;
                      }
                      console.log(
                        `[qwik-ds TRANSFORM with Oxc] Updated _staticHasDescription to ${hasDescription} in _jsxC props for ${cleanedId}`
                      );
                    } else {
                      const identifierKey: IdentifierName = {
                        type: "Identifier",
                        name: "_staticHasDescription",
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
                      modified = true;
                      console.log(
                        `[qwik-ds TRANSFORM with Oxc] Added _staticHasDescription={${hasDescription}} to _jsxC props for ${cleanedId}`
                      );
                    }
                  }
                }
              }
            }
          });

          console.log(
            `[qwik-ds TRANSFORM with Oxc] AST walk finished for ${cleanedId}. Modified: ${modified}`
          );

          if (modified) {
            console.log(
              `[qwik-ds TRANSFORM with Oxc] Attempting to generate code with astring for ${ast}`
            );
            const outputCode = astringGenerate(ast);
            console.log(
              `[qwik-ds TRANSFORM with Oxc] Code after transformation: ${outputCode.substring(0, 500)}...`
            );
            return {
              code: outputCode,
              map: null
            };
          }
        } catch (e) {
          console.error(
            `[qwik-ds TRANSFORM with Oxc] Error transforming ${cleanedId}:`,
            e
          );
          return null;
        }
      }
      return null;
    }
  };
}

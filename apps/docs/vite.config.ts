import { qwikCity } from "@builder.io/qwik-city/vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "pathe";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import fs from "node:fs";
import { Parser, type Node as AcornNode } from "acorn";
import jsx from "acorn-jsx";
import { recursive as recursiveWalk, base as baseVisitor } from "acorn-walk";

/**
 * This is the base config for vite.
 * When building, the adapter config is used which loads this file and extends it.
 */
import { type UserConfig, defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json";
import { recmaProvideComponents } from "./src/mdx/recma-provide-comp";

// Define types for JSX-related AST nodes (simplified for this example)
// In a more complex setup, you might use types from a library or define them more extensively
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
  attributes: AcornNode[]; // Or more specific attribute types
}
interface JSXElement extends AcornNode {
  type: "JSXElement";
  openingElement: JSXOpeningElement;
  children: AcornNode[];
  closingElement: AcornNode | null;
}

type PkgDep = Record<string, string>;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const { dependencies = {}, devDependencies = {} } = pkg as any as {
  dependencies: PkgDep;
  devDependencies: PkgDep;
  [key: string]: unknown;
};
errorOnDuplicatesPkgDeps(devDependencies, dependencies);

// Helper function to get the full name of a JSX element (e.g., "Checkbox.Root")
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
    ); // Recursive call
    const propertyName = nameNode.property.name;
    return objectName && propertyName ? `${objectName}.${propertyName}` : null;
  }
  return null;
}

interface CandidateComponent {
  componentName: string;
  astNode: JSXElement; // The JSXElement node in hero.tsx
  importSource?: string; // e.g., './Heyo' or '@some-lib/Button'
  resolvedPath?: string; // Absolute path after this.resolve()
  providesDescription?: boolean; // Result of analyzing the child component
}

/**
 * Note that Vite normally starts from `index.html` but the qwikCity plugin makes start at `src/entry.ssr.tsx` instead.
 */
export default defineConfig(({ command, mode }): UserConfig => {
  const mainQuality = {
    quality: 80
  };

  return {
    plugins: [
      tailwindcss(),
      qwikCity({
        mdx: {
          providerImportSource: "~/mdx/provider",
          recmaPlugins: [recmaProvideComponents]
        }
      }),
      qwikVite({ lint: false }),
      ViteImageOptimizer({
        includePublic: true,
        png: mainQuality,
        jpeg: mainQuality,
        jpg: mainQuality,
        webp: mainQuality,
        avif: mainQuality
      }),
      tsconfigPaths(),
      {
        name: "qwik-design-system",
        enforce: "pre",
        async load(id) {
          const cleanedId = id.split("?")[0];
          if (
            cleanedId.includes("apps/docs/src/routes/base/checkbox/examples/hero.tsx")
          ) {
            try {
              const rawCode = fs.readFileSync(cleanedId, "utf-8");
              try {
                const JsxParser = Parser.extend(jsx());
                // Ensure ast is treated as a Program node for accessing .body
                const ast = JsxParser.parse(rawCode, {
                  sourceType: "module",
                  ecmaVersion: "latest",
                  locations: true
                }) as AcornNode & { type: "Program"; body: AcornNode[] }; // More specific type here

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

                // Phase 1.5: Find import sources for candidate components
                // The type assertion for `ast` above makes `ast.body` accessible here.
                if (candidateComponents.length > 0) {
                  // ast.type === "Program" is implicit from the type assertion
                  for (const astBodyNode of ast.body) {
                    if (astBodyNode.type === "ImportDeclaration") {
                      const importDeclarationNode = astBodyNode as AcornNode & {
                        specifiers: (AcornNode & {
                          local: { name: string };
                          imported?: { name: string };
                          type: string;
                        })[]; // Added type to specifier for ImportDefaultSpecifier check
                        source: { value: string; raw: string };
                      };
                      for (const specifier of importDeclarationNode.specifiers) {
                        const localName = specifier.local.name;
                        // const importedName = specifier.imported ? specifier.imported.name : (specifier.type === 'ImportDefaultSpecifier' ? localName : null);

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
                    // Changed from forEach to for...of
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
              } // End inner try-catch
            } catch (e) {
              console.error(`[qwik-ds] Error reading file ${cleanedId}:`, e);
            } // End outer try-catch
          } // End if hero.tsx
          return null;
        },
        transform(code, id) {
          const cleanedId = id.split("?")[0]; // Also clean ID here if using it for conditions

          if (cleanedId.endsWith(".tsx")) {
            // console.log(`[qwik-ds-plugin TRANSFORM] SAW .tsx ID: ${id}`); // Optional
          }

          if (
            cleanedId.includes("apps/docs/src/routes/base/checkbox/examples/hero.tsx")
          ) {
            // console.log( // Optional: log transformed code if needed for comparison
            //   `[qwik-ds-plugin TRANSFORM hero.tsx] Transformed code (first 500 chars for ID ${id}):\n${code.substring(0, 500)}...`
            // );
          }
          return null;
        }
      }
    ],
    // This tells Vite which dependencies to pre-build in dev mode.
    optimizeDeps: {
      // Put problematic deps that break bundling here, mostly those with binaries.
      // For example ['better-sqlite3'] if you use that in server functions.
      exclude: []
    },
    ssr:
      command === "build" && mode === "production"
        ? {
            // All dev dependencies should be bundled in the server build
            noExternal: Object.keys(devDependencies),
            // Anything marked as a dependency will not be bundled
            // These should only be production binary deps (including deps of deps), CLI deps, and their module graph
            // If a dep-of-dep needs to be external, add it here
            // For example, if something uses `bcrypt` but you don't have it as a dep, you can write
            // external: [...Object.keys(dependencies), 'bcrypt']
            external: Object.keys(dependencies)
          }
        : undefined,

    server: {
      headers: {
        // Don't cache the server response in dev mode
        "Cache-Control": "public, max-age=0"
      },
      fs: {
        allow: ["../.."]
      }
    },
    preview: {
      headers: {
        // Do cache the server response in preview (non-adapter production build)
        "Cache-Control": "public, max-age=600"
      }
    },
    resolve: {
      alias: {
        "@kunai-consulting/qwik": resolve(__dirname, "../../libs/components/src"),
        "@kunai-consulting/qwik-utils": resolve(__dirname, "../../libs/utils/src"),
        "@kunai-consulting/qwik-icons": resolve(__dirname, "../../libs/icons/src"),
        "~": resolve(__dirname, "src")
      },
      dedupe: ["@builder.io/qwik", "@builder.io/qwik-city"]
    }
  };
});

// *** utils ***

/**
 * Function to identify duplicate dependencies and throw an error
 * @param {Object} devDependencies - List of development dependencies
 * @param {Object} dependencies - List of production dependencies
 */
function errorOnDuplicatesPkgDeps(devDependencies: PkgDep, dependencies: PkgDep) {
  let msg = "";
  // Create an array 'duplicateDeps' by filtering devDependencies.
  // If a dependency also exists in dependencies, it is considered a duplicate.
  const duplicateDeps = Object.keys(devDependencies).filter((dep) => dependencies[dep]);

  // include any known qwik packages
  const qwikPkg = Object.keys(dependencies).filter((value) => /qwik/i.test(value));

  // any errors for missing "qwik-city-plan"
  // [PLUGIN_ERROR]: Invalid module "@qwik-city-plan" is not a valid package
  msg = `Move qwik packages ${qwikPkg.join(", ")} to devDependencies`;

  if (qwikPkg.length > 0) {
    throw new Error(msg);
  }

  // Format the error message with the duplicates list.
  // The `join` function is used to represent the elements of the 'duplicateDeps' array as a comma-separated string.
  msg = `
    Warning: The dependency "${duplicateDeps.join(", ")}" is listed in both "devDependencies" and "dependencies".
    Please move the duplicated dependencies to "devDependencies" only and remove it from "dependencies"
  `;

  // Throw an error with the constructed message.
  if (duplicateDeps.length > 0) {
    throw new Error(msg);
  }
}

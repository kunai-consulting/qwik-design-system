import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import type { Plugin as VitePlugin } from "vite";
import { getIconData, iconToSVG } from "@iconify/utils";
import MagicString from "magic-string";
import { parseSync } from "oxc-parser";
import type {
  JSXAttribute,
  JSXElement,
  JSXIdentifier,
  JSXMemberExpression,
  Node,
  Program,
  StringLiteral
} from "@oxc-project/types";

import { handleExpression } from "../utils/expressions";
import {
  extractFromElement,
  extractProps,
  isJSXElement,
  isJSXExpressionContainer,
  isJSXText
} from "../utils/jsx";
import { IconifyJSON } from "@iconify/types";

export type PacksMap = Record<
  string,
  {
    iconifyPrefix: string;
    sanitizeIcon?: (pascal: string) => string;
  }
>;

export type IconsPluginOptions = {
  debug?: boolean;
  importSources?: string[];
  packs?: PacksMap;
};

// Default icon packs configuration
const DEFAULT_PACKS: PacksMap = {
  Lucide: { iconifyPrefix: "lucide" },
  Heroicons: { iconifyPrefix: "heroicons" },
  Tabler: { iconifyPrefix: "tabler" }
};

// Default import sources to scan for icon packs
const DEFAULT_IMPORT_SOURCES = ["@kunai-consulting/qwik"];

type Collections = Map<string, IconifyJSON>;
type IconCache = Map<string, { body: string; viewBox: string }>;

/**
 * Vite plugin that transforms icon JSX elements to direct jsx("svg", {...}) calls
 * @param options - Plugin configuration options
 * @returns Vite plugin object
 */
export const icons = (options: IconsPluginOptions = {}): VitePlugin => {
  const packs = { ...DEFAULT_PACKS, ...options.packs };
  const importSources = options.importSources ?? DEFAULT_IMPORT_SOURCES;
  const debug = !!options.debug;
  const require = createRequire(import.meta.url);

  const collections: Collections = new Map();
  const iconCache: IconCache = new Map();

  const debugLog = (message: string, ...data: any[]) => {
    if (!debug) return;
    console.log(`[icons] ${message}`, ...data);
  };

  function toKebabCase(str: string): string {
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase();
  }


  function sanitizeIconName(name: string, packName: string): string {
    const packConfig = packs[packName];
    if (packConfig?.sanitizeIcon) {
      return packConfig.sanitizeIcon(name);
    }
    return /^\d/.test(name) ? `Icon${name}` : name;
  }

  function resolveIconNames(pascalName: string): string[] {
    const kebab = toKebabCase(pascalName);
    return [kebab, pascalName.toLowerCase()];
  }

  function loadIconData(prefix: string, name: string): { body: string; viewBox: string } | null {
    const cacheKey = `${prefix}:${name}`;
    if (iconCache.has(cacheKey)) {
      return iconCache.get(cacheKey)!;
    }

    try {
      if (!collections.has(prefix)) {
        const collectionPath = require.resolve(`@iconify/json/json/${prefix}.json`);
        const collectionData = readFileSync(collectionPath, 'utf-8');
        const collection = JSON.parse(collectionData);
        collections.set(prefix, collection);
        debugLog(`Loaded ${prefix} collection with ${Object.keys(collection.icons || {}).length} icons`);
      }

      const collection = collections.get(prefix)!;
      const iconDataRaw = getIconData(collection, name);

      if (!iconDataRaw) {
        debugLog(`Icon "${name}" not found in ${prefix} collection`);
        return null;
      }

      const svgData = iconToSVG(iconDataRaw);
      const result = {
        body: svgData.body,
        viewBox: `${iconDataRaw.left || 0} ${iconDataRaw.top || 0} ${iconDataRaw.width} ${iconDataRaw.height}`
      };

      iconCache.set(cacheKey, result);
      return result;
    } catch (error) {
      debugLog(`Error loading icon "${name}" from ${prefix}: ${error}`);
      return null;
    }
  }

  /**
   * Find pack aliases from import statements
   * @param ast - AST program
   * @param importSources - Sources to scan for imports
   * @param packs - Available packs configuration
   * @returns Map of local alias to pack name
   */
  function findPackAliases(
    ast: Program,
    importSources: string[],
    packs: PacksMap
  ): Map<string, string> {
    const aliasToPack = new Map<string, string>();

    function traverse(node: Node) {
      if (node.type === "ImportDeclaration") {
        const importDecl = node as any;
        const source = (importDecl.source as StringLiteral).value;

        if (importSources.includes(source)) {
          console.log(`[icons] Found import from ${source}: ${importDecl.specifiers.map(s => s.type === "ImportSpecifier" ? (s as any).local?.name || (s as any).imported?.name : s.type).join(", ")}`);

          for (const specifier of importDecl.specifiers) {
            if (specifier.type === "ImportSpecifier") {
              const spec = specifier as any;
              let imported: string;

              if (spec.imported) {
                if ((spec.imported as any).type === "Identifier") {
                  imported = (spec.imported as any).name;
                } else {
                  imported = (spec.imported as any).value;
                }
              } else {
                // Default import case
                imported = spec.local.name;
              }

              const local = spec.local.name;

              if (Object.keys(packs).includes(imported)) {
                aliasToPack.set(local, imported);
                debugLog(`Mapped alias ${local} -> ${imported}`);
              }
            }
          }
        }
      }

      // Recursively traverse
      for (const key in node) {
        const child = (node as any)[key];
        if (Array.isArray(child)) {
          for (const c of child) {
            if (c && typeof c === "object" && c.type) traverse(c);
          }
        } else if (child && typeof child === "object" && (child as Node).type) {
          traverse(child as Node);
        }
      }
    }

    traverse(ast);
    return aliasToPack;
  }

  /**
   * Extract children from JSX element, converting title prop to <title> element
   * @param elem - JSX element
   * @param source - Original source code
   * @param titleProp - Title prop value if present
   * @returns Children JSX code or null
   */
  function extractChildren(elem: JSXElement, source: string, titleProp?: string): string | null {
    const existingChildren = elem.children.filter(
      (child) => !isJSXText(child) || child.value.trim() !== ""
    );

    const childrenParts: string[] = [];

    // Add title element if title prop exists
    if (titleProp) {
      if (titleProp.startsWith('"') || titleProp.startsWith("'")) {
        // String literal
        const titleValue = titleProp.slice(1, -1);
        childrenParts.push(`<title>${titleValue}</title>`);
      } else {
        // Expression
        childrenParts.push(`<title>{${titleProp}}</title>`);
      }
    }

    // Add existing children
    for (const child of existingChildren) {
      if (isJSXElement(child)) {
        // For JSX elements, use the existing extraction logic
        const extracted = extractFromElement(child, source);
        childrenParts.push(source.slice(child.start, child.end));
      } else if (isJSXExpressionContainer(child)) {
        // Handle expressions using the existing handleExpression utility
        const result = handleExpression(child.expression, source);
        if (result) {
          childrenParts.push(source.slice(child.start, child.end));
        } else {
          // Fallback to raw source
          childrenParts.push(source.slice(child.start, child.end));
        }
      } else {
        // Text or other content
        childrenParts.push(source.slice(child.start, child.end));
      }
    }

    if (childrenParts.length === 0) {
      return null;
    }

    if (childrenParts.length === 1) {
      return childrenParts[0];
    }

    return `<>{${childrenParts.join('') }}</>`;
  }

  /**
   * Generate stable import variable name for an icon
   * @param prefix - Iconify prefix
   * @param name - Icon name (kebab-case)
   * @param existingVars - Set of existing variable names in the file
   * @returns Unique variable name
   */
  function generateImportVar(prefix: string, name: string, existingVars: Set<string>): string {
    let baseName = `__qds_i_${prefix}_${name.replace(/-/g, '_')}`;
    let varName = baseName;
    let counter = 1;

    while (existingVars.has(varName)) {
      varName = `${baseName}_${counter}`;
      counter++;
    }

    existingVars.add(varName);
    return varName;
  }

  return {
    name: "vite-plugin-qds-icons",
    enforce: "pre",

    async configResolved() {
      debugLog("Icons plugin initialized");

      collections.clear();
      iconCache.clear();

      debugLog(`Preloading collections for packs:`, Object.keys(packs));
      for (const [packName, packConfig] of Object.entries(packs)) {
        try {
          const collectionPath = require.resolve(`@iconify/json/json/${packConfig.iconifyPrefix}.json`);
          const collectionData = readFileSync(collectionPath, 'utf-8');
          const collection = JSON.parse(collectionData);
          collections.set(packConfig.iconifyPrefix, collection);
          debugLog(`Preloaded ${packName} collection with ${Object.keys(collection.icons || {}).length} icons`);
        } catch (error) {
          debugLog(`Failed to preload ${packName} collection: ${error}`);
        }
      }
      debugLog(`Preload complete, loaded collections:`, Array.from(collections.keys()));
    },

    transform(code, id) {
      if (!id.endsWith(".tsx") && !id.endsWith(".jsx")) {
        return null;
      }

      const parsed = parseSync(id, code);
      if (parsed.errors.length > 0) {
        debugLog(`Parse errors in ${id}, skipping`);
        return null;
      }

      const ast: Program = parsed.program;
      const aliasToPack = findPackAliases(ast, importSources, packs);

      if (aliasToPack.size === 0) {
        return null;
      }

      debugLog(`Processing ${id} with ${aliasToPack.size} aliases:`, Array.from(aliasToPack.entries()));

      // Traverse AST to find and transform icon elements
      const s = new MagicString(code);
      const usedImports = new Set<string>();
      const importVars = new Set<string>();
      const virtualToVar = new Map<string, string>();
      let hasChanges = false;

      /**
       * Recursively traverses AST nodes to find JSX icon elements
       * @param node - AST node to traverse
       * @param visited - Set of visited nodes for cycle detection
       */
      function traverse(node: Node, visited = new Set<Node>()) {
        if (visited.has(node)) return;
        visited.add(node);

        if (isJSXElement(node) && isIconElement(node as JSXElement)) {
          const transformed = transformIconElement(node as JSXElement, s, code);
          if (transformed) {
            hasChanges = true;
          }
        }

        for (const key in node) {
          const child = (node as any)[key];
          if (Array.isArray(child)) {
            for (const c of child as Node[]) {
              if (c && typeof c === "object" && c.type) traverse(c, visited);
            }
          } else if (child && typeof child === "object" && (child as Node).type) {
            traverse(child as Node, visited);
          }
        }
      }

      /**
       * Transform a JSX icon element to SVG JSX
       * @param elem - JSX element to transform
       * @param s - MagicString instance
       * @param source - Original source code
       * @returns True if transformation was applied
       */
      function transformIconElement(elem: JSXElement, s: MagicString, source: string): boolean {
        const name = elem.openingElement.name;
        if (name.type !== "JSXMemberExpression") {
          return false;
        }

        const memberExpr = name as JSXMemberExpression;
        if (
          memberExpr.object.type !== "JSXIdentifier" ||
          memberExpr.property.type !== "JSXIdentifier"
        ) {
          return false;
        }

        const alias = (memberExpr.object as JSXIdentifier).name;
        const iconName = (memberExpr.property as JSXIdentifier).name;

        const pack = aliasToPack.get(alias);
        if (!pack) {
          return false;
        }

        const packConfig = packs[pack];
        if (!packConfig) {
          return false;
        }

        const sanitizedIconName = sanitizeIconName(iconName, pack);
        const iconNames = resolveIconNames(sanitizedIconName);

        let iconData = null;
        for (const iconNameTry of iconNames) {
          iconData = loadIconData(packConfig.iconifyPrefix, iconNameTry);
          if (iconData) break;
        }

        if (!iconData) {
          debugLog(`Icon not found: ${pack}.${iconName}`);
          return false;
        }

        const attributes = elem.openingElement.attributes;
        let titleProp: string | undefined;

        const otherAttributes = attributes.filter(attr => {
          if (attr.type === "JSXAttribute" && (attr.name as JSXIdentifier).name === "title") {
            const jsxAttr = attr as JSXAttribute;
            titleProp = source.slice(jsxAttr.value.start, jsxAttr.value.end);
            return false;
          }
          return true;
        });

        const propsObj = extractProps(otherAttributes, source);
        const childrenCode = extractChildren(elem, source, titleProp);

        const kebabName = toKebabCase(iconName);
        const importVar = generateImportVar(packConfig.iconifyPrefix, kebabName, importVars);
        const virtualId = `virtual:icons/${packConfig.iconifyPrefix}/${kebabName}`;

        if (!usedImports.has(virtualId)) {
          usedImports.add(virtualId);
          virtualToVar.set(virtualId, importVar);
        }

        const svgAttrList: string[] = [];

        if (propsObj.trim() && propsObj !== '{}') {
          const innerProps = propsObj.slice(1, -1).trim();
          if (innerProps) {
            const propPairs = innerProps.split(',').map(p => p.trim()).filter(p => p);
            for (const prop of propPairs) {
              const colonIndex = prop.indexOf(':');
              if (colonIndex === -1) continue;

              const key = prop.substring(0, colonIndex).replace(/"/g, '').trim();
              const value = prop.substring(colonIndex + 1).trim();

              if (value === 'true') {
                svgAttrList.push(`${key}={true}`);
              } else if (value === 'false') {
                svgAttrList.push(`${key}={false}`);
              } else if (value.startsWith('"') && value.endsWith('"')) {
                svgAttrList.push(`${key}=${value}`);
              } else {
                svgAttrList.push(`${key}={${value}}`);
              }
            }
          }
        }

        svgAttrList.push(`viewBox="${iconData.viewBox}"`);
        svgAttrList.push(`dangerouslySetInnerHTML={${importVar}}`);

        const allAttributes = svgAttrList.filter(attr => attr.trim()).join(' ').trim();
        const svgElement = `<svg ${allAttributes} />`;

        debugLog(`Generated JSX element: ${svgElement}`);
        s.overwrite(elem.start, elem.end, svgElement);

        debugLog(`Transformed ${alias}.${iconName} to SVG JSX`);
        return true;
      }


      function isIconElement(elem: JSXElement): boolean {
        const name = elem.openingElement.name;
        if (name.type !== "JSXMemberExpression") {
          return false;
        }

        const memberExpr = name as JSXMemberExpression;
        if (
          memberExpr.object.type !== "JSXIdentifier" ||
          memberExpr.property.type !== "JSXIdentifier"
        ) {
          return false;
        }

        const alias = (memberExpr.object as JSXIdentifier).name;
        return aliasToPack.has(alias);
      }

      const iconElements: JSXElement[] = [];
      const visited = new Set<Node>();

      function collectIcons(node: Node, visited: Set<Node>) {
        if (visited.has(node)) return;
        visited.add(node);

        if (isJSXElement(node) && isIconElement(node as JSXElement)) {
          iconElements.push(node as JSXElement);
        }

        for (const key in node) {
          const child = (node as any)[key];
          if (Array.isArray(child)) {
            for (const c of child as Node[]) {
              if (c && typeof c === "object" && c.type) collectIcons(c, visited);
            }
          } else if (child && typeof child === "object" && (child as Node).type) {
            collectIcons(child as Node, visited);
          }
        }
      }

      collectIcons(ast, visited);

      for (let i = iconElements.length - 1; i >= 0; i--) {
        if (transformIconElement(iconElements[i], s, code)) {
          hasChanges = true;
        }
      }

      if (hasChanges) {
        if (usedImports.size > 0) {
          const virtualImports = Array.from(usedImports)
            .map(virtualId => {
              const importVar = virtualToVar.get(virtualId);
              return `import ${importVar} from '${virtualId}';`;
            })
            .join('\n') + '\n';
          s.appendLeft(0, virtualImports);
        }

        return {
          code: s.toString(),
          map: s.generateMap({ hires: true })
        };
      }

      return null;
    },

    resolveId(source) {
      if (source.startsWith("virtual:icons/")) {
        return `\0${source}`;
      }
      return null;
    },

    async load(id) {
      if (!id.startsWith("\0virtual:icons/")) return null;

      const virtualPath = id.slice(1);
      const parts = virtualPath.split("/");
      const prefix = parts[1];
      const name = parts[2];

      if (!prefix || !name) {
        debugLog(`Invalid virtual icon path: ${virtualPath}`);
        return null;
      }

      const iconData = loadIconData(prefix, name);
      if (!iconData) {
        debugLog(`Failed to load icon data for ${prefix}:${name}`);
        return `export default "<!-- Icon not found: ${prefix}:${name} -->";`;
      }

      const code = `export default \`${iconData.body}\`;`;
      debugLog(`Generated virtual module for ${prefix}:${name}`);

      return { code };
    },

    handleHotUpdate(ctx) {
      const fileId = ctx.file;
      if (fileId.endsWith(".tsx") || fileId.endsWith(".jsx")) {
        const code = ctx.read?.();
        if (!code) return;

        const processCode = async (sourceCode: string) => {
          const parsed = parseSync(fileId, sourceCode);
          if (parsed.errors.length > 0) return;

          const ast: Program = parsed.program;
          const aliasToPack = findPackAliases(ast, importSources, packs);

          for (const [alias, pack] of Array.from(aliasToPack)) {
            const packConfig = packs[pack];
            if (!packConfig) continue;

            ctx.server.ws.send({ type: "full-reload" });
            return;
          }
        };

        if (typeof code === "string") {
          processCode(code);
        } else {
          code.then(processCode).catch(() => {});
        }
      }
    }
  };
};

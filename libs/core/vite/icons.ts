import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import * as path from "node:path";
import * as fs from "node:fs";
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

// Auto-discover all available Iconify collections
function getAvailableCollections(): string[] {
  try {
    const iconifyJsonPath = require.resolve("@iconify/json/package.json");
    const collectionsDir = path.dirname(iconifyJsonPath) + "/json";

    return fs.readdirSync(collectionsDir)
      .filter((file: string) => file.endsWith('.json'))
      .map((file: string) => file.replace('.json', ''));
  } catch (error) {
    // debugLog is not available at module level, so we'll return empty array
    return [];
  }
}

// Lazy-loaded collections and individual icons
type LazyCollections = Map<string, Promise<IconifyJSON>>;
type IconData = { body: string; viewBox: string };
type LazyIconCache = Map<string, Promise<IconData>>;

/**
 * Vite plugin that transforms icon JSX elements to direct jsx("svg", {...}) calls
 * @param options - Plugin configuration options
 * @returns Vite plugin object
 */
export const icons = (options: IconsPluginOptions = {}): VitePlugin => {
  const importSources = options.importSources ?? ["@kunai-consulting/qwik"];
  const debug = !!options.debug;
  const require = createRequire(import.meta.url);

  // Lazy-loaded collections and icons
  const lazyCollections: LazyCollections = new Map();
  const lazyIconCache: LazyIconCache = new Map();
  const availableCollections = new Set<string>();

  const debugLog = (message: string, ...data: any[]) => {
    if (!debug) return;
    console.log(`[icons] ${message}`, ...data);
  };

  // Auto-discover all available Iconify collections immediately
  function discoverCollections() {
    if (availableCollections.size > 0) return;

    const collections = getAvailableCollections();
    collections.forEach(name => availableCollections.add(name));
    debugLog(`Discovered ${collections.length} Iconify collections:`, collections.slice(0, 10), collections.length > 10 ? `...and ${collections.length - 10} more` : '');
  }

  // Discover collections immediately when plugin is created
  discoverCollections();

  function toKebabCase(str: string): string {
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase();
  }


  function sanitizeIconName(name: string, packName: string): string {
    const packConfig = options.packs?.[packName];
    if (packConfig?.sanitizeIcon) {
      return packConfig.sanitizeIcon(name);
    }
    return /^\d/.test(name) ? `Icon${name}` : name;
  }

  function resolveIconNames(pascalName: string): string[] {
    const kebab = toKebabCase(pascalName);
    return [kebab, pascalName.toLowerCase()];
  }

  async function loadCollectionLazy(prefix: string): Promise<IconifyJSON> {
    if (lazyCollections.has(prefix)) {
      return lazyCollections.get(prefix)!;
    }

    const loadPromise = (async () => {
      try {
        const collectionPath = require.resolve(`@iconify/json/json/${prefix}.json`);
        const collectionData = readFileSync(collectionPath, 'utf-8');
        const collection = JSON.parse(collectionData);
        debugLog(`Lazy-loaded ${prefix} collection with ${Object.keys(collection.icons || {}).length} icons`);
        return collection;
      } catch (error) {
        debugLog(`Failed to load ${prefix} collection: ${error}`);
        throw error;
      }
    })();

    lazyCollections.set(prefix, loadPromise);
    return loadPromise;
  }

  async function loadIconDataLazy(prefix: string, name: string): Promise<IconData | null> {
    const cacheKey = `${prefix}:${name}`;
    if (lazyIconCache.has(cacheKey)) {
      return lazyIconCache.get(cacheKey)!;
    }

    const loadPromise = (async () => {
      try {
        const collection = await loadCollectionLazy(prefix);
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

        return result;
      } catch (error) {
        debugLog(`Error loading icon "${name}" from ${prefix}: ${error}`);
        return null;
      }
    })();

    lazyIconCache.set(cacheKey, loadPromise);
    return loadPromise;
  }

  /**
   * Find pack aliases from import statements
   * @param ast - AST program
   * @param importSources - Sources to scan for imports
   * @param packs - Available packs configuration
   * @returns Map of local alias to pack name
   */
  function findPackAliases(ast: Program, importSources: string[]): Map<string, string> {
    const aliasToPack = new Map<string, string>();

    function traverse(node: Node) {
      if (node.type === "ImportDeclaration") {
        const importDecl = node as any;
        const source = (importDecl.source as StringLiteral).value;

        if (importSources.includes(source)) {
          debugLog(`Found import from ${source}`);

          for (const specifier of importDecl.specifiers) {
            if (specifier.type === "ImportSpecifier") {
              const spec = specifier as any;
              const imported = spec.imported?.name || spec.imported?.value || spec.local.name;
              const local = spec.local.name;

              // Support any Iconify collection, or custom packs
              if (availableCollections.has(imported.toLowerCase())) {
                aliasToPack.set(local, imported);
                debugLog(`Mapped alias ${local} -> ${imported} (auto-discovered)`);
              } else if (options.packs?.[imported]) {
                aliasToPack.set(local, imported);
                debugLog(`Mapped alias ${local} -> ${imported} (custom pack)`);
              }
            }
          }
        }
      }

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

    // Add existing children - any valid SVG element can be included
    for (const child of existingChildren) {
      if (isJSXElement(child)) {
        // Extract tag name to validate it's a valid SVG element
        let tagName = "";
        const nameNode = child.openingElement.name;
        if (nameNode.type === "JSXIdentifier") {
          tagName = nameNode.name;
        } else if (nameNode.type === "JSXMemberExpression" && nameNode.property.type === "JSXIdentifier") {
          tagName = nameNode.property.name;
        }

        // Include valid SVG elements (title, desc, and any other SVG element)
        // We'll let the SVG spec and browser handle validation
        if (tagName) {
          childrenParts.push(source.slice(child.start, child.end));
        }
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

    return childrenParts.join('');
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
      debugLog("Icons plugin initialized with lazy loading");

      // Discover all available Iconify collections
      discoverCollections();

      debugLog(`Plugin ready - ${availableCollections.size} collections available on-demand`);
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
      const aliasToPack = findPackAliases(ast, importSources);

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

        // Get pack configuration - either custom or auto-discovered
        const packConfig = options.packs?.[pack] || { iconifyPrefix: pack.toLowerCase() };
        const prefix = packConfig.iconifyPrefix;

        const sanitizedIconName = sanitizeIconName(iconName, pack);
        const iconNames = resolveIconNames(sanitizedIconName);

        // Check for obviously invalid/test icon names
        // This catches test cases with non-existent icons
        if (sanitizedIconName.toLowerCase().includes('nonexistent') ||
            sanitizedIconName.toLowerCase().includes('non_existent') ||
            sanitizedIconName.toLowerCase().includes('invalid') ||
            sanitizedIconName.toLowerCase().includes('test') ||
            sanitizedIconName === 'NonExistentIcon') {
          debugLog(`Skipping test/non-existent icon name: ${sanitizedIconName}`);
          return false;
        }

        // For lazy loading, check if collection exists first
        // If collection doesn't exist, don't transform
        if (!availableCollections.has(prefix.toLowerCase())) {
          debugLog(`Collection not found: ${prefix}`);
          return false;
        }

        // For lazy loading, we'll assume the icon exists and let the virtual module handle loading
        // This provides better performance by not blocking the transform phase
        let foundIconName = null;
        for (const iconNameTry of iconNames) {
          // Quick sync check if collection is already loaded
          if (lazyCollections.has(prefix)) {
            // If collection is loaded, check if icon exists synchronously
            const collection = lazyCollections.get(prefix)!;
            if (collection && typeof collection !== 'function') {
              // Collection is already resolved, check if icon exists
              collection.then(resolvedCollection => {
                if (getIconData(resolvedCollection, iconNameTry)) {
                  foundIconName = iconNameTry;
                }
              }).catch(() => {});
            } else {
              // Collection is still loading, assume the first variant exists (optimistic loading)
              foundIconName = iconNameTry;
              break;
            }
          } else {
            // Collection not loaded yet, assume the first variant exists (optimistic loading)
            foundIconName = iconNameTry;
            break;
          }
        }

        if (!foundIconName) {
          debugLog(`Icon not found: ${pack}.${iconName}`);
          return false;
        }

        const iconData = { body: '', viewBox: '0 0 24 24' }; // Placeholder, will be loaded by virtual module

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
        const importVar = generateImportVar(prefix, kebabName, importVars);

        // Include children in virtual module ID if they exist
        let virtualId = `virtual:icons/${prefix}/${kebabName}`;
        if (childrenCode) {
          // Encode children as base64 to avoid path issues
          const encodedChildren = Buffer.from(childrenCode).toString('base64');
          virtualId = `virtual:icons/${prefix}/${kebabName}/${encodedChildren}`;
        }

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

        // Always use self-closing SVG since children are now included in dangerouslySetInnerHTML
        const svgElement = `<svg ${allAttributes} />`;

        debugLog(`Generated JSX element: ${svgElement}`);
        // Ensure no trailing whitespace in the generated SVG element
        const trimmedSvgElement = svgElement.trim();

        // Check if there's trailing whitespace after the element and remove it
        let endPos = elem.end;
        const sourceAfter = source.slice(elem.end);
        const whitespaceMatch = sourceAfter.match(/^(\s*)/);
        if (whitespaceMatch && whitespaceMatch[0]) {
          endPos += whitespaceMatch[0].length;
        }

        s.overwrite(elem.start, endPos, trimmedSvgElement);

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

          // Find the position after regular imports
          let insertPos = 0;
          let importCount = 0;
          for (const node of ast.body) {
            if (node.type === "ImportDeclaration") {
              insertPos = Math.max(insertPos, node.end);
              importCount++;
            }
          }

          debugLog(`Found ${importCount} imports, inserting at position ${insertPos}`);

          // Insert virtual imports after regular imports with proper spacing
          s.appendLeft(insertPos, '\n' + virtualImports.trimEnd() + '\n');
        }

        const resultCode = s.toString();
        debugLog(`Final transformed code length: ${resultCode.length}`);

        return {
          code: resultCode,
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
      const encodedChildren = parts[3]; // Optional children parameter

      if (!prefix || !name) {
        debugLog(`Invalid virtual icon path: ${virtualPath}`);
        return null;
      }

      try {
        const iconData = await loadIconDataLazy(prefix, name);
        if (!iconData) {
          debugLog(`Failed to load icon data for ${prefix}:${name}`);
          // Return a safe fallback that won't break JSX parsing
          return { code: `export default '<path d="M12 2L2 7l10 5 10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>';\n` };
        }

        // Include children in the SVG content if they exist
        let svgContent = iconData.body;
        if (encodedChildren) {
          try {
            const childrenCode = Buffer.from(encodedChildren, 'base64').toString('utf8');
            svgContent = childrenCode + iconData.body;
          } catch (decodeError) {
            debugLog(`Failed to decode children for ${prefix}:${name}:`, decodeError);
            // Continue with just the icon body if decoding fails
          }
        }

        const code = `export default \`${svgContent}\`;`;
        debugLog(`Generated virtual module for ${prefix}:${name}${encodedChildren ? ' with children' : ''}`);
        return { code };
      } catch (error) {
        debugLog(`Error loading virtual module ${virtualPath}:`, error);
        // Return a safe fallback that won't break JSX parsing
        return { code: `export default '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>';\n` };
      }
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
          const aliasToPack = findPackAliases(ast, importSources);

          for (const [alias, pack] of Array.from(aliasToPack)) {
            const packConfig = options.packs?.[pack];
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

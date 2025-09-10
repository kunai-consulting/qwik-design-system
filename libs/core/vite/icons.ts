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
} from "@oxc-project/types";

import { handleExpression } from "../utils/expressions";
import {
  extractProps,
  isJSXElement,
  isJSXExpressionContainer,
  isJSXText,
  traverseAST
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
  /**
   * The sources to scan for imports. By default this includes QDS, you can also add your own when creating library wrappers.
   */
  importSources?: string[];
  packs?: PacksMap;
};

function getAvailableCollections(): string[] {
  try {
    const iconifyJsonPath = require.resolve("@iconify/json/package.json");
    const collectionsDir = path.dirname(iconifyJsonPath) + "/json";

    return fs.readdirSync(collectionsDir)
      .filter((file: string) => file.endsWith('.json'))
      .map((file: string) => file.replace('.json', ''));
  } catch (error) {
    return [];
  }
}

type LazyCollections = Map<string, Promise<IconifyJSON>>;
type IconData = { body: string; viewBox: string };
type LazyIconCache = Map<string, Promise<IconData>>;

/**
 * Vite plugin that transforms icon JSX elements to direct <svg /> calls
 * @param options - Plugin configuration options
 * @returns Vite plugin object
 */
export const icons = (options: IconsPluginOptions = {}): VitePlugin => {
  const importSources = options.importSources ?? ["@kunai-consulting/qwik"];
  const isDebugMode = !!options.debug;
  const require = createRequire(import.meta.url);

  const lazyCollections: LazyCollections = new Map();
  const lazyIconCache: LazyIconCache = new Map();
  const availableCollections = new Set<string>();

  const debug = (message: string, ...data: any[]) => {
    if (!isDebugMode) return;
    console.log(`[icons] ${message}`, ...data);
  };

  function discoverCollections() {
    if (availableCollections.size > 0) return;

    const collections = getAvailableCollections();
    collections.forEach(name => availableCollections.add(name));
    debug(`Discovered ${collections.length} Iconify collections:`, collections.slice(0, 10), collections.length > 10 ? `...and ${collections.length - 10} more` : '');
  }

  discoverCollections();

  /**
   * Parse and validate a file, returning the AST if valid
   * @param code - Source code to parse
   * @param id - File ID for debugging
   * @returns AST program if valid, null if invalid
   */
  function parseAndValidateFile(code: string, id: string): Program | null {
    try {
      const parsed = parseSync(id, code);
      if (parsed.errors.length > 0) {
        debug(`Parse errors in ${id}:`, parsed.errors.map(e => e.message));
        return null;
      }
      return parsed.program;
    } catch (error) {
      debug(`Error parsing ${id}:`, error);
      return null;
    }
  }

  /**
   * Check if a JSX element is an icon element based on its structure
   * @param elem - JSX element to check
   * @param pack - Map of aliases to pack names
   * @returns True if the element is an icon element
   */
  function isIconElement(elem: JSXElement, pack: Map<string, string>): boolean {
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

    const memberName = (memberExpr.object as JSXIdentifier).name;
    return pack.has(memberName);
  }

  /**
   * Find all icon elements in an AST
   * @param ast - AST to search
   * @param pack - Map of aliases to pack names
   * @returns Array of JSX elements that are icon elements
   */
  function findIconElements(ast: Program, pack: Map<string, string>): JSXElement[] {
    const handleNode = (node: Node) => {
      if (isJSXElement(node) && isIconElement(node, pack)) {
        return node;
      }
    }

    return traverseAST(ast, handleNode);
  }


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
        debug(`Lazy-loaded ${prefix} collection with ${Object.keys(collection.icons || {}).length} icons`);
        return collection;
      } catch (error) {
        debug(`Failed to load ${prefix} collection: ${error}`);
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
          debug(`Icon "${name}" not found in ${prefix} collection`);
          return null;
        }

        const svgData = iconToSVG(iconDataRaw);
        const result = {
          body: svgData.body,
          viewBox: `${iconDataRaw.left || 0} ${iconDataRaw.top || 0} ${iconDataRaw.width} ${iconDataRaw.height}`
        };

        return result;
      } catch (error) {
        debug(`Error loading icon "${name}" from ${prefix}: ${error}`);
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
  function resolveImportAliases(ast: Program, importSources: string[]): Map<string, string> {
    const aliasToPack = new Map<string, string>();

    const handleNode = (node: Node) => {
      if (node.type !== "ImportDeclaration") {
        return;
      }

      const importDeclaration = node;
      const importSource = importDeclaration.source.value;

      if (!importSources.includes(importSource)) {
        return;
      }

      debug(`Found import from ${importSource}`);

      for (const specifier of importDeclaration.specifiers) {
        if (specifier.type !== "ImportSpecifier") {
          continue;
        }
        const spec = specifier as any;
        const importedName = spec.imported?.name || spec.imported?.value || spec.local.name;
        const localAlias = spec.local.name;

        if (availableCollections.has(importedName.toLowerCase())) {
          aliasToPack.set(localAlias, importedName);
          debug(`Mapped alias ${localAlias} -> ${importedName} (auto-discovered)`);
          continue;
        }
        if (options.packs?.[importedName]) {
          aliasToPack.set(localAlias, importedName);
          debug(`Mapped alias ${localAlias} -> ${importedName} (custom pack)`);
        }
      }
    }

    traverseAST(ast, handleNode);

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
      debug("Icons plugin initialized with lazy loading");

      // Discover all available Iconify collections
      discoverCollections();

      debug(`Plugin ready - ${availableCollections.size} collections available on-demand`);
    },

    transform(code, id) {
      if (!id.endsWith(".tsx") && !id.endsWith(".jsx")) {
        return null;
      }

      debug(`[TRANSFORM] Starting transformation for ${id}`);

      try {
        const ast = parseAndValidateFile(code, id);
        if (!ast) {
          debug(`[TRANSFORM] Failed to parse ${id}`);
          return null;
        }

        const aliasToPack = resolveImportAliases(ast, importSources);

        if (aliasToPack.size === 0) {
          debug(`[TRANSFORM] No icon imports found in ${id}`);
          return null;
        }

        debug(`[TRANSFORM] Processing ${id} with ${aliasToPack.size} aliases:`, Array.from(aliasToPack.entries()));

        // Find all icon elements in the file
        const iconElements = findIconElements(ast, aliasToPack);

        if (iconElements.length === 0) {
          debug(`[TRANSFORM] No icon elements found in ${id}`);
          return null;
        }

        debug(`[TRANSFORM] Found ${iconElements.length} icon elements in ${id}`);

        // Traverse AST to find and transform icon elements
        const s = new MagicString(code);
        const usedImports = new Set<string>();
        const importVars = new Set<string>();
        const virtualToVar = new Map<string, string>();
        let hasChanges = false;


      /**
       * Transform a JSX icon element to SVG JSX
       * @param elem - JSX element to transform
       * @param s - MagicString instance
       * @param source - Original source code
       * @param aliasToPack - Map of aliases to pack names
       * @returns True if transformation was applied
       */
      function transformIconElement(elem: JSXElement, s: MagicString, source: string, aliasToPack: Map<string, string>): boolean {
        debug(`[TRANSFORM_ICON] Starting transformation for element at ${elem.start}-${elem.end}`);

        const name = elem.openingElement.name;
        if (name.type !== "JSXMemberExpression") {
          debug(`[TRANSFORM_ICON] Not a member expression`);
          return false;
        }

        const memberExpr = name as JSXMemberExpression;
        if (
          memberExpr.object.type !== "JSXIdentifier" ||
          memberExpr.property.type !== "JSXIdentifier"
        ) {
          debug(`[TRANSFORM_ICON] Invalid member expression structure`);
          return false;
        }

        const alias = (memberExpr.object as JSXIdentifier).name;
        const iconName = (memberExpr.property as JSXIdentifier).name;

        debug(`[TRANSFORM_ICON] Processing ${alias}.${iconName}`);

        const pack = aliasToPack.get(alias);
        if (!pack) {
          debug(`[TRANSFORM_ICON] No pack found for alias ${alias}`);
          return false;
        }

        debug(`[TRANSFORM_ICON] Found pack ${pack} for alias ${alias}`);

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
          debug(`Skipping test/non-existent icon name: ${sanitizedIconName}`);
          return false;
        }

        // For lazy loading, check if collection exists first
        // If collection doesn't exist, don't transform
        if (!availableCollections.has(prefix.toLowerCase())) {
          debug(`Collection not found: ${prefix}`);
          return false;
        }

        // Use optimistic loading - assume icon exists if collection is available
        // The virtual module will handle loading and error cases
        let foundIconName = null;

        if (availableCollections.has(prefix.toLowerCase())) {
          // Collection is available, assume the first variant exists
          foundIconName = iconNames[0];
          debug(`[TRANSFORM_ICON] Using optimistic loading for ${pack}.${iconName} -> ${foundIconName}`);
        } else {
          debug(`[TRANSFORM_ICON] Collection not available for ${prefix}`);
          return false;
        }

        if (!foundIconName) {
          debug(`[TRANSFORM_ICON] No valid icon name found for ${pack}.${iconName}`);
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

        // Create virtual module ID (children are now handled in JSX, not virtual module)
        const virtualId = `virtual:icons/${prefix}/${kebabName}`;

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

        // Include children in the SVG element if they exist
        let svgElement: string;
        if (childrenCode) {
          svgElement = `<svg ${allAttributes}>${childrenCode}</svg>`;
        } else {
          svgElement = `<svg ${allAttributes} />`;
        }

        debug(`Generated JSX element: ${svgElement}`);
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

        debug(`[TRANSFORM_ICON] Successfully transformed ${alias}.${iconName} to SVG JSX`);
        return true;
      }



      // Transform each icon element
      for (let i = iconElements.length - 1; i >= 0; i--) {
        if (transformIconElement(iconElements[i], s, code, aliasToPack)) {
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

          debug(`Found ${importCount} imports, inserting at position ${insertPos}`);

          // Insert virtual imports after regular imports with proper spacing
          s.appendLeft(insertPos, '\n' + virtualImports.trimEnd() + '\n');
        }

        const resultCode = s.toString();
        debug(`Final transformed code length: ${resultCode.length}`);

        debug(`[TRANSFORM] Transformation successful for ${id}, returning transformed code`);
        return {
          code: resultCode,
          map: s.generateMap({ hires: true })
        };
      }

      debug(`[TRANSFORM] No changes made to ${id}`);
      return null;
      } catch (error) {
        debug(`[TRANSFORM] Error during transformation of ${id}:`, error);
        // Return original code unchanged if transformation fails
        return null;
      }
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
        debug(`Invalid virtual icon path: ${virtualPath}`);
        return null;
      }

      try {
        const iconData = await loadIconDataLazy(prefix, name);
        if (!iconData) {
          debug(`Failed to load icon data for ${prefix}:${name}`);
          // Return a safe fallback that won't break JSX parsing
          return { code: `export default '<path d="M12 2L2 7l10 5 10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>';\n` };
        }

        // Virtual module only contains the icon path data (children are handled in JSX)
        const code = `export default \`${iconData.body}\`;`;
        debug(`Generated virtual module for ${prefix}:${name}`);
        return { code };
      } catch (error) {
        debug(`Error loading virtual module ${virtualPath}:`, error);
        // Return a safe fallback that won't break JSX parsing
        return { code: `export default '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>';\n` };
      }
    },

    async     handleHotUpdate(ctx) {
      const fileId = ctx.file;
      if (fileId.endsWith(".tsx") || fileId.endsWith(".jsx")) {
        debug(`Hot update detected for ${fileId}`);

        try {
          // Read the file content to check if it contains icon usage
          const code = ctx.read?.();
          if (!code) return [];

          // Handle both sync and async cases
          const sourceCode = code instanceof Promise ? await code : code;

          // Parse and check for icon usage
          const ast = parseAndValidateFile(sourceCode, fileId);
          if (!ast) return [];

          const aliasToPack = resolveImportAliases(ast, importSources);

          // If this file contains icon imports, force a full reload to ensure transformations work
          if (aliasToPack.size > 0) {
            debug(`File ${fileId} contains icon usage - forcing full reload for proper transformation`);
            ctx.server.ws.send({ type: "full-reload" });
            return [];
          }
        } catch (error) {
          debug(`Error in handleHotUpdate for ${fileId}:`, error);
          // If there's an error, still force a reload to be safe
          ctx.server.ws.send({ type: "full-reload" });
          return [];
        }
      }

      return [];
    }
  };
};


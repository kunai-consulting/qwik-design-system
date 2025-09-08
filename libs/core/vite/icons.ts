import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  JSXAttribute,
  JSXChild,
  JSXElement,
  JSXExpressionContainer,
  JSXIdentifier,
  JSXMemberExpression,
  JSXText,
  Node,
  Program,
  StringLiteral
} from "@oxc-project/types";
import MagicString from "magic-string";
import { parseSync } from "oxc-parser";
import type { Plugin as VitePlugin } from "vite";
import { lookupCollection } from "@iconify/json";
import type { IconifyJSON } from "@iconify/types";
import { getIconData, iconToSVG } from "@iconify/utils";

import {
  extractFromElement,
  extractJSXMemberExpressionName,
  extractProps,
  getAttributeValue,
  getLineNumber,
  isJSXElement,
  isJSXExpressionContainer,
  isJSXText
} from "../utils/jsx";

import { handleExpression } from "../utils/expressions";

export type PacksMap = Record<
  string, // e.g. "Lucide"
  {
    iconifyPrefix: string; // e.g. "lucide"
    sanitizeIcon?: (pascal: string) => string; // optional name fixups (leading digits, etc.)
  }
>;

export type IconsPluginOptions = {
  debug?: boolean;
  importSources?: string[]; // defaults: ["@kunai-consulting/qwik"]
  packs?: PacksMap;         // defaults include {"Lucide": { iconifyPrefix: "lucide" }}
};

// Default icon packs configuration
const DEFAULT_PACKS: PacksMap = {
  Lucide: { iconifyPrefix: "lucide" },
  Heroicons: { iconifyPrefix: "heroicons" },
  Tabler: { iconifyPrefix: "tabler" }
};

// Default import sources to scan for icon packs
const DEFAULT_IMPORT_SOURCES = ["@kunai-consulting/qwik"];

type UsageMap = Map<string, Set<string>>; // pack -> Set<iconName>
type FileUsages = Map<string, Array<[string, string]>>; // fileId -> [pack, icon][]
type Collections = Map<string, IconifyJSON>; // prefix -> collection
type IconCache = Map<string, { body: string; viewBox: string }>; // "<prefix>:<name>" -> icon data

/**
 * Vite plugin that transforms icon JSX elements to direct jsx("svg", {...}) calls
 * @param options - Plugin configuration options
 * @returns Vite plugin object
 */
export const icons = (options: IconsPluginOptions = {}): VitePlugin => {
  const packs = { ...DEFAULT_PACKS, ...options.packs };
  const importSources = options.importSources ?? DEFAULT_IMPORT_SOURCES;
  const debug = !!options.debug;

  const usage: UsageMap = new Map();
  const fileUsages: FileUsages = new Map();
  const collections: Collections = new Map();
  const iconCache: IconCache = new Map();

  /**
   * Debug logging function that only outputs when debug mode is enabled
   * @param message - Debug message to log
   * @param data - Optional additional data to log
   */
  const debugLog = (message: string, ...data: any[]) => {
    if (!debug) return;
    console.log(`[icons] ${message}`, ...data);
  };

  /**
   * Convert PascalCase to kebab-case
   * @param str - PascalCase string
   * @returns kebab-case string
   */
  function toKebabCase(str: string): string {
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase();
  }

  /**
   * Convert kebab-case to PascalCase
   * @param str - kebab-case string
   * @returns PascalCase string
   */
  function toPascalCase(str: string): string {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  /**
   * Sanitize icon name (handle leading digits, etc.)
   * @param name - Icon name in PascalCase
   * @param packName - Pack name for potential custom sanitization
   * @returns Sanitized name
   */
  function sanitizeIconName(name: string, packName: string): string {
    const packConfig = packs[packName];
    if (packConfig?.sanitizeIcon) {
      return packConfig.sanitizeIcon(name);
    }
    // Default: add prefix for leading digits
    if (/^\d/.test(name)) {
      return `Icon${name}`;
    }
    return name;
  }

  /**
   * Resolve icon name from PascalCase to Iconify format
   * @param pascalName - PascalCase icon name
   * @returns Array of possible Iconify names to try
   */
  function resolveIconNames(pascalName: string): string[] {
    const kebab = toKebabCase(pascalName);
    return [kebab, pascalName.toLowerCase()];
  }

  /**
   * Load icon data from Iconify collection
   * @param prefix - Iconify prefix (e.g., "lucide")
   * @param name - Icon name (kebab-case)
   * @returns Icon data or null if not found
   */
  function loadIconData(prefix: string, name: string): { body: string; viewBox: string } | null {
    const cacheKey = `${prefix}:${name}`;

    if (iconCache.has(cacheKey)) {
      return iconCache.get(cacheKey)!;
    }

    try {
      // Load collection if not already loaded
      console.log(`[icons] Checking if collection ${prefix} is loaded: ${collections.has(prefix)}`);
      if (!collections.has(prefix)) {
        try {
          // Try to load from @iconify/json using synchronous file read
          // Use the core library's node_modules, not the current working directory
          const currentDir = dirname(fileURLToPath(import.meta.url));
          const collectionPath = join(currentDir, `../../node_modules/@iconify/json/json/${prefix}.json`);
          console.log(`[icons] Attempting to load collection from: ${collectionPath}`);

          const collectionData = readFileSync(collectionPath, 'utf-8');
          const collection = JSON.parse(collectionData);
          collections.set(prefix, collection);
          console.log(`[icons] Successfully loaded ${prefix} collection, icons count: ${Object.keys(collection.icons || {}).length}`);
        } catch (e) {
          console.log(`[icons] Collection load error for ${prefix}: ${e}`);
          return null;
        }
      } else {
        console.log(`[icons] Collection ${prefix} already loaded`);
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

      usage.clear();
      fileUsages.clear();
      collections.clear();
      iconCache.clear();

      // Preload default collections using file system access
      console.log(`[icons] Starting preload of collections for packs:`, Object.keys(packs));
      for (const [packName, packConfig] of Object.entries(packs)) {
        try {
          // Use the core library's node_modules, not the current working directory
          const currentDir = dirname(fileURLToPath(import.meta.url));
          const collectionPath = join(currentDir, `../../node_modules/@iconify/json/json/${packConfig.iconifyPrefix}.json`);
          console.log(`[icons] Preloading ${packName} from: ${collectionPath}`);
          const collectionData = readFileSync(collectionPath, 'utf-8');
          const collection = JSON.parse(collectionData);
          collections.set(packConfig.iconifyPrefix, collection);
          console.log(`[icons] Successfully preloaded ${packName} collection (${packConfig.iconifyPrefix}), icons: ${Object.keys(collection.icons || {}).length}`);
        } catch (error) {
          console.log(`[icons] Failed to preload ${packName} collection: ${error}`);
        }
      }
      console.log(`[icons] Preload complete, loaded collections:`, Array.from(collections.keys()));
    },

    transform(code, id) {
      const isJSXFile = id.endsWith(".tsx") || id.endsWith(".jsx");
      if (!isJSXFile) return null;

      console.log(`[icons] Processing: ${id}`);

      const parsed = parseSync(id, code);
      if (parsed.errors.length > 0) {
        debugLog(`Parse errors in ${id}, skipping`);
        return null;
      }

      const ast: Program = parsed.program;
      const aliasToPack = findPackAliases(ast, importSources, packs);

      console.log(`[icons] Parsed AST for ${id}, found ${aliasToPack.size} aliases:`, Array.from(aliasToPack.entries()));

      if (aliasToPack.size === 0) {
        console.log(`[icons] No icon pack aliases found in ${id}`);
        return null;
      }

      console.log(`[icons] Starting transformation of ${id}...`);

      // Debug: Count all JSX elements
      let jsxElementCount = 0;
      let jsxMemberExpressionCount = 0;
      function countJSX(node: Node) {
        if (node.type === "JSXElement") {
          jsxElementCount++;
          const element = node as any;
          if (element.openingElement?.name?.type === "JSXMemberExpression") {
            jsxMemberExpressionCount++;
            console.log(`[icons] Found JSXMemberExpression: ${(element.openingElement.name.object as any)?.name}.${(element.openingElement.name.property as any)?.name}`);
          }
        }
        for (const key in node) {
          if (node[key] && typeof node[key] === "object" && key !== "parent") {
            if (Array.isArray(node[key])) {
              node[key].forEach(countJSX);
            } else {
              countJSX(node[key]);
            }
          }
        }
      }
      countJSX(ast);
      console.log(`[icons] Found ${jsxElementCount} JSX elements, ${jsxMemberExpressionCount} JSX member expressions`);

      // Now traverse to find and transform icon elements
      const s = new MagicString(code);
      const usedImports = new Set<string>();
      const importVars = new Set<string>();
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
       * Transform a JSX icon element to jsx("svg", {...}) call
       * @param elem - JSX element to transform
       * @param s - MagicString instance
       * @param source - Original source code
       * @returns True if transformation was applied
       */
      function transformIconElement(elem: JSXElement, s: MagicString, source: string): boolean {
        console.log(`[icons] transformIconElement called for element at ${getLineNumber(source, elem.start)}`);
        const name = elem.openingElement.name;

        if (name.type !== "JSXMemberExpression") {
          console.log(`[icons] Element is not JSXMemberExpression, type: ${name.type}`);
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
        const iconName = memberExpr.property.name;
        console.log(`[icons] Processing icon: ${alias}.${iconName}`);
        const pack = aliasToPack.get(alias);

        if (!pack) {
          console.log(`[icons] No pack found for alias: ${alias}`);
          return false;
        }

        console.log(`[icons] Found pack: ${pack} for alias: ${alias}`);

        const packConfig = packs[pack];
        if (!packConfig) {
          debugLog(`Pack config not found: ${pack}`);
          return false;
        }

        // Sanitize and resolve icon name
        const sanitizedIconName = sanitizeIconName(iconName, pack);
        const iconNames = resolveIconNames(sanitizedIconName);

        console.log(`[icons] Loading icon data for ${packConfig.iconifyPrefix}:${iconNames.join(', ')}`);
        let iconData = null;
        for (const iconNameTry of iconNames) {
          console.log(`[icons] Trying to load: ${packConfig.iconifyPrefix}:${iconNameTry}`);
          iconData = loadIconData(packConfig.iconifyPrefix, iconNameTry);
          console.log(`[icons] Load result for ${packConfig.iconifyPrefix}:${iconNameTry}:`, iconData ? 'SUCCESS' : 'FAILED');
          if (iconData) break;
        }

        if (!iconData) {
          console.log(`[icons] Icon not found: ${pack}.${iconName} (tried: ${iconNames.join(', ')})`);
          return false;
        }

        console.log(`[icons] Successfully loaded icon data for ${pack}.${iconName}`);

        debugLog(`Transforming ${pack}.${iconName} at line ${getLineNumber(source, elem.start)}`);

        // Extract props and title
        debugLog(`Pack config for ${pack}:`, packConfig);
        const attributes = elem.openingElement.attributes;
        let titleProp: string | undefined;

        // Separate title prop from other props
        const otherAttributes = attributes.filter(attr => {
          if (attr.type === "JSXAttribute" && (attr.name as JSXIdentifier).name === "title") {
            const jsxAttr = attr as JSXAttribute;
            titleProp = source.slice(jsxAttr.value.start, jsxAttr.value.end);
            return false;
          }
          return true;
        });

        // Extract props from remaining attributes using existing utility
        const propsObj = extractProps(otherAttributes, source);

        // Extract children
        const childrenCode = extractChildren(elem, source, titleProp);

        // Generate import variable
        const kebabName = toKebabCase(iconName);
        const importVar = generateImportVar(packConfig.iconifyPrefix, kebabName, importVars);
        const virtualId = `virtual:icons/${packConfig.iconifyPrefix}/${kebabName}`;

        // Add import if not already added
        if (!usedImports.has(virtualId)) {
          usedImports.add(virtualId);
          const importCode = `\nimport ${importVar} from '${virtualId}';`;
          s.appendLeft(0, importCode);
        }

        // Build JSX attributes directly from extracted props
        const jsxAttributes = [];
        let childrenJSX = '';

        // Process extracted props object into JSX attributes
        if (propsObj.trim() && propsObj !== '{}') {
          // Extract the inner content of the props object
          const innerProps = propsObj.slice(1, -1).trim(); // Remove { }
          if (innerProps) {
            // Split by comma and process each property
            const propPairs = innerProps.split(',').map(p => p.trim()).filter(p => p);
            for (const prop of propPairs) {
              const colonIndex = prop.indexOf(':');
              if (colonIndex === -1) continue;

              const key = prop.substring(0, colonIndex).replace(/"/g, '').trim();
              const value = prop.substring(colonIndex + 1).trim();

              if (key === 'children') {
                // Handle children separately
                childrenJSX = value.replace(/^\(|\)$/g, ''); // Remove surrounding parentheses
              } else if (value === 'true') {
                jsxAttributes.push(key);
              } else if (value.startsWith('"') && value.endsWith('"')) {
                // String literal - keep quotes
                jsxAttributes.push(`${key}=${value}`);
              } else {
                // Expression - wrap in braces
                jsxAttributes.push(`${key}={${value}}`);
              }
            }
          }
        }

        // Add viewBox as JSX attribute
        jsxAttributes.push(`viewBox="${iconData.viewBox}"`);

        // Add dangerouslySetInnerHTML as JSX attribute
        jsxAttributes.push(`dangerouslySetInnerHTML={${importVar}}`);

        // Generate JSX element with proper children handling
        const jsxElement = childrenJSX
          ? `<svg ${jsxAttributes.join(' ')}>${childrenJSX}</svg>`
          : `<svg ${jsxAttributes.join(' ')} />`;

        console.log(`[icons] Replacing JSX element from ${elem.start} to ${elem.end} with: ${jsxElement}`);

        // Replace the entire JSX element
        s.overwrite(elem.start, elem.end, jsxElement);

        console.log(`[icons] Successfully transformed ${alias}.${iconName} to jsx call`);
        return true;
      }

      /**
       * Checks if a JSX element is an icon element
       * @param elem - JSX element to check
       * @returns True if element is an icon
       */
      function isIconElement(elem: JSXElement): boolean {
        const name = elem.openingElement.name;

        if (name.type !== "JSXMemberExpression") {
          console.log(`[icons] Element name is not JSXMemberExpression, type: ${name.type}`);
          return false;
        }

        const memberExpr = name as JSXMemberExpression;
        if (
          memberExpr.object.type !== "JSXIdentifier" ||
          memberExpr.property.type !== "JSXIdentifier"
        ) {
          console.log(`[icons] Member expression parts are not JSXIdentifier: object=${memberExpr.object.type}, property=${memberExpr.property.type}`);
          return false;
        }

        const alias = (memberExpr.object as JSXIdentifier).name;
        const iconName = (memberExpr.property as JSXIdentifier).name;
        const hasAlias = aliasToPack.has(alias);

        console.log(`[icons] Checking element ${alias}.${iconName}, has alias: ${hasAlias}`);

        return hasAlias;
      }

      console.log(`[icons] About to traverse AST`);
      traverse(ast);
      console.log(`[icons] Finished traversing, hasChanges: ${hasChanges}`);

      if (hasChanges) {
        console.log(`[icons] Returning transformed code`);
        const result = {
          code: s.toString(),
          map: s.generateMap({ hires: true })
        };
        console.log(`[icons] Transformed code length: ${result.code.length}`);
        return result;
      }

      console.log(`[icons] No changes made, returning null`);
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

      const virtualPath = id.slice(1); // Remove \0
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
        // Re-scan this file and update usage
        const code = ctx.read?.();
        if (!code) return;

        const processCode = async (sourceCode: string) => {
          const parsed = parseSync(fileId, sourceCode);
          if (parsed.errors.length > 0) return;

          const ast: Program = parsed.program;
          const aliasToPack = findPackAliases(ast, importSources, packs);

          // Invalidate virtual modules that are no longer used
          const currentVirtualIds = new Set<string>();
          for (const [alias, pack] of Array.from(aliasToPack)) {
            const packConfig = packs[pack];
            if (!packConfig) continue;

            // We would need to traverse again to find all icons, but for simplicity
            // let's just trigger a full reload for now
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

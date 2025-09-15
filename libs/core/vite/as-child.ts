import type {
  JSXChild,
  JSXElement,
  JSXIdentifier,
  JSXOpeningElement,
  Program
} from "@oxc-project/types";
import MagicString from "magic-string";
import { parseSync } from "oxc-parser";
import { walk } from "oxc-walker";
import type { Plugin as VitePlugin } from "vite";

import {
  extractFromElement,
  getLineNumber,
  isJSXElement,
  isJSXExpressionContainer,
  isJSXText
} from "../utils/jsx";

import { handleExpression } from "../utils/expressions";

export type AsChildTypes = {
  asChild: true;
};

export type AsChildPluginOptions = {
  debug?: boolean;
};

/**
 * Vite plugin that transforms JSX elements with asChild prop by moving child element props to the parent
 * @param options - Plugin configuration options
 * @returns Vite plugin object
 */
export const asChild = (options: AsChildPluginOptions = {}): VitePlugin => {
  const { debug: isDebugMode = false } = options;

  /**
   * Debug logging function that only outputs when debug mode is enabled
   * @param message - Debug message to log
   */
  const debug = (message: string) => {
    if (!isDebugMode) return;
    console.log(message);
  };

  return {
    name: "vite-plugin-as-child",
    enforce: "pre",
    transform(code, id) {
      const isJSXFile = id.endsWith(".tsx") || id.endsWith(".jsx");

      if (!isJSXFile) return null;

      debug(`🔧 asChild plugin processing: ${id}`);

      const parsed = parseSync(id, code);
      if (parsed.errors.length > 0) return null;

      const ast: Program = parsed.program;
      const s = new MagicString(code);

      walk(ast, {
        enter(node) {
          if (isJSXElement(node) && hasAsChild(node.openingElement)) {
            processAsChild(node, s, code);
          }
        }
      });

      if (s.hasChanged()) {
        return {
          code: s.toString(),
          map: s.generateMap({ hires: true })
        };
      }
      return null;
    }
  };

  /**
   * Checks if a JSX opening element has an asChild attribute
   * @param opening - JSX opening element to check
   * @returns True if element has asChild attribute
   */
  function hasAsChild(opening: JSXOpeningElement): boolean {
    const isAsChildProp = opening.attributes.some(
      (attr) =>
        attr.type === "JSXAttribute" && (attr.name as JSXIdentifier).name === "asChild"
    );
    if (isAsChildProp) debug("🔄 Found asChild element!");
    return isAsChildProp;
  }

  /**
   * Processes a JSX element with asChild prop, moving child props to parent
   * @param elem - JSX element with asChild prop
   * @param s - MagicString instance for code transformation
   * @param source - Original source code
   */
  function processAsChild(elem: JSXElement, s: MagicString, source: string) {
    const children = elem.children.filter(
      (child) => !isJSXText(child) || child.value.trim() !== ""
    );

    if (children.length === 0) return;
    if (children.length > 1) {
      throw new Error(`asChild elements must have exactly one child at ${elem.start}`);
    }

    const child = children[0] as JSXChild;

    let jsxType: string;
    let movedProps: string;

    if (isJSXElement(child)) {
      const { type, props } = extractFromElement(child, source);
      jsxType = type;
      movedProps = props;

      const attrs = child.openingElement.attributes;
      if (attrs.length > 0) {
        const nameEnd = child.openingElement.name.end;
        const firstAttrStart = attrs[0].start;
        const lastAttrEnd = attrs[attrs.length - 1].end;

        const startPos = Math.max(nameEnd, firstAttrStart - 10);
        const actualStart =
          source.slice(startPos, firstAttrStart).search(/\s/) + startPos;
        s.remove(
          actualStart === startPos - 1 ? firstAttrStart : actualStart,
          lastAttrEnd
        );
      }

      if (child.children.length > 0) {
        const childrenCode = child.children
          .map((grandchild) => source.slice(grandchild.start, grandchild.end))
          .join("");
        s.overwrite(child.start, child.end, childrenCode);
      } else {
        s.remove(child.start, child.end);
      }
    } else if (isJSXExpressionContainer(child)) {
      const result = handleExpression(child.expression, source);
      if (result) {
        jsxType = result.type;
        movedProps = result.props;
        debug("⚠️ Expression asChild: props not removed from children");
      } else {
        debug(
          `⚠️ Skipping unsupported expression type: ${child.expression.type} at line ${getLineNumber(source, elem.start)}`
        );
        return;
      }
    } else {
      debug(
        `⚠️ Skipping unsupported child type: ${child.type} at line ${getLineNumber(source, elem.start)}`
      );
      return;
    }

    const opening = elem.openingElement;
    const insertPos =
      opening.attributes.length > 0
        ? opening.attributes[opening.attributes.length - 1].end
        : opening.name.end;

    const typeAttr = jsxType.startsWith('"')
      ? ` jsxType=${jsxType}`
      : ` jsxType={${jsxType}}`;
    s.appendLeft(insertPos, typeAttr);

    const propsAttr = ` movedProps={${movedProps}}`;
    s.appendLeft(insertPos, propsAttr);
  }
};

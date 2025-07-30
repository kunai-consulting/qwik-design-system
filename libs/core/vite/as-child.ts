import type {
  ConditionalExpression,
  JSXAttribute,
  JSXAttributeItem,
  JSXChild,
  JSXElement,
  JSXExpressionContainer,
  JSXIdentifier,
  JSXOpeningElement,
  JSXText,
  Node,
  Program
} from "@oxc-project/types";
import MagicString from "magic-string";
import { parseSync } from "oxc-parser";
import type { Plugin } from "vite";

export type AsChildPluginOptions = {
  debug?: boolean;
};

/**
 * Vite plugin that transforms JSX elements with asChild prop by moving child element props to the parent
 * @param options - Plugin configuration options
 * @returns Vite plugin object
 */
export default function asChildPlugin(options: AsChildPluginOptions = {}): Plugin {
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

      /**
       * Recursively traverses AST nodes to find JSX elements with asChild prop
       * @param node - AST node to traverse
       */
      function traverse(node: Node) {
        if (isJSXElement(node) && hasAsChild(node.openingElement)) {
          processAsChild(node, s, code);
        }

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child as Node[]) {
              if (c) traverse(c);
            }
          } else if (child && typeof child === "object") {
            traverse(child as Node);
          }
        }
      }

      traverse(ast);

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
        s.remove(attrs[0].start - 1, attrs[attrs.length - 1].end);
      }

      if (child.children.length > 0) {
        const childrenCode = child.children
          .map((grandchild) => source.slice(grandchild.start, grandchild.end))
          .join("");
        s.overwrite(child.start, child.end, childrenCode);
      } else {
        s.remove(child.start, child.end);
      }
    } else if (
      isJSXExpressionContainer(child) &&
      isConditionalExpression(child.expression)
    ) {
      const condExpr = child.expression as ConditionalExpression;
      const testCode = source.slice(condExpr.test.start, condExpr.test.end);
      const cons = extractFromNode(condExpr.consequent, source);
      const alt = extractFromNode(condExpr.alternate, source);
      jsxType = `${testCode} ? ${cons.type} : ${alt.type}`;
      movedProps = `${testCode} ? ${cons.props} : ${alt.props}`;
      debug("⚠️ Conditional asChild: props not removed from children");
    } else {
      throw new Error(`Unsupported child type for asChild at ${elem.start}`);
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
}

/**
 * Type guard to check if a node is a JSX element
 * @param node - AST node to check
 * @returns True if node is a JSX element
 */
function isJSXElement(node: Node): node is JSXElement {
  return node.type === "JSXElement";
}

/**
 * Type guard to check if a node is a JSX expression container
 * @param node - AST node to check
 * @returns True if node is a JSX expression container
 */
function isJSXExpressionContainer(node: Node): node is JSXExpressionContainer {
  return node.type === "JSXExpressionContainer";
}

/**
 * Type guard to check if a node is a conditional expression
 * @param node - AST node to check
 * @returns True if node is a conditional expression
 */
function isConditionalExpression(node: Node): node is ConditionalExpression {
  return node.type === "ConditionalExpression";
}

/**
 * Type guard to check if a node is JSX text
 * @param node - AST node to check
 * @returns True if node is JSX text
 */
function isJSXText(node: Node): node is JSXText {
  return node.type === "JSXText";
}

interface Extracted {
  type: string;
  props: string;
}

/**
 * Extracts type and props from various node types in conditional expressions
 * @param node - AST node to extract from
 * @param source - Original source code
 * @returns Object containing extracted type and props
 */
function extractFromNode(node: Node, source: string): Extracted {
  if (isJSXElement(node)) {
    return extractFromElement(node, source);
  }
  if (node.type === "ParenthesizedExpression") {
    return extractFromNode((node as { expression: Node }).expression, source);
  }
  if (node.type === "ConditionalExpression") {
    const conditionalExpression = node as ConditionalExpression;
    const { start, end, consequent, alternate } = conditionalExpression;

    const testCode = source.slice(start, end);
    const isTrue = extractFromNode(consequent, source);
    const isFalse = extractFromNode(alternate, source);
    return {
      type: `${testCode} ? ${isTrue.type} : ${isFalse.type}`,
      props: `${testCode} ? ${isTrue.props} : ${isFalse.props}`
    };
  }
  if (node.type === "Identifier") {
    return {
      type: source.slice(node.start, node.end),
      props: "{}"
    };
  }
  throw new Error(`Unsupported node in conditional: ${node.type} at ${node.start}`);
}

/**
 * Extracts type and props from a JSX element
 * @param elem - JSX element to extract from
 * @param source - Original source code
 * @returns Object containing extracted type and props
 */
function extractFromElement(elem: JSXElement, source: string): Extracted {
  const nameNode = elem.openingElement.name;
  if (nameNode.type !== "JSXIdentifier") {
    throw new Error("Complex names not supported");
  }
  const name = nameNode.name;
  const isIntrinsic = name[0] === name[0].toLowerCase();
  const type = isIntrinsic ? `"${name}"` : name;

  const propsObj = extractProps(elem.openingElement.attributes, source);

  return { type, props: propsObj };
}

/**
 * Extracts props from JSX attributes into object literal string
 * @param attributes - Array of JSX attributes
 * @param source - Original source code
 * @returns Object literal string representation of props
 */
function extractProps(attributes: JSXAttributeItem[], source: string): string {
  const props: string[] = [];

  for (const attr of attributes) {
    if (attr.type !== "JSXAttribute") continue;

    const a = attr as JSXAttribute;
    if (a.name.type !== "JSXIdentifier") continue;

    const key = a.name.name;
    const value = getAttributeValue(a, source);
    props.push(`"${key}": ${value}`);
  }

  return `{ ${props.join(", ")} }`;
}

/**
 * Extracts the value from a JSX attribute
 * @param attr - JSX attribute to extract value from
 * @param source - Original source code
 * @returns String representation of the attribute value
 */
function getAttributeValue(attr: JSXAttribute, source: string): string {
  if (!attr.value) return "true";
  if (attr.value.type === "Literal")
    return source.slice(attr.value.start, attr.value.end);
  if (isJSXExpressionContainer(attr.value)) {
    return source.slice(attr.value.expression.start, attr.value.expression.end);
  }
  return "true";
}

import type {
  ConditionalExpression,
  JSXAttribute,
  JSXAttributeItem,
  JSXChild,
  JSXElement,
  JSXExpressionContainer,
  JSXIdentifier,
  JSXMemberExpression,
  JSXOpeningElement,
  JSXText,
  LogicalExpression,
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
       * @param visited - Set of visited nodes for cycle detection
       */
      function traverse(node: Node, visited = new Set<Node>()) {
        if (visited.has(node)) return;
        visited.add(node);

        if (isJSXElement(node) && hasAsChild(node.openingElement)) {
          processAsChild(node, s, code);
        }

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child as Node[]) {
              if (c && typeof c === "object" && c.type) traverse(c, visited);
            }
          } else if (child && typeof child === "object" && (child as Node).type) {
            traverse(child as Node, visited);
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

  /**
   * Handles various expression types in asChild elements
   * @param expression - The expression to handle
   * @param source - Original source code
   * @returns Extracted type and props, or null if unsupported
   */
  function handleExpression(expression: Node, source: string): Extracted | null {
    switch (expression.type) {
      case "ConditionalExpression":
        return handleConditionalExpression(expression as ConditionalExpression, source);
      case "LogicalExpression":
        return handleLogicalExpression(expression, source);
      case "Identifier":
        return handleIdentifierExpression(expression, source);
      case "CallExpression":
        return handleCallExpression(expression, source);
      default:
        return null;
    }
  }

  /**
   * Handles conditional expressions (ternary operator)
   * @param expr - Conditional expression
   * @param source - Original source code
   * @returns Extracted type and props
   */
  function handleConditionalExpression(
    expr: ConditionalExpression,
    source: string
  ): Extracted {
    const testCode = source.slice(expr.test.start, expr.test.end);
    const isTrue = extractFromNode(expr.consequent, source);
    const isFalse = extractFromNode(expr.alternate, source);
    return {
      type: `${testCode} ? ${isTrue.type} : ${isFalse.type}`,
      props: `${testCode} ? ${isTrue.props} : ${isFalse.props}`
    };
  }

  /**
   * Handles logical expressions (&&, ||)
   * @param expr - Logical expression
   * @param source - Original source code
   * @returns Extracted type and props, or null if unsupported
   */
  function handleLogicalExpression(expr: Node, source: string): Extracted | null {
    const logicalExpr = expr as LogicalExpression;
    if (logicalExpr.operator === "&&") {
      const testCode = source.slice(logicalExpr.left.start, logicalExpr.left.end);
      const rightSide = extractFromNode(logicalExpr.right, source);
      return {
        type: `${testCode} && ${rightSide.type}`,
        props: `${testCode} ? ${rightSide.props} : {}`
      };
    }
    return null;
  }

  /**
   * Handles identifier expressions (variables)
   * @param expr - Identifier expression
   * @param source - Original source code
   * @returns Extracted type and props
   */
  function handleIdentifierExpression(expr: Node, source: string): Extracted {
    const name = source.slice(expr.start, expr.end);
    return {
      type: name,
      props: "{}"
    };
  }

  /**
   * Handles call expressions (function calls)
   * @param expr - Call expression
   * @param source - Original source code
   * @returns Extracted type and props
   */
  function handleCallExpression(expr: Node, source: string): Extracted {
    const callCode = source.slice(expr.start, expr.end);
    return {
      type: callCode,
      props: "{}"
    };
  }

  /**
   * Gets line number from source position for better error messages
   * @param source - Original source code
   * @param position - Character position in source
   * @returns Line number (1-based)
   */
  function getLineNumber(source: string, position: number): number {
    return source.slice(0, position).split("\n").length;
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
  let type: string;

  if (nameNode.type === "JSXIdentifier") {
    const name = nameNode.name;
    const isIntrinsic = name[0] === name[0].toLowerCase();
    type = isIntrinsic ? `"${name}"` : name;
  } else if (nameNode.type === "JSXMemberExpression") {
    type = extractJSXMemberExpressionName(nameNode, source);
  } else {
    throw new Error(`Unsupported JSX name type: ${nameNode.type}`);
  }

  const propsObj = extractProps(elem.openingElement.attributes, source);

  return { type, props: propsObj };
}

/**
 * Extracts the full name from a JSX member expression (e.g., Menu.Item)
 * @param memberExpr - JSX member expression node
 * @param source - Original source code
 * @returns The full member expression as a string
 */
function extractJSXMemberExpressionName(
  memberExpr: JSXMemberExpression,
  source: string
): string {
  return source.slice(memberExpr.start, memberExpr.end);
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

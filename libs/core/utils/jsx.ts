import type {
  ConditionalExpression,
  JSXAttribute,
  JSXAttributeItem,
  JSXElement,
  JSXExpressionContainer,
  JSXMemberExpression,
  JSXText,
  Node
} from "@oxc-project/types";

export interface Extracted {
  type: string;
  props: string;
}

/**
 * Generic AST traversal utility with cycle detection and customizable callback
 * @param node - Root AST node to start traversal
 * @param callback - Function called for each node, can return a value to control traversal
 * @param visited - Set of visited nodes for cycle detection (optional, auto-created)
 * @returns Array of results from callback invocations
 */
export function traverseAST<T = void>(
  node: Node,
  callback: (node: Node, visited: Set<Node>) => T | undefined,
  visited: Set<Node> = new Set<Node>()
): T[] {
  if (visited.has(node)) return [];
  visited.add(node);

  const results: T[] = [];

  const result = callback(node, visited);
  if (result !== undefined) {
    results.push(result);
  }

  for (const key in node) {
    const child = (node)[key];
    if (Array.isArray(child)) {
      for (const c of child) {
        if (c && typeof c === "object" && c.type) {
          results.push(...traverseAST(c, callback, visited));
        }
      }
    } else if (child && typeof child === "object" && (child).type) {
      results.push(...traverseAST(child, callback, visited));
    }
  }

  return results;
}

/**
 * Type guard to check if a node is a JSX element
 * @param node - AST node to check
 * @returns True if node is a JSX element
 */
export function isJSXElement(node: Node): node is JSXElement {
  return node.type === "JSXElement";
}

/**
 * Type guard to check if a node is a JSX expression container
 * @param node - AST node to check
 * @returns True if node is a JSX expression container
 */
export function isJSXExpressionContainer(node: Node): node is JSXExpressionContainer {
  return node.type === "JSXExpressionContainer";
}

/**
 * Type guard to check if a node is JSX text
 * @param node - AST node to check
 * @returns True if node is JSX text
 */
export function isJSXText(node: Node): node is JSXText {
  return node.type === "JSXText";
}

/**
 * Extracts type and props from various node types in conditional expressions
 * @param node - AST node to extract from
 * @param source - Original source code
 * @returns Object containing extracted type and props
 */
export function extractFromNode(node: Node, source: string): Extracted {
  if (isJSXElement(node)) {
    return extractFromElement(node, source);
  }
  if (node.type === "ParenthesizedExpression") {
    return extractFromNode((node as { expression: Node }).expression, source);
  }
  if (node.type === "ConditionalExpression") {
    const conditionalExpression = node as ConditionalExpression;
    const { test, consequent, alternate } = conditionalExpression;

    const testCode = source.slice(test.start, test.end);
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
export function extractFromElement(elem: JSXElement, source: string): Extracted {
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
export function extractJSXMemberExpressionName(
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
export function extractProps(attributes: JSXAttributeItem[], source: string): string {
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
export function getAttributeValue(attr: JSXAttribute, source: string): string {
  if (!attr.value) return "true";
  if (attr.value.type === "Literal")
    return source.slice(attr.value.start, attr.value.end);
  if (isJSXExpressionContainer(attr.value)) {
    return source.slice(attr.value.expression.start, attr.value.expression.end);
  }
  return "true";
}

/**
 * Gets line number from source position for better error messages
 * @param source - Original source code
 * @param position - Character position in source
 * @returns Line number (1-based)
 */
export function getLineNumber(source: string, position: number): number {
  return source.slice(0, position).split("\n").length;
}

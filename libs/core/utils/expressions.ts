import type { ConditionalExpression, LogicalExpression, Node } from "@oxc-project/types";

import { type Extracted, extractFromNode } from "./jsx";

/**
 * Handles various expression types in asChild elements
 * @param expression - The expression to handle
 * @param source - Original source code
 * @returns Extracted type and props, or null if unsupported
 */
export function handleExpression(expression: Node, source: string): Extracted | null {
  switch (expression.type) {
    case "ConditionalExpression":
      return handleConditionalExpression(expression as ConditionalExpression, source);
    case "LogicalExpression":
      return handleLogicalExpression(expression, source);
    case "Identifier":
      return handleIdentifierExpression(expression, source);
    case "CallExpression":
      return handleCallExpression(expression, source);
    case "MemberExpression":
      return handleMemberExpression(expression, source);
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
export function handleConditionalExpression(
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
export function handleLogicalExpression(expr: Node, source: string): Extracted | null {
  const logicalExpr = expr as LogicalExpression;
  if (logicalExpr.operator === "&&") {
    const testCode = source.slice(logicalExpr.left.start, logicalExpr.left.end);
    const rightSide = extractFromNode(logicalExpr.right, source);
    return {
      type: `${testCode} && ${rightSide.type}`,
      props: `${testCode} ? ${rightSide.props} : {}`
    };
  }
  if (logicalExpr.operator === "||") {
    const leftCode = source.slice(logicalExpr.left.start, logicalExpr.left.end);
    const rightSide = extractFromNode(logicalExpr.right, source);
    return {
      type: `${leftCode} || ${rightSide.type}`,
      props: `${leftCode} ? ${leftCode} : ${rightSide.props}`
    };
  }
  return null; // Only support && and || for now
}

/**
 * Handles identifier expressions (variables)
 * @param expr - Identifier expression
 * @param source - Original source code
 * @returns Extracted type and props
 */
export function handleIdentifierExpression(expr: Node, source: string): Extracted {
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
export function handleCallExpression(expr: Node, source: string): Extracted {
  const callCode = source.slice(expr.start, expr.end);
  return {
    type: callCode,
    props: "{}"
  };
}

/**
 * Handles member expressions (object.property, object.method())
 * @param expr - Member expression
 * @param source - Original source code
 * @returns Extracted type and props
 */
export function handleMemberExpression(expr: Node, source: string): Extracted {
  const memberCode = source.slice(expr.start, expr.end);
  return {
    type: memberCode,
    props: "{}"
  };
}

/**
 * Checks if an expression type is supported
 * @param expressionType - The expression type to check
 * @returns True if the expression type is supported
 */
export function isSupportedExpressionType(expressionType: string): boolean {
  return [
    "ConditionalExpression",
    "LogicalExpression",
    "Identifier",
    "CallExpression",
    "MemberExpression"
  ].includes(expressionType);
}

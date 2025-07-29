// Implementing asChild Vite plugin for Qwik Design System

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
} from "@oxc-project/types"; // Assuming types from oxc
import MagicString from "magic-string";
import { parseSync } from "oxc-parser";
import type { Plugin } from "vite";

export default function asChildPlugin(): Plugin {
  return {
    name: "vite-plugin-as-child",
    enforce: "pre",
    transform(code, id) {
      if (!id.endsWith(".tsx") && !id.endsWith(".jsx")) return null;

      const parsed = parseSync(id, code);
      if (parsed.errors.length > 0) return null; // Handle errors if needed

      const ast: Program = parsed.program;
      const s = new MagicString(code);

      function traverse(node: Node) {
        if (isJSXElement(node)) {
          const jsxElem = node as JSXElement;
          if (hasAsChild(jsxElem.openingElement)) {
            processAsChild(jsxElem, s, code);
          }
        }
        // Traverse children
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
}

function isJSXElement(node: Node): node is JSXElement {
  return node.type === "JSXElement";
}

function isJSXExpressionContainer(node: Node): node is JSXExpressionContainer {
  return node.type === "JSXExpressionContainer";
}

function isConditionalExpression(node: Node): node is ConditionalExpression {
  return node.type === "ConditionalExpression";
}

function isJSXText(node: Node): node is JSXText {
  return node.type === "JSXText";
}

function hasAsChild(opening: JSXOpeningElement): boolean {
  return opening.attributes.some(
    (attr) =>
      attr.type === "JSXAttribute" && (attr.name as JSXIdentifier).name === "asChild"
  );
}

interface Extracted {
  type: string;
  props: string;
}

function processAsChild(elem: JSXElement, s: MagicString, source: string) {
  // Get non-text children
  const children = elem.children.filter(
    (child) => !isJSXText(child) || child.value.trim() !== ""
  );
  if (children.length > 1) {
    throw new Error(`asChild elements must have exactly one child at ${elem.start}`);
  }
  if (children.length === 0) return; // No child, skip

  const child = children[0] as JSXChild;

  let jsxType: string;
  let movedProps: string;

  if (isJSXElement(child)) {
    const extracted = extractFromElement(child, source);
    jsxType = extracted.type;
    movedProps = extracted.props;
    // Remove props from child
    const attrs = child.openingElement.attributes;
    if (attrs.length > 0) {
      const start = attrs[0].start;
      const end = attrs[attrs.length - 1].end;
      s.remove(start - 1, end); // -1 to remove space before first attr
    }
  } else if (
    isJSXExpressionContainer(child) &&
    isConditionalExpression(child.expression)
  ) {
    const cond = child.expression as ConditionalExpression;
    const testCode = source.slice(cond.test.start, cond.test.end);
    const cons = extractFromNode(cond.consequent, source);
    const alt = extractFromNode(cond.alternate, source);
    jsxType = `${testCode} ? ${cons.type} : ${alt.type}`;
    movedProps = `${testCode} ? ${cons.props} : ${alt.props}`;
    // Replace the entire expression with something? But since we're moving, perhaps remove props from the expressions, but that's complex.
    // For simplicity, we'll assume the transformation is to add the props without removing, or handle manually.
    // To remove, we'd need to transform the consequent and alternate AST, but since we're using MagicString, it's tricky.
    // For now, let's just add without removing for conditionals.
    console.warn("Conditional asChild: props not removed from children");
  } else {
    // Other cases, perhaps throw or skip
    throw new Error(`Unsupported child type for asChild at ${elem.start}`);
  }

  // Find position to insert new attributes
  const opening = elem.openingElement;
  const insertPos = opening.name.end; // After name

  // Insert jsxType - use quotes for strings, braces for everything else
  const typeAttr = jsxType.startsWith('"')
    ? ` jsxType=${jsxType}`
    : ` jsxType={${jsxType}}`;
  s.appendLeft(insertPos, typeAttr);

  // Insert movedProps - always wrap in braces for JSX expression
  const propsAttr = ` movedProps={${movedProps}}`;
  s.appendLeft(insertPos, propsAttr);

  // If self-closing, but has child, might need to adjust, but since child is kept, ensure not self-closing.
  // Actually, keep the child but props removed for simple case.
}

function extractFromNode(node: Node, source: string): Extracted {
  if (isJSXElement(node)) {
    return extractFromElement(node, source);
  }
  // Handle ParenthesizedExpression
  if (node.type === "ParenthesizedExpression") {
    return extractFromNode((node as { expression: Node }).expression, source);
  }
  // Handle ConditionalExpression
  if (node.type === "ConditionalExpression") {
    const cond = node as ConditionalExpression;
    const testCode = source.slice(cond.test.start, cond.test.end);
    const cons = extractFromNode(cond.consequent, source);
    const alt = extractFromNode(cond.alternate, source);
    return {
      type: `${testCode} ? ${cons.type} : ${alt.type}`,
      props: `${testCode} ? ${cons.props} : ${alt.props}`
    };
  }
  // Assume it's Identifier for component
  if (node.type === "Identifier") {
    return {
      type: source.slice(node.start, node.end),
      props: "{}"
    };
  }
  throw new Error(`Unsupported node in conditional: ${node.type} at ${node.start}`);
}

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

function extractProps(attributes: JSXAttributeItem[], source: string): string {
  const props: string[] = [];
  for (const attr of attributes) {
    if (attr.type === "JSXAttribute") {
      const a = attr as JSXAttribute;
      if (a.name.type !== "JSXIdentifier") continue;
      const key = a.name.name;
      let value: string;
      if (!a.value) {
        value = "true";
      } else if (a.value.type === "Literal") {
        value = source.slice(a.value.start, a.value.end);
      } else if (isJSXExpressionContainer(a.value)) {
        value = source.slice(a.value.expression.start, a.value.expression.end);
      } else {
        value = "true"; // Fallback
      }
      props.push(`${key}: ${value}`);
    }
  }
  return `{ ${props.join(", ")} }`;
}

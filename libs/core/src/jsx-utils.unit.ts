import type { JSXElement, Node } from "@oxc-project/types";
import { parseSync } from "oxc-parser";
import { describe, expect, it } from "vitest";

import {
  extractFromElement,
  extractFromNode,
  extractProps,
  getLineNumber,
  isJSXElement,
  isJSXExpressionContainer,
  isJSXText
} from "./jsx-utils.js";

describe("jsx-utils", () => {
  describe("Type guards", () => {
    it("should correctly identify JSX elements", () => {
      const code = "<div>Hello</div>";
      const parsed = parseSync("test.tsx", code);
      const jsxElement = parsed.program.body[0];

      expect(isJSXElement(jsxElement)).toBe(false); // This is an ExpressionStatement
      // The actual JSX element is nested deeper
    });

    it("should correctly identify JSX expression containers", () => {
      const code = "<div>{expression}</div>";
      const parsed = parseSync("test.tsx", code);
      const ast = parsed.program;

      function findJSXExpressionContainer(node: Node): Node | null {
        if (node.type === "JSXExpressionContainer") return node;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findJSXExpressionContainer(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findJSXExpressionContainer(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const expressionContainer = findJSXExpressionContainer(ast);
      expect(expressionContainer).toBeTruthy();
      if (expressionContainer) {
        expect(isJSXExpressionContainer(expressionContainer)).toBe(true);
      }
    });

    it("should correctly identify JSX text", () => {
      const code = "<div>Hello World</div>";
      const parsed = parseSync("test.tsx", code);
      const ast = parsed.program;

      function findJSXText(node: Node): Node | null {
        if (node.type === "JSXText") return node;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findJSXText(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findJSXText(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const textNode = findJSXText(ast);
      expect(textNode).toBeTruthy();
      if (textNode) {
        expect(isJSXText(textNode)).toBe(true);
      }
    });
  });

  describe("extractFromElement", () => {
    it("should extract intrinsic element type", () => {
      const code = '<div className="test" disabled>Content</div>';
      const parsed = parseSync("test.tsx", code);

      function findJSXElement(node: Node): JSXElement | null {
        if (node.type === "JSXElement") return node as JSXElement;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findJSXElement(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findJSXElement(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const jsxElement = findJSXElement(parsed.program);
      expect(jsxElement).toBeTruthy();

      if (jsxElement) {
        const result = extractFromElement(jsxElement, code);
        expect(result.type).toBe('"div"');
        expect(result.props).toContain('"className": "test"');
        expect(result.props).toContain('"disabled": true');
      }
    });

    it("should extract component element type", () => {
      const code = '<MyComponent prop="value">Content</MyComponent>';
      const parsed = parseSync("test.tsx", code);

      function findJSXElement(node: Node): JSXElement | null {
        if (node.type === "JSXElement") return node as JSXElement;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findJSXElement(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findJSXElement(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const jsxElement = findJSXElement(parsed.program);
      expect(jsxElement).toBeTruthy();

      if (jsxElement) {
        const result = extractFromElement(jsxElement, code);
        expect(result.type).toBe("MyComponent");
        expect(result.props).toContain('"prop": "value"');
      }
    });

    it("should extract member expression type", () => {
      const code = '<Menu.Item value="test">Content</Menu.Item>';
      const parsed = parseSync("test.tsx", code);

      function findJSXElement(node: Node): JSXElement | null {
        if (node.type === "JSXElement") return node as JSXElement;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findJSXElement(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findJSXElement(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const jsxElement = findJSXElement(parsed.program);
      expect(jsxElement).toBeTruthy();

      if (jsxElement) {
        const result = extractFromElement(jsxElement, code);
        expect(result.type).toBe("Menu.Item");
        expect(result.props).toContain('"value": "test"');
      }
    });
  });

  describe("extractProps", () => {
    it("should handle boolean attributes", () => {
      const code = "<input disabled required />";
      const parsed = parseSync("test.tsx", code);

      function findJSXElement(node: Node): JSXElement | null {
        if (node.type === "JSXElement") return node as JSXElement;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findJSXElement(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findJSXElement(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const jsxElement = findJSXElement(parsed.program);
      expect(jsxElement).toBeTruthy();

      if (jsxElement) {
        const result = extractProps(jsxElement.openingElement.attributes, code);
        expect(result).toContain('"disabled": true');
        expect(result).toContain('"required": true');
      }
    });

    it("should handle expression attributes", () => {
      const code = "<div onClick={handler} style={{color: 'red'}} />";
      const parsed = parseSync("test.tsx", code);

      function findJSXElement(node: Node): JSXElement | null {
        if (node.type === "JSXElement") return node as JSXElement;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findJSXElement(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findJSXElement(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const jsxElement = findJSXElement(parsed.program);
      expect(jsxElement).toBeTruthy();

      if (jsxElement) {
        const result = extractProps(jsxElement.openingElement.attributes, code);
        expect(result).toContain('"onClick": handler');
        expect(result).toContain("\"style\": {color: 'red'}");
      }
    });
  });

  describe("getLineNumber", () => {
    it("should return correct line number for position", () => {
      const code = `line1
line2
line3
line4`;

      expect(getLineNumber(code, 0)).toBe(1);
      expect(getLineNumber(code, 6)).toBe(2);
      expect(getLineNumber(code, 12)).toBe(3);
      expect(getLineNumber(code, 18)).toBe(4);
    });

    it("should handle single line", () => {
      const code = "single line";
      expect(getLineNumber(code, 0)).toBe(1);
      expect(getLineNumber(code, 5)).toBe(1);
      expect(getLineNumber(code, 10)).toBe(1);
    });
  });

  describe("extractFromNode", () => {
    it("should handle identifier nodes", () => {
      const code = "myVariable";
      const parsed = parseSync("test.tsx", code);

      function findIdentifier(node: Node): Node | null {
        if (node.type === "Identifier") return node;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findIdentifier(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findIdentifier(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const identifier = findIdentifier(parsed.program);
      expect(identifier).toBeTruthy();

      if (identifier) {
        const result = extractFromNode(identifier, code);
        expect(result.type).toBe("myVariable");
        expect(result.props).toBe("{}");
      }
    });

    it("should handle conditional expressions", () => {
      const code = "condition ? <div>true</div> : <span>false</span>";
      const parsed = parseSync("test.tsx", code);

      function findConditional(node: Node): Node | null {
        if (node.type === "ConditionalExpression") return node;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findConditional(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findConditional(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const conditional = findConditional(parsed.program);
      expect(conditional).toBeTruthy();

      if (conditional) {
        const result = extractFromNode(conditional, code);
        expect(result.type).toContain('condition ? "div" : "span"');
      }
    });
  });
});

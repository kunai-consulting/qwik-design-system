import type { ConditionalExpression, LogicalExpression, Node } from "@oxc-project/types";
import { parseSync } from "oxc-parser";
import { describe, expect, it } from "vitest";

import {
  handleCallExpression,
  handleConditionalExpression,
  handleExpression,
  handleIdentifierExpression,
  handleLogicalExpression,
  handleMemberExpression,
  isSupportedExpressionType
} from "./expression-utils.js";

describe("expression-utils", () => {
  describe("handleExpression", () => {
    it("should dispatch to handleConditionalExpression for ternary operators", () => {
      const code = "condition ? <div>A</div> : <span>B</span>";
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
        const result = handleExpression(conditional, code);
        expect(result).toBeTruthy();
        expect(result?.type).toContain('condition ? "div" : "span"');
      }
    });

    it("should dispatch to handleLogicalExpression for && operators", () => {
      const code = "condition && <div>Content</div>";
      const parsed = parseSync("test.tsx", code);

      function findLogical(node: Node): Node | null {
        if (node.type === "LogicalExpression") return node;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findLogical(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findLogical(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const logical = findLogical(parsed.program);
      expect(logical).toBeTruthy();

      if (logical) {
        const result = handleExpression(logical, code);
        expect(result).toBeTruthy();
        expect(result?.type).toContain('condition && "div"');
      }
    });

    it("should dispatch to handleIdentifierExpression for variables", () => {
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
        const result = handleExpression(identifier, code);
        expect(result).toBeTruthy();
        expect(result?.type).toBe("myVariable");
        expect(result?.props).toBe("{}");
      }
    });

    it("should return null for unsupported expression types", () => {
      const code = "a + b";
      const parsed = parseSync("test.tsx", code);

      function findBinary(node: Node): Node | null {
        if (node.type === "BinaryExpression") return node;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findBinary(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findBinary(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const binary = findBinary(parsed.program);
      expect(binary).toBeTruthy();

      if (binary) {
        const result = handleExpression(binary, code);
        expect(result).toBeNull();
      }
    });
  });

  describe("handleConditionalExpression", () => {
    it("should handle simple conditional expressions", () => {
      const code = "isActive ? <Button>Active</Button> : <Button>Inactive</Button>";
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
        const result = handleConditionalExpression(
          conditional as ConditionalExpression,
          code
        );
        expect(result.type).toContain("isActive ? Button : Button");
        expect(result.props).toContain("isActive ? {  } : {  }");
      }
    });

    it("should handle nested conditional expressions", () => {
      const code = "a ? b ? <C /> : <D /> : <E />";
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
        const result = handleConditionalExpression(
          conditional as ConditionalExpression,
          code
        );
        expect(result.type).toContain("a ? ");
        expect(result.type).toContain(" : ");
      }
    });
  });

  describe("handleLogicalExpression", () => {
    it("should handle && logical expressions", () => {
      const code = "showElement && <div>Visible</div>";
      const parsed = parseSync("test.tsx", code);

      function findLogical(node: Node): Node | null {
        if (node.type === "LogicalExpression") return node;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findLogical(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findLogical(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const logical = findLogical(parsed.program);
      expect(logical).toBeTruthy();

      if (logical) {
        const result = handleLogicalExpression(logical, code);
        expect(result).toBeTruthy();
        expect(result?.type).toBe('showElement && "div"');
        expect(result?.props).toBe("showElement ? {  } : {}");
      }
    });

    it("should handle || logical expressions", () => {
      const code = "fallback || <DefaultComponent />";
      const parsed = parseSync("test.tsx", code);

      function findLogical(node: Node): Node | null {
        if (node.type === "LogicalExpression") return node;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findLogical(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findLogical(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const logical = findLogical(parsed.program);
      expect(logical).toBeTruthy();

      if (logical) {
        const result = handleLogicalExpression(logical, code);
        expect(result).toBeTruthy();
        expect(result?.type).toBe("fallback || DefaultComponent");
        expect(result?.props).toBe("fallback ? fallback : {  }");
      }
    });

    it("should return null for unsupported logical operators", () => {
      // Test would need a custom logical expression with unsupported operator
      // For now, test that null handling works
      const mockExpr = {
        type: "LogicalExpression",
        operator: "??", // Nullish coalescing not supported
        left: { start: 0, end: 4 },
        right: { start: 7, end: 11 }
      } as LogicalExpression;

      const result = handleLogicalExpression(mockExpr, "test ?? default");
      expect(result).toBeNull();
    });
  });

  describe("handleIdentifierExpression", () => {
    it("should extract identifier name correctly", () => {
      const code = "componentVariable";
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
        const result = handleIdentifierExpression(identifier, code);
        expect(result.type).toBe("componentVariable");
        expect(result.props).toBe("{}");
      }
    });

    it("should handle single character identifiers", () => {
      const code = "a";
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
        const result = handleIdentifierExpression(identifier, code);
        expect(result.type).toBe("a");
        expect(result.props).toBe("{}");
      }
    });
  });

  describe("handleCallExpression", () => {
    it("should extract function call correctly", () => {
      const code = "renderComponent()";
      const parsed = parseSync("test.tsx", code);

      function findCall(node: Node): Node | null {
        if (node.type === "CallExpression") return node;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findCall(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findCall(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const call = findCall(parsed.program);
      expect(call).toBeTruthy();

      if (call) {
        const result = handleCallExpression(call, code);
        expect(result.type).toBe("renderComponent()");
        expect(result.props).toBe("{}");
      }
    });

    it("should handle function calls with arguments", () => {
      const code = 'createButton("primary", { size: "large" })';
      const parsed = parseSync("test.tsx", code);

      function findCall(node: Node): Node | null {
        if (node.type === "CallExpression") return node;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findCall(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findCall(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const call = findCall(parsed.program);
      expect(call).toBeTruthy();

      if (call) {
        const result = handleCallExpression(call, code);
        expect(result.type).toBe('createButton("primary", { size: "large" })');
        expect(result.props).toBe("{}");
      }
    });
  });

  describe("handleMemberExpression", () => {
    it("should extract member expression correctly", () => {
      const code = "object.property";
      const parsed = parseSync("test.tsx", code);

      function findMember(node: Node): Node | null {
        if (node.type === "MemberExpression") return node;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findMember(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findMember(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const member = findMember(parsed.program);
      expect(member).toBeTruthy();

      if (member) {
        const result = handleMemberExpression(member, code);
        expect(result.type).toBe("object.property");
        expect(result.props).toBe("{}");
      }
    });

    it("should handle nested member expressions", () => {
      const code = "deep.nested.property.chain";
      const parsed = parseSync("test.tsx", code);

      function findMember(node: Node): Node | null {
        if (node.type === "MemberExpression") return node;

        for (const key in node) {
          const child = (node as unknown as Record<string, unknown>)[key];
          if (Array.isArray(child)) {
            for (const c of child) {
              if (c && typeof c === "object") {
                const result = findMember(c as Node);
                if (result) return result;
              }
            }
          } else if (child && typeof child === "object") {
            const result = findMember(child as Node);
            if (result) return result;
          }
        }
        return null;
      }

      const member = findMember(parsed.program);
      expect(member).toBeTruthy();

      if (member) {
        const result = handleMemberExpression(member, code);
        expect(result.type).toBe("deep.nested.property.chain");
        expect(result.props).toBe("{}");
      }
    });
  });

  describe("isSupportedExpressionType", () => {
    it("should return true for supported expression types", () => {
      expect(isSupportedExpressionType("ConditionalExpression")).toBe(true);
      expect(isSupportedExpressionType("LogicalExpression")).toBe(true);
      expect(isSupportedExpressionType("Identifier")).toBe(true);
      expect(isSupportedExpressionType("CallExpression")).toBe(true);
      expect(isSupportedExpressionType("MemberExpression")).toBe(true);
    });

    it("should return false for unsupported expression types", () => {
      expect(isSupportedExpressionType("BinaryExpression")).toBe(false);
      expect(isSupportedExpressionType("UnaryExpression")).toBe(false);
      expect(isSupportedExpressionType("UpdateExpression")).toBe(false);
      expect(isSupportedExpressionType("AssignmentExpression")).toBe(false);
      expect(isSupportedExpressionType("ArrayExpression")).toBe(false);
      expect(isSupportedExpressionType("ObjectExpression")).toBe(false);
    });

    it("should handle empty and invalid strings", () => {
      expect(isSupportedExpressionType("")).toBe(false);
      expect(isSupportedExpressionType("InvalidType")).toBe(false);
      expect(isSupportedExpressionType("randomString")).toBe(false);
    });
  });
});

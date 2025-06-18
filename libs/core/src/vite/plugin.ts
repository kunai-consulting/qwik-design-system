import MagicString from "magic-string";
import { parseSync } from "oxc-parser";
import type { Plugin } from "vite";

interface ASTNode {
  type: string;
  start: number;
  end: number;
  [key: string]: unknown;
}

interface CallExpressionNode extends ASTNode {
  type: "CallExpression";
  callee: MemberExpressionNode;
  arguments: Array<ASTNode>;
}

interface MemberExpressionNode extends ASTNode {
  type: "MemberExpression";
  object: IdentifierNode;
  property: IdentifierNode;
}

interface IdentifierNode extends ASTNode {
  type: "Identifier";
  name: string;
}

export default function qwikAutoPlugin(): Plugin {
  return {
    name: "qwik-auto",
    enforce: "pre",
    transform(code, id) {
      if (!id.endsWith(".auto.ts")) return null;

      try {
        const result = parseSync(id, code);
        if (result.errors.length > 0) {
          console.error("Parser errors:", result.errors);
          return null;
        }

        const s = new MagicString(code);
        let hasChanges = false;

        if (!code.includes('import { $ } from "@builder.io/qwik"')) {
          s.prepend('import { $ } from "@builder.io/qwik";\n');
          hasChanges = true;
        }

        const walk = (node: ASTNode) => {
          if (
            node.type === "CallExpression" &&
            (node as CallExpressionNode).callee.type === "MemberExpression"
          ) {
            const callExpr = node as CallExpressionNode;
            const memberExpr = callExpr.callee;

            if (
              memberExpr.object.type === "Identifier" &&
              (memberExpr.object as IdentifierNode).name === "use" &&
              memberExpr.property.type === "Identifier" &&
              ["task", "computed"].includes((memberExpr.property as IdentifierNode).name)
            ) {
              const callback = callExpr.arguments[0];
              if (callback && callback.type === "ArrowFunctionExpression") {
                const start = callback.start;
                const end = callback.end;

                // Wrap the callback with $()
                s.overwrite(start, end, `$(${code.slice(start, end)})`);
                hasChanges = true;
              }
            }
          }

          for (const key in node) {
            const value = node[key];
            if (value && typeof value === "object") {
              if (Array.isArray(value)) {
                for (const item of value) {
                  if (item && typeof item === "object") {
                    walk(item as ASTNode);
                  }
                }
              } else {
                walk(value as ASTNode);
              }
            }
          }
        };

        walk(result.program as unknown as ASTNode);

        if (hasChanges) {
          return {
            code: s.toString(),
            map: s.generateMap()
          };
        }

        return null;
      } catch (error) {
        console.error("Error processing file:", id, error);
        return null;
      }
    }
  };
}

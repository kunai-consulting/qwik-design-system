import { walk } from "oxc-walker";
import type {
  Node,
  CallExpression,
  IdentifierName,
  ObjectExpression,
  Program
} from "@oxc-project/types";
import {
  findPropertyByName,
  setStaticBooleanProp,
  getStandardElementName
} from "./ast-utils";

import { debug } from "./qwik-analyzer-vite";

/**
 * Processes a _jsxC call for a specific component
 *
 * @param callNode Call expression node
 * @param componentName Target component name to look for
 * @param staticProps Object with static props to set
 * @param filePath File path for debugging
 * @returns Whether the node was modified
 */
export function processJSXTransformCall(
  callNode: CallExpression,
  componentName: string,
  staticProps: { [key: string]: boolean },
  filePath: string
): boolean {
  let modified = false;

  let calleeName: string | null = null;
  if (callNode.callee.type === "Identifier") {
    calleeName = (callNode.callee as IdentifierName).name;
  }

  if (calleeName === "_jsxC" && callNode.arguments && callNode.arguments.length >= 2) {
    const componentArg = callNode.arguments[0];
    const propsArg = callNode.arguments[1];
    const renderedComponentName = getStandardElementName(componentArg as Node);

    if (renderedComponentName === componentName && propsArg.type === "ObjectExpression") {
      debug(`Found _jsxC call for ${componentName} in ${filePath}`);
      const propsObject = propsArg as ObjectExpression;

      for (const [propName, value] of Object.entries(staticProps)) {
        const propModified = setStaticBooleanProp(propsObject, propName, value);
        if (propModified) {
          modified = true;
          const action =
            findPropertyByName(propsObject, propName) !== -1 ? "Updated" : "Added";
          debug(`${action} ${propName} to ${value} in _jsxC props for ${filePath}`);
        }
      }
    }
  }

  return modified;
}

/**
 * Updates static properties in _jsxC calls for components
 *
 * @param ast The AST to transform
 * @param hasDescription Whether the component has description
 * @param filePath File path for debugging
 * @returns Whether the AST was modified
 */
export function updateStaticProps(
  ast: Program,
  hasDescription: boolean,
  filePath: string
): boolean {
  let modified = false;

  debug(`Starting AST walk for ${filePath}`);

  walk(ast, {
    enter: (node: Node) => {
      if (node.type === "CallExpression") {
        const nodeModified = processJSXTransformCall(
          node as CallExpression,
          "Checkbox.Root",
          { _staticHasDescription: hasDescription },
          filePath
        );

        if (nodeModified) {
          modified = true;
        }
      }
    }
  });

  debug(`AST walk finished for ${filePath}. Modified: ${modified}`);

  return modified;
}

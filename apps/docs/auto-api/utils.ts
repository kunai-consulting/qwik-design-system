import ts from "typescript";
import { resolve } from "node:path";
import fs from "node:fs";

import type {
  AnatomyItem,
  SubComponents,
  PublicType,
  SubComponent,
  ComponentEntry
} from "./types";

export function getSourceFile(path: string) {
  return ts.createSourceFile(
    path,
    fs.readFileSync(path, "utf-8"),
    ts.ScriptTarget.Latest,
    true
  );
}

export function getLeadingComment(
  sourceFile: ts.SourceFile,
  node: ts.Node
): string | undefined {
  const comment = ts.getLeadingCommentRanges(sourceFile.text, node.pos)?.[0];
  if (!comment) return undefined;

  return sourceFile.text.slice(comment.pos, comment.end).replace(/[/*]/g, "").trim();
}

export function parseComponentAnatomy(
  indexPath: string,
  componentName: string
): AnatomyItem[] {
  const sourceFile = getSourceFile(indexPath);
  const subComponents: AnatomyItem[] = [];
  const capitalizedComponent =
    componentName.charAt(0).toUpperCase() + componentName.slice(1);
  const parentDir = indexPath.replace(/index\.ts$/, "");

  function getComponentSource(propertyName: string) {
    const kebabName = propertyName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    const componentPath = resolve(parentDir, `${kebabName}.tsx`);
    return fs.existsSync(componentPath) ? getSourceFile(componentPath) : null;
  }

  function findExportedComponentComment(source: ts.SourceFile): string | undefined {
    let description: string | undefined;

    function visit(node: ts.Node) {
      if (description) return; // Stop if we found the comment

      if (
        ts.isVariableStatement(node) &&
        node.modifiers?.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword)
      ) {
        description = getLeadingComment(source, node);
        return;
      }
      ts.forEachChild(node, visit);
    }

    visit(source);
    return description;
  }

  function createAnatomyItem(element: ts.ExportSpecifier): AnatomyItem {
    if (!element.propertyName) return { name: "" }; // Should never happen due to earlier check

    const anatomyItem: AnatomyItem = {
      name: `${capitalizedComponent}.${element.name.text}`
    };

    const componentSource = getComponentSource(element.propertyName.text);
    if (componentSource) {
      const description = findExportedComponentComment(componentSource);
      if (description) {
        anatomyItem.description = description;
      }
    }

    return anatomyItem;
  }

  function visit(node: ts.Node) {
    if (!ts.isExportDeclaration(node)) {
      ts.forEachChild(node, visit);
      return;
    }

    const clause = node.exportClause;
    if (!clause) return;
    if (!ts.isNamedExports(clause)) return;

    for (const element of clause.elements) {
      if (element.propertyName) {
        subComponents.push(createAnatomyItem(element));
      }
    }
  }

  visit(sourceFile);
  return subComponents;
}

export function parseSingleComponentFromDir(
  path: string,
  ref: SubComponents
): SubComponents | undefined {
  const componentNameMatch = /[\\/](\w[\w-]*)\.tsx$/.exec(path);
  if (!componentNameMatch) return;

  if (componentNameMatch[1].toLowerCase().includes("context")) {
    return;
  }

  const componentName = componentNameMatch[1];
  const sourceFile = getSourceFile(path);
  const parsed: PublicType[] = [];
  let currentType: PublicType | undefined;
  let dataAttributes: Array<{ name: string; type: string }> = [];
  let inheritsFrom: string | undefined;

  function findDefaultValueInDestructuring(propName: string): string | undefined {
    let defaultValue: string | undefined;

    function visit(node: ts.Node) {
      if (ts.isObjectBindingPattern(node)) {
        for (const element of node.elements) {
          if (
            ts.isBindingElement(element) &&
            (element.propertyName?.getText() === propName ||
              element.name.getText() === propName) &&
            element.initializer
          ) {
            defaultValue = element.initializer.getText();
          }
        }
      }
      ts.forEachChild(node, visit);
    }

    ts.forEachChild(sourceFile, visit);
    return defaultValue;
  }

  function visit(node: ts.Node) {
    if (ts.isTypeAliasDeclaration(node) && node.name.text.startsWith("Public")) {
      const typeName = node.name.text;
      currentType = { [typeName]: [] };
      parsed.push(currentType);
    }

    if (ts.isPropertySignature(node) && currentType) {
      const typeName = Object.keys(currentType)[0];
      const comment = getLeadingComment(sourceFile, node);
      const propName = node.name.getText();

      const defaultValue = findDefaultValueInDestructuring(propName);

      const prop = {
        comment: comment || "",
        prop: propName,
        type: node.type?.getText() || "",
        ...(defaultValue && { defaultValue })
      };

      currentType[typeName].push(prop);
    }

    // Data attributes collection remains unchanged
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const attributes = ts.isJsxElement(node)
        ? node.openingElement.attributes.properties
        : node.attributes.properties;

      const newDataAttrs = attributes
        .filter(
          (attr) =>
            ts.isJsxAttribute(attr) &&
            ts.isIdentifier(attr.name) &&
            attr.name.text.startsWith("data-") &&
            !attr.name.text.startsWith("data-qds-")
        )
        .map((attr) => {
          const jsxAttr = attr as ts.JsxAttribute;
          const attrName = jsxAttr.name.getText();
          const comment = getLeadingComment(sourceFile, jsxAttr);
          const attrType =
            jsxAttr.initializer &&
            ts.isJsxExpression(jsxAttr.initializer) &&
            jsxAttr.initializer.expression &&
            (ts.isConditionalExpression(jsxAttr.initializer.expression) ||
              jsxAttr.initializer.expression.getText().includes("undefined"))
              ? "string | undefined"
              : "string";

          return {
            name: attrName,
            type: attrType,
            ...(comment && { comment })
          };
        });

      dataAttributes = [...dataAttributes, ...newDataAttrs];
    }

    // Check for PropsOf in a type-safe way
    if (
      ts.isTypeReferenceNode(node) &&
      ts.isIdentifier(node.typeName) &&
      node.typeName.text === "PropsOf" &&
      node.typeArguments?.length === 1
    ) {
      const typeArg = node.typeArguments[0];
      if (ts.isLiteralTypeNode(typeArg) && ts.isStringLiteral(typeArg.literal)) {
        inheritsFrom = typeArg.literal.text;
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  const transformedName = componentName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const completeSubComponent: SubComponent = {
    types: parsed,
    ...(inheritsFrom && { inheritsFrom }),
    ...(dataAttributes.length > 0 && { dataAttributes })
  };

  const componentEntry: ComponentEntry = { [transformedName]: completeSubComponent };
  ref.push(componentEntry);
  return ref;
}

export function transformPublicTypes(
  sourceFile: ts.SourceFile,
  publicTypes: Array<{ targetLine: string }>
) {
  const transformer = (
    context: ts.TransformationContext
  ): ts.Transformer<ts.SourceFile> => {
    return (rootNode: ts.SourceFile) => {
      function visit(node: ts.Node): ts.Node {
        if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
          // Skip if the type already has Public prefix
          if (node.name.text.startsWith("Public")) {
            return node;
          }

          if (publicTypes.some((t) => node.getText().includes(t.targetLine))) {
            const factory = context.factory;
            return ts.isTypeAliasDeclaration(node)
              ? factory.updateTypeAliasDeclaration(
                  node,
                  node.modifiers,
                  factory.createIdentifier(`Public${node.name.text}`),
                  node.typeParameters,
                  node.type
                )
              : factory.updateInterfaceDeclaration(
                  node,
                  node.modifiers,
                  factory.createIdentifier(`Public${node.name.text}`),
                  node.typeParameters,
                  node.heritageClauses ?? [],
                  node.members
                );
          }
        }

        if (ts.isTypeReferenceNode(node)) {
          // Skip if the type reference already has Public prefix
          if (node.typeName.getText().startsWith("Public")) {
            return node;
          }

          const typeName = node.typeName.getText();
          if (publicTypes.some((t) => t.targetLine.includes(typeName))) {
            return context.factory.createTypeReferenceNode(
              `Public${typeName}`,
              node.typeArguments
            );
          }
        }

        return ts.visitEachChild(node, visit, context);
      }

      return ts.visitNode(rootNode, visit) as ts.SourceFile;
    };
  };

  const result = ts.transform(sourceFile, [transformer]);
  const printer = ts.createPrinter();
  return printer.printFile(result.transformed[0] as ts.SourceFile);
}

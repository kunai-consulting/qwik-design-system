import fs from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";

import type {
  AnatomyItem,
  ComponentEntry,
  PublicType,
  SubComponent,
  SubComponents
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
  publicTypes: Array<{ targetLine: string; dependencies?: string[] }>
) {
  const transformer = (
    context: ts.TransformationContext
  ): ts.Transformer<ts.SourceFile> => {
    return (rootNode: ts.SourceFile) => {
      const typesToMakePublic = new Set<string>();
      const typeMapping = new Map<string, string>();
      const internalTypes = new Set<string>();

      function isInternalType(
        node: ts.InterfaceDeclaration | ts.TypeAliasDeclaration
      ): boolean {
        const isContext = node
          .getSourceFile()
          .text.includes(`createContextId<${node.name.getText()}>`);
        if (isContext) {
          return true;
        }

        if (ts.isInterfaceDeclaration(node)) {
          const hasPrivateMembers = node.members.some((member) => {
            if (ts.isPropertySignature(member) || ts.isMethodSignature(member)) {
              const memberName = member.name.getText();
              return memberName.startsWith("_");
            }
            return false;
          });
          if (hasPrivateMembers) {
            return true;
          }
        }

        let isUsedInProps = false;
        let isUsedInternally = false;

        function checkUsage(n: ts.Node) {
          if (ts.isTypeReferenceNode(n)) {
            const typeName = n.typeName.getText();
            if (typeName === node.name.getText()) {
              let current: ts.Node | undefined = n.parent;
              while (current) {
                if (
                  ts.isParameter(current) &&
                  current.parent &&
                  ts.isFunctionDeclaration(current.parent)
                ) {
                  isUsedInternally = true;
                  break;
                }
                if (
                  ts.isPropertySignature(current) &&
                  current.parent &&
                  current.parent.parent &&
                  ts.isInterfaceDeclaration(current.parent.parent) &&
                  current.parent.parent.name.getText().includes("Props")
                ) {
                  isUsedInProps = true;
                  break;
                }
                current = current.parent;
              }
            }
          }
          ts.forEachChild(n, checkUsage);
        }

        ts.forEachChild(sourceFile, checkUsage);
        return !isUsedInProps && isUsedInternally;
      }

      function collectTypes(node: ts.Node) {
        if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
          const typeName = node.name.getText();
          if (!typeName.startsWith("Public")) {
            if (isInternalType(node)) {
              internalTypes.add(typeName);
            } else if (publicTypes.some((t) => t.targetLine.includes(typeName))) {
              typesToMakePublic.add(typeName);
              typeMapping.set(typeName, `Public${typeName}`);
            }
          }
        }
        ts.forEachChild(node, collectTypes);
      }

      collectTypes(rootNode);

      function visit(node: ts.Node): ts.Node {
        if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
          const typeName = node.name.getText();
          if (typeName.startsWith("Public") || internalTypes.has(typeName)) {
            return node;
          }

          if (typesToMakePublic.has(typeName)) {
            const factory = context.factory;
            if (ts.isTypeAliasDeclaration(node)) {
              let newType = node.type;
              if (ts.isIntersectionTypeNode(node.type)) {
                newType = factory.createIntersectionTypeNode(
                  node.type.types.map((t) => {
                    if (ts.isTypeReferenceNode(t)) {
                      const refName = t.typeName.getText();
                      return factory.createTypeReferenceNode(
                        typeMapping.get(refName) || refName,
                        t.typeArguments
                      );
                    }
                    return t;
                  })
                );
              }

              return factory.updateTypeAliasDeclaration(
                node,
                node.modifiers,
                factory.createIdentifier(`Public${typeName}`),
                node.typeParameters,
                newType
              );
            } else {
              return factory.updateInterfaceDeclaration(
                node,
                node.modifiers,
                factory.createIdentifier(`Public${typeName}`),
                node.typeParameters,
                node.heritageClauses ?? [],
                node.members
              );
            }
          }
        }

        if (ts.isTypeReferenceNode(node)) {
          const typeName = node.typeName.getText();
          if (typeName.startsWith("Public") || internalTypes.has(typeName)) {
            return node;
          }

          if (typeMapping.has(typeName)) {
            return context.factory.createTypeReferenceNode(
              typeMapping.get(typeName)!,
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

import type {
  Node,
  ObjectExpression,
  ObjectProperty,
  BooleanLiteral,
  IdentifierName,
  JSXIdentifier,
  JSXMemberExpression,
  MemberExpression
} from "@oxc-project/types";

/**
 * Extracts component/element name from JSX AST nodes.
 * Handles standard elements (<div />), components (<Button />),
 * and namespaced components (<Checkbox.Description />).
 */
export function getJsxElementName(
  nameNode: JSXIdentifier | JSXMemberExpression | Node | null | undefined
): string | null {
  if (!nameNode) {
    return null;
  }
  if (nameNode.type === "JSXIdentifier") {
    return nameNode.name;
  }
  if (nameNode.type === "JSXMemberExpression") {
    const jsxMemberNode = nameNode;
    const objectName = getJsxElementName(jsxMemberNode.object);
    const propertyName = jsxMemberNode.property.name;
    return objectName && propertyName ? `${objectName}.${propertyName}` : null;
  }
  return null;
}

/**
 * Extracts component name from standard JS AST nodes (non-JSX).
 * Handles identifiers and member expressions in compiled code.
 */
export function getStandardElementName(node: Node | null | undefined): string | null {
  if (!node) {
    return null;
  }
  if (node.type === "Identifier") {
    return node.name;
  }
  if (node.type === "MemberExpression") {
    const memberNode = node as MemberExpression;
    const objectName = getStandardElementName(memberNode.object);
    let propertyName: string | undefined;
    if (memberNode.property.type === "Identifier") {
      propertyName = (memberNode.property as IdentifierName).name;
    } else if (memberNode.property.type === "PrivateIdentifier") {
      propertyName = memberNode.property.name;
    }

    if (objectName && propertyName) {
      return `${objectName}.${propertyName}`;
    }
    return null;
  }
  return null;
}

/**
 * Finds a property in an object expression by name
 *
 * @param propsObject Object expression to search
 * @param propName Name of the property to find
 * @returns Index of the property or -1 if not found
 */
export function findPropertyByName(
  propsObject: ObjectExpression,
  propName: string
): number {
  if (!propsObject.properties) {
    return -1;
  }

  for (let i = 0; i < propsObject.properties.length; i++) {
    const prop = propsObject.properties[i];
    if (prop.type === "Property") {
      const objectProp = prop as ObjectProperty;
      const key = objectProp.key;
      if (key.type === "Identifier" && (key as IdentifierName).name === propName) {
        return i;
      }
    }
  }

  return -1;
}

/**
 * Creates or updates a static boolean property in an object expression
 *
 * @param propsObject Object expression to modify
 * @param propName Name of the property to set
 * @param value Boolean value to set
 * @returns Whether the object was modified
 */
export function setStaticBooleanProp(
  propsObject: ObjectExpression,
  propName: string,
  value: boolean
): boolean {
  if (!propsObject.properties) {
    propsObject.properties = [];
  }

  const existingPropIndex = findPropertyByName(propsObject, propName);

  const newPropValueLiteral: BooleanLiteral = {
    type: "Literal",
    value: value,
    raw: value ? "true" : "false",
    start: 0,
    end: 0
  };

  if (existingPropIndex !== -1) {
    const existingProperty = propsObject.properties[existingPropIndex];
    if (existingProperty.type === "Property") {
      existingProperty.value = newPropValueLiteral;
      return true;
    }
    return false;
  }

  const identifierKey: IdentifierName = {
    type: "Identifier",
    name: propName,
    start: 0,
    end: 0
  };

  const newProperty: ObjectProperty = {
    type: "Property",
    method: false,
    shorthand: false,
    computed: false,
    key: identifierKey,
    value: newPropValueLiteral,
    kind: "init",
    start: 0,
    end: 0
  };

  propsObject.properties.push(newProperty);
  return true;
}

import type {
  ObjectExpression,
  ObjectProperty,
  BooleanLiteral,
  IdentifierName,
  Expression
} from "@oxc-project/types";

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
      (existingProperty as ObjectProperty).value =
        newPropValueLiteral as unknown as Expression;
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
    value: newPropValueLiteral as unknown as Expression,
    kind: "init",
    start: 0,
    end: 0
  };

  propsObject.properties.push(newProperty);
  return true;
}

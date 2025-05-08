import type { FunctionComponent, JSXChildren, JSXNode } from "@builder.io/qwik";

/**
 * Checks if specific components exist within a component's visible tree.
 *
 * This utility helps component roots detect if required child components are present.
 * If a component isn't found in the visible tree, you should
 * throw an error in the specific component (e.g. CheckboxDescription) instructing users to pass a prop to the root component to handle
 * the missing component case.
 *
 * This is useful for conditional logic based on whether a component is present or not from the user.
 *
 * @param children The JSX children to search within
 * @param targets Map of component flags to component references to check for
 * @param config Optional configuration options
 * @returns Object with boolean flags indicating if each component was found
 */
export function getComponentFlags<T extends Record<string, FunctionComponent>>(
  children: JSXChildren,
  targets: T,
  config?: { debug?: boolean }
): { [K in keyof T]: boolean } {
  const targetKeys = Object.keys(targets) as Array<keyof T>;
  const targetReferences = Object.values(targets);

  const results = {} as { [K in keyof T]: boolean };
  for (const key of targetKeys) {
    results[key] = false;
  }

  let numTargetsSuccessfullyFound = 0;
  let startTime = 0;

  if (config?.debug) {
    startTime = performance.now();
  }

  // Handle the case of empty targets object immediately
  if (targetKeys.length === 0) {
    if (config?.debug) {
      const endTime = performance.now();
      console.log(
        `findSpecificComponents: Debug: Traversal took ${(endTime - startTime).toFixed(2)}ms for 0 iterations. Targets (0): [none]. Result: {}.`
      );
    }
    return {} as { [K in keyof T]: boolean };
  }

  const toProcess: JSXChildren[] = [children];
  let iterations = 0;
  const MAX_ITERATIONS = 50000;

  while (toProcess.length > 0 && iterations < MAX_ITERATIONS) {
    iterations++;
    // Optimization: if all target flags are true, stop.
    if (numTargetsSuccessfullyFound === targetKeys.length) {
      break;
    }

    const currentChild = toProcess.pop();

    if (
      !currentChild ||
      typeof currentChild === "boolean" ||
      typeof currentChild === "number" ||
      typeof currentChild === "string"
    ) {
      continue;
    }

    if (Array.isArray(currentChild)) {
      for (let i = currentChild.length - 1; i >= 0; i--) {
        toProcess.push(currentChild[i]);
      }
      continue;
    }

    const node = currentChild as JSXNode;

    if (node.type && typeof node.type !== "string") {
      // Check if this node.type matches any of our target references
      for (let i = 0; i < targetReferences.length; i++) {
        if (targetReferences[i] === node.type) {
          const key = targetKeys[i]; // Get the corresponding key for this reference
          if (!results[key]) {
            // Only mark and count if not already found for this key
            results[key] = true;
            numTargetsSuccessfullyFound++;
          }
          // A single node.type could still match multiple *target references* if the user
          // passed the same component reference multiple times with different keys.
          // e.g., targets = { MyDesc1: DescCmp, MyDesc2: DescCmp }
          // The outer loop (targetReferences.length) handles this correctly.
        }
      }
    }

    // Continue processing children if not all distinct targets are found yet
    if (node.children && numTargetsSuccessfullyFound < targetKeys.length) {
      toProcess.push(node.children);
    }
  }

  if (config?.debug) {
    const endTime = performance.now();
    const targetNamesForLog = targetKeys.join(", ") || "none";
    const resultLog = JSON.stringify(results); // Show the results object
    console.log(
      `findSpecificComponents: Debug: Traversal took ${(endTime - startTime).toFixed(2)}ms for ${iterations} iterations. Targets (${targetKeys.length}): [${targetNamesForLog}]. Result: ${resultLog}.`
    );
  }

  if (iterations >= MAX_ITERATIONS) {
    const targetNamesForLog = targetKeys.join(", ") || "none";
    const resultLog = JSON.stringify(results);
    console.warn(
      `findSpecificComponents: Traversal halted after ${MAX_ITERATIONS} iterations. Targets (${targetKeys.length}): [${targetNamesForLog}]. Partial Result: ${resultLog}. This might indicate an excessively deep, complex, or cyclical JSX structure.`
    );
  }

  return results;
}

// ... (rest of the file: processChildren, componentRegistry, findComponent, ComponentProcessor)
/**
 *
 * This function allows us to process the children of an inline component. We can look into the children and get the proper index, pass data, or make certain API decisions.
 *
 * See accordion-inline.tsx for a usage example.
 *
 * @param children
 *
 */
export function processChildren(children: JSXChildren) {
  const childrenToProcess = (
    Array.isArray(children) ? [...children] : children ? [children] : []
  ) as JSXNode[];

  while (childrenToProcess.length) {
    const child = childrenToProcess.shift();

    if (!child) {
      continue;
    }

    if (Array.isArray(child)) {
      childrenToProcess.unshift(...child);
      continue;
    }

    const processor = componentRegistry.get(child.type);

    if (processor) {
      processor(child.props);
    } else {
      const anyChildren = Array.isArray(child.children)
        ? [...child.children]
        : child.children
          ? [child.children]
          : []; // Ensure anyChildren is always an array
      // Filter out non-object/non-array children before unshifting to avoid processing primitives directly
      const validChildrenToUnshift = anyChildren.filter(
        (c) => c && (typeof c === "object" || Array.isArray(c))
      );
      if (validChildrenToUnshift.length > 0) {
        childrenToProcess.unshift(...(validChildrenToUnshift as JSXNode[]));
      }
    }
  }
}

// biome-ignore lint/suspicious/noExplicitAny: required for dynamic component registration
const componentRegistry = new Map<any, ComponentProcessor>();

// biome-ignore lint/suspicious/noExplicitAny: required for dynamic component registration
export function findComponent(component: any, processor: ComponentProcessor) {
  componentRegistry.set(component, processor);
}

type ComponentProcessor = (props: Record<string, unknown>) => void;

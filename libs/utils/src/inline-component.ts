import type { JSXChildren, JSXNode } from "@builder.io/qwik";

/**
 * Optimized function to find specific component types within a JSX tree.
 * It checks for the existence of one or more unique component references.
 *
 * @param initialChildren The JSX children to search within.
 * @param targetComponentTypes A ReadonlySet of component references to look for.
 * @returns A Set containing the references of the target components that were found.
 */
export function findSpecificComponents(
  initialChildren: JSXChildren,
  targetComponentTypes: ReadonlySet<any>,
  config?: { debug?: boolean }
): Set<any> {
  const foundComponents = new Set<any>();
  let startTime = 0;

  if (config?.debug) {
    startTime = performance.now();
  }

  // Stack for iterative DFS-like traversal. It will hold JSXChildren items.
  // Start with initialChildren, as it could be a single node, an array, or primitive.
  const toProcess: JSXChildren[] = [initialChildren];

  let iterations = 0;
  // Safety break for very deep/complex structures or potential cycles in dynamic JSX.
  const MAX_ITERATIONS = 50000;

  while (toProcess.length > 0 && iterations < MAX_ITERATIONS) {
    iterations++;
    // Optimization: if all target component types have been found, stop.
    if (foundComponents.size === targetComponentTypes.size) {
      break;
    }

    const currentChild = toProcess.pop(); // LIFO for DFS-like behavior

    // Skip primitives or empty values that cannot be components or contain children.
    if (
      !currentChild ||
      typeof currentChild === "boolean" ||
      typeof currentChild === "number" ||
      typeof currentChild === "string"
    ) {
      continue;
    }

    // If currentChild is an array, push its elements onto the stack.
    // Elements are pushed in reverse order to maintain a more natural DFS traversal.
    if (Array.isArray(currentChild)) {
      for (let i = currentChild.length - 1; i >= 0; i--) {
        toProcess.push(currentChild[i]);
      }
      continue;
    }

    // At this point, currentChild should be a JSXNode-like object.
    // We perform duck-typing, assuming it has 'type' and 'children' properties.
    const node = currentChild as JSXNode;

    // Check if the node's type is one of the target component references.
    // Component types are functions or QRL objects (not strings).
    if (node.type && typeof node.type !== "string") {
      if (targetComponentTypes.has(node.type)) {
        foundComponents.add(node.type);
        // Continue processing, as other distinct target components might be nested
        // or siblings. The main loop condition will break if all are found.
      }
    }

    // Always process the children of the current node, regardless of its type,
    // unless all target components have already been found.
    // This ensures searching within intrinsic elements (divs), non-target components,
    // and target components (for other potential distinct targets nested within).
    if (node.children && foundComponents.size < targetComponentTypes.size) {
      toProcess.push(node.children);
    }
  }

  if (config?.debug) {
    const endTime = performance.now();
    console.log(
      `findSpecificComponents: Debug: Traversal took ${(endTime - startTime).toFixed(2)}ms for ${iterations} iterations.`
    );
  }

  if (iterations >= MAX_ITERATIONS) {
    console.warn(
      `findSpecificComponents: Traversal halted after ${MAX_ITERATIONS} iterations. This might indicate an excessively deep, complex, or cyclical JSX structure. Found components: ${foundComponents.size}/${targetComponentTypes.size}`
    );
  }

  return foundComponents;
}

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

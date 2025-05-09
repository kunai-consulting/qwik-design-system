import type {
  FunctionComponent,
  JSXChildren,
  JSXNode,
  Component
} from "@builder.io/qwik";

/**
 * Defines optional properties for overriding default component checks and component implementations
 * based on a map of components.
 *
 * For a given `FlagMap` (e.g., `{ description: CmpA, customLabel: CmpB }`), this type generates properties like:
 * - `skipDescriptionCheck?: boolean;`
 * - `descriptionComponent?: CmpA;`
 * - `skipCustomLabelCheck?: boolean;`
 * - `customLabelComponent?: CmpB;`
 *
 * The pattern for generated properties, where `Key` is a key from `FlagMap`:
 * - `skip<CapitalizedKey>Check`: An optional boolean. If true, the existence check for the component associated with `Key` might be skipped.
 * - `<key>Component`: An optional Qwik component. If provided, this component can be used as an alternative to the default component associated with `Key`.
 */
export type ComponentCheckerProps<
  FlagMap extends Record<string, FunctionComponent<Record<string, unknown>>>
> = {
  [K in keyof FlagMap as `skip${Capitalize<K & string>}Check`]?: boolean;
} & {
  [K in keyof FlagMap as `${K & string}Component`]?: Component<Record<string, unknown>>;
} & {
  componentChecker?: ComponentCheckerData<{ [K in keyof FlagMap]: boolean }>;
};

export type ComponentCheckerData<TResults> = {
  results: TResults;
  name: string;
};

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
 * @param props The component props containing children and optional component overrides
 * @param flagMap Map of component flags to component references to check for
 * @param config Configuration options including the component name for error messages
 * @returns Object with boolean flags indicating if each component was found
 *
 * Note: This function updates the `componentChecker` prop on the provided props object
 * with the results of the component detection, which can be used by child components
 * to verify they're properly connected to their parent.
 */
export function setComponentFlags<T extends Record<string, FunctionComponent>>(
  props: Record<string, unknown> & {
    children?: JSXChildren;
    componentChecker?: ComponentCheckerData<{ [K in keyof T]: boolean }>;
  } & ComponentCheckerProps<T>,
  flagMap: T,
  config: { debug?: boolean; componentName: string }
): { [K in keyof T]: boolean } {
  const targetKeys = Object.keys(flagMap) as Array<keyof T>;
  // Dynamically build targetReferences based on props overrides or flagMap defaults
  const targetReferences: FunctionComponent[] = [];
  for (const key of targetKeys) {
    const overrideComponentPropName =
      `${key as string}Component` as keyof ComponentCheckerProps<T>; // e.g., descriptionComponent
    const overrideComponent = (props as ComponentCheckerProps<T>)[
      overrideComponentPropName
    ];

    if (overrideComponent && typeof overrideComponent === "function") {
      targetReferences.push(overrideComponent as FunctionComponent);
    } else {
      targetReferences.push(flagMap[key]);
    }
  }

  const results = {} as { [K in keyof T]: boolean };
  let numTargetsSuccessfullyFound = 0;

  // Initialize results and handle skip checks
  for (const key of targetKeys) {
    const capitalizedKey =
      (key as string).charAt(0).toUpperCase() + (key as string).slice(1);
    const skipPropName = `skip${capitalizedKey}Check` as keyof ComponentCheckerProps<T>;

    if ((props as ComponentCheckerProps<T>)[skipPropName] === true) {
      results[key] = true;
      numTargetsSuccessfullyFound++;
    } else {
      results[key] = false;
    }
  }

  const activelySearchedTargetKeys = targetKeys.filter((key) => !results[key]);
  let startTime = 0;

  if (config?.debug) {
    startTime = performance.now();
  }

  // Handle the case of empty targets object immediately
  if (targetKeys.length === 0) {
    throw new Error(
      `[${config?.componentName}] Qwik Design System: No targets provided to setComponentFlags.`
    );
  }

  const toProcess: JSXChildren[] = [props.children];
  let iterations = 0;
  const MAX_ITERATIONS = 50000;
  const WARNING_THRESHOLD = 201;

  while (toProcess.length > 0 && iterations < MAX_ITERATIONS) {
    iterations++;
    // Optimization: if all target flags are true, stop.
    if (numTargetsSuccessfullyFound === targetKeys.length) {
      break;
    }

    if (iterations === WARNING_THRESHOLD) {
      const finalTargetNamesForLog = activelySearchedTargetKeys.join(", and ") || "none";
      console.warn(
        `
--------------------------------

Qwik Design System Warning in ${config?.componentName}:

Potential performance issue: Exceeded ${WARNING_THRESHOLD - 1} iterations when searching for the following child component(s): ${finalTargetNamesForLog}.

This usually means the JSX content within ${config?.componentName} is very deep or complex.

To improve performance, consider these options for ${config?.componentName}:

  - Simplify JSX:
    Try moving complex or deeply nested elements outside of this component.

  - Virtualize Lists:
    If ${config?.componentName} contains long lists, use virtualization to render only visible items.

  - Skip Component Existence Checks (Advanced):

    If you are certain the component(s) listed above (${finalTargetNamesForLog}) are indeed present as children, you can remove the need to search for the component by providing a skip prop to ${config?.componentName} Root.
    
    For example, if you have definitely passed a Description component as a child to ${config?.componentName}, you could add the prop 'skipDescriptionCheck={true}' to ${config?.componentName}. Similarly for other listed components (e.g., 'skipLabelCheck={true}').
    
    Be cautious: Only use this option if you are absolutely sure the child component is present. Incorrectly skipping these checks can lead to unexpected behavior or hide issues if the component is actually missing.

--------------------------------
`
      );
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
    const debugTargetNamesForLog = activelySearchedTargetKeys.join(", ") || "none";
    const resultLog = JSON.stringify(results);
    console.log(
      `[${config?.componentName}] Qwik Design System: Debug: Traversal took ${(endTime - startTime).toFixed(2)}ms for ${iterations} iterations. Actively Searched Targets (${activelySearchedTargetKeys.length}): [${debugTargetNamesForLog}]. Full Result: ${resultLog}.`
    );
  }

  if (iterations >= MAX_ITERATIONS) {
    const errorTargetNamesForLog = activelySearchedTargetKeys.join(", ") || "none";
    const resultLog = JSON.stringify(results);
    throw new Error(
      `[${config?.componentName}] Qwik Design System: Traversal halted after ${MAX_ITERATIONS} iterations. Actively Searched Targets (${activelySearchedTargetKeys.length}): [${errorTargetNamesForLog}]. Partial Result: ${resultLog}. This might indicate an excessively deep, complex, or cyclical JSX structure.`
    );
  }

  props.componentChecker = {
    results: results,
    name: config.componentName
  };

  return results;
}

/**
 * Asserts that a specific child component was detected by its parent root component.
 *
 * This function is intended to be called from within a child component (e.g., Description, Label)
 * to ensure that the parent Root component (which should have used `setComponentFlags`)
 * has successfully found this child in its JSX structure or that the check was skipped.
 *
 * If the child was not found (and its check was not skipped), it throws an error
 * guiding the user on how to correctly pass the child component or use the override props.
 *
 * @param componentChecker The component checker data, typically from the parent root component's props.
 * @param config An object containing the `flagKey` and `componentName`.
 *   - `flagKey`: The key corresponding to this child component in the `componentChecker.results`. Autocomplete should be available.
 *   - `componentName`: The display name of the child component making this assertion (e.g., "CheckboxDescription").
 */

// Define a type for the configuration object
export type AssertConfig<TResults extends Record<string, boolean>> = {
  flagKey: keyof TResults;
  componentName: string;
};

export function assertComponentPresence<TResults extends Record<string, boolean>>(
  componentChecker: ComponentCheckerData<TResults> | undefined,
  config: AssertConfig<TResults> // Updated parameter
): void {
  // Destructure from config object
  const { flagKey, componentName } = config;

  if (!componentChecker) {
    console.warn(
      `Qwik Design System Warning: \`${componentName}\` called \`assertComponentIsPresent\` but the \`componentChecker\` data was not provided. Ensure the parent root component correctly uses \`setComponentFlags\` and that its \`componentChecker\` data is passed to this function.`
    );
    return;
  }

  const { results, name: namespace } = componentChecker;

  if (results && (results as Record<string, boolean>)[flagKey as string] === false) {
    const componentPropName = `${flagKey as string}Component`;

    throw new Error(
      `[Qwik Design System] ${namespace}.Root could not find the rendered ${componentName} piece.

This usually happens if ${componentName} is rendered inside another Qwik component, not directly under '${namespace}.Root'.

To fix: Pass the Qwik component that wraps over ${componentName} to the ${componentPropName} prop on <${namespace}.Root>.

Example:
If My${componentName}Wrapper is your Qwik component rendering the ${componentName} content:

<${namespace}.Root ${componentPropName}={My${componentName}Wrapper}>
  {/* ... */}
</${namespace}.Root>
`
    );
  }
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

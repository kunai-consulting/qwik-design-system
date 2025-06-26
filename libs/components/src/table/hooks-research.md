# Headless Libraries Hooks Management Research

## Overview
This research explores how different headless libraries manage hooks across frameworks, focusing on creating an 
intuitive and unified API that works seamlessly in both React and Qwik environments. The goal is to 
understand current best practices and propose a solution that maintains framework-specific benefits while 
providing a consistent developer experience.

## Current Landscape Analysis

### Major Headless Libraries Approaches

#### 1. Radix UI / Primitives
```typescript
// React Implementation
const useTabsContext = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('useTabsContext must be used within a Tabs provider')
  }
  return context
}

// Usage
function TabsContent() {
  const { selectedTab } = useTabsContext()
  return <div>{selectedTab}</div>
}
```

Key points:
- Uses React Context heavily
- Hook naming follows `use[Component]` pattern
- Returns object with values and methods
- [Source](https://github.com/radix-ui/primitives/blob/main/packages/react/tabs/src/tabs.tsx)

#### 2. Headless UI
```typescript
// Framework agnostic core logic
function useTabList(props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  return {
    selectedIndex,
    select: setSelectedIndex,
    // ... other shared logic
  }
}

// Framework specific wrapper
function useReactTabList(props) {
  const state = useTabList(props)
  useEffect(() => {
    // React specific side effects
  }, [])
  return state
}
```

Key points:
- Separates core logic from framework-specific code
- Uses adapter pattern for different frameworks
- [Source](https://github.com/tailwindlabs/headlessui)

#### 3. React Aria
```typescript
// Framework agnostic state
interface TabState {
  selectedKey: Key;
  orientation: Orientation;
  // ...
}

// Hook implementation
function useTab(props: TabProps, state: TabState, ref: RefObject<HTMLElement>) {
  const { selectedKey, orientation } = state
  
  // Shared logic
  return {
    tabProps: {
      role: 'tab',
      'aria-selected': isSelected,
      // ...
    }
  }
}
```

Key points:
- State management separated from UI logic
- Strong TypeScript support
- Explicit state passing
- [Source](https://github.com/adobe/react-spectrum/tree/main/packages/%40react-aria/tabs)

## Proposed Unified API Approach

### 1. Core Hook Pattern
```typescript
export function useTable(
        props: TableProps,
        runtime: ReactivityAdapter
) {
   const use = runtime;

   // State
   const selectedRowsSig = use.signal<Set<string>>(new Set());
   const sortingSig = use.signal<SortState | null>(null);

   // Computed
   const sortedDataSig = use.computed(() => {
      const currentSorting = sortingSig.value;
      if (!currentSorting) return props.data;

      // Sorting logic
      return [...props.data].sort((a, b) => {});
   });

   // Effects
   use.task(() => {
      // React -> useEffect
      // Qwik -> useTask$
      const currentSorting = sortingSig.value;
      if (currentSorting) {
         console.log('Sorting changed:', currentSorting);
      }

      // Cleanup fruncion
      return () => {
         // Cleanup logic
         console.log('Cleaning up sorting effect');
      };
   });

   return {
      selectedRows: selectedRowsSig,
      sorting: sortingSig,
      sortedData: sortedDataSig,
      // State methods
      toggleRowSelection: (rowId: string) => {
         const newSet = new Set(selectedRowsSig.value);
         if (newSet.has(rowId)) {
            newSet.delete(rowId);
         } else {
            newSet.add(rowId);
         }
         selectedRowsSig.value = newSet;
      },
      updateSorting: (newSorting: SortState) => {
         sortingSig.value = newSorting;
      }
   };
}
```

### 2. Framework-Specific Adapters

```typescript
// React Adapter
export const createReactAdapter = () => ({
   signal: function useReactSignal<T>(initialValue: T) {
      const [value, setValue] = useState<T>(initialValue);
      return {
         get value() { return value; },
         set value(newValue: T) { setValue(newValue); }
      };
   },
   computed: (fn: () => any) => useMemo(fn, []),
   task: (fn: () => void) => useEffect(fn, []),
   cleanup: (fn: () => void) => useEffect(() => fn, [])
});

// Qwik Adapter
export const createQwikAdapter = () => ({
   signal: useSignal,
   computed: useComputed$,
   task: useTask$,
   cleanup: useCleanup$
});

```

### 3. Framework-Specific Usage

```typescript
// React usage
function ReactTable(props: TableProps) {
  const adapter = createReactAdapter();
  const table = useTable(props, adapter);
  return <div>{/* Use table state */}</div>;
}

// Qwik usage
export const QwikTable = component$((props: TableProps) => {
  const adapter = createQwikAdapter();
  const table = useTable(props, adapter);
  return <div>{/* Use table state */}</div>;
});
```

## Documentation UI Proposal

### 1. Interactive Hook Explorer
```typescript
interface HookExplorerProps {
  framework: 'react' | 'qwik';
  hook: {
    name: string;
    signals: Array<{
      name: string;
      type: string;
      description: string;
    }>;
    computed: Array<{
      name: string;
      dependencies: string[];
      description: string;
    }>;
    methods: Array<{
      name: string;
      parameters: any[];
      returnType: string;
      description: string;
    }>;
  };
}
```

Example UI:
```jsx
<HookExplorer
  framework="react"
  hook={{
    name: "useTable",
    signals: [
      {
        name: "selectedRows",
        type: "Set<string>",
        description: "Currently selected row IDs"
      }
    ],
    computed: [
      {
        name: "sortedData",
        dependencies: ["data", "sorting"],
        description: "Data sorted according to current sort state"
      }
    ],
    methods: [
      {
        name: "toggleRow",
        parameters: [{ name: "id", type: "string" }],
        returnType: "void",
        description: "Toggle selection state of a row"
      }
    ]
  }}
/>
```

### 2. Live Code Playground
```typescript
interface CodePlaygroundProps {
  framework: 'react' | 'qwik';
  defaultCode: string;
  availableHooks: string[];
  dependencies: Record<string, string>;
}
```

## Best Practices & Recommendations

1. **Naming Conventions**
    - Use consistent prefixes (`use` for React, `use$` for Qwik)
    - Descriptive names that indicate purpose
    - Consistent suffix patterns (`Sig` for signals, `Fn` for functions)
    ```typescript
    // ✅ Good
    const userDataSig = use.signal<UserData>(initialData);
    const computedValueFn = $(() => transform(data));
    const handleUserActionFn = $(() => {});

    // ❌ Bad
    const userData = use.signal(initialData); // Missing Sig suffix
    const computed = $(() => transform(data)); // Non-descriptive name
    const fn = $(() => {}); // Too generic
    ```

2. **Type Safety**
   ```typescript
   interface ReactivityAdapter {
     signal: <T>(initial: T) => Signal<T>;
     computed: <T>(fn: () => T) => Signal<T>;
     task: (fn: TaskFn) => void;
     cleanup: (fn: () => void) => void;
   }
   ```

3. **Error Handling**
   ```typescript
   function assertAdapter(adapter: ReactivityAdapter) {
     if (!adapter.signal || !adapter.computed || !adapter.task) {
       throw new Error('Invalid reactivity adapter provided');
     }
   }
   ```

4. **Documentation Structure**
    - Overview and basic usage
    - Framework-specific considerations
    - Interactive examples
    - API reference
    - Common patterns and gotchas

## Interactive Documentation Examples

```typescript
// Example of interactive documentation component
export const HookDemo = component$(() => {
  return (
    <div class="hook-demo">
      <FrameworkSelector options={['react', 'qwik']} />
      <CodeEditor />
      <Preview />
      <PropsExplorer />
      <StateInspector />
    </div>
  );
});
```

## Known Limitations & Challenges

1. **Framework-Specific Features**
    - Some features might not have direct equivalents
    - Performance characteristics may differ
    - Bundle size implications

2. **TypeScript Support**
    - Generic type inference across frameworks
    - Framework-specific type definitions
    - Type safety in runtime adapters

3. **Development Experience**
    - IDE support and intellisense
    - Hot reload behavior

4. **Side Effects Handling**
   - React uses synchronous effects
   - Qwik has different types of tasks (useTask$, useVisibleTask$)
   - Cleanup timing differences
   - Server/Client execution differences
   - Resource management differences

## Questions to Consider

1. How to handle framework-specific optimizations?
2. Should we provide framework-specific escape hatches?
3. How to maintain consistency while allowing framework-specific patterns?
4. How to handle versioning and breaking changes?
5. What level of type safety can we guarantee across frameworks?

## Next Steps

1. Create prototype of unified hook system
2. Develop interactive documentation UI
3. Test with complex components (e.g., Table, DataGrid)
4. Create migration guides for existing components 

## References

1. [Qwik Signal Documentation](https://qwik.builder.io/docs/components/state/)
2. [React Signals RFC](https://github.com/reactjs/rfcs/pull/229)
3. [Preact Signals](https://preactjs.com/guide/v10/signals/)
4. [React Aria Hooks Documentation](https://react-spectrum.adobe.com/react-aria/hooks.html)
5. [Signals in @preact/signals-react](https://github.com/preactjs/signals/tree/main/packages/react)
6. [SolidJS Reactivity Documentation](https://www.solidjs.com/guides/reactivity)

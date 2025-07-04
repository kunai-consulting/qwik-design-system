# Contributing State

Accessible via: `/contributing/state`

> TODO: Add description.

import { Image } from "~/docs-widgets/image/image";
import ratingGroup from "~/assets/docs/state/rating-group.webp";

# State

<Image src={ratingGroup} loading="eager" alt="Rating Group" />

QDS components have two types of state:

1. **Signal based (two-way binding)**
2. **Value based (one-way binding)**

Signal based state is the default and **recommended** way for consumers to manage state, however consumers of the library may find value based more intuitive.

## Signal based (reactive state)

Consumers can pass a signal directly to the component to manage the component's state.

```tsx
export const ExampleComp = component$(() => {
    const selectedValueSig = signal(null);

    return (
        <Select.Root bind:value={selectedValueSig}>
            {...}
        </Select.Root>
    )
})
```

`bind:value` under the hood is really *just a prop*. The convention is to use `bind:` for signals, to stay consistent with Qwik's API (which was inspired by frameworks like Svelte and Angular).


### Binds in Qwik

In Qwik, you can use `bind:value` or `bind:checked` to pass your own signal state to update form controls.

<Showcase name="two-way" />

This is [two-way data binding](https://www.geeksforgeeks.org/two-way-data-binding-in-javascript/). Unlike traditional two-way binding that can be performance-heavy in other frameworks, Qwik's signals make it efficient by updating **only what needs to change**, with no unnecessary re-renders.

### useBindings (important)

The `useBindings` helper intends to simplify state management from multiple sources. 

It looks at what the user passed to your component - whether it's a plain value like `value="hello"` or a reactive signal like `bind:value={mySignal}`. Then it creates a simple signal for you to use in your component that automatically stays in sync with whatever the user provided.

<Showcase name="bindings" />

#### Usage

1. Import the necessary types and hook:
   ```tsx
   import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
   ```

2. Define your bindable properties:
   ```tsx
   type ExampleComponentBind = {
     value: string;
     disabled: boolean;
   };
   ```

3. Create component props with BindableProps:
   ```tsx
   export type MyComponentProps = {
     // Regular props here
   } & BindableProps<ExampleComponentBind>;
   ```

4. Use the hook in your component:
   ```tsx
   const { valueSig, disabledSig } = useBindings(props, {
     value: "",
     disabled: false
   });
   
   return <input value={valueSig.value} disabled={disabledSig.value} />;
   ```

Without `useBindings`, component authors often face challenges:

1. **Stale state issues** 🕒 - Components can get out of sync with consumers' signals
2. **Repetitive code** 🔄 - Writing similar synchronization logic for each property
3. **Edge case handling** 🐛 - Missing synchronization scenarios leads to subtle bugs
4. **Inconsistent updates** 🔄❌ - Properties update but internal state doesn't reflect changes

> Note: Our CI workflow checks that all root components use `useBindings`. If your component doesn't need it, add a `// no-bindings` comment to exempt it from the check.

> For a more in-depth example of seeing `useBindings` in action, look at the `checkbox-root.tsx` file in the `libs/components` folder.

#### useBoundSignal (internal)

`useBindings` uses this hook under the hood, `useBoundSignals` what combines the signals.

```tsx
export const SelectRoot = component$((props: SelectRootProps) => {
    const {
        "bind:value": givenSelectedValueSig,
    } = props;

    const selectedValueSig = useBoundSignal(givenSelectedValueSig, "Jim");

    return (
        <div>
            <Slot />
        </div>
    )
})
```

The `useBoundSignal` hook takes three arguments:

1. The **signal that the consumer passed in** for signal-based state
2. The **initial value** to use when no signal is provided
3. A **computed signal** that gets the latest resolved value from value-based state

In this case we've provided the initial value of `"Jim"` to the signal, but it could be an initial value from a prop passed by the consumer as well from value based state.

<Showcase name="bound-signal" />

Above is an example of a component that uses the `useBoundSignal` hook to combine the signal from the consumer with our internal signal.

> Notice that whenever toggling the checkbox or programmatically changing the signal, the **signal value** of the checkbox is updated both **internally and externally**.

Another example:

```tsx
  const { "bind:open": givenOpenSig,  ...rest } = props;
  const openPropSig = useComputed$(() => props.open);
  const isOpenSig = useBoundSignal(
    givenOpenSig,
    openPropSig.value ?? givenOpenSig?.value ?? false,
    openPropSig
  );
```

### Two-way store properties

Stores can also be two-way bound, in this case we use the `useStoreSignal` hook to create a signal from the store.

<Showcase name="store-signal" />

Now the store property is updated whenever the internal signal is updated and vice versa. This can be useful if you want to use the store as a source of truth for the component's state.

## Value based

Value based state is when the value is **passed directly** to the component as a prop.

For example, the `Select.Root` component has a `value` prop that can be used to set the selected value of the select.

```tsx
export const UserSelect = component$((props: UserSelectProps) => {

    return (
        <Select.Root value="Jim">
            {...}
        </Select.Root>
    )
})
```


### Types of value based state

Value based state can accept literal values, signal reads, stores, and anything under the sun that resolves to a value.

Literal value:

```tsx
<Select.Root value="Jim">
    {...}
</Select.Root>
```

Signal read:

```tsx
<Select.Root value={selectedValueSig.value}>
    {...}
</Select.Root>
```

Store read:

```tsx
<Select.Root value={myStore.property}>
    {...}
</Select.Root>
```

### Understanding reactivity

Keep in mind, that value based state is **not reactive**. This means that the component receiving the value has no idea that you're using a signal read or store property.

This is especially evident when you're passing state through context, where consumers expect to be able to update the state and see the changes.

<Showcase name="value-and-context" />

In the example above, notice how the button doesn't update when we toggle the state. This is because context values are not reactive - they're just snapshots at render time.

> Qwik does not re-render components when reactive values change, only the functions that depend on the reactive values run again.

#### Getting the latest values

To get the latest values from context, you need to turn value based state into **reactive state**.

We can do this by tracking whenever the specific property changes on the props object.

<Showcase name="signal-and-context" />

Another example:

```tsx
export const SelectRoot = component$((props: SelectRootProps) => {
    const isDisabledSig = useSignal(props.disabled);

    const context: ExampleContext = {
        isDisabledSig
    }

    useContextProvider(exampleContextId, context);

    return {...}
})

export const SelectTrigger = component$((props: SelectTriggerProps) => {
    const context = useContext(exampleContextId);

    return <button disabled={context.isDisabledSig.value}>
        <Slot />
    </button>
})
```

### Why useComputed$?

`useComputed$` will automatically track any reactive values (or props) that are used inside of it. The returned signal is a read-only signal that will update whenever the tracked reactive values change.

It is the equivalent of:

```tsx
const isDisabledSig = useSignal(props.disabled);

useTask$(({ track }) => {
    isDisabledSig.value = track(() => props.disabled);
})
```

You specifically need to track the property on the props object, similar to how you would track a store property.

> Qwik tracks reactivity through proxies. Props are reactive when used directly, but when values (not signals) are passed through context (or destructured), this reactive connection is lost. Always pass reactive state through context or explicitly track prop changes to maintain reactivity across context consumers.




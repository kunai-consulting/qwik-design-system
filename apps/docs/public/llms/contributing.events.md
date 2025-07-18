# Contributing Events

Accessible via: `/contributing/events`

> TODO: Add description.

import { Image } from "~/docs-widgets/image/image";
import events from "~/assets/docs/events/events.webp";
import stoplight from "~/assets/docs/events/stoplight.webp";

# Events

<Image loading="eager" src={stoplight} alt="Stoplight" />

## Event Naming Conventions

The most important event that handles the value change should *always* be named `onChange$` on the `Root` component.

Any other events should be named like `on<EventName>Change$`.

Examples:
- For value changes: `<Select.Root onChange$={...} />`
- For open state changes: `<Select.Root onOpenChange$={...} />`

## Event Handler Declaration

All events or functions inside a component should have a `$` suffix, indicating they are QRLs (Qwik Resource Loader functions).

Use reference to QRLs in JSX rather than inlining functions:

```tsx
// Good practice:
const handleClick$ = $(() => {
    // do something
})

<button onClick$={handleClick$}>
    <Slot />
</button>
```

```tsx
// Avoid this pattern:
<button onClick$={() => {
    // do something
}}>
    <Slot />
</button>
```

## Event Array Pattern

When handling events, you should ALWAYS pass an array with component-specific handlers first and the prop event handler second:

```tsx
// Correct pattern
<button 
  onClick$={[handleClick$, props.onClick$]}
>
  <Slot />
</button>
```

This ensures:
1. The component's internal handlers execute first
2. The event from props is passed to parent components
3. Both handlers receive the same event object

### Examples in the Codebase

This pattern is used throughout the component library:

```tsx
<label
  {...props}
  onMouseDown$={[handleMouseDownSync$, handleMouseDown$, props.onMouseDown$]}
>
  <Slot />
</label>
```

```tsx
<button
  onClick$={[handleClick$, props.onClick$]}
>
  <Slot />
</button>
```

## Special Event Handlers

### Sync Event Handlers

For immediate, synchronous event handling (like preventing default behaviors), use `sync$`:

This can be useful to **conditionally prevent default behavior** without waking up the Qwik runtime on load.

```tsx
const handleKeyDownSync$ = sync$((e: KeyboardEvent) => {
  const keys = ["Enter", "Space"];
  if (keys.includes(e.key)) {
    e.preventDefault();
  }
});

<button onKeyDown$={[handleKeyDownSync$, props.onKeyDown$]}>
  <Slot />
</button>
```

#### v1 Serialization Bug

In v1 there is a serialization bug with `sync$` events that is fixed in v2. The current workaround is the `useOnWindow` hook rather than passing the event directly. Here is an example workaround in v1:

```tsx
  useOnWindow("keydown", sync$((event: KeyboardEvent) => {
    // we have to do this on a window event due to v1 serialization issues
    const activeElement = document.activeElement;
    const isWithinRadioGroup = activeElement?.closest("[data-qds-radio-group-root]");

    if (!isWithinRadioGroup) return;

    const preventKeys = [
      "ArrowRight",
      "ArrowLeft",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End"
    ];
    if (preventKeys.includes(event.key)) {
      event.preventDefault();
    }
  }));
```

### Preventing Default Behavior

For common events where you want to prevent default browser behavior, use the `preventdefault:` directive:

```tsx
<div
  preventdefault:dragenter
  preventdefault:dragover
  preventdefault:dragleave
  preventdefault:drop
  // Other handlers...
>
  <Slot />
</div>
```

## Window/Document Level Events

For global event handlers, prefix with `window:` or `document:`:

```tsx
<div
  window:onDragOver$={onWindowDragOver$}
  document:onClick$={onDocumentClick$}
>
  <Slot />
</div>
```

Alternatively, you can use the `useOn`, `useOnWindow` or `useOnDocument` hooks to handle these events.
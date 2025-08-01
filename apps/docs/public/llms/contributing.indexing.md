# Contributing Indexing

Accessible via: `/contributing/indexing`

> TODO: Add description.

import { Image } from "~/docs-widgets/image/image";
import indexing from "~/assets/docs/indexing/indexing.webp";

# Indexing

<Image src={indexing} alt="Indexing" />

## Understanding the Need for Component Indexing

When building compound components with multiple instances of the same element type, we need to track the **specific index** of each item. This is crucial for features like:

- Determining the active slide in a carousel
- Managing selection in a list or tabs component
- Implementing keyboard navigation between related elements

### Single vs. Multiple Component Instances

**Single instance components** (like tooltips) don't typically need indexing:

```tsx
<Tooltip.Root>
 <Tooltip.Trigger>
    Trigger
 </Tooltip.Trigger>
 <Tooltip.Content>
   Content
 </Tooltip.Content>
</Tooltip.Root>
```

**Multiple instance components** (like carousels) require proper indexing:

```tsx
<Carousel.Root>
    <Carousel.Slide /> {/* index 0 */}
    <Carousel.Slide /> {/* index 1 */}
    <Carousel.Slide /> {/* index 2 */}
</Carousel.Root>
```

## The Challenge with Qwik v1

### Asynchronous Execution vs. Predictable Indexing

In Qwik v1, the framework executes code that **might be asynchronous** without a built-in scheduler:

- **Traditional frameworks** (React, Preact, Solid) have "implicit" schedulers
  - Component render order is sequential and predictable
  - This makes indexing straightforward but comes at a performance cost
  - Everything executes eagerly and blocks the main thread

- **Qwik v1's asynchronous model**
  - We can't predict when promises will resolve
  - This creates challenges for reliable indexing

Here's an example demonstrating the problem:

<Showcase name="the-problem" />

## The Workaround for Qwik v1

To solve this in v1, we use **synchronous code execution** via inline components:

### Using Inline Components

Qwik provides [inline components](https://qwik.dev/docs/components/overview/#inline-components) that:
- Execute synchronously (like traditional frameworks)
- Can access and manipulate children
- Allow us to implement reliable indexing

### Implementation Steps

1. **Create a base component**:

```tsx
const CarouselRootBase = component$((props) => {
    return (
        <Render fallback="div" {...props}>
          <Slot />
        </Render>
    )
})

export const CarouselRoot = withAsChild(CarouselRootBase)
```

2. **Use `withAsChild` for synchronous execution**:

The `withAsChild` function returns an inline component with a callback for synchronous code:

```tsx
const CarouselRootBase = component$((props) => {
    return (
        <Render fallback="div" {...props}>
          <Slot />
        </Render>
    )
})

export const CarouselRoot = withAsChild(CarouselRootBase, (props) => {
    // Synchronous code runs here
    console.log("I can do synchronous work here!");
    props.newProp = newValue;
    return props;
})
```

### Creating a Reliable Indexing System

We use two helper utilities:

1. **In the Root component**: Reset indexes at the start of each render cycle

```tsx
export const CarouselRoot = withAsChild(CarouselRootBase, (props) => {
    resetIndexes("carousel")  // Tie indexes to render lifecycle
    return props;
})
```

2. **In each item component**: Get the next sequential index

```tsx
export const CarouselSlide = withAsChild(CarouselSlideBase, (props) => {
  const nextIndex = getNextIndex("carousel");
  props._index = nextIndex;  // Store index in props for component access
  return props;
});
```

This solution produces correct indexes in most cases:

<Showcase name="the-fix" />

> Both helper functions expect a namespace, to prevent collision with other components.

## Limitations of the v1 Solution

The v1 solution breaks when consumers wrap our component instances in their own components:

<Showcase name="wrapped" />

This happens because:
- The consumer's wrapper components may introduce their own execution timing
- Without a built-in scheduler, we lose control of the execution order
- The indexes become out of sync with visual order

> In v1 on the consumer side, make sure not to compose multiple instance components.

## The Complete Solution in Qwik v2

In Qwik v2, the built-in scheduler solves these problems by allowing us to:
- Track component indexes reliably via context
- Maintain the correct order regardless of wrapper components
- Handle asynchronous operations without losing indexing reliability

```tsx
<Carousel.Root>
    <Carousel.Slide /> {/* index 0 */}
    <Carousel.Slide /> {/* index 1 */}
    <Carousel.Slide /> {/* index 2 */}
</Carousel.Root>
```

## Key Takeaways

- **Indexing is critical** for components with multiple instances of the same type
- **Qwik v1** requires manual synchronous workarounds using inline components
- **Helper utilities** (`resetIndexes` and `getNextIndex`) make implementation easier
- **Qwik v2's scheduler** solves these problems more elegantly, and anywhere in the component tree
- Always consider how your component will behave when wrapped by consumer components
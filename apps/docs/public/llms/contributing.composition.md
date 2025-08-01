# Contributing Composition

Accessible via: `/contributing/composition`

> TODO: Add description.

import { Image } from "~/docs-widgets/image/image";
import composition from "~/assets/docs/composition/lego-composition.webp";

# Composition

<Image src={composition} loading="eager" alt="Composition" />

## What is Composability?

Composability means building complex UIs from simple, reusable pieces that work well together. In QDS, components are designed to be composed rather than configured through numerous props.

For example, instead of a monolithic component with many configuration options, QDS provides component parts that you can combine:

```jsx
<Tooltip.Root>
  <Tooltip.Trigger>Hover me</Tooltip.Trigger>
  <Tooltip.Content>I appear on hover!</Tooltip.Content>
</Tooltip.Root>
```

## One Component, One Markup Element

A key principle in QDS is that each component typically corresponds to ONE piece of markup. With few exceptions, components are responsible for rendering and controlling a single element in the DOM.

```tsx
export const CheckboxTrigger = component$((props) => {
  return (
    <button {...props}>
      <Slot />
    </button>
  );
});
```

This principle:

- Keeps components focused on a single responsibility
- Makes the relationship between components and DOM clearer
- Simplifies styling and accessibility implementations
- Avoids "div soup" and unnecessary nesting

By following these composition principles, QDS aims to provide a flexible foundation that can be adapted to any design system needs while maintaining accessibility and performance.

Composability means building complex UIs from simple, reusable pieces that work well together.

For example, instead of a single `<Tooltip>` component with many props, you get:

```jsx
<Tooltip.Root>
  <Tooltip.Trigger>Hover me</Tooltip.Trigger>
  <Tooltip.Content>I appear on hover!</Tooltip.Content>
</Tooltip.Root>
```

This approach gives you more control and flexibility.

Without composability, you face "prop armageddon":

```jsx
<Tooltip
  content="I appear on hover!"
  triggerText="Hover me"
  triggerProps={{ className: "btn", disabled: false }}
  triggerClass="text-blue"
  contentBackgroundColor="#333"
  contentClass="p-2 rounded"
  position="top"
  arrow={true}
  arrowSize={8}
  delay={200}
  // ...and 20 more props
/>
```

This pattern is ok for those consuming the library, but not for those building it.

### Composing by abstraction

The purpose of these primitives is for consumers to combine the pieces of the component, so you can focus on building your app.

```jsx
import { Tooltip } from "@kunai-consulting/qwik";

export const HelpTip = component$(({ trigger }) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        {icon}
      </Tooltip.Trigger>
      <Tooltip.Content class="help-bubble">
        <Slot />
      </Tooltip.Content>
    </Tooltip.Root>
  );
});

export default component$(() => {
  return (
      <form>
        <label>
          Username
          <HelpTip icon={<QuestionCircleIcon />}>
            Choose a username between 3-20 characters
          </HelpTip>
        </label>
        <input name="username" />
      </form>
  )
})
```

### Composing with your own elements

With the `asChild` prop, consumers can even replace our default elements with their own JSX or components:

```jsx
<Tooltip.Root>
  <Tooltip.Trigger asChild>
    <button class="my-custom-button"> 
      Hover me <Icon name="info" />
    </button>
  </Tooltip.Trigger>
  <Tooltip.Content>I appear on hover!</Tooltip.Content>
</Tooltip.Root>
```

> For more on composability, see [this article](https://atomicdesign.bradfrost.com/chapter-2/).

This lets you maintain your component structure while still getting all the built-in behavior. The next section covers `asChild` in more detail.

## What is asChild?

The `asChild` prop enables component polymorphism - the ability to change a component's underlying HTML element while preserving its functionality. This pattern allows developers to:

- Use their own elements or components
- Maintain semantic structure
- Compose multiple components together seamlessly

For example, instead of this:

```jsx
<Button>
  <Link href="/about">About</Link>
</Button>
```

You can write this:

```jsx
<Button asChild>
  <Link href="/about">About</Link>
</Button>
```

### Implementing asChild in Your Components

#### Step 1: Import the Render Component

The `Render` component is the foundation of the `asChild` pattern in Qwik Design System. It handles:

- Merging props between your component and the consumer's element
- Handling the JSX type given by the consumer
- Giving fallback types to the author, with a better DX.

<Showcase name="render" />

- `fallback` is the default element type to render if `asChild` is not used. 
- `internalRef` is the prop to pass refs from context or in the library f. (leave `ref` for the consumer's use)

#### Step 2: Use the withAsChild Function

The `withAsChild` function creates a wrapper around your base component that enables the `asChild` functionality:

<Showcase name="as-child" />

In this example:
1. `TooltipTriggerBase` is your original component implementation
2. `withAsChild` wraps it to create the consumer-facing `TooltipTrigger` component
3. The consumer passes a `div` element as the child, and the `TooltipTrigger` component will now become the `div` element.

> The returned component is an inline component. This is needed to be able to find the consumer's children, and pass the props to the consumer's children.

### Usage Example

```jsx
// Default usage (renders a button)
<TooltipTrigger>Click me</TooltipTrigger>

// With asChild (renders a div)
<TooltipTrigger asChild>
  <div>Custom trigger element</div>
</TooltipTrigger>
```

Be careful with the `asChild` and inline components. There is a [common pitfall where library authors pass inline components to the asChild prop](/contributing/tradeoffs/#aschild-and-inline-components), and then wonder why the component is not behaving as expected.


### Accessibility Considerations

When using `asChild`, accessibility responsibility shifts partially to the consumer. Remember:

⚠️ **Important**: When allowing element substitution, ensure:

- Interactive elements are focusable (add `tabindex="0"` when needed)
- Proper keyboard event handling is maintained
- ARIA attributes are preserved or properly implemented
- The replacement element semantically makes sense for the component's purpose

For example, if replacing a `button` with a `div`:

```jsx
<Button asChild>
  <div 
    tabIndex={0} 
    onKeyDown$={(e) => e.key === 'Enter' && handleClick()}
  >
    Click me
  </div>
</Button>
```
# Contributing Component-Structure

Accessible via: `/contributing/component-structure`

> TODO: Add description.

import { Image } from "~/docs-widgets/image/image";
import structure from '~/assets/docs/structure/structure.png';
import pyramid from '~/assets/docs/structure/pyramid.webp';

# Component Structure

<Image src={pyramid} loading="eager" alt="Pyramid" />

## The Spectrum of Components

When building a design system, it's helpful to understand that components exist on a spectrum:

- **Low-level components**: Generic, highly reusable "LEGO brick" components like `Button` or `Input`
- **Mid-level components**: Combinations of low-level components with added functionality, like `SearchInput` or `NavMenu`
- **High-level components**: Application-specific components that implement business logic, like `UserProfileCard` or `CheckoutForm`

In QDS, we focus primarily on creating low-level components that are highly reusable across different applications and use cases. However, we structure them in a way that makes it easy to compose them into mid-level and high-level components.

<Image src={structure} alt="Structure" />

## Compound Components

To achieve both flexibility and simplicity, QDS uses a pattern called *compound components*. This approach allows developers to have precise control over each part of a component while maintaining a clean, organized API.

In QDS, compound components are structured as a collection of related components that share a **common namespace**. 

The component name itself serves as the namespace (like `Dropdown`), and within that namespace, we have different pieces including a `Root` component. These components work together to create a cohesive UI element, but each has a specific role.

For example, a Dropdown component might be structured like this:

A Root component that provides the context and state for the child pieces.

```tsx
import { component$, Slot } from '@builder.io/qwik';

export const dropdownContextId = createContextId<DropdownContext>('qds-dropdown');

// The component pieces
export const DropdownRoot = component$((props) => {
  const { openSig: isPopoverOpenSig } = useBindings(props, {
    open: false,
  });
 
  const context = {
    isPopoverOpenSig,
    // ...
  }

  useContextProvider(dropdownContextId, context);

  return (
    <div {...props}>
      <Slot />
    </div>
  );
});
```

```tsx
export const DropdownTrigger = component$((props) => {

  const handleClick$ = $(() => { 
    context.isPopoverOpenSig.value = !context.isPopoverOpenSig.value;
  });

  return (
    <button onClick$={[handleClick$, props.onClick$]} {...props}>
      <Slot />
    </button>
  );
});
```

The Dropdown builds on top of the Popover component, another composable primitive.

```tsx
export const DropdownContent = component$((props) => {
  const context = useContext(dropdownContextId);

  useTask$(() => {
    track(() => context.isPopoverOpenSig.value);

    // this task allows us to do Dropdown specific logic
    // when the popover opens or closes
  })

  return (
    <Popover.Content {...props}>
      <Slot />
    </Popover.Content>
  );
});
```

```tsx
export const DropdownItem = component$((props) => {
  return (
    <a {...props}>
      <Slot />
    </a>
  );
});
```

Exporting the pieces in the component's `index.ts` file:

```tsx
export { DropdownRoot as Root } from './root';
export { DropdownTrigger as Trigger } from './trigger';
export { DropdownItem as Item } from './item';
export { DropdownContent as Content } from './content';
```

This enables developers to use the component like this:

```tsx
<Dropdown.Root>
  <Dropdown.Trigger>Actions</Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Item href="/profile">Profile</Dropdown.Item>
    <Dropdown.Item href="/settings">Settings</Dropdown.Item>
    <Dropdown.Item href="/logout">Logout</Dropdown.Item>
  </Dropdown.Content>
</Dropdown.Root>
```

## Benefits of Compound Components

Using compound components solves several problems:

1. **Avoids "prop explosion"** - Instead of dozens of configuration props, each piece has its own focused API
2. **Provides flexibility** - Developers can compose the pieces how they need
3. **Maintains separation of concerns** - Each piece has a clear, single responsibility
4. **Enables better abstractions** - Developers can build their own higher-level components from the primitives
5. **Type safety** - When consuming the namespace, the IDE can provide autocompletion for the available pieces

For example, a developer might create a specialized dropdown for user actions:

```tsx
export const UserActionsDropdown = component$(({ user }) => {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>User Actions</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item href={`/user/${user.id}/profile`}>Profile</Dropdown.Item>
        <Dropdown.Item href={`/user/${user.id}/settings`}>Settings</Dropdown.Item>
        <Dropdown.Item href="/logout">Logout</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
});
```

## Organizing Component Files

Each component should have a root, which is the top level component that provides the context and state for the child pieces.

The other pieces can be named anything, but should be related to the component.

Ideally, they should be declarative and intuitively explain the purpose of the piece.

```
libs/components/src/dropdown/
├── index.ts           # Main export file that creates the namespace
├── dropdown-root.tsx           # Root component piece
├── dropdown-trigger.tsx        # Trigger component piece
├── dropdown-content.tsx        # Content component piece
├── dropdown-item.tsx           # Item component piece
└── research.mdx       # Research and documentation
```

The component folder's `index.ts` file exports the pieces:

```tsx
export { DropdownRoot as Root } from './root';
export { DropdownTrigger as Trigger } from './trigger';
export { DropdownContent as Content } from './content';
export { DropdownItem as Item } from './item';
```

Then, the `lib/components/src/index.ts` file exports the namespace:

```tsx
export * as Otp from "./otp";
export * as Checkbox from "./checkbox";
export * as Checklist from "./checklist";
export * as Pagination from "./pagination";
export * as ScrollArea from "./scroll-area";
export * as RadioGroup from "./radio-group";
export * as Calendar from "./calendar";
export * as FileUpload from "./file-upload";
export * as QRCode from "./qr-code";
export * as Resizable from "./resizable";
export * as Dropdown from "./dropdown";
```

## Benefits of This Structure

Organizing components this way provides several benefits:

1. **Maintainability** - Each component piece has its own file, making it easier to maintain
2. **Testability** - Component pieces can be tested individually
3. **Documentation** - Each piece can have its own documentation
4. **Flexibility** - Developers can import only the namespace and use the pieces they need

By following this structure, we create components that are both powerful and easy to use, balancing flexibility with developer experience. 
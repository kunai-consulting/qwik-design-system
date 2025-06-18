# Contributing New-Component

Accessible via: `/contributing/new-component`

> TODO: Add description.

import { Image } from "~/docs-widgets/image/image";
import newComponent from "~/assets/docs/new-component/new-component.webp";

# Creating a new component

<Image src={newComponent} loading="eager" alt="New Component" />

## Initial component setup

1. Create a new component folder in the [`libs/components/src`](https://github.com/kunai-consulting/qwik-design-system/tree/main/apps/docs/src) directory.
2. Create a new route folder in the [`apps/docs/src/routes/`](https://github.com/kunai-consulting/qwik-design-system/tree/main/apps/docs/src/routes) directory.
3. Add a new file for each component piece in your new component folder.
3. Export the component namespace from the [`libs/components/src/index.ts`](https://github.com/kunai-consulting/qwik-design-system/blob/main/libs/components/src/checkbox/index.ts) file.
4. Add the component to the sidebar menu in the [`apps/docs/src/routes/menu.md`](https://github.com/kunai-consulting/qwik-design-system/blob/main/apps/docs/src/routes/menu.md) file.

> Look at the example links above for further clarification on setup.

## Adding docs examples

To add examples in the docs, you can use the `Showcase` component.

First, in your new route folder, create a `examples` folder.

Then, add a new example, create a new file in the `examples` folder, and create a Qwik component that does a default export.

```tsx
import { component$ } from "@builder.io/qwik";

export default component$(() => {
    return <div>Hello World</div>;
});
```

Then, consume this in the mdx file with the file name as the name of the example.

File tree:

```shell
apps/docs/src/routes/tree/examples/hero.tsx
```

How it looks in MDX:

`src/routes/base/checkbox/index.mdx`

```mdx
# Checkbox

<Showcase name="hero" />
```

## When can people use the component?

A component is ready when it has:

- Research
- Tests
- Examples
- Documentation
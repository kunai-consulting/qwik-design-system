# Qwik-Core Use-Constant

Accessible via: `/qwik-core/use-constant`

> TODO: Add description.

---
title: useConstant
description: Initialize a value once per component instance
---

# useConstant

`useConstant` guarantees a value is initialized exactly once per component instance.

```tsx
import { component$, useConstant } from '@qwik.dev/core';

export default component$(() => {
  // Runs once during initialization
  const formatter = useConstant(() => 
    new Intl.NumberFormat('en-US', {
      style: 'currency', 
      currency: 'USD'
    })
  );
  
  return <div>{formatter.format(1234.56)}</div>;
});
```

## Use Cases

- Expensive calculations that should run only once
- One-time initialization logic

```tsx
// Persistence strategy (server → client)
const storage = useConstant(() => 
  isServer ? 'cookie' : 'localStorage'
);

// Complex initialization
const data = useConstant(() => 
  processLargeDataset(initialData)
);
```

Unlike `useSignal`, values from `useConstant` are not reactive and won't trigger re-renders when modified.

## Example

In Qwik Design System, this hook is used to determine which state persistence strategy to use. If the component is initially on the server, it will use a server side cookie, otherwise it will use localStorage
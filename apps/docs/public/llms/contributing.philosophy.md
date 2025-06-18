# Contributing Philosophy

Accessible via: `/contributing/philosophy`

> TODO: Add description.

import { Image } from "~/docs-widgets/image/image";
import philosophy from "~/assets/docs/philosophy/feather.webp";

# Philosophy

Everything should be HTML and CSS until users *actually* care about it (with a few exceptions).

<Image src={philosophy} loading="eager" alt="Philosophy" />

Have you ever been on a janky site and it took so long to load that you just gave up and left?

Chances are, that application is iterating through multiple trees, setting up a bunch of initialization logic (js or otherwise) that is never used.

The idea is we want to do **less work**, and only the work that is actually needed. It's the technical equivalent of work smarter, not harder.

As library authors, we want to make this process seamless and invisible to the developer.

## Code should be optimized for the environment

It's very common to see code that is optimized *only* for the browser. (React, Vue, Svelte)

On the other hand, it's also very common to see code that is optimized *only* for the server. (PHP, Ruby, WordPress)

What if we **didn't have to re-invent the wheel** for each component in each environment? And those components actually **got the benefits** of the environment they're running in?

QDS components are designed to be **optimized for the environment** they're running in, down to the function and event level.

## Thinking in terms of interactions

To users, components don't exist. All they see is a button they can click. Code should execute in response to those interactions.

When that click happens, the *only* code that actually runs is the **event handler**.

Even visible tasks are events, under the hood it is an internal event called `qvisible`. The event code runs when the parent element is visible in the user's viewport.

> `useVisibleTask$` is not a hook that should be used in Qwik Design System. It is highly probable you can use `useTask$`, `useComputed$`, `useResource$`, `sync$` or `useSerializer$` instead.

### Delay the execution of code until it's needed

We want to provide Just In Time (JIT) code execution. Only when they click the button, does the button's `onClick$` event handler run.

## What about code that executes when visible in the viewport?

In this case, you can use `useVisibleTask$` to delay the execution of code until the component is visible in the viewport.

Keep in mind, this immediately wakes up the Qwik runtime, when visible, so it is important that this is not above the fold.

> If you do have something above the fold, you could also create an intersection observer in a script tag (or sync$) for something more simple, without waking up the Qwik runtime.

## Handling synchronous code

There are a few cases where it is unavoidable to have synchronous code.

For example, light or dark mode detection, and preferences we can only know with javascript in the browser.

In this case, we can use either the `sync$` function, or a script tag to run the code, avoiding waking up the Qwik runtime.

### Example: File Upload

The files API is a synchronous API, meaning on the first drop of a file, that must be handled synchronously (or it wont register).

`sync$` while similar to a script tag, performs a number of optimizations to ensure it is as performant as possible.

What we can do is the synchronous work in the sync$ function, grab the necessary data, and then fire a custom event to the rest of our async code.

```tsx
import { component$, useSignal, useOn, sync$, $ } from "@builder.io/qwik";

export const SimpleFileUpload = component$(() => {
  const files = useSignal<File[]>([]);
  
  useOn(
    "drop",
    sync$((e: DragEvent) => {
      e.preventDefault();
      
      const droppedFiles = e.dataTransfer?.files;
      if (!droppedFiles?.length) return;
      
      const fileData = Array.from(droppedFiles).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
      
      const event = new CustomEvent("fileDropped", {
        detail: { files: Array.from(droppedFiles) }
      });
      e.target.dispatchEvent(event);
    })
  );

  const handleFileDrop$ = $((e: CustomEvent) => {
    files.value = e.detail.files;
    console.log(`Uploaded ${files.value.length} files`);
  });
  
  return (
    <div
      preventdefault:dragover
      preventdefault:dragenter
      onFileDropped$={handleFileDrop$}
    >
      <Slot />
    </div>
  );
});
```

This simple example demonstrates:

1. Using `sync$` to handle the synchronous file drop API
2. Gathering file data synchronously when needed
3. Dispatching a custom event to bridge to asynchronous code
4. Processing the files in an asynchronous event handler

We've also avoided waking up the Qwik runtime on load, and this code executes *only* when the user drops a file.
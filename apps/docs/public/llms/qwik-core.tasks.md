# Qwik-Core Tasks

Accessible via: `/qwik-core/tasks`

> TODO: Add description.

---
title: Tasks
description: This is a learn section. It is not specific to specific hooks. We will have a reference section for each hook later.
---

import serverRack from '~/assets/qwik-core/tasks/server-rack.webp'
import theClient from '~/assets/qwik-core/tasks/the-client.webp'
import tasksPlaceholder from '~/assets/qwik-core/tasks/tasks-placeholder.webp'
import { Image } from "~/docs-widgets/image/image";

# Tasks

<Image src={tasksPlaceholder} loading="eager" alt="Tasks" class="mix-blend-exclusion" />

Tasks are how your application responds to change.

Users type in inputs, data is fetched from different sources, timers fire, and state needs to be updated. Tasks help you manage all of these by:

1. **Watching for changes** - Tasks track the state you care about
2. **Running your code** - When tracked state changes, your task runs again
3. **Cleaning up** - Tasks clean up previous code before executing new code.

Tasks also come with a superpower: they can **efficiently transfer data between server and browser**.

<details class="mt-6 bg-neutral-900 p-[1ch] rounded-md">
  <summary>How are tasks different from effects in my previous framework?</summary>
  
  Key differences:
  * Tasks can run on both server and browser ([resumability](https://qwik.dev/docs/concepts/resumable/))
  * Tasks fundamentally understand asynchronous code
  * Tasks run independently (they don't need their component's code to run)
  * Tasks run before [rendering](/rendering) (unlike effects or [useVisibleTask$](https://qwik.dev/docs/components/tasks/#usevisibletask) which run after)

  Think of Tasks like a smart mailman - they efficiently deliver your code and data between server (sender) and browser (recipient).
</details>

## Tasks Run Based on Environment

Tasks *initially* run in the same place where your component is created. 

```tsx
  export default component$(() => {
    console.log("I'm inside the component boundary. I run once when rendered!")

    useTask$(() => {
      console.log("Nothing special here, so I run once based on the environment!")
    })

    {...}
  })
```

> The following examples cover `useTask$`, but the same principles apply to `useComputed$`, `useResource$` and other functions called within a component, with the exception of `useVisibleTask$`.

### Created in the Browser

When a component is created from a user interaction (like clicking a button), the task runs in the browser:

<Showcase name="task-conditional" />

## Environment rendering strategies

Your app can run entirely in the browser or start on a server - this choice affects where your code runs at page load.

### How can I know where my code is running?

A simple way to check is by running a `console.log` statement in your task.

#### Checking where code runs

After running `npm run dev` or `npm run preview`, and viewing the page in your browser you can check two locations:

- Browser: Look in your browser's [DevTools console](https://developer.chrome.com/docs/devtools/console)
- Server: Look in your [terminal](https://code.visualstudio.com/docs/terminal/getting-started) where you ran the command

<details class="mt-6 bg-neutral-900 p-[1ch] rounded-md">
  <summary>Checking by inspecting the DOM</summary>

Without having to be an expert in rendering strategies, you can find the `q:render` attribute on the Qwik container element to understand where your code is running.

Every Qwik application is wrapped in a [Qwik container](https://qwik.dev/docs/advanced/containers/#containers) (usually the `<html>` element) that provides information about how and where the code is running. You can inspect this container in your browser's DevTools to understand the execution environment.

### Finding the Container

Look for an element with a `q:container` attribute - this is your Qwik container. It will typically look something like this:

```html
<html q:container="paused" 
      q:version="2.0.0" 
      q:render="ssr" 
      q:base="/build/">
```

- `dom` - This part of the page was client side rendered
- `ssr` - This part of the page was server side rendered
- `static-ssr` - This part of the page was statically generated

> In dev mode, the value of the `q:render` attribute will have an appended `-dev` suffix.
</details>

### When the browser manages the page (CSR)

When a visitor of your site first reaches a page, and that page uses [Client side rendering (CSR)](https://www.youtube.com/watch?v=4-Lel1oaV7M), the task and application code will **always** run in the browser.

<Image 
  src={theClient} 
  alt="The Client" 
  class="max-w-50 mix-blend-luminosity rounded-full border-2 border-white mx-auto mt-6" 
/>

Even if this task function runs again, it will **always** run in the browser.

```tsx
useTask$(() => {
  // Always browser code
})
```

> CSR can be enabled by setting `csr: true` in the `qwikVite` plugin options.

### When a server delivers the page (SSR and SSG)

Applications using [SSR](https://www.youtube.com/watch?v=0bvo6UKkNDA) and [SSG](https://www.youtube.com/watch?v=1zhT23VDVDc) will *initially* run your tasks on the server.

<Showcase name="task-server" />

This grants access to powerful operations like data fetching and complex calculations before the page reaches the browser.

Think of your UI as a function of data. Servers are powerful because they:
1. Already have all your data
2. Know exactly what UI to send (no loading spinners)
3. Only ship the code your user needs right now

```tsx
export default component$(() => {
  const userExperience = useSignal();
  
  useTask$(async () => {
    // Get initial data
    const user = await getCurrentUser();
    
    // Process and transform
    const updatedUser = {
      ...user,
      preferences: optimizePreferences(user.preferences),
      segments: await calculateUserSegments(user)
    };
    
    // Grab data in advance
    userExperience.value = {
      user: updatedUser,
      features: await getEnabledFeatures(updatedUser),
      experiments: await getActiveExperiments(updatedUser.segments)
    };
    // All done before the page reaches the browser!
  });

  useTask$(() => {
    signal.value = "My signal assignment is synchronous!"
  })
  
  return <YourPersonalizedExperience data={userExperience.value} />;
});
```

> Tasks naturally handle both immediate operations and [promises](https://www.joshwcomeau.com/javascript/promises/).

#### Navigating with `<Link />` (Hybrid Rendering)

Using Qwik Router's `<Link />` component lets you switch between pages without a full page reload. When you click the Link component, any new tasks will run in the browser:

```tsx
export default component$(() => {
  return (
    <>
      <a href="/blog">
        Blog (Static Site Generated) after click
      </a>

      <Link href="/dashboard">
        Dashboard (Client-Side Rendered) after click
      </Link>
    </>
  );
});
```

However, in the context of a server rendered application, refreshing the dashboard page will run the task code on the server. The next section covers how to ensure your code only runs in the intended environment.

> Astro's `<ClientRouter />` component works similarly, converting `<a>` tags to client-side navigation, but at the page level rather than the element level.

## Ensure your code *only* runs in the intended environment

Qwik provides two ways to ensure your code only runs in the intended environment:

1. `isServer` - Check if the code is running on the **server**
2. `isBrowser` - Check if the code is running on the **browser**

```tsx
import { isBrowser, isServer } from '@qwik.dev/core';

export default component$(() => {
  useTask$(() => {
    if (isServer) {
      // code here will ONLY run on the server
    }

    if (isBrowser) {
      // code here will ONLY run on the browser
    }
  })

  {...}
})
```

Alternatively, you could early return based on the environment:

```tsx
useTask$(() => {
  // server and browser code can go here

  if (isServer) return;

  // browser only code can go here
})
```

## When tasks run

Now that you know how to check *where* your code is running, it's important to know *when* your code runs.

Tasks run before the JSX has been rendered, meaning they **block rendering** until they complete. Taking a look at our earlier example, we can see that the task changed the signal value before the page was server rendered:

<Showcase name="task-server" />

> An exception to this rule is `useVisibleTask$` - the callback function passed to the hook runs after the JSX has been rendered.

### Tasks Run in Order

Tasks run sequentially in the order they are defined - like following steps in a recipe. Just as you can't frost a cake before baking it, tasks will execute one after another in the order you write them.

It's best practice to `await` promises in your tasks. This ensures each task completes before the next one starts:

```tsx
useTask$(async () => {
   // Good: Wait for the async work to complete
   await someAsyncWork();
});

useTask$(async () => {
   // Next task won't start until someAsyncWork is done
   await someOtherWork();
});
```

> The framework does the hard work of running tasks in order. This makes your code predictable and easier to debug.

<details class="mt-6 bg-neutral-900 p-[1ch] rounded-md">
  <summary>How does Qwik schedule and manage tasks internally?</summary>

  Qwik has a scheduler that identifies pieces of work that need to run, these are called **chores**. 

  `useTask$`, `useComputed$`, and `useResource$`, are types of chores that the scheduler will run.

  Some other types of chores include rendering a component, doing a node diff, or flushing the journal.

  The journal tracks what needs to change, while the scheduler manages when and in what order those changes (and other work) should happen. 

  The scheduler uses a [priority queue](https://encore.dev/blog/queueing) to determine when this work should happen. 
</details>

### Running Tasks in Parallel

Sometimes you might want tasks to run at the same time. You can do this by not returning the promise:

```tsx
useTask$(() => {
   // This runs in parallel - doesn't block other tasks
   someAsyncWork();
});

useTask$(() => {
   // This starts immediately, doesn't wait for someAsyncWork
   someOtherWork();
});
```

The `await` keyword implicitly returns the promise. If you do not return the promise, and the promise throws an error, **you are responsible for handling the error**.


```tsx
// Sequential: Framework handles errors for you
useTask$(async () => {
  await someAsyncWork();
});

// Parallel: You must handle errors yourself
useTask$(() => {
  someAsyncWork().catch(error => {
    console.error(error);
  });
});
```

{/* <Showcase name="task-order" /> */}

## Tracking and watching for changes 

Tasks are reactive and will re-run **only** the task function when the tracked state changes. Every task has a function called `track` as its first argument.

> The exception being `useComputed$`, which will automatically track any reactive values (including props) that are passed to it.

The track function is able to watch the changes of:
- Reactive values (signals, stores, etc.)
- Properties on the props object

```tsx
useTask$(({ track }) => {
  track(() => signal.value);

  // code here will run initially, then re-run when the signal value changes
  // Code runs in that new environment
});
```

### Transitioning between environments

Does the text say `hello from the browser` initially? If so refresh the page, this is because of SPA navigation.

When the signal value changes, the task will re-run. What's important to note is that the task will run in the environment of where the tracked change took place. (usually the browser)

For example, if you have a signal value, and the signal value was changed in the browser, the task will run in the browser.

<Showcase name="environment-transition" />

> To reiterate, this function will re-run, and do a server to client handoff if the application was server rendered. Otherwise, it would always run in the browser.




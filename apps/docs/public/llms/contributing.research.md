# Contributing Research

Accessible via: `/contributing/research`

> TODO: Add description.

import { Image } from "~/docs-widgets/image/image";
import research from "~/assets/docs/research/research.webp";

# Research

<Image src={research} loading="eager" alt="Research" />

Research is a critical step in the development of any component. It helps us understand the problem we're solving and the best way to solve it.

## Inspiration

As OSS library authors, we want to create solutions that are not only useful, but also a _joy to use_. Existing projects can give us insight into how to make our components better, figure out limitations and edge cases, and come up with intuitive API design.

### Existing Headless libraries

Take a look at the following projects and see if you can find any inspiration. This will help with the **Research** step of the component development process.

- [Ark UI](https://ark-ui.com/)
- [Kobalte](https://kobalte.dev/)
- [Corvu](https://corvu.dev/)
- [Radix UI](https://www.radix-ui.com/primitives)
- [React Aria](https://react-spectrum.adobe.com/react-aria/index.html)
- [Melt UI](https://next.melt-ui.com/guides/installation)
- [Ariakit](https://ariakit.org/)
- [Headless UI](https://headlessui.com/)
- [Base UI](https://base-ui.com/)
- [Dice UI](https://www.diceui.com/)
- [Material Angular CDK](https://material.angular.io/cdk/categories)

#### Not headless but interesting

- [Shadcn UI](https://ui.shadcn.com/)
- [Flux UI](https://fluxui.dev/)
- [Angular Material](https://material.angular.io/components/categories)

> If you find something cool and think it fits, add it to the list!

### What is common across all these projects?

For each component you work on, find what is common across all the projects.

Ex: Do all the Accordion implementations have a `Panel` or `Content` component?

Ex: Do most date pickers have props to select a min and max date?

Ex: Do certain DOM elements have an exact or similar role / attribute?

### What is unique about these projects?

Is there an API that is very different from the rest? If you were going to use this component, what would you like to see in the API?

### What is the best part of these projects?

Is there an API that stands out and seems to be a better design? If you were going to use this component, what would you like to see in the API?

## Research Process

Each component folder should have a file called `research.md` or `research.mdx` that outlines the research that went into the component. This should include:

A comprehensive research document should cover the following areas:

### Research Links

Here are some links to research links for the tree component:

```md
- [Ark UI](https://ark-ui.com/react/docs/components/tree-view)

- [Material UI](https://mui.com/x/react-tree-view/?srsltid=AfmBOor5Lu38zUPxWS633qeArjpzz9IK_DuLrAtQxqsjy33VUa5EyI3l)

- [React Headless Tree](https://headless-tree.lukasbach.com/storybook/react/index.html?path=/story/react-async-data-loading--async-data-loading)

- [React Arborist](https://github.com/brimdata/react-arborist)

- [Melt UI](https://next.melt-ui.com/components/tree/)
```

Preview:

- [Ark UI](https://ark-ui.com/react/docs/components/tree-view)

- [Material UI](https://mui.com/x/react-tree-view/?srsltid=AfmBOor5Lu38zUPxWS633qeArjpzz9IK_DuLrAtQxqsjy33VUa5EyI3l)

- [React Headless Tree](https://headless-tree.lukasbach.com/storybook/react/index.html?path=/story/react-async-data-loading--async-data-loading)

- [React Arborist](https://github.com/brimdata/react-arborist)

- [Melt UI](https://next.melt-ui.com/components/tree/)

### Features

List all the features the component should support, using a checklist format:

```md
- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
```

As you add features, make sure to update the research document to reflect the latest changes.

### Component Structure

Define the composition pieces of the component:

```md
Pieces:

- Root
- Panel
- Handle
```

### Keyboard Interactions

Document all keyboard interactions the component should support for accessibility:

```md
- Arrow keys for navigation
- Enter/Space for activation
- Escape for dismissal
```

### Attributes

List all the attributes needed for the component to work or be accessible:

```md
role="dialog"

- aria-labelledby
- aria-describedby
```

### Use Cases

Document common use cases for the component:

```md
- Forms
- Navigation
- Data visualization
```

Provide links to the example use cases.

For example, here's some use case links of the slider component:

- [Image Reveal slider](https://examples.motion.dev/js/image-reveal-slider)
- [iOS Slider](https://examples.motion.dev/js/ios-slider)

### CSS Considerations

Note any important CSS properties or techniques:

```md
Important CSS:

- position: absolute
- position-anchor: top-left
- overflow: hidden
```

### API Design

Document the proposed API for each component part:

```md
Root:

- prop1 -> description
- prop2 -> description

Panel:

- propA -> description
- propB -> description
```

### Known Issues

Document any known issues or challenges from similar implementations:

```md
- Edge case handling
- Browser inconsistencies
```

### Questions

List any open questions that need resolution:

```md
- How should X behavior work?
- Should we support Y feature?
```

See the [resizable component research](https://github.com/kunai-consulting/qwik-design-system/blob/main/libs/components/src/resizable/research.mdx) for an example.

## Don't reverse engineer

Don't reverse engineer the component from the research links. The links are there to help you understand the component, the spec, and the problem it solves.

Only look at the implementation if you are stuck or need to understand a specific part of the component.

## Research is not a one time thing

Research is not a one time thing. It is a living document that should be updated as you learn more about the component.

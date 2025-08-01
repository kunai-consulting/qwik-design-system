# Contributing Intro

Accessible via: `/contributing/intro`

> TODO: Add description.

import { Sparkles } from "~/docs-widgets/sparkles/sparkles";
import { Image } from "~/docs-widgets/image/image";
import workshop from "~/assets/docs/intro/workshop.webp";
import roadmap from "~/assets/docs/intro/treasure-map.webp";

# Intro to QDS

<Image loading="eager" src={workshop} alt="QDS Workshop" />

Welcome to the <Sparkles>Qwik Design System team</Sparkles>!

**Qwik Design System** is an open source framework for building *better design systems at scale* with Qwik. From here on out, we'll refer to it as QDS.

## What's Included

✨ **A component library of unstyled UI components**  
📚 **A documentation site** to showcase and explain components  
📝 **An automatic documenter** that generates the initial docs and API surface for each component. <br />
🔍 **A testing environment** for ensuring component quality and accessibility

### Coming Soon

🛠️ **A CLI tool** to help you get started with the framework  
🧰 **A set of utilities** specifically designed for building robust design systems

## Prerequisites

Before contributing to QDS, you should be familiar with:

- **[Qwik](https://qwik.dev/)** ⚡: a basic understanding of Qwik's component model, reactivity system (e.g signals, stores), and tasks

> New to Qwik? Check out this talk by Shai Reznik: [Qwik - Behind The Magic](https://www.youtube.com/watch?v=G3psTl5wqdk)

> Still learning Qwik? Start tackling a couple of [free frontend mentor challenges](https://www.frontendmentor.io/challenges?type=free) to get familiar with the framework.

Nice to haves:

- **Web Accessibility** ♿: Basic understanding of ARIA attributes and keyboard navigation patterns
- **Testing** 🧪: Familiarity with testing tools and strategies

## Our Tech Stack

QDS is built with the following technologies:

- **[Qwik](https://qwik.dev/)** ⚡: Our core framework for environment agnostic components
- **[TypeScript](https://www.typescriptlang.org/)** 🔒: For type safety and better developer experience
- **[Vite](https://vite.dev/)** 🚀: For fast development and optimized builds
- **[MDX](https://mdxjs.com/)** 📝: For documentation with embedded components
- **[Vitest](https://vitest.dev/)** 🧪: For unit and component testing
- **[Playwright](https://playwright.dev/)** 🎭: For end-to-end testing
- **[Tailwind CSS](https://tailwindcss.com/)** 🎨: For styling the documentation site itself
- **[Changesets](https://changesets-docs.vercel.app/en)** 📦: For versioning and changelog management

> We also use [Biome](https://biomejs.dev/) for linting and formatting. Please enable the [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) in VSCode to get the recommended rules and formatting.



## What is unstyled or headless ui?

A headless UI library is just the brains without the beauty - all the smart functionality with [zero styling](https://www.smashingmagazine.com/2022/05/you-dont-need-ui-framework/).

- You get the complex behaviors (keyboard navigation, accessibility)
- You add your own styles (colors, spacing, animations)

Think of it as LEGO instructions without dictating what colors to use! 🧩

## Roadmap

<Image src={roadmap} alt="QDS Roadmap" />

Qwik Design System is currently focused on providing a robust headless UI component library. Here's what we're planning for the future:

### Phase 1: Core Headless Components (Current)
- Building a comprehensive set of accessible, composable UI primitives
- An icons library that is automatically optimized via [OXVG](https://github.com/noahbald/oxvg)
- Utilities library to aid in building design systems

### Phase 2: Design System Tooling
- CLI for design system and docs setup
- Registry for adding both components and templates to consumer design systems
- Docs framework with batteries included search, headless sidebars, and more
- A headless charts and tables library
- Qwik Motion, a performant animation library

### Phase 3: Enterprise Features
- Automated release process for soc2
- Analytics for tracking usage and adoption
- Bringing Code-Notate to each new design system

We welcome contributions at any stage of our roadmap! PR's are always welcome, and we are always happy to chat about new ideas.

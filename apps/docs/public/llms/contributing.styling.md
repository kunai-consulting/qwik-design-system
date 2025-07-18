# Contributing Styling

Accessible via: `/contributing/styling`

> TODO: Add description.

import { Image } from "~/docs-widgets/image/image";
import styling from "~/assets/docs/styling/styling.webp";

# Styling

<Image src={styling} loading="eager" alt="Styling" />

There are two parts of styling in QDS, both with differing philosophies and approaches.

## Styling in headless components

For the most part, headless components should not have any styling. There are however, some exceptions to this rule.

Depending on the component, it may need *behavioral* or css that affects its *layout algorithm*. 

This does not mean changing a background color or font size, but rather changing the css properties that affect the layout of the component.

Conversely, you may need to strip styles from a browser user-agent (albeit rare).

These styles should also be easy for consumers to override. (no specificity wars)

### Adding styles

1. In your component folder, create a `<component-name>.css` file. Ex: `checkbox.css`
2. Add the css to in an [@layer](https://css-tricks.com/css-cascade-layers/) named qds at the top of the file.

```css
@layer qds {
  [data-qds-indicator] {
    user-select: none;
  }

  [data-qds-indicator][data-hidden] {
    display: none;
  }
}
```

3. Inline the css file in the root component piece using the `useStyles$` hook.

```tsx
import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./checkbox.css?inline";

export const CheckboxRoot = component$(() => {
    useStyles$(styles);
    {/* ... */}
});
```

In the case of the checkbox, we make some slight changes to the selection behavior of the indicator, along with managing when the indicator is hidden.

There are however more complex cases, where a layout algorithm needs to be the default. Take Qwik UI's [Carousel](https://github.com/qwikifiers/qwik-ui/blob/8c0795522591b5b6bd3ec060b9fdb330a165fe8a/packages/kit-headless/src/components/carousel/carousel.css) component for example.

> Inline CSS is another cool tool in our toolbelt when it comes to creating components that should not execute code unless the consumer wants it to. In the case of the carousel, it handles the alignment options, and even the initial slide position on the server!


## Styling the examples

Eventually we have to make something consumer facing in the docs. The examples here are more "user land", and will not come with the `@kunai-consulting/qwik` package.

Currently, you can add a new css file in the `examples` folder for each component in the docs.

Here are the styles for Each Checkbox example in the docs:

```css
.checklist-root {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.checkbox-root {
    display: flex;
    align-items: center;
    gap: 8px;
}

.checkbox-trigger {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    position: relative; 
    background: gray;
}

.checkbox-trigger:focus-visible {
    outline: 1px solid white;
}

.checkbox-trigger[data-disabled] {
    opacity: 0.5;
}

.checkbox-indicator[data-checked] {
    display: flex;
    justify-content: center;
    position: absolute;  
    inset: 0;           
    align-items: center;
    background: #0a4d70;
    border-radius: 8px;
}

.select-all-trigger [data-check-icon],
.select-all-trigger [data-minus-icon] {
    display: none;
}

.select-all-trigger[data-checked] [data-check-icon] {
    display: block;
}

.select-all-trigger[data-mixed] [data-minus-icon] {
    display: block;
}
```

> In the future, we'd like to write these examples using Tailwind, and have LLM's or a convertor tool to convert it into regular css, and other styling solutions. For example, the default code view being vanilla css with a select dropdown to switch between the different styling solutions.




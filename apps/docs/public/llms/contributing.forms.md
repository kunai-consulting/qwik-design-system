# Contributing Forms

Accessible via: `/contributing/forms`

> TODO: Add description.

import { Image } from "~/docs-widgets/image/image";
import forms from "~/assets/docs/forms/forms.webp";

# Forms

<Image src={forms} alt="Forms" />

Some components in QDS act as form controls, while others don't. Understanding this distinction is important for allowing consumers to build accessible and functional forms.

## Form Controls

### What is a Form Control?
Form controls are components that collect and submit user input to a form. Native examples include:

- `<input>`
- `<select>`
- `<textarea>`

Base / Headless Components like **Checkbox, Radio Group, and OTP are form controls**, while components like Collapsible or QR Code are **not**.

### Visually Hidden Pieces

If a component is a form control, it should contain a piece that is visually hidden.

The purpose of the visually hidden piece is to:

1. Maintain native form submission behavior
2. Preserve accessibility
3. Support standard HTML form attributes (name, value, required, etc.)

For example, when you use our Checkbox component, and a consumer wants to submit a form, they add the hidden input to their form:

<Showcase name="form" />

Under the hood it looks like this:

```tsx
import { $, type PropsOf, component$, useContext } from "@builder.io/qwik";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";
import { checkboxContextId } from "./checkbox-context";

type PublicCheckboxHiddenNativeInputProps = PropsOf<"input">;

export const CheckboxHiddenInput = component$(
  (props: PublicCheckboxHiddenNativeInputProps) => {

    const context = useContext(checkboxContextId);

    const handleChange$ = $((e: InputEvent) => {
      const target = e.target as HTMLInputElement;
      if (target.checked === context.isCheckedSig.value) {
        return;
      }
      context.isCheckedSig.value = target.checked;
    });

    return (
      <VisuallyHidden>
        <input
          type="checkbox"
          tabIndex={-1}
          checked={context.isCheckedSig.value === true}
          indeterminate={context.isCheckedSig.value === "mixed"}
          // Identifier for the hidden native checkbox input element
          data-qds-checkbox-hidden-input
          name={context.name ?? props.name ?? undefined}
          required={context.required ?? props.required ?? undefined}
          value={context.value ?? props.value ?? undefined}
          onChange$={[handleChange$, props.onChange$]}
          {...props}
        />
      </VisuallyHidden>
    );
  }
);
```

Notice that the example above wraps the native input in a `VisuallyHidden` component. This is important for accessibility and usability, same as adding the attribute `name` to the native input.

## Form Submission

Due to the element being a native form control, the data will be present in the form data object:

```tsx
<form
  preventdefault:submit
  onSubmit$={(e) => {
    const form = e.target as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form));
    // formData will include values from all form controls
  }}
>
  {/* Form controls here */}
</form>
```

## Form Validation

Form controls can include validation through error messages. The error state is controlled by the presence of an Error component:

<Showcase name="validation" />

> When introducing an error message component, it's important to make sure you have added the correct data or aria attributes when the component is in an error state. E.g `data-invalid` or `aria-invalid`.
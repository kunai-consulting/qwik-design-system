# Base Checkbox

Accessible via: `/base/checkbox`

> TODO: Add description.

import api from "./code-notate/api.json";

# Checkbox

A clickable input that lets users make binary choices or select multiple options.

<Showcase name="hero" />

## Features

<Features api={api} />

## Anatomy

<AnatomyTable api={api} />

## Examples

### Basic Usage

The most basic checkbox implementation requires a `Checkbox.Root` component with a `Checkbox.Trigger` and `Checkbox.Indicator` nested inside.

<Showcase name="initial" />

The `checked` prop on `Checkbox.Root` sets the initial checked state. When checked, the `Checkbox.Indicator` becomes visible.

### Visual Features

#### Labels and Descriptions

Add descriptive text with `Checkbox.Label` and `Checkbox.Description` components. The `isDescription` prop on `Checkbox.Root` enables description support.

<Showcase name="description" />

#### Mixed State

Checkboxes support an indeterminate state using the `"mixed"` value. This is useful for parent/child checkbox relationships.

<Showcase name="mixed-initial" />

### Advanced Usage

#### Form Integration

For form submissions, add `Checkbox.HiddenInput` to create a native checkbox input. Use `name` and `value` props to control form data.

<Showcase name="form" />

The `required` prop enforces validation:

<Showcase name="validation" />

You can customize the submitted value using the `value` prop:

<Showcase name="value" />

#### Error Handling

Display error messages using the `Checkbox.Error` component. This automatically sets the appropriate ARIA attributes.

<Showcase name="validation" />

#### Mixed State Management

For complex selection scenarios, use the `bind:checked` prop to handle mixed states programmatically.

<Showcase name="mixed-reactive" />

The checkbox cycles through mixed → checked → unchecked states when clicked.

## Component State

### Using Component State

The checkbox component provides several ways to control its state:

1. **Initial State**
   As shown in the Initial example, you can set the initial checked state using the `checked` prop on `Checkbox.Root`:

```tsx
<Checkbox.Root checked>
  <Checkbox.Trigger>
    <Checkbox.Indicator />
  </Checkbox.Trigger>
</Checkbox.Root>
```

2. **Controlled State**
   For controlled state management, use the `bind:checked` prop as demonstrated in the Reactive example. This allows you to bind the checkbox state to your application's state.
3. **Indeterminate State**
   The checkbox supports a third "mixed" or indeterminate state, as shown in the Mixed Initial example. This is useful for representing partially selected states, like in a tree structure or bulk selection interface.

### State Interactions

1. **Change Events**
   As shown in the Change example, use the `onChange$` prop to handle state changes:

```tsx
<Checkbox.Root
  onChange$={(checked) => {
    // Handle the new checked state
  }}
>
```

2. **Disabled State**
   The Disabled example demonstrates how to disable the checkbox using the `disabled` prop. When disabled:

- The checkbox cannot be interacted with
- The visual state reflects the disabled status
- All interactions are prevented

3. **Programmatic Control**
   As shown in the Programmatic example, you can programmatically control the checkbox state from outside the component:

```tsx
<button
  onClick$={() => {
    // Update the bound checked state
    isChecked.value = true;
  }}
>
  Check the checkbox
</button>
```

4. **Mixed State Transitions**
   When in a mixed state, clicking the checkbox will first transition to a checked state, then follow the normal checked/unchecked cycle on subsequent clicks, as demonstrated in the Mixed Reactive example.
   The checkbox maintains a predictable state transition flow:

- mixed → checked
- checked → unchecked
- unchecked → checked

## Core Configuration

### Initial State

The checkbox can be configured with an initial state using the `checked` prop on `Checkbox.Root`. As shown in the `initial` example above, this sets an uncontrolled initial value.

> The default value is `false` if not specified.

### Value Configuration

The checkbox supports three states:

- `false` (unchecked)
- `true` (checked)
- `"mixed"` (indeterminate)
  As shown in the `mixed-initial` example above, the indeterminate state can be set initially.

### Form Integration

The checkbox can be configured for form submission with these props:

- `name` - Form field name
- `value` - Custom value for form submission (defaults to "on")
- `required` - Makes the field required
  As shown in the `value` example above, you can customize the submitted value.

## Advanced Configuration

### State Management

The checkbox supports both controlled and uncontrolled state management:

```typescript
// Uncontrolled
<Checkbox.Root checked={true} />
// Controlled
<Checkbox.Root bind:checked={isCheckedSignal} />
```

### Description Configuration

When using `Checkbox.Description`, you must set `isDescription` prop on `Checkbox.Root`:

```typescript
<Checkbox.Root isDescription>
  <Checkbox.Description>...</Checkbox.Description>
</Checkbox.Root>
```

> Failing to set `isDescription` will trigger a console warning.

### Technical Constraints

1. The `bind:checked` signal must be of type `Signal<boolean | "mixed">`
2. The `onChange$` handler receives the new state as its only argument
3. When in `mixed` state, the first click will set the state to `true`
   These behaviors can be observed in the `mixed-reactive` example above.

## Forms

The Checkbox component provides form integration through the `<Checkbox.HiddenInput>` component, which renders a native checkbox input that's visually hidden but still accessible for form submission.

<Showcase name="form" />
The following props can be used to configure the form behavior:
- `name`: Sets the name of the form field
- `value`: Sets a custom value for the checkbox (defaults to "on")
- `required`: Makes the checkbox a required form field
<Showcase name="value" />
## Form Validation
The Checkbox supports form validation through the `<Checkbox.Error>` component. When rendered, it automatically puts the checkbox in an invalid state and connects it with the error message via ARIA.
<Showcase name="validation" />
The error message is displayed when form validation fails, and the checkbox trigger receives the appropriate ARIA attributes:
- `aria-invalid="true"`
- `aria-describedby` pointing to the error message
## Mixed State in Forms
For complex form scenarios, the checkbox supports a mixed (indeterminate) state that can be used when a form field represents a partial selection.
<Showcase name="form-mixed" />
The mixed state is reflected in the hidden input's `indeterminate` property, ensuring proper form submission behavior.

<APITable api={api} />

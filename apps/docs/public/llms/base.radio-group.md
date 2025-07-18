# Base Radio-Group

Accessible via: `/base/radio-group`

> TODO: Add description.

import api from "./code-notate/api.json";

# Radio Group
A set of options where users can select only one choice at a time, commonly used in forms, settings, and questionnaires.

<Showcase name="horizontal" />

## When to use Radio Group

Radio Group is ideal when:
- Users must choose exactly one option from a list (unlike checkboxes which allow multiple selections)
- You have 2-7 mutually exclusive options (for more options, consider using a Select component)
- Options need to be immediately visible to users
- You need native form integration

Real-world examples:
- Payment method selection in checkout flows
- Account settings (e.g., notification preferences)
- Survey questions with single-choice answers
- Subscription plan selection

## Implementation Notes

Radio Group is built on native radio inputs, providing several advantages:
- Works with browser form validation
- Reliable form submission
- Better accessibility out of the box

## Features
<Features api={api} />

## Anatomy
<AnatomyTable api={api} />

## Examples

### Basic Usage
Start with this example if you're new to Radio Group. It shows the minimal setup needed for a functional component.

<Showcase name="hero" />

This example demonstrates:
- Basic radio group structure
- Label and item organization
- Visual indicators for selection
- Default vertical orientation

```tsx
<RadioGroup.Root>
  <RadioGroup.Item value="option1">
    <RadioGroup.Label>Option 1</RadioGroup.Label>
    <RadioGroup.Trigger>
      <RadioGroup.Indicator />
    </RadioGroup.Trigger>
  </RadioGroup.Item>
</RadioGroup.Root>
```

### Value Based
Manage the radio group's selected value externally using signals, allowing for dynamic updates and state sharing across components.

<Showcase name="value-based" />

```tsx
const currentValue = useSignal("option1");

<RadioGroup.Root
  value={currentValue.value}
  onChange$={(value: string) => {
    currentValue.value = value;
    console.log("Selected:", value);
  }}
>
  {/* Radio items */}
</RadioGroup.Root>
```

### Form Integration
Radio group with form validation and error messages.
<Showcase name="form" />

Essential for collecting user input. This example demonstrates:
-	Form validation integration
-	Error message handling
-	Description text for better context
-	Hidden native inputs for reliable form submission

### Horizontal Layout
Radio group with horizontal orientation.
Use horizontal layout for:
-	Compact spaces
-	Short option labels
-	Small number of choices (2-3 options)
-	Binary choices (Yes/No, Enable/Disable)
<Showcase name="horizontal" />

### Disabled States
Example showing both group-level and individual item disabled states.
<Showcase name="disabled" />

This demonstrates:
- Disabling the entire group
- Individual item disabling
- Visual feedback for disabled state
- Maintaining proper keyboard navigation

Implement disabled states to:
-	Prevent selection based on conditions
-	Show unavailable options
-	Maintain context while restricting access

## Keyboard Navigation

The component supports full keyboard navigation:
-	Tab: Focus the radio group
-	Space/Enter: Select focused option
-	Arrow keys: Navigate between options (respects orientation)
-	Home/End: Jump to first/last option

## Accessibility

Built following the WAI-ARIA radio group pattern, the component includes:
-	Proper role attributes (radiogroup, radio)
-	Aria states (checked, disabled)
-	Focus management
-	Keyboard navigation
-	Form integration
-	Error states
-	Description support

## Form Integration

The component provides several features for form integration:
```tsx
<RadioGroup.Root
  name="options"        // Form field name
  required={true}      // Required validation
  form="form-id"       // Form connection
>
  {/* Radio items */}
  <RadioGroup.Error>
    Please select an option
  </RadioGroup.Error>
</RadioGroup.Root>
```

## Styling
The component uses data attributes for styling:
```css
[data-qds-radio-group-root] {
/* Root styles */
}

[data-qds-radio-group-trigger][data-state="checked"] {
/* Checked state styles */
}

[data-qds-radio-group-trigger][data-disabled] {
/* Disabled state styles */
}
```


<APITable api={api} />
# Base Switch

Accessible via: `/base/switch`

> TODO: Add description.

import api from "./code-notate/api.json";

# Switch
A toggleable control that changes between two states when activated.
<Showcase name="hero" />
## Features
<Features api={api} />
## Anatomy
<AnatomyTable api={api} />
## Examples
### Basic Usage
The most basic switch implementation includes a trigger, thumb, and label. The switch can be controlled through mouse clicks or keyboard interactions.
<Showcase name="binding" />
In this example, we demonstrate:
- Using `bind:checked` for state management
- Basic switch structure with `Root`, `Trigger`, `Thumb`, and `Label` components
- Visual feedback showing the current state
### Visual Features
#### Description Text
Add supplementary information to the switch using the `Description` component.
<Showcase name="description" />
This example shows:
- Using `Description` component to provide additional context
- Proper ARIA association between the switch and its description
- Maintaining accessibility while adding more information
### Advanced Usage
#### Disabled State
Switches can be disabled to prevent user interaction.
<Showcase name="disabled" />
This example demonstrates:
- Using the `disabled` prop to prevent interaction
- Visual styling for disabled state
- Maintaining proper ARIA attributes for accessibility
#### Form Integration
Switches can be integrated into forms with validation and error handling.
<Showcase name="form" />
This example showcases:
- Form integration with `name` and `value` props
- Required field validation
- Error message display using `Error` component
- Error state handling with `hasError` prop
- Hidden input management for form submission

## Component State
### Using Component State
#### State-Related Props
The Switch component accepts several state-related props:
- `checked` - Controls the checked state
- `disabled` - Disables user interaction
- `required` - Makes the switch a required form field
- `name` - Sets the form field name
- `value` - Sets the form submission value
### State Interactions
#### Handling State Changes
The Switch component provides the `onChange$` prop to handle state changes:
```typescript
<Switch.Root
  onChange$={(checked) => {
    console.log(`Switch is now ${checked ? 'on' : 'off'}`);
  }}
>
  {/* ... */}
</Switch.Root>
```
#### Form Integration
As shown in the Form Integration example above, the Switch component integrates seamlessly with forms through:
- Automatic form value submission
- Required field validation
- Error state handling

And can be configured for form integration with the following props:
- `name` - Form field identifier
- `value` - Value submitted with the form
- `required` - Enforces field requirement
- `hasError` - Controls error state display
#### Error State Management
The Switch supports error state handling through:
- The `hasError` prop to indicate an error state
- The `Error` component to display error messages
- Proper ARIA attributes for accessibility

As demonstrated in the Form Integration example, error states can be managed dynamically based on form validation or other conditions.
#### State Persistence
The Switch maintains its state across:
- User interactions (clicks and keyboard events)
- Form submissions
- Focus changes
This ensures a consistent user experience while maintaining proper form functionality.

### Default Values
The Switch component initializes with these default configurations:
```typescript
{
  checked: false,
  disabled: false,
  required: false,
  name: "",
  value: ""
}
```
## Advanced Configuration
### Component Structure
The Switch uses a compound component pattern with these required elements:
- `Root` - Container and state manager
- `Trigger` - Interactive element
- `Thumb` - Visual indicator
- `Label` - Text identifier

Optional components include:
- `Description`
- `Error`
- `HiddenInput`
### Technical Constraints
- The `Trigger` component must be a direct child of `Root`
- The `Thumb` component must be within the `Trigger`
- Form integration requires the `HiddenInput` component
- Error messages require both `hasError` prop and `Error` component
These constraints ensure proper functionality and accessibility compliance.


<APITable api={api} />
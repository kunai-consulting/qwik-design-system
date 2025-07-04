# Base Otp

Accessible via: `/base/otp`

> TODO: Add description.

import api from "./code-notate/api.json";

# One-Time Password Input
Securely collect and validate numeric codes with automatic field navigation and keyboard support.
<Showcase name="hero" />
## Features
<Features api={api} />
## Anatomy
<AnatomyTable api={api} />
## Examples
### Basic Usage
The OTP input can be initialized with a default value using the `value` prop.
<Showcase name="initial" />
This example demonstrates:
- Using `value` prop to set an initial uncontrolled value
- Default numeric validation pattern
- Automatic field navigation
### Visual Features
The OTP input can be disabled to prevent user interaction.
<Showcase name="disabled" />
This example shows:
- Using the `disabled` prop to control input state
- Visual feedback for disabled state via `data-disabled` attribute
### Advanced Usage
#### Controlled Input
The OTP input can be controlled using signals with `bind:value`.
<Showcase name="reactive" />
This example demonstrates:
- Two-way binding with `bind:value` prop
- Programmatic value updates
- Reactive state management
#### Event Handling
The OTP input supports completion and change events.
<Showcase name="complete" />
This example shows:
- Using `onComplete$` to handle filled state
- Using `onChange$` for value updates
- Automatic validation and field progression
#### Change Events
Monitor input changes with the `onChange$` handler.
<Showcase name="change" />
This example demonstrates:
- Real-time value change detection
- Event handling for input modifications
- Integration with external state

## Component State
### Using Component State
The OTP component provides several ways to control its state through props:
1. Initial Value
As shown in the `initial` example above, you can set an initial uncontrolled value using the `value` prop on `<Otp.Root />`:
```tsx
<Otp.Root value="1234">
  {/* OTP items */}
</Otp.Root>
```
2. Controlled Value
For controlled state management, use the `bind:value` prop as demonstrated in the `reactive` example above. This allows you to programmatically update the OTP value.
3. Disabled State 
The `disabled` example shows how to disable the entire OTP input using the `disabled` prop:
```tsx
<Otp.Root disabled={true}>
  {/* OTP items */}
</Otp.Root>
```
### State Interactions
1. Change Events
As shown in the `change` example, use the `onChange$` prop to listen for value changes:
```tsx
<Otp.Root 
  onChange$={(value) => {
    // Handle value change
  }}
>
  {/* OTP items */}
</Otp.Root>
```
2. Completion Events
The `complete` example demonstrates using `onComplete$` to handle when all OTP digits are filled:
```tsx
<Otp.Root
  onComplete$={() => {
    // Handle OTP completion
  }}
>
  {/* OTP items */}
</Otp.Root>
```
3. Password Manager Integration
Control password manager suggestion positioning with the `shiftPWManagers` prop (enabled by default):
```tsx
<Otp.Root shiftPWManagers={false}>
  {/* OTP items */}
</Otp.Root>
```
The component maintains internal state for:
- Current input value
- Focus state
- Selection range
- Current input position
- Validation state
These states are automatically managed based on user interaction and the provided props.

Based on the provided examples and API documentation, I'll document the configuration options for the OTP component.
## Core Configuration
### Input Pattern
By default, the OTP component only accepts numeric input (0-9). You can customize the input validation pattern through the `pattern` prop on `<Otp.HiddenInput />`. The default pattern is `^[0-9]*$`.
### Initial Value
The OTP component supports setting an initial uncontrolled value. As shown in the `initial` example above, you can pass the `value` prop to `<Otp.Root />` to set the initial value.
### Password Manager Integration
The OTP component includes built-in support for password managers. By default, password manager suggestions are shifted to the right of the OTP input. This behavior can be controlled via the `shiftPWManagers` prop on `<Otp.Root />`:
```typescript
<Otp.Root shiftPWManagers={false}>
  {/* ... */}
</Otp.Root>
```
### Input Length
The number of OTP digits is determined by the number of `<Otp.Item />` components rendered. The component automatically manages the maximum input length based on this count.
## Advanced Configuration
### Value Binding
For reactive control over the OTP value, the component supports value binding through the `bind:value` prop. As shown in the `reactive` example above, this allows two-way binding with a signal.
### Completion Handling
The component provides completion detection through the `onComplete$` prop. As demonstrated in the `complete` example above, this handler is called when all OTP digits are filled.
### Change Detection
For granular control over value changes, use the `onChange$` prop. As shown in the `change` example above, this handler is called on every value change, receiving the current OTP value as an argument.
### Disabled State
The entire OTP input can be disabled through the `disabled` prop on `<Otp.Root />`. As shown in the `disabled` example above, this affects all child components and prevents user interaction.
> Note: The disabled state is reflected through the `data-disabled` attribute on both root and individual items, allowing for consistent styling across states.





<APITable api={api} />
# Base Date-Input

Accessible via: `/base/date-input`

> TODO: Add description.

import api from "./code-notate/api.json";

# Date Input
A customizable date entry field that allows users to input dates in various formats.
<Showcase name="hero" />

Note: This component relies on `field-sizing: content;` to set the width of the inputs based on the content of the input or its placeholder. 
This is supported in Chromium-based browsers, but may not work properly in other browsers.
If you need to support other or older browsers, you can manage the width of the inputs in your own CSS.
## Features
<Features api={api} />
## Examples
### Basic Usage
The Date Input component provides a structured way to enter dates with separate segments for year, month, and day. The basic implementation includes a root component that manages state, a label for accessibility, date entry container, and individual segments.
<Showcase name="basic" />
In this example:
- `<DateInput.Root>` serves as the container and handles overall state
- `<DateInput.Label>` provides an accessible label for the input
- `<DateInput.Entry>` groups the segments for proper accessibility and handles input, output, and state for an individual date value
- `<DateInput.Year>`, `<DateInput.Month>`, and `<DateInput.Day>` are the individual input segments
- `<DateInput.HiddenInput>` provides a hidden native input for form submission
### Visual Features
#### Custom Date Formats
You can customize the date format by arranging the segments in any order and using different separators.
<Showcase name="format" />
This example shows a European-style date format (DD.MM.YYYY) with dots as separators. The `showLeadingZero` prop ensures single-digit values are displayed with a leading zero.
#### Leading Zeros
The `showLeadingZero` prop can be applied to month or day segments to ensure consistent formatting with leading zeros for single-digit values.
<Showcase name="value-based" />
In this example, both the month and day segments display leading zeros, creating a consistent visual appearance.

#### Separators
The Entry component accepts a `separator` prop, which then gets automatically inserted between the segments of the input.
```tsx
<DateInput.Entry separator="/">
  <DateInput.Month />
  <DateInput.Day />
  <DateInput.Year />
</DateInput.Entry>
```

You may instead use normal markup to insert separators between the segments.
```tsx
<DateInput.Root>
  <DateInput.Label>Enter your date of birth:</DateInput.Label>
  <DateInput.Entry>
    <DateInput.Year />
    <span>-</span>
    <DateInput.Month />
    <span>-</span>
    <DateInput.Day />
  </DateInput.Entry>
</DateInput.Root>
```

Example using a custom separator icon inserted via the separator prop:
<Showcase name="separator" />

### Advanced Usage
#### Form Integration
The Date Input can be integrated with forms using the `<DateInput.HiddenInput>` component.
<Showcase name="form" />
The `name` attribute on the `<DateInput.HiddenInput>` component ensures the date value is included when the form is submitted.
#### Reactive Binding
You can bind the date value to a signal for two-way data binding.
<Showcase name="reactive" />
This example demonstrates binding the date to a signal with `bind:date`. Changes made in the input are reflected in the external state, and external changes update the input.
#### Value-Based One-Way Data Binding
For more granular control, you can use the Date Input with `date` and `onChange$` props.
<Showcase name="change" />
The `onChange$` handler is called whenever the date changes, allowing you to track changes and update external state.
#### Observing Changes at the Root Level
You can also use the `onChange$` handler on the `<DateInput.Root>` component to observe changes at the root level.
The event fires whenever any date changes in the Date Input context, providing the date values as an array. 
This can be useful when you have two or more Date Entry components under the same root.
<Showcase name="root-change" />

#### Disabled State
The Date Input can be disabled to prevent user interaction.
<Showcase name="disabled" />
When the `disabled` prop is set to `true`, all segments become non-editable while still displaying their values.
#### Toggling Disabled State
You can dynamically toggle the disabled state of the Date Input.
<Showcase name="toggle-disabled" />
This example shows how to toggle the disabled state using a signal, allowing you to enable or disable the input based on application logic.

## Component State
### Using Component State
The Date Input component provides several ways to control its state through props.
#### Initial Values
When no initial value is provided, all segments will display their placeholder text. 

To set an initial date value, use the `date` prop on the `<DateInput.Root>` component. 
The simplest way to provide an initial value is to provide a string value in ISO format (YYYY-MM-DD).
```tsx
<DateInput.Root date="2021-01-01">
  {/* ... */}
</DateInput.Root>
```
#### Controlling the Date Value
You can also use a variable such that any updates to your date value will be reflected in the input.
```tsx
<DateInput.Root  date={selectedDate.value} >
  {/* ... */}
</DateInput.Root>
```

Alternatively, you can supply a Signal to the `bind:date` prop to create a two-way binding, 
where changes in the input are automatically reflected in the external state, and vice versa.
```tsx
<DateInput.Root bind:date={selectedDate}>
  {/* ... */}
</DateInput.Root>
```

#### Disabled State
To prevent user interaction with the Date Input, use the `disabled` prop:
```tsx
<DateInput.Root disabled={true}>
  {/* ... */}
</DateInput.Root>
```
The Disabled example demonstrates this feature, showing a Date Input with a fixed date that users cannot modify.
### State Interactions
#### Responding to Date Changes
The Date Input provides an `onChange$` handler that is called whenever the date changes, allowing you to respond to user input:
```tsx
const handleChange$ = $((date: DateInput.ISODate | null) => {
  // Update external state or perform actions based on the new date
  selectedDate.value = date;
});
```
As shown in the Change example, you can use this handler to track changes and update external state.

#### Clearing the Date Value
You can clear the date value by setting it to `null`, which will reset all segments to their placeholder state:
```tsx
<button onClick$={() => (selectedDate.value = null)}>
  Clear
</button>
```
This is demonstrated in both the Reactive and Value-Based examples, where a button is provided to clear the date.

## Configuration Options
### Date Format Configuration
#### Custom Date Formats
The Date Input component allows you to customize the date format by arranging the segments in any order and using different separators. This flexibility enables you to create date formats that match regional preferences or specific application requirements.
As shown in the Format example above, you can create a European-style date format (DD.MM.YYYY) by arranging the segments in day-month-year order and using dots as separators:
```tsx
<DateInput.Entry>
  <DateInput.Day showLeadingZero={true} />
  <DateInput.Separator separator="." />
  <DateInput.Month showLeadingZero={true} />
  <DateInput.Separator separator="." />
  <DateInput.Year />
</DateInput.Entry>
```
The component supports various date formats including:
- American format (MM/DD/YYYY) as shown in the first example
- ISO format (YYYY-MM-DD) as shown in the Basic example
- European format (DD.MM.YYYY) as shown in the Format example
### Segment Formatting
#### Leading Zeros
Each segment component (`<DateInput.Day />`, `<DateInput.Month />`, and `<DateInput.Year />`) accepts a 
`showLeadingZero` prop that controls whether single-digit values are displayed with a leading zero. 
This can be useful for maintaining consistent visual width across all possible values.
As shown in the Value-Based example, you can apply this prop to both month and day segments:
```tsx
<DateInput.Month showLeadingZero />
<DateInput.Day showLeadingZero />
```
When `showLeadingZero` is enabled:
- A month value of 1 will display as "01"
- A day value of 9 will display as "09"
This prop is `false` by default for all segments.

Currently `showLeadingZero` has no effect on the year display.
#### Placeholder Text
Each segment component accepts a `placeholder` prop that allows you to customize the placeholder text shown when no value is entered:
```tsx
<DateInput.Day placeholder="Day" />
<DateInput.Month placeholder="Month" />
<DateInput.Year placeholder="Year" />
```
The default placeholder values are:
- "dd" for the day segment
- "mm" for the month segment
- "yyyy" for the year segment

### Multiple dates
The Date Input can be composed with multiple `<DateInput.Entry>` components to create a multi-date input.
You could use multiple `<DateInput.Root>` components, but if you have multiple dates that are related, with a single label, 
you can use a single `<DateInput.Root>` component with multiple `<DateInput.Entry>` components,
as in the following Date Range example:

<Showcase name="date-range" />

## Technical Constraints
### Date Range Limitations
The Date Input component enforces the following constraints on segment values:
- Year: Values between 0 and 10000
- Month: Values between 1 and 12
- Day: Values between 1 and the last day of the selected month/year
The day segment's maximum value is dynamically adjusted based on the selected month and year, accounting for variations in month length and leap years.
### ISO Date Format
The component uses the ISO date format (YYYY-MM-DD) for its internal value representation. When providing a date via the `date` prop, it must be in this format:
```tsx
<DateInput.Root date="2023-04-15">
  {/* ... */}
</DateInput.Root>
```
If an invalid format is provided, the component will throw an error.

## Keyboard Navigation
The Date Input component provides comprehensive keyboard navigation between segments:
- Tab/Shift+Tab: Moves focus between segments
- Arrow keys: Navigate within and between segments
- Numeric input: Automatically advances to the next segment when appropriate
As shown in the Basic example, the component handles focus management automatically, moving to the next segment when a complete value is entered.

## Form Integration
The Date Input component provides seamless integration with forms through the `<DateInput.HiddenInput>` component.

### Basic Form Integration
To use the Date Input in a form, include the `<DateInput.HiddenInput>` component within the `<DateInput.Entry>` component.
```tsx
<DateInput.Root>
  {/* ... */}
  <DateInput.Entry>
    {/* ... date segments ... */}
    <DateInput.HiddenInput name="appointment-date" />
  </DateInput.Entry>
</DateInput.Root>
```
This creates a hidden native input field that will be included in the form data when the form is submitted.
<Showcase name="form" />
In this example:
- The `name` attribute on `<DateInput.HiddenInput>` specifies the field name that will appear in the form data
- The Date Input's value is automatically included in form submissions
- The submitted data is displayed after form submission, showing the date in ISO format (YYYY-MM-DD)

Note that the `<DateInput.HiddenInput>` must be slotted within a `<DateInput.Entry>` component in order to properly access the date value from the entry's context.

### Required Fields
The `required` attribute can be applied to make the date field mandatory in form submissions:
```tsx
<DateInput.HiddenInput name="appointment-date" required={true} />
```
### Form Value Handling
The `<DateInput.HiddenInput>` component automatically uses the current date value from the Date Input context. When the form is submitted, the date is included in the ISO format (YYYY-MM-DD).
As shown in the Form example above, the submitted data includes the date value with the specified field name:
```json
{ "appointment-date": "2022-02-14" }
```
### Custom Form Handling
For more control over form submission, you can combine the Date Input with custom form handling logic:
```tsx
<form
  preventdefault:submit
  onSubmit$={(e) => {
    const form = e.target as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form));
    // Process form data
  }}
>
  <DateInput.Root>
    {/* ... */}
    <DateInput.Entry>
      {/* ... date segments ... */}
      <DateInput.HiddenInput name="date-field" />
    </DateInput.Entry>
  </DateInput.Root>
  <button type="submit">Submit</button>
</form>
```
This approach allows you to intercept the form submission and process the data before sending it to a server or performing other actions.

# Environment Considerations
The Date Input component is designed to work seamlessly in both server-side rendering (SSR) 
and client-side rendering (CSR) environments, as is standard for Qwik components.

<APITable api={api} />
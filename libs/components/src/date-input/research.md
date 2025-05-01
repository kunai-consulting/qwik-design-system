# Date Input Research

Note: Consult the [Calendar research document](../calendar/research.md), which is more comprehensive at the moment.

## Features
Target features. Some are essential, others are nice to have. Checked items are already implemented in our component.
- [x] Year, month and date entry
- [x] Customizable entry format (e.g. "mm/dd/yyyy", "yyyy-mm-dd", "dd/mm/yyyy")
- [x] Placeholder text
- [x] Increment/decrement using up and down arrows
- [x] Automatically move focus to the next segment when a segment is fully entered
- [x] Label
- [x] ARIA attributes
- [x] Keyboard navigation
- [x] Hidden input
- [x] Default date
- [x] Change event handling
- [x] Bound date
- [x] Disabled state
- [ ] Error messages
- [ ] Required state
- [ ] Default format based on locale
- [ ] Support two-digit date entry (e.g. "12/31/26" instead of "12/31/2026")

## Component Structure
- Root
  - Label
  - DateEntry
  - ErrorMessage
  - HiddenInput

## Research Links
Here are some resources that can inform and inspire our implementation

### Native HTML
Source: [MDN article on Date Input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)

Native HTML provides a date input element that can be used to select a date.

### Other libraries
- [React Aria](https://react-spectrum.adobe.com/react-aria/DateField.html)
  - This component has a very pleasant user experience. It breaks the input into three parts: month, day, and year. 
  Each has a clear placeholder and the ability to increment/decrement the value using the up and down arrows.
- [flux Date Picker](https://fluxui.dev/components/date-picker)
  - The tech stack and API is quite different, but the input in this date picker works similarly to React Aria's DateField.
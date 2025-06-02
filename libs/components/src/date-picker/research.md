# Date Picker Research

A component that combines a date input with a calendar that opens in a popover when the input is focused.

Note: Also consult the related [Calendar research document](../calendar/research.md) and [Date Input research document](../date-input/research.md).

## Description and functionality
The 

## Features
Target features. Some are essential, others are nice to have. Checked items are already implemented in our component.
- [ ] Date input
- [ ] Customizable trigger button that can be used to open and close the calendar
- [ ] Calendar in a popover or inline
- [ ] Trigger the calendar to open on focus, on click of a button, or both
- [ ] User can either type a date or select a date from the calendar
- [ ] Typing can be enabled/disabled
- [ ] Selection can be enabled/disabled



## Component Structure
- Root
  - Input
  - Trigger
  - Popover
    - Calendar

## Research Links
Here are some resources that can inform and inspire our implementation

### Other libraries
- [Ark UI](https://ark-ui.com/docs/components/date-picker)
  - Input, Calendar, and related components all fall under the same namespace.
  - Can set open/closed state of the calendar via props.
  - `closeOnSelect` prop controls whether the calendar should close when a date is selected.
- [React Aria](https://react-spectrum.adobe.com/react-aria/DatePicker.html)
  - Makes use of their Popover component to display their Calendar component
  - There is also a separate but very similar [DateRangePicker](https://react-spectrum.adobe.com/react-aria/DateRangePicker.html)
- [melt](https://www.melt-ui.com/docs/builders/date-picker)
  - Has separate Date Field, Date Picker, Date Range Field, and Date Range Picker components
- [shadcn](https://ui.shadcn.com/docs/components/date-picker)
  - Built using a combination of their Popover and Calendar components
  - Doesn't allow typing a date in the input, only selection from the Calendar
- [flux Date Picker](https://fluxui.dev/components/date-picker)
  - The tech stack and API is quite different, but the functionality is robust

Some comparable libraries do not provide a date picker as such. These include: [corvu](https://corvu.dev/), 
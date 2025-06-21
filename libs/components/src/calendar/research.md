# Calendar/Date Picker Research
## Features
Target features. Some are essential, others are nice to have. Checked items are already implemented in our component.
- [ ] Date input
- [ ] Date selection via popover calendar view
- [x] Date selection via inline Calendar view
- [ ] Date range input
- [ ] Date range selection via calendar view
- [ ] Multiple non-contiguous date selection via calendar view
- [ ] Keyboard navigation
- [ ] Specify date display format
- [ ] Month view for selecting a day of the month
- [ ] Year view for selecting a month in a given year
- [ ] Multi-year view for selecting a year
- [ ] Month and year dropdowns (alternative to having separate year and multi-year views)
- [ ] Min and max date bounds
- [ ] Min and max date ranges (i.e. minimum hotel stay of 3 days, maximum stay of 14 days)
- [ ] Range presets (i.e. last week, next month, etc.)
- [ ] Today shortcut
- [ ] Required validation
- [ ] Disabled state
- [ ] Read-only state
- [ ] Custom disabling/filtering of available dates via a callback function
- [ ] Show multiple months at a time
- [ ] Input hint (i.e. MM/DD/YYYY)
- [ ] Calendar in popover
- [ ] Confirmation action buttons in the calendar view: i.e. Apply, Cancel
- [ ] Localization

## Research Links
Here are some resources that can inform and inspire our implementation

### Native HTML
HTML includes an `<input type="date" />` [element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date) and the `<input type="datetime-local" />` [element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local). 
Different browsers provide different date picking UIs for these components. These built-in UIs are inconsistent, 
difficult to style, and lacking in features like internationalization. 
For these reasons many applications use a library component or a custom implementation.

## Official accessibility guidance:
The [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/) 
provides an example of how to implement a date picker dialog:
> a date input field and a button that opens a date picker that implements the Dialog (Modal) Pattern. The dialog 
contains a calendar that uses the grid pattern to present buttons that enable the user to choose a day from the 
calendar. Choosing a date from the calendar closes the dialog and populates the date input field. When the dialog is 
opened, if the input field is empty, or does not contain a valid date, then the current date is focused in the calendar. 
Otherwise, the focus is placed on the day in the calendar that matches the value of the date input field.

The guide also provides a [Combobox Date Picker example](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-datepicker/)
that is worth consulting.

### Other component libraries:
- [Ark UI Date Picker](https://ark-ui.com/react/docs/components/date-picker)
  - Ark UI provides a Date Picker component that supports single, multiple, and range date selection.
  - It includes month and year views for day and month selection, respectively.
  - Highly composable
- [corvu](https://corvu.dev/docs/primitives/calendar/)
  - >This calendar is designed to be simple and lightweight. It handles functionality and accessibility to cover the 
  common use cases but leaves things like internationalization and more individual behavior up to the user to implement.
  - Can specify number of months to show at a time
- [React Aria](https://react-spectrum.adobe.com/react-aria/DatePicker.html)
  - React Aria has five separate date components: DateField for the input, Calendar for single date selection, 
  DatePicker for the combination of DateField and Calendar, RangeCalendar for selecting a range, and DateRangePicker for
  the combination of DateField and RangeCalendar. This is a composable approach and avoids having to handle various 
  modes within a single component.
  - [DateField](https://react-spectrum.adobe.com/react-aria/DateField.html) has a pleasant user experience. It breaks 
  the input into three parts: month, day, and year. Each has a clear placeholder and the ability to increment/decrement 
  the value using the up and down arrows.
  - Strong Internationalization support with the help of [@internationalized/date](https://www.npmjs.com/package/@internationalized/date)
  - Can specify the first day of the week
- [flux Date Picker](https://fluxui.dev/components/date-picker) and [Calendar](https://fluxui.dev/components/calendar)
  - Flux is a styled component library for Laravel with fully-featured Date Picker and Calendar components. It is 
  a good source of inspiration for potential features to include in our component(s).
- [Angular Material Date Picker](https://material.angular.io/components/datepicker/overview)
  - Fully-featured, styled Date Picker and Calendar component. It would probably take months to implement a calendar 
  component from scratch with all the features included in this component.
  - Has month, year, and multi-year views with the ability to specify which view appears initially
  - Has custom filtering of available dates
  - Can be used for year-only selection or year-month selection in addition to date selection
  - Supports confirmation action buttons in the calendar view: i.e. Apply, Cancel
  - Supports different Date implementations, i.e. JS Date, Moment, Luxon, and custom implementations
  - Robust internationalization support
  - Touch UI mode
  - Keyboard navigation
  - Accessibility support: 
    - popup uses the `role="dialog"` interaction pattern and the calendar uses `role="grid"`.
    - They recommend using buttons to apply/cancel a selection:
    > Always enable confirmation action buttons. This allows assistive technology users to explicitly confirm their selection before committing a value.

Some comparable headless component libraries have no calendar component. These include: 
[Ariakit](https://ariakit.org/components) [Dice UI](https://www.diceui.com/), [Kobalte](https://kobalte.dev/), [Base UI](https://base-ui.com/),
[HeadlessUI](https://headlessui.com/), [Radix UI](https://www.radix-ui.com), [melt](https://next.melt-ui.com/).

### Date utility libraries
We need to consider whether or not to use a third-party library for date parsing, formatting, validation, manipulation, etc.

In my experience, few time-oriented web development teams build exclusively with the native JS Date object.

This comment from the @internationalized/date docs seems summarizes it:
> By default, JavaScript represents dates and times using the [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object. However, Date has many problems, including a very difficult to use API, lack of all internationalization support, and more. The [Temporal](https://tc39.es/proposal-temporal/docs/index.html) proposal will eventually address this in the language

As of now Temporal [has almost zero browser support](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal#browser_compatibility), and no clear expected date.

If we do use a library, here are some options:

- [date-fns](https://date-fns.org/)
  - Modular, immutable, TypeScript-first date utility library with excellent tree-shaking support.
- [dayjs](https://day.js.org/)
  - Minimalist library with a Moment.js-compatible API but much smaller size.
- [Luxon](https://moment.github.io/luxon/)
  - Powerful, immutable date library with built-in timezone handling from the same team that maintains Moment.js.
- [@internationalized/date](https://www.npmjs.com/package/@internationalized/date)

Of these, I think date-fns is the best option for our needs, since it's TypeScript, immutable, and tree-shakeable.

For Internationalization, we can likely use the browser's native [Intl.DateTimeFormat API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat), which is widely supported.

## Component Structure
- Root
  - Header
    - Previous
    - Title
    - Next
  - Grid
    - GridDay

## Keyboard Interactions
- Arrow keys, page up/down, home/end for navigation within the calendar grid
(cf. [ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/))

## Attributes
- The calendar itself should have `aria-roledescription="datepicker"` to inform screen readers of the component's purpose.
- Month view:
  - The month element should have `role="grid"`.
  - The day elements should have `role="gridcell"`.
- Year view:
  - The year element should have `role="grid"`.
  - The month elements should have `role="gridcell"`.

## Use Cases
- Travel booking
- Appointment scheduling
- Data filtering by date or date range
- Date of birth (although calendar views can be unwieldy for birthdays)

## CSS Considerations
Implementer needs to create their own CSS to handle placement and styling of the calendar elements. See examples.

## API Design

## Known Issues

## Questions
- Will we use native JS Date functionality for date parsing and formatting, or a third-party library, or a combo?
- What specific localization and internationalization features should we include?
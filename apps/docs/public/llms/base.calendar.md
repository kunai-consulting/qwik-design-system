# Base Calendar

Accessible via: `/base/calendar`

> TODO: Add description.

import api from "./code-notate/api.json";

# Calendar
A customizable date picker that helps users select dates through an intuitive grid interface.
<Showcase name="hero" />
## Features
<Features api={api} />
## Anatomy 
<AnatomyTable api={api} />
## Examples
### Basic Usage
The calendar component provides a simple way to implement date selection functionality. The example below shows the basic setup with core components and date change handling.
<Showcase name="hero" />
This example demonstrates:
- Using `Calendar.Root` as the main container with `locale` set to "en" by default
- `Calendar.Header` containing navigation buttons and month/year display
- `Calendar.Grid` for the calendar layout with `Calendar.GridDay` for individual date cells
- Date selection handling through `onDateChange$` prop
- Visual feedback for selected dates using `data-selected` and current date with `data-current`
Key props used:
- `onDateChange$`: Callback fired when a date is selected
- `data-selected`: Indicates the currently selected date
- `data-current`: Highlights the current date
- `class`: Custom styling applied to various components
The calendar supports full keyboard navigation and follows WAI-ARIA calendar design patterns for accessibility.
Note: Since there are no additional examples available in the provided list, I cannot document other sections like Visual Features or Advanced Usage. The documentation is limited to the basic usage example shown in the hero showcase.

## Component State
### Using Component State
The Calendar component's state can be controlled through several props on the `Calendar.Root` component:
1. **Default Date**
Set the initial date to display when the calendar loads using the `defaultDate` prop:
```tsx
<Calendar.Root defaultDate="2024-03-15">
  {/* Calendar content */}
</Calendar.Root>
```
2. **Selected Date**
Track the currently selected date using the `date` prop:
```tsx
<Calendar.Root date={selectedDate}>
  {/* Calendar content */}
</Calendar.Root>
```
3. **Display Options**
Control what information is shown in the calendar:
```tsx
<Calendar.Root 
  showWeekNumber={true}  // Show week numbers
  showDaysOfWeek={true}  // Show day names header
  fullWeeks={true}       // Show complete weeks including adjacent month days
>
  {/* Calendar content */}
</Calendar.Root>
```
### State Interactions
The Calendar provides ways to respond to date selection through event handlers:
1. **Date Selection**
Listen for date changes using the `onDateChange$` prop on either the `Calendar.Root` or `Calendar.GridDay` components:
```tsx
<Calendar.Root
  onDateChange$={(date) => {
    console.log('Selected date:', date);
  }}
>
  {/* Calendar content */}
</Calendar.Root>
```
As shown in the hero example, you can track the selected date in your application state:
```tsx
const selectedDate = useSignal<LocalDate>();
<Calendar.GridDay
  onDateChange$={$((date) => {
    selectedDate.value = date;
  })}
/>
```
2. **Popover State**
Control the calendar popover's open state using the `bind:open` prop:
```tsx
const isOpen = useSignal(false);
<Calendar.Root bind:open={isOpen}>
  {/* Calendar content */}
</Calendar.Root>
```
The calendar component maintains its own internal state for:
- Current month/year being displayed
- Date currently in focus
- Navigation between months
- Keyboard navigation within the calendar grid
These aspects are handled automatically by the component and don't require manual management.

Based on the provided implementation and examples, I'll document the Calendar component's configuration options.
## Core Configuration
### Locale and Date Format
The Calendar component supports localization through the `locale` prop on `Calendar.Root`. Currently, it supports:
- Default locale: `"en"`
- Date format: `YYYY-MM-DD`
As shown in the hero example above, the calendar uses the default English locale for month names, weekday labels, and date formatting.
### Initial Date Selection
The calendar can be configured with:
- `defaultDate`: Sets the initial focused date (defaults to current date)
- `date`: Controls the currently selected date
- `showDaysOfWeek`: Controls visibility of weekday headers (defaults to `true`)
- `showWeekNumber`: Enables week number display (defaults to `false`)
### Week Display
The calendar provides two week display modes controlled by the `fullWeeks` prop:
```typescript
type WeekDisplayProps = {
  // When true, shows complete weeks including days from adjacent months
  fullWeeks?: boolean; // default: false
}
```
## Advanced Configuration
### Date Change Handling
The calendar supports date selection handling through:
```typescript
type DateChangeProps = {
  onDateChange$?: (date: LocalDate) => void;
}
```
Where `LocalDate` is typed as:
```typescript
type LocalDate = `${number}-${number}-${number}`;
```
### Grid Customization
The calendar grid can be customized through:
- `buttonProps`: Props to be spread onto each date button
- Custom day cell rendering through `Calendar.GridDay`
### Technical Constraints
1. Date Format Validation
   - Dates must follow the `YYYY-MM-DD` format
   - Invalid formats will throw an error during initialization
2. Month Navigation
   - Month navigation is handled internally
   - Year boundaries are automatically managed when navigating between December and January
3. Focus Management
   - Focus is automatically managed within the calendar grid
   - Only one date cell is focusable at a time (tabIndex management)
   - Focus is preserved during month navigation
The calendar maintains internal state for:
- Current month/year being displayed
- Selected date
- Focused date
- Week number calculations (when enabled)





<APITable api={api} />
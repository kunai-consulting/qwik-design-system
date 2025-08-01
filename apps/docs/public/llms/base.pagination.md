# Base Pagination

Accessible via: `/base/pagination`

> TODO: Add description.

import api from "./code-notate/api.json";

# Pagination
Navigate through large sets of data with numbered pages and controls.
<Showcase name="hero" />
## Features
<Features api={api} />
## Anatomy
<AnatomyTable api={api} />
## Examples
### Basic Usage
The most basic pagination setup requires `totalPages` and `pages` props to define the range of pages available.
<Showcase name="basic" />
The `totalPages` prop determines the total number of pages, while the `pages` array provides the actual page numbers to display. The `currentPage` prop sets which page is initially active.
### Visual Features
#### Disabled State
Pages can be disabled to prevent interaction when at boundaries or based on conditions.
<Showcase name="disabled" />
The `isDisabled` prop on `Pagination.Page` disables individual pages, while the `disabled` prop on `Pagination.Root` disables the entire pagination component.
#### Ellipsis Display
Customize how page gaps are displayed using ellipsis.
<Showcase name="ellipsis" />
The `ellipsis` prop on `Pagination.Root` allows customization of the gap indicator between page numbers.
#### First and Last Navigation
Add quick navigation to the start and end of the pagination range.
<Showcase name="first-last" />
The `isFirst` and `isLast` props on `Pagination.Previous` and `Pagination.Next` respectively enable first/last page navigation.
### Advanced Usage
#### Keyboard Navigation
Enable full keyboard control for accessibility.
<Showcase name="keyboard" />
Arrow keys navigate between pages, while Home/End keys jump to first/last pages. The component handles focus management automatically.
#### Custom Page Length
Control how many pages are displayed at once.
<Showcase name="length" />
The `totalPages` prop determines the overall number of pages, while `siblingCount` controls how many adjacent pages are shown.
#### Sibling Count
Adjust how many pages appear on either side of the current page.
<Showcase name="siblings" />
The `siblingCount` prop determines how many page numbers are visible before and after the current page.

## Component State
### Using Component State
The Pagination component offers several ways to control its state through props and events:
1. **Current Page Control**
As shown in the `page` example above, you can set the initial page using the `currentPage` prop on `Pagination.Root`. For reactive control, use the `bind:page` prop which accepts a signal.
2. **Total Pages**
The `totalPages` prop determines the total number of pages available for navigation, as demonstrated in the `length` example above.
3. **Disabled State**
As shown in the `disabled` example above, the entire pagination can be disabled by setting the `disabled` prop on `Pagination.Root`. This will prevent all user interactions with the component.
### State Interactions
1. **Page Change Events**
The component provides an `onPageChange$` prop to handle page navigation events:
```typescript
<Pagination.Root
  totalPages={10}
  onPageChange$={(page: number) => {
    // Handle page change
    console.log(`Navigated to page ${page}`);
  }}
>
  {/* ... */}
</Pagination.Root>
```
2. **Navigation Controls**
As demonstrated in the `first-last` example above, you can control navigation behavior using the `isFirst` and `isLast` props on the `Previous` and `Next` components respectively.
3. **Sibling Pages**
The `siblingCount` prop controls how many page numbers are shown on either side of the current page, as shown in the `siblings` example above. This helps manage the pagination's visual state when dealing with large numbers of pages.
4. **Custom Ellipsis**
As shown in the `ellipsis` example above, you can customize the appearance of truncated pages using the `ellipsis` prop on `Pagination.Root`.
The pagination state is automatically managed to ensure:
- Previous/Next buttons are disabled at boundaries
- Current page is highlighted
- Correct page range is displayed based on current selection
- Proper ellipsis placement for large page counts

Based on the provided implementation and examples, I'll document the configuration options for the Pagination component.
## Core Configuration
### Page Management
The Pagination component requires essential configuration for managing page counts and navigation:
- `totalPages`: Required number that sets the total available pages
- `currentPage`: Optional initial page number (defaults to 1)
- `pages`: Required array of page numbers to display
As shown in the `basic` example above, these props work together to create the foundation of the pagination:
> The `currentPage` will automatically be constrained between 1 and `totalPages`
### Sibling Pages
The component supports configurable sibling pages through the `siblingCount` prop:
- Controls how many page numbers appear on each side of the current page
- Defaults to 1 if not specified
- Must be a non-negative number
As shown in the `siblings` example above, increasing `siblingCount` displays more adjacent page numbers.
### Ellipsis Display
The ellipsis configuration determines how page gaps are displayed:
- `ellipsis`: Optional custom element to replace the default "..." display
- Automatically appears when there are too many pages to display
- Intelligently positioned based on current page location
As shown in the `ellipsis` example above, you can customize the ellipsis display.
## Advanced Configuration
### Controlled State
The component supports controlled state management through:
- `bind:page`: Signal to control the current page externally
- `onPageChange$`: Event handler called when page changes
As shown in the `page` example above, these props enable external state control.
### Navigation Controls
Additional navigation options can be configured:
- `isFirst`: Boolean prop on `<Pagination.Previous />` to jump to first page
- `isLast`: Boolean prop on `<Pagination.Next />` to jump to last page
As shown in the `first-last` example above, these enable quick navigation to boundaries.
### Disabled State
The pagination supports complete disabling:
- `disabled`: Boolean prop to disable all pagination interactions
- Automatically disables boundary navigation when at first/last page
As shown in the `disabled` example above, this controls the interactive state of the entire component.
> When disabled, all interactive elements receive the `disabled` attribute and appropriate ARIA states





<APITable api={api} />
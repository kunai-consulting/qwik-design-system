# Table Research
## Features
Target features. Some are essential, others are nice to have. Checked items are already implemented in our component.
- [ ] Display data in a table with headings
- [ ] Sorting
  - [ ] Ascending and descending by a single column
  - [ ] Multiple column sorting
- [ ] Filtering
- [ ] Pagination
- [ ] Toggle column visibility
- [ ] Row selection (single and multiple)
- [ ] Drag and drop column reordering
- [ ] Drag and drop row reordering
- [ ] Column resizing
- [ ] Row action callback
- [ ] Row disabling
- [ ] Virtual scrolling
- [ ] Empty state
- [ ] Loading state

## Research Links
Here are some resources that can inform and inspire our implementation

### Native HTML
The React Aria docs [say it well](https://react-spectrum.adobe.com/react-aria/Table.html):
> A table can be built using the \<table>, \<tr>, \<td>, and other table specific HTML elements, but is very limited in 
functionality especially when it comes to user interactions. HTML tables are meant for static content, rather than 
tables with rich interactions like focusable elements within cells, keyboard navigation, row selection, sorting, etc.

## Official accessibility guidance:
The ARIA Authoring Practices Guide has guidance for [tables](https://www.w3.org/WAI/ARIA/apg/patterns/table/) and 
[grids](https://www.w3.org/WAI/ARIA/apg/patterns/grid/). The primary difference between the two is that tables are
used for static tabular data, while grids are used for interactive widgets where every table cell is interactable.
Data grids can be used appropriately for _interactive_ or _editable_ tabular data.

This component will focus on the table pattern rather than the grid pattern(?).

Tables should have `role="table"`, while grids should have `role="grid"`.

While a table can be implemented with many different HTML elements in combination with the relevant ARIA roles, 
the ARIA Authoring Practices Guide recommends using the native `<table>` elements whenever possible.

### Other component libraries:
- [Dice UI](https://www.diceui.com/docs/components/data-table)
  - > A powerful and flexible data table component for displaying, filtering, sorting, and paginating tabular data.
  - Data model: an array of data objects, and an array of column objects. Each column has a key to a property on the 
  data object, metadata, sort/filter-related properties, and header and cell properties that take JSX for how to display.
  - Does sorting, filtering, and pagination, including sorting by multiple columns
  - Supports dragging and dropping columns to reorder them.
  - Uses native HTML `<table>` elements, and does not use `role="grid"` or other ARIA roles.
- [React Aria](https://react-spectrum.adobe.com/react-aria/Table.html)
  - Extensive API and feature set
  - Uses native HTML `<table>` elements, but sets `role="grid"` and follows the ARIA **Grid** Pattern.
  - Supports drag and drop row reordering, but not drag and drop column reordering.
- [flux](https://fluxui.dev/components/table)
  - Flux is a styled component library for Laravel...
- [Angular Material](https://material.angular.dev/components/table/overview)
  - Fully-featured, styled Table component...

Some comparable headless component libraries have no calendar component. These include: 
- [Ariakit](https://ariakit.org/components)
- [Ark UI](https://ark-ui.com/)
- [Melt UI](https://www.melt-ui.com/)
- [Kobalte](https://kobalte.dev/)
- [Base UI](https://base-ui.com/)
- [HeadlessUI](https://headlessui.com/)
- [Radix UI](https://www.radix-ui.com)
- [corvu](https://corvu.dev/docs/primitives/calendar/)

## Component Structure
- Root
  - 

## Keyboard Interactions
- 

## Attributes
- 

## Focus Management
- 

## Use Cases
- Data analysis
- Data visualization
- Inventory management
- Administration of data

## CSS Considerations

## Known Issues

## Questions
- Focus on the table patter or the grid pattern?
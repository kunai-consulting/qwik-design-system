# Table Research
## Features
Target features. Some are essential, others are nice to have. Checked items are already implemented in our component.
- [ ] Display data in a table with headings, body, and footer
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

## Research Links
Here are some resources that can inform and inspire our implementation

### Native HTML
[MDN article on HTML tables](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table)

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

The table element should have an aria-label or aria-labelledby attribute that provides a human-readable label for 
the table.

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
  - Relatively simple feature set including sorting, filtering, and pagination.
- [Angular Material](https://material.angular.dev/components/table/overview)
  - Table component that focuses on performance and accessibility. The basic table does not include sorting, filtering, selection,
  or pagination, but it provides optional tools for adding these features.
  - Paginator is a separate component, but can be easily integrated with the table.
  - Sets `role="table"` on the table by default. The developer can easily override this by setting `role="grid"` or 
  `role="treegrid"` on the table element.
  - Developers can use native HTML `<table>` elements plus Material directives or use the Material components directly for a flex layout.
- [Material UI Table](https://mui.com/material-ui/react-table/)
  - Offers both styled and unstyled versions of the table component.
  - Can use in conjunction with an external library (`react-virtuoso`) for row virtualization.
- [Material UI Data Grid](https://mui.com/x/react-data-grid/)
  - Grid implementation with a less-composable API with tons of props.
- [shadcdnd](https://ui.shadcn.com/docs/components/table)
  - 

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
  - Table
    - Caption
    - Header
      - Row
        - Cell
    - Body
      - Row
        - Cell 
    - Footer
      - Row
        - Cell
  - Pagination

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
- Focus on the table pattern or the grid pattern?
- Should the root correspond to the table element or a container div?
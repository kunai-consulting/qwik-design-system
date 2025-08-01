# Base Menu

Accessible via: `/base/menu`

> TODO: Add description.

import api from "./code-notate/api.json";

# Menu
A menu that appears below a trigger button, containing selectable options for user interaction.
<Showcase name="hero" />

## Features
<Features api={api} />

## Anatomy
<AnatomyTable api={api} />

## Examples

### Basic Usage
The menu provides a simple way to show a list of selectable options. The menu opens when clicking the trigger button and closes when selecting an item or clicking outside.

<Showcase name="hero" />
This example demonstrates:
- Using `Menu.Root` as the container
- `Menu.Trigger` to toggle the menu
- `Menu.Content` to wrap menu items
- `Menu.Item` for selectable options
- `Menu.ItemLabel` for item text content

### Open State Callbacks
Track the menu's open state using the `onOpenChange$` callback.
<Showcase name="callbacks" />
This example highlights:
- `onOpenChange$` prop to monitor open/close state
- `open` prop for controlled state management

### Item Selection Behavior
Control whether items close the menu on selection using the `closeOnSelect` prop.
<Showcase name="close-on-select" />
This example demonstrates:
- `closeOnSelect={false}` to keep menu open after selection
- Default behavior where items close the menu when selected
- `disabled` prop to make items non-interactive

### Submenu Functionality
Menus now support nested submenus for more complex menu structures. Use `Menu.Submenu` to wrap a submenu, `Menu.SubmenuTrigger` to provide the trigger item, and `Menu.SubmenuContent` for the submenu's content.

<Showcase name="submenu" />
This example demonstrates:
- Creating a submenu inside a menu
- Using `Menu.SubmenuTrigger` to open the submenu
- Keyboard navigation and focus management between root and submenu items

### Multi-level Submenus
You can nest submenus to any depth, allowing for complex menu hierarchies. Each submenu manages its own open state and keyboard navigation, and focus is managed across all levels.

<Showcase name="submenu-multilevel" />
This example demonstrates:
- Multiple levels of nested submenus
- Keyboard navigation between root, first-level, and second-level submenu items
- Each submenu trigger opens its own submenu and returns focus to the correct trigger when closed

### With Checkbox
<Showcase name="with-checkbox" />
This example demonstrates:
- Usage of the headless checkbox component

### With Radio Group
<Showcase name="with-radio-group" />
This example demonstrates:
- Usage of the headless radio group component

### Context Menu
<Showcase name="context-menu" />
This example demonstrates:
- Using `Menu.ContextTrigger` to create a right-click context menu
- Menu automatically positions itself at the cursor location
- Subsequent right-clicks reposition the menu without closing it
- Context menu stays open until an item is selected, Escape is pressed, or clicking outside

## Component State

### State Management
The menu's open state can be controlled in two ways:
1. Uncontrolled state using the `open` prop:
```typescript
<Menu.Root open={false}>
  <Menu.Trigger>Menu</Menu.Trigger>
  <Menu.Content>...</Menu.Content>
</Menu.Root>
```
2. Controlled state using bind:open prop to bind the menu's open state to a reactive value.
The menu automatically manages its open state in response to:
- Clicking the trigger button (toggles open/closed)
- Selecting an item (closes by default)
- Clicking outside (closes)
- Pressing Escape (closes)

### Item Interaction
Items can be configured in several ways:
- **Selection Behavior:** Use `closeOnSelect` prop to control whether the menu closes after item selection
- **Disabled State:** Use the `disabled` prop to make items non-interactive. Disabled items:
  - Cannot be selected or receive focus
  - Are skipped during keyboard navigation
  - Have `tabIndex={-1}`
  - Have appropriate ARIA attributes
  - Will not trigger `onSelect$` handler

## Core Configuration
### Menu Structure
The Menu component requires a specific component hierarchy:
```typescript
<Menu.Root>
  {/* Choose one of these trigger types */}
  <Menu.Trigger />        {/* Click trigger */}
  <Menu.ContextTrigger /> {/* Right-click trigger */}
  
  <Menu.Content>
    <Menu.Item>
      <Menu.ItemLabel />
    </Menu.Item>
  </Menu.Content>
</Menu.Root>
```
Each component serves a specific purpose:
- `Root`: Manages state and context for the menu
- `Trigger`: The button that toggles the menu
- `ContextTrigger`: Area that responds to right-clicks to open the menu as a context menu
- `Content`: The container for menu items
- `Item`: Individual selectable options
- `ItemLabel`: Text or content within items

### Context Menu Setup
To create a context menu that appears on right-click:
```typescript
<Menu.Root>
  <Menu.ContextTrigger>
    Right-click me!
  </Menu.ContextTrigger>
  <Menu.Content>
    {/* Menu items */}
  </Menu.Content>
</Menu.Root>
```
The context menu automatically:
- Positions itself at the cursor location
- Stays open until deliberately dismissed
- Repositions with subsequent right-clicks
- Prevents browser's native context menu

## Technical Constraints

### Positioning
The menu positioning is handled by the underlying Popover component. The content will automatically position
itself relative to the trigger button, adjusting for available viewport space.

### Focus Management
The component maintains a strict focus management system:
- Focus is trapped within the menu when open
- Arrow keys navigate between enabled items only
- Home/End keys move focus to first/last enabled items
- Focus returns to trigger when closed

These behaviors are built into the component and cannot be disabled to maintain accessibility compliance.





<APITable api={api} />
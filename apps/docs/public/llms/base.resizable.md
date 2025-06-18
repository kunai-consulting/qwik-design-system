# Base Resizable

Accessible via: `/base/resizable`

> TODO: Add description.

import api from "./code-notate/api.json";

# Resizable
A draggable divider that allows users to adjust the size of adjacent sections.

<Showcase name="hero" />

## When to use Resizable

Resizable is ideal when:
- Users need to customize layout proportions
- Content sections need flexible sizing
- Space allocation needs to be adjustable
- Complex layouts require nested resize capabilities

Real-world examples:
- Code editors with adjustable content
- File explorers with resizable navigation
- Dashboard layouts with customizable widgets
- Documentation sites with adjustable sidebars
- Chat applications with flexible content
- Data tables with resizable columns

## Features
<Features api={api} />

## Anatomy
<AnatomyTable api={api} />

## Examples

### Basic Usage
Start with this example if you're new to Resizable. It shows the minimal setup needed for a functional component.

<Showcase name="hero" />

This example demonstrates:
- Basic content structure
- Handle placement
- Size constraints
- Default horizontal orientation

```tsx
<Resizable.Root>
  <Resizable.Content width={200} minWidth={100} maxWidth={500}>
    <div>Left Content</div>
  </Resizable.Content>
  <Resizable.Handle />
  <Resizable.Content minWidth={150}>
    <div>Right Content</div>
  </Resizable.Content>
</Resizable.Root>
```
### Vertical Layout
Change the resize direction to vertical for stacked layouts.
<Showcase name="vertical" />

### Collapsible Content
Enable content collapsing with customizable thresholds and sizes.
<Showcase name="collapsible" />

This demonstrates:
-	Collapse functionality
-	Custom collapse thresholds
-	Collapse/expand callbacks
-	Visual feedback

### Nested Layouts
Create complex layouts by nesting resizable components.
<Showcase name="custom" />

### State Management
Track and respond to content size changes.
<Showcase name="callback" />

### Disabled State
Prevent resizing when needed.
<Showcase name="disabled" />

## Keyboard Navigation
The component supports full keyboard interaction:
-	Tab: Focus the handle
-	Arrow keys: Adjust content sizes
-	Shift + Arrow: Larger size adjustments
-	Home/End: Collapse/expand contents
-	Enter/Space: Toggle collapse (for collapsible contents)

## Accessibility
Built following the WAI-ARIA window splitter pattern, including:
-	Proper role attributes
-	ARIA states
-	Keyboard navigation
-	Focus management
-	Screen reader announcements
- Pointer capture for smooth dragging

## Styling
The component uses data attributes for styling:
```css
[data-qds-resizable-root] {
  /* Root styles */
}

[data-qds-resizable-handle][data-dragging="true"] {
/* Handle drag state */
}

[data-qds-resizable-content][data-collapsed="true"] {
/* Collapsed content state */
}
```



<APITable api={api} />

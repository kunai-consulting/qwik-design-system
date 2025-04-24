# Toast Research
The toast component will leverage our [popover component](https://qwik.design/base/popover/) and build on top of it.

## Resources
- [Toast API Example](https://www.agnosui.dev/latest/api/react/headless/components/toast)
- [Ark Toast Example](https://ark-ui.com/docs/components/toast)
- [Base-ui Toast & Toaster](https://base-ui.com/react/components/toast)
- [Toaster Example and Usage inspiration](https://kobalte.dev/docs/core/components/toast)
- [Toaster Accessibility Example](https://www.radix-ui.com/primitives/docs/components/toast#accessibility)

## Features
- [ ] `Auto-dismiss` - Automatically close after configurable duration
- [ ] `Pause on hover/focus` - Stop timer when user interacts

## Component Structure
- `Toaster.Root` 
- `Toaster.Trigger`
- `Toaster.Item`
- `Toaster.ItemTitle`
- `Toaster.ItemDescription`
- `Toaster.ItemClose`

## Keyboard Interactions
- `Escape` - Dismiss the currently focused toast
- `Tab` - Navigate between interactive elements in the toast
- `Enter/Space` - Activate buttons (close, action buttons)

## Attributes
- role="status" for non-critical toasts (informational), applies an implicit aria-live='polite'
- role="alert" for critical notifications (errors, warnings), applies an implicit aria-live='assertive'
- [data-state] "open" or "close" to describe the visual state of the component.

## Use Cases
- System notifications - Updates about system state
- [User action confirmation - Saved, deleted, updated messages](https://cedar.rei.com/components/toast)
- [Temporary alerts - Information that doesn't require action](https://blueprintjs.com/docs/#core/components/toast)

## CSS Considerations
- Implementer needs to create their own CSS to handle placement and styling of checkboxes and labels.

## API Design
```
Toaster.Root:
- defaultDuration -> Default duration (in ms) before toasts auto-dismiss
- pauseOnHover -> Whether to pause dismiss timer on hover

Toaster.Trigger:
- id -> Unique identifier for the target toast item
- type -> Toast type ('success', 'error', 'info', 'warning')
- action -> Action to perform ('show', 'hide', 'toggle')

Toaster.Item
- id -> Unique identifier for the toast
- type -> Toast type ('success', 'error', 'info', 'warning')
- duration -> Time (in ms) before auto-dismissal (overrides Root default)
- dismissible -> Whether the toast can be dismissed manually
- onDismiss$ -> QRL function called when toast is dismissed

Toaster.ItemTitle
- id -> Optional ID for ARIA relationships

Toaster.ItemDescription
- id -> Optional ID for ARIA relationships

Toaster.ItemClose
- onClick$ -> QRL function called when close button is clicked
- label -> Accessibility label for close button (default: "Close")
```
## Known Issues

## Questions

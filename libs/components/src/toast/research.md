# Toast Research
The toast component will leverage our [popover component](https://qwik.design/base/popover/) and build on top of it.

## Resources
- [Ark Toast Example](https://ark-ui.com/docs/components/toast)
- [Toaster Example and Usage inspiration](https://kobalte.dev/docs/core/components/toast)
- [Toaster Accessibility Example](https://www.radix-ui.com/primitives/docs/components/toast#accessibility)
- [Toaster toaster example](https://next.melt-ui.com/components/toaster)

## Features
- [ ] `Auto-dismiss` - Automatically close after configurable duration
- [ ] `Pause on hover/focus` - Stop timer when user interacts

## Component Structure
- `Toast.Root` 
- `Toast.Title`
- `Toast.Description`
- `Toast.Close`

## Keyboard Interactions
- `Escape` - Dismiss the currently focused toast
- `Tab` - Navigate between interactive elements in the toast
- `Enter/Space` - Activate buttons (close, action buttons)

## Attributes
- [data-state] "open" or "close" to describe the visual state of the component.

## Use Cases
- System notifications - Updates about system state
- [User action confirmation - Saved, deleted, updated messages](https://cedar.rei.com/components/toast)
- [Temporary alerts - Information that doesn't require action](https://blueprintjs.com/docs/#core/components/toast)

## CSS Considerations


## API Design

## Known Issues

## Questions

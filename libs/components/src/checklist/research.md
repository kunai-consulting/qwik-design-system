# Research Links
Here are some resources that can inform and inspire our implementation

## Native HTML
Source: [MDN article on Checkbox, with an example of handling multiple checkboxes](
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#handling_multiple_checkboxes)

Native HTML form handling uses the `name` attribute and the `value` attribute to set the form values. 
Only checked items with a `name` attribute are included in the form submission. 
If `value` is not set, the value will be set to "on". `value` is treated as a `string`.

Each checkbox can have its own `name`, OR alternatively a set of related checkboxes can be grouped together 
with a common `name`, in which case the name key will be repeated in the form submission for each checked item.

## Official accessibility guidance:
The [ARIA APG Checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) provides guidance related to 
checkboxes as well as checklists. Some notes relevant specifically to checklists:
> If a set of checkboxes is presented as a logical group with a visible label, the checkboxes are included in an element with role group that has the property aria-labelledby set to the ID of the element containing the label.

The pattern document describes two types of checkboxes: dual-state and tri-state. The tri-state checkbox 
can be used in a checklist to signal that some but not all items are checked.

## Other libraries:
- [Ariakit Checkbox Group](https://ariakit.org/examples/checkbox-group)
  - Ariakit does not provide a checklist component, but it provides an example of how to build a checklist using its 
  Checkbox component. The example makes use of the [ARIA role](https://w3c.github.io/aria/#group) `group` to group the 
  checkboxes together, which is something we should consider doing as well. 
  It does not provide a top-level select-all/select-none/mixed control.
- [Ark UI Checkbox Group](https://ark-ui.com/react/docs/components/checkbox#checkbox-group) | [Example](https://ark-ui.com/react/examples/checkbox-group)
  - Ark UI provides a simple Checkbox Group component under the same Checkbox namespace, rather than having a separate 
  namespace for Checklist. It does not provide a top-level select-all/select-none/mixed control either.
- [React Aria](https://react-spectrum.adobe.com/react-aria/CheckboxGroup.html)
  - React Aria has a sophisticated Checkbox Group component including group-level required validation, 
  but again without a top-level select-all/select-none/mixed control.
- [Base UI](https://base-ui.com/react/components/checkbox-group)
    - Base UI has a simple Checkbox Group component. It does not provide a top-level select-all/select-none/mixed control.
- [Dice UI](https://www.diceui.com/docs/components/checkbox-group)
  - Dice's Checkbox Group has a robust validation API and a slick ability to select a range of checkboxes by using the 
  Shift key. It does not provide a top-level select-all/select-none/mixed control.
- [flux](https://fluxui.dev/components/checkbox#check-all)
  - Flux is a styled component library, but it provides a very clean API for optionally including a select-all control.
- [Angular Material](https://material.angular.io/components/checkbox/overview)
  - Fully-featured, styled checkbox component. Example code shows a way to implement select all/none/indeterminate 
  functionality using signals.

Some comparable headless component libraries have no checklist or checkbox group component, and no clear example of a 
checkbox group. These include: [Kobalte](https://kobalte.dev/), [corvu](https://corvu.dev/docs/), 
[HeadlessUI](https://headlessui.com/react/checkbox), 
[Radix UI](https://www.radix-ui.com/primitives/docs/components/checkbox), [melt](https://next.melt-ui.com/).

# Features
- [ ] Handles state for child checkboxes
- [ ] Keyboard navigation
- [ ] Disabled state (group and individual items)
- [ ] Required validation (group and individual items)
- [ ] Custom validation support
- [ ] Form integration
- [ ] Optional Select-all/none/indeterminate control
- [ ] Optional label for the group of checkboxes

# Component Structure
- Root
- SelectAll
  - SelectAllIndicator
- Item
  - ItemTrigger
    - ItemIndicator
  - ItemLabel

# Keyboard Interactions
- Tab for moving focus to the next checkbox
- Shift+Tab for moving focus to the previous checkbox
- Space for toggling the state of an individual checkbox

# Attributes
Most of the important attributes should be handled by the Checkbox component, but we need handle the following in this 
component:
> If a set of checkboxes is presented as a logical group with a visible label, the checkboxes are included in an 
element with role group that has the property aria-labelledby set to the ID of the element containing the label.

Source: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/

# Use Cases
- Multiple choice questionnaires
- Feature selection, i.e. in a software installation or subscription form
- Sign-up form with multiple checkbox options
- TODO List

# CSS Considerations
Implementer needs to create their own CSS to handle placement and styling of checkboxes and labels. See examples.

# API Design

# Known Issues
- The component currently does not provide an affordance for including a label for the group of checkboxes. This should be
added in the future, since it is pattern mentioned in the [ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/).

# Questions


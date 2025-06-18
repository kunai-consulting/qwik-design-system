# Contributing Terminology

Accessible via: `/contributing/terminology`

> TODO: Add description.

# Terminology

Our components are built from smaller pieces, and these pieces have consistent names. Knowing these common names helps you understand how the components work. You can often find these pieces in the code or DOM by looking for attributes like `data-qds-[component]-[part]` (for example, `data-qds-checkbox-trigger`).

## Root

The `Root` is the main box or container for a component. It holds the settings and manages how the component works. It's the outer shell.

**Example:** `<Checkbox.Root>` holds all the other parts of a Checkbox.

## Trigger

The `Trigger` is the part you click or interact with to make something happen, like showing or hiding content, or changing the component's state. It's usually a button.

**Example:** The button you click to open the `Content` part of a Dropdown, or the part you click on a Checkbox or Switch.

*Note:* For the Toggle component, the `Root` *is* the trigger because there aren't other sibling pieces like a dropdown menu.

## Content

The `Content` is the area where the main information or visual part of the component is shown. This is especially used for parts that can appear or disappear.

**Example:** The popup area shown by a Dropdown's `Trigger`, the section opened by a Collapsible's `Trigger`, or the scrollable part inside a Scroll Area.

For floating components (above the page), the `Content` uses a special browser feature (Popover API) to appear on top of everything else. For others (like Collapsible), it just appears normally on the page.

## Item

An `Item` is one thing in a list or group within a component.

**Example:** One choice in a Radio Group (`<RadioGroup.Item>`), one line in a Checklist (`<Checklist.Item>`), or one branch in a Tree (`<Tree.Item>`).

## Indicator

The `Indicator` is a visual sign showing the component's current status (like if it's checked, selected, or something in between).

**Example:** The check mark inside a Checkbox, the dot inside a chosen Radio Group `Item`, or the little marker showing the position on a Slider.

> Each indicator also takes a prop called `fallback`, jsx that can be passed when the indicator is not visible.

## Label

The `Label` is the text name or title for a component, like you'd see next to a checkbox or input field. It helps explain what the component is for and makes it easier to use, especially for screen readers.

**Example:** The text next to a Checkbox or Radio Group.

## Description

The `Description` is extra text that gives more detail or instructions about a component. It often appears near a `Label`.

**Example:** Helpful text under an input field explaining what kind of information to enter.

## Error

The `Error` should only show up when something is wrong, like if you forget to fill out a required field. It only appears when there's an error.

**Example:** Text like "This field is required" showing up next to an empty input field.

We purposely leave the addition of error messages to the developer, to allow integration with any validation or form library.

## HiddenInput

A visually hidden input that is used for form submission.

**Example:** The hidden input associated with a Checkbox that tells a form whether it was checked or not when submitted.

## Thumb

The `Thumb` is the movable part of a component that the user drags or interacts with to change a value or position.

**Example:** The circle you drag on a Slider, the switch toggle itself within a Switch, or the draggable part of a Scroll Area's scrollbar.

## Track

The `Track` is the path or groove along which a `Thumb` moves.

**Example:** The line that the `Thumb` slides along within a Slider.






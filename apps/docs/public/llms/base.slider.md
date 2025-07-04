# Base Slider

Accessible via: `/base/slider`

> TODO: Add description.

import api from "./code-notate/api.json";

# Slider
A customizable input that allows users to select numeric values by dragging a thumb along a track.
<Showcase name="hero" />
## Features
<Features api={api} />
## Anatomy
<AnatomyTable api={api} />
## Examples
### Basic Usage
The most basic slider implementation allows users to select a single value within a range.
<Showcase name="single-default-values" />
The `min` and `max` props define the range (defaulting to 0-100), while `step` controls the increment size (default 1). The `value` prop sets the initial position.
### Visual Features
#### Custom Styling
The slider can be visually customized through CSS classes and inline styles.
<Showcase name="custom-styles" />
In this example, we customize the thumb's appearance using inline styles, demonstrating how to modify its `backgroundColor`, `width`, `height`, and `border`.
#### Markers and Labels
Add visual markers and labels to indicate specific values along the track.
<Showcase name="marks" />
The `<Slider.MarkerGroup>` component contains `<Slider.Marker>` elements, each with a `value` prop that determines its position. Labels can be added as children.
### Advanced Usage
#### Range Selection
Create a range slider with two thumbs for selecting a value range.
<Showcase name="range" />
Set `isRange` to `true` and provide an array of two values `[start, end]` to create a range slider.
#### Range with Markers
Combine range selection with markers for a more informative interface.
<Showcase name="range-marks" />
This example shows how to integrate markers with a range slider, providing visual reference points for both thumbs.
#### Callbacks
Track value changes and final selections with callback functions.
<Showcase name="callbacks" />
The `onChange$` prop fires on every value change, while `onChangeEnd$` fires when the user finishes dragging or keyboard navigation.
#### Disabled State
Control the slider's interactive state.
<Showcase name="disabled" />
The `disabled` prop can be a boolean or signal to toggle the slider's interactive state. When disabled, all interactions are prevented.

## Component State
### Using Component State
The Slider component offers flexible state management through its props. Here are the key ways to control the slider's state:
1. **Single Value Mode**
As shown in the "single-default-values" example above, you can control the slider's value using the `value` prop. The slider accepts a number between the `min` and `max` values.
2. **Range Mode**
To enable range selection mode, set the `isRange` prop to `true` and provide an array of two numbers as the `value` prop, representing the start and end values. This is demonstrated in the "range" example above.
3. **Bounds and Steps**
Control the slider's range and granularity with:
- `min`: Set the minimum value (defaults to 0)
- `max`: Set the maximum value (defaults to 100)
- `step`: Define the increment size (defaults to 1)
4. **Disabled State**
As shown in the "disabled" example above, you can disable the slider by setting the `disabled` prop to `true`. This prevents all user interactions with the slider.
### State Interactions
The Slider component provides two main ways to respond to state changes:
1. **Value Changes**
Use the `onChange$` prop to handle immediate value changes:
```typescript
<Slider.Root
  onChange$={(value) => {
    console.log('Value changed:', value);
  }}
>
```
2. **Committed Values**
The `onChangeEnd$` prop is called when the user finishes interacting with the slider (after drag or keyboard navigation):
```typescript
<Slider.Root
  onChangeEnd$={(value) => {
    console.log('Final value:', value);
  }}
>
```
As shown in the "callbacks" example above, both handlers receive either:
- A single number in single-value mode
- An array of two numbers `[start, end]` in range mode
These handlers are useful for:
- Updating external state
- Triggering side effects
- Validating values
- Synchronizing with other components
The state management system ensures that:
- Values stay within the defined `min` and `max` bounds
- Range values maintain their order (start ≤ end)
- Values snap to the nearest step
- The UI updates smoothly during interactions

Based on the provided implementation and examples, I'll document the configuration options for the Slider component.
## Core Configuration
### Value and Range Mode
The Slider can be configured in two modes: single value or range. The core configuration is handled through the `SliderRoot` component.
As shown in the `hero` example above, a basic single-value slider can be created with minimal configuration. By default, it operates with:
- `min`: 0
- `max`: 100
- `step`: 1
- `value`: 0 (single mode) or [0, 100] (range mode)
For range mode, as demonstrated in the `range` example, set `isRange` to true and provide an array of two values:
```typescript
type SliderValue = number | [number, number];
```
### Step Configuration
The slider supports custom step intervals through the `step` prop. As shown in the `marks` example above, you can configure larger step intervals to create discrete value points.
> The step value must be greater than 0 and should evenly divide into the range between min and max for optimal behavior.
### Marker System
The Slider supports a marker system for displaying value points along the track. As shown in the `range-marks` example above, markers can be added with labels to create a more informative slider.
Markers must have values within the slider's min/max range and are positioned automatically based on the percentage calculation:
```typescript
markerPosition = ((value - min) / (max - min)) * 100
```
## Advanced Configuration
### Value Updates and Callbacks
The Slider provides two callback mechanisms:
- `onChange$`: Fires during continuous value changes (dragging)
- `onChangeEnd$`: Fires when value changes are committed
As shown in the `callbacks` example above, these can be used to track both intermediate and final values.
### Disabled State Management
The disabled state can be controlled either through a boolean or a signal. As shown in the `disabled` example above, the slider supports dynamic toggling of the disabled state.
When disabled:
- All user interactions are prevented
- Callbacks are not fired
- ARIA attributes are automatically updated
- Visual styling can be controlled via the `aria-disabled` attribute





<APITable api={api} />
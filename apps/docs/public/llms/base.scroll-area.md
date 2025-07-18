# Base Scroll-Area

Accessible via: `/base/scroll-area`

> TODO: Add description.

import api from "./code-notate/api.json";

# Scroll Area
A customizable container that adds scrollbars when content overflows its boundaries.
<Showcase name="both" />
## Features
<Features api={api} />
## Anatomy 
<AnatomyTable api={api} />
## Examples
### Basic Usage
The scroll area component provides a customizable scrolling experience with different visibility modes for the scrollbars.
The `type` prop controls when scrollbars are visible:
- `"hover"` (default): Shows scrollbars on hover
- `"scroll"`: Shows scrollbars during scrolling
- `"auto"`: Shows scrollbars when content overflows
- `"always"`: Shows scrollbars whenever there's overflow
<Showcase name="vertical" />
### Visual Features
#### Horizontal Scrolling
For content that extends beyond the horizontal bounds, use the `orientation="horizontal"` prop on `ScrollArea.Scrollbar`.
<Showcase name="horizontal" />
#### Both Axes Scrolling
When content overflows in both directions, you can include both vertical and horizontal scrollbars.
<Showcase name="both" />
### Advanced Usage
#### Custom Hide Delay
For scroll-triggered visibility (`type="scroll"`), customize how long scrollbars remain visible after scrolling stops using the `hideDelay` prop (in milliseconds).
<Showcase name="both" />
Note: The examples demonstrate the core functionality of the scroll area component. The `hideDelay` prop (default: 600ms) determines how long scrollbars remain visible after scrolling stops when using `type="scroll"`.

## Component State
The ScrollArea component offers several ways to control its scrollbar visibility and behavior through state management.
### Using Component State
#### Scrollbar Visibility Types
The ScrollArea provides four visibility modes controlled through the `type` prop on `ScrollArea.Root`:
1. **Auto Mode**
Shows scrollbars when content overflows and hides them when it doesn't.
<Showcase name="both" />
2. **Always Mode**
Keeps scrollbars visible whenever content overflows, regardless of user interaction.
3. **Hover Mode**
Shows scrollbars only when the user hovers over the scroll area.
4. **Scroll Mode**
Displays scrollbars only during active scrolling.
#### Hide Delay Configuration
When using the "scroll" visibility type, you can customize how long the scrollbars remain visible after scrolling stops using the `hideDelay` prop:
```tsx
<ScrollArea.Root type="scroll" hideDelay={1000}>
  {/* Content */}
</ScrollArea.Root>
```
### State Interactions
#### Overflow Detection
The ScrollArea automatically detects content overflow and updates its state accordingly. This state is reflected through the `data-has-overflow` attribute on the root element.
#### Scrollbar State
Scrollbars expose their current visibility state through the `data-state` attribute, which can be either "visible" or "hidden". This state updates automatically based on:
- The chosen visibility type
- Content overflow status
- User interactions (hover, scroll)
- Window resize events
- Zoom level changes
#### Thumb Position
The thumb position automatically updates to reflect the current scroll position. You can programmatically control the scroll position through the viewport:
```tsx
const viewport = document.querySelector('[data-qds-scroll-area-viewport]');
if (viewport) {
  viewport.scrollTop = 100; // Scroll vertically
  viewport.scrollLeft = 50; // Scroll horizontally
}
```
#### Drag State
During thumb dragging, the thumb element receives a `data-dragging` attribute that can be used for styling:
```css
[data-qds-scroll-area-thumb][data-dragging] {
  /* Styles for dragging state */
}
```
The ScrollArea maintains the scroll position relative to the drag position, ensuring smooth scrolling even when the cursor moves outside the scrollbar bounds.

Based on the provided implementation and examples, I'll document the ScrollArea configuration options:
## Scrollbar Visibility
### Core Behavior
The ScrollArea component supports four visibility modes controlled by the `type` prop on `ScrollArea.Root`:
- `hover` (default): Shows scrollbars when hovering over the scroll area
- `scroll`: Displays scrollbars during scrolling, then hides after delay
- `auto`: Always shows scrollbars when content overflows
- `always`: Permanently displays scrollbars when content overflows
As shown in the `hover-test` example above, the hover mode provides a clean interface that reveals scrollbars only when needed.
### Hide Delay
For the `scroll` type, you can customize how long scrollbars remain visible after scrolling stops using the `hideDelay` prop:
```typescript
type ScrollAreaRootProps = {
  hideDelay?: number; // milliseconds, defaults to 600
}
```
As shown in the `custom-delay-test` example above, this allows fine-tuning of the scrollbar fade-out timing.
## Scrollbar Configuration
### Orientation Support
ScrollArea supports both vertical and horizontal scrollbars through the `orientation` prop on `ScrollArea.Scrollbar`:
```typescript
type ScrollbarOrientation = "vertical" | "horizontal";
```
As shown in the `both` example above, you can include both orientations simultaneously for content that overflows in both directions.
### Technical Constraints
- Scrollbar visibility is automatically managed based on content overflow
- Thumb size and position are dynamically calculated based on viewport and content dimensions
- Scrollbars maintain position during window resize and zoom operations
- Custom scroll behavior is preserved across browser zoom levels (25% to 500%)
### Performance Considerations
The ScrollArea implements several optimizations:
- Throttled resize handling to prevent excessive recalculation
- Efficient thumb position updates using transform
- Minimal DOM updates during scroll operations
- Lazy initialization of overflow detection
These ensure smooth scrolling performance even with large content areas and frequent updates.





<APITable api={api} />
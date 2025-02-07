export const api = {
  "scroll-area": [
    {
      "Scroll Area Root": {
        "types": [
          {
            "PublicScrollbarVisibility": []
          },
          {
            "PublicRootProps": [
              {
                "comment": "Controls when the scrollbars are visible: 'hover', 'scroll', 'auto', or 'always'",
                "prop": "type",
                "type": "ScrollbarVisibility",
                "defaultValue": "\"hover\""
              },
              {
                "comment": "Delay in milliseconds before hiding the scrollbars when type is 'scroll'",
                "prop": "hideDelay",
                "type": "number",
                "defaultValue": "600"
              }
            ]
          }
        ],
        "inheritsFrom": "div",
        "dataAttributes": [
          {
            "name": "data-type",
            "type": "string",
            "comment": "Defines the scrollbar visibility behavior (hover, scroll, auto, or always)"
          },
          {
            "name": "data-has-overflow",
            "type": "string | undefined",
            "comment": "Indicates whether the content exceeds the viewport dimensions"
          }
        ]
      }
    },
    {
      "Scroll Area Scrollbar": {
        "types": [
          {
            "PublicScrollBarType": [
              {
                "comment": "The orientation of the scrollbar",
                "prop": "orientation",
                "type": "\"vertical\" | \"horizontal\"",
                "defaultValue": "\"vertical\""
              },
              {
                "comment": "Event handler for scroll events",
                "prop": "onScroll$",
                "type": "QRL<(e: Event) => void>"
              }
            ]
          }
        ],
        "inheritsFrom": "div",
        "dataAttributes": [
          {
            "name": "data-orientation",
            "type": "string"
          },
          {
            "name": "data-state",
            "type": "string | undefined",
            "comment": "Indicates the visibility state of the scrollbar (visible or hidden)"
          }
        ]
      }
    },
    {
      "Scroll Area Thumb": {
        "types": [
          {
            "PublicScrollAreaThumb": [
              {
                "comment": "Reference to the thumb element",
                "prop": "ref",
                "type": "Signal<HTMLDivElement | undefined>"
              },
              {
                "comment": "Event handler for when thumb dragging starts",
                "prop": "onDragStart$",
                "type": "PropFunction<(e: MouseEvent) => void>"
              },
              {
                "comment": "Event handler for when thumb is being dragged",
                "prop": "onDragMove$",
                "type": "PropFunction<(e: MouseEvent) => void>"
              },
              {
                "comment": "Event handler for when thumb dragging ends",
                "prop": "onDragEnd$",
                "type": "PropFunction<() => void>"
              }
            ]
          }
        ],
        "inheritsFrom": "div",
        "dataAttributes": [
          {
            "name": "data-dragging",
            "type": "string | undefined",
            "comment": "Indicates whether the thumb is currently being dragged"
          }
        ]
      }
    },
    {
      "Scroll Area View Port": {
        "types": [
          {
            "PublicViewPortProps": [
              {
                "comment": "Event handler for scroll events",
                "prop": "onScroll$",
                "type": "PropFunction<(e: Event) => void>"
              }
            ]
          }
        ],
        "inheritsFrom": "div"
      }
    }
  ],
  "anatomy": [
    {
      "name": "Scroll-area.Root",
      "description": "A root component for scrollable content areas with customizable scrollbar behavior"
    },
    {
      "name": "Scroll-area.Viewport"
    },
    {
      "name": "Scroll-area.Scrollbar",
      "description": "A scrollbar component that can be oriented vertically or horizontally"
    },
    {
      "name": "Scroll-area.Thumb",
      "description": "A draggable thumb component for the scrollbar that handles scroll position"
    }
  ],
  "keyboardInteractions": [
    {
      "key": "ArrowDown",
      "comment": "When focus is on the viewport, scrolls the content vertically downward"
    },
    {
      "key": "ArrowUp",
      "comment": "When focus is on the viewport, scrolls the content vertically upward"
    },
    {
      "key": "ArrowRight",
      "comment": "When focus is on the viewport, scrolls the content horizontally to the right"
    },
    {
      "key": "ArrowLeft",
      "comment": "When focus is on the viewport, scrolls the content horizontally to the left"
    },
    {
      "key": "PageDown",
      "comment": "When focus is on the viewport, scrolls the content down by a larger increment"
    },
    {
      "key": "PageUp",
      "comment": "When focus is on the viewport, scrolls the content up by a larger increment"
    },
    {
      "key": "Home",
      "comment": "When focus is on the viewport, scrolls to the top of the content"
    },
    {
      "key": "End",
      "comment": "When focus is on the viewport, scrolls to the bottom of the content"
    },
    {
      "key": "Tab",
      "comment": "Moves focus to the scrollable viewport region"
    }
  ],
  "features": [
    "Custom scrollbar visibility modes (hover, scroll, auto, always)",
    "Drag and drop thumb scrolling",
    "Click-to-scroll on track",
    "Responsive overflow detection",
    "Automatic thumb size and position updates",
    "Horizontal and vertical scrolling support",
    "Keyboard zoom level handling",
    "Customizable hide delay for scrollbars",
    "WAI-ARIA compliant scrollable region",
    "Smooth thumb position animations"
  ]
};
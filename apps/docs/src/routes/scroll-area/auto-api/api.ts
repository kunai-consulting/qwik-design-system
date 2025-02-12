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
                "type": "PublicScrollbarVisibility",
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
      "name": "ScrollArea.Root",
      "description": "A root component for scrollable content areas with customizable scrollbar behavior"
    },
    {
      "name": "ScrollArea.Viewport"
    },
    {
      "name": "ScrollArea.Scrollbar",
      "description": "A scrollbar component that can be oriented vertically or horizontally"
    },
    {
      "name": "ScrollArea.Thumb",
      "description": "A draggable thumb component for the scrollbar that handles scroll position"
    }
  ],
  "keyboardInteractions": [
    {
      "key": "ArrowDown",
      "comment": "Scrolls the viewport content vertically downward when focus is on the viewport"
    },
    {
      "key": "ArrowUp",
      "comment": "Scrolls the viewport content vertically upward when focus is on the viewport"
    },
    {
      "key": "ArrowRight",
      "comment": "Scrolls the viewport content horizontally to the right when focus is on the viewport"
    },
    {
      "key": "ArrowLeft",
      "comment": "Scrolls the viewport content horizontally to the left when focus is on the viewport"
    },
    {
      "key": "PageDown",
      "comment": "Scrolls the viewport content down by a larger increment when focus is on the viewport"
    },
    {
      "key": "PageUp",
      "comment": "Scrolls the viewport content up by a larger increment when focus is on the viewport"
    },
    {
      "key": "Home",
      "comment": "Scrolls to the top of the viewport content when focus is on the viewport"
    },
    {
      "key": "End",
      "comment": "Scrolls to the bottom of the viewport content when focus is on the viewport"
    },
    {
      "key": "Ctrl/Cmd + 0",
      "comment": "Triggers overflow check when zooming to default level"
    },
    {
      "key": "Ctrl/Cmd + +/=",
      "comment": "Triggers overflow check when zooming in"
    },
    {
      "key": "Ctrl/Cmd + -",
      "comment": "Triggers overflow check when zooming out"
    }
  ],
  "features": [
    "Custom scrollbar visibility modes (hover, scroll, auto, always)",
    "Draggable thumb with smooth scroll tracking",
    "Two-axis scrolling support (vertical and horizontal)",
    "Overflow detection and automatic scrollbar display",
    "Click-to-scroll on track functionality",
    "Zoom level detection and overflow adjustment",
    "WAI-ARIA compliant scrollable region",
    "Scroll position memory during thumb dragging",
    "Configurable scrollbar hide delay",
    "Responsive to window resize events",
    "Cross-browser zoom handling",
    "Dynamic thumb size based on content"
  ]
};
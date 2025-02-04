export const api = {
  "scroll-area": [
    {
      "Scroll Area Root": {
        "types": [],
        "inheritsFrom": "div"
      }
    },
    {
      "Scroll Area Scrollbar": {
        "types": [],
        "inheritsFrom": "div",
        "dataAttributes": [
          {
            "name": "data-orientation",
            "type": "string"
          }
        ]
      }
    },
    {
      "Scroll Area Thumb": {
        "types": [],
        "inheritsFrom": "div",
        "dataAttributes": [
          {
            "name": "data-dragging",
            "type": "string | undefined"
          }
        ]
      }
    },
    {
      "Scroll Area View Port": {
        "types": [],
        "inheritsFrom": "div"
      }
    }
  ],
  "anatomy": [
    {
      "name": "Scroll-area.Root"
    },
    {
      "name": "Scroll-area.Viewport"
    },
    {
      "name": "Scroll-area.Scrollbar"
    },
    {
      "name": "Scroll-area.Thumb"
    }
  ],
  "keyboardInteractions": [
    {
      "key": "ArrowDown",
      "comment": "When focus is on the viewport, scrolls the content down"
    },
    {
      "key": "ArrowUp",
      "comment": "When focus is on the viewport, scrolls the content up"
    },
    {
      "key": "ArrowLeft",
      "comment": "When focus is on the viewport, scrolls the content left"
    },
    {
      "key": "ArrowRight",
      "comment": "When focus is on the viewport, scrolls the content right"
    },
    {
      "key": "PageDown",
      "comment": "When focus is on the viewport, scrolls down by viewport height"
    },
    {
      "key": "PageUp",
      "comment": "When focus is on the viewport, scrolls up by viewport height"
    },
    {
      "key": "Home",
      "comment": "When focus is on the viewport, scrolls to the top of content"
    },
    {
      "key": "End",
      "comment": "When focus is on the viewport, scrolls to the bottom of content"
    },
    {
      "key": "Tab",
      "comment": "Moves focus to the viewport region when tabbing through the page"
    }
  ],
  "features": [
    "Custom scrollbars with draggable thumbs",
    "Horizontal and vertical scrolling support",
    "Accessible keyboard navigation and focus management",
    "Click-to-scroll on track functionality",
    "Smooth thumb position updates during scrolling",
    "ARIA roles and labels for accessibility",
    "Drag and drop scrollbar thumb interaction",
    "Independent scroll tracking for both axes",
    "Proportional thumb sizing based on content",
    "Dynamic scroll ratio calculations"
  ]
};
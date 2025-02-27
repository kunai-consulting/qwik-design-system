export const api = {
  "slider": [
    {
      "Slider Range": {
        "inheritsFrom": "div"
      }
    },
    {
      "Slider Root": {
        "types": [
          {
            "PublicRootProps": []
          }
        ],
        "inheritsFrom": "div"
      }
    },
    {
      "Slider Thumb": {
        "dataAttributes": [
          {
            "name": "data-thumb-type",
            "type": "string | undefined",
            "comment": "Identifies whether the thumb is for the start or end value in range mode"
          }
        ]
      }
    },
    {
      "Slider Tooltip": {
        "types": [
          {
            "PublicTooltipPlacement": [
              {
                "comment": "The placement of the tooltip relative to the thumb. Default is 'top'",
                "prop": "placement",
                "type": "PublicTooltipPlacement",
                "defaultValue": "\"top\""
              }
            ]
          }
        ],
        "dataAttributes": [
          {
            "name": "data-placement",
            "type": "string",
            "comment": "Specifies the placement position of the tooltip relative to the thumb"
          }
        ]
      }
    },
    {
      "Slider Track": {
        "inheritsFrom": "div"
      }
    }
  ],
  "anatomy": [
    {
      "name": "Slider.Root",
      "description": "Root component that provides slider context and handles core slider functionality"
    },
    {
      "name": "Slider.Track",
      "description": "Component that renders the track along which the thumb slides"
    },
    {
      "name": "Slider.Range",
      "description": "Component that displays the filled range between min value and current value"
    },
    {
      "name": "Slider.Thumb",
      "description": "Draggable thumb component that users interact with to change slider values"
    },
    {
      "name": "Slider.Marks",
      "description": "Component that renders marksindicators along the slider track"
    },
    {
      "name": "Slider.Tooltip",
      "description": "Component that displays the current value in a tooltip"
    }
  ],
  "keyboardInteractions": {
    "keys": [
      {
        "key": "ArrowRight",
        "comment": "When focus is on the thumb, increases the value by one step. With Shift key, increases by 10 steps"
      },
      {
        "key": "ArrowLeft",
        "comment": "When focus is on the thumb, decreases the value by one step. With Shift key, decreases by 10 steps"
      },
      {
        "key": "ArrowUp",
        "comment": "When focus is on the thumb, increases the value by one step. With Shift key, increases by 10 steps"
      },
      {
        "key": "ArrowDown",
        "comment": "When focus is on the thumb, decreases the value by one step. With Shift key, decreases by 10 steps"
      },
      {
        "key": "Home",
        "comment": "When focus is on the thumb, sets the value to the minimum allowed value"
      },
      {
        "key": "End",
        "comment": "When focus is on the thumb, sets the value to the maximum allowed value"
      },
      {
        "key": "Tab",
        "comment": "Moves focus to the next focusable element"
      }
    ]
  },
  "features": [
    "WAI ARIA Slider design pattern compliance",
    "Single and range modes with multiple thumbs",
    "Keyboard navigation with arrow keys, Home/End",
    "Custom step sizes with Shift key modifier",
    "Customizable marks with labels",
    "Drag and drop thumb control",
    "Optional tooltips with flexible positioning",
    "Disabled state support",
    "Progress track visualization",
    "Touch and pointer events support",
    "Value change callbacks (continuous and end)",
    "Min/max bounds enforcement",
    "Customizable styling per component part"
  ]
};
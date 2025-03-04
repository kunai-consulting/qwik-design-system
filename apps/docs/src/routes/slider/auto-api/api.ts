export const api = {
  "slider": [
    {
      "Slider Marker Group": {
        "inheritsFrom": "div"
      }
    },
    {
      "Slider Range": {
        "inheritsFrom": "div"
      }
    },
    {
      "Slider Root": {
        "types": [
          {
            "PublicDivProps": [
              {
                "comment": "Whether the slider should act as a range slider with two thumbs. Default is false",
                "prop": "isRange",
                "type": "boolean",
                "defaultValue": "false"
              },
              {
                "comment": "The current value of the slider. For range sliders, this should be a tuple of [start, end] values",
                "prop": "value",
                "type": "SliderValue | Signal<SliderValue>",
                "defaultValue": "isRange ? [0, 100] : 0"
              },
              {
                "comment": "The minimum value of the slider. Default is 0",
                "prop": "min",
                "type": "number",
                "defaultValue": "0"
              },
              {
                "comment": "The maximum value of the slider. Default is 100",
                "prop": "max",
                "type": "number",
                "defaultValue": "100"
              },
              {
                "comment": "The step interval for the slider value. Default is 1",
                "prop": "step",
                "type": "number",
                "defaultValue": "1"
              },
              {
                "comment": "Whether the slider is disabled. Default is false",
                "prop": "disabled",
                "type": "boolean | Signal<boolean>",
                "defaultValue": "false"
              },
              {
                "comment": "Event handler called when the slider value changes",
                "prop": "onChange$",
                "type": "| QRL<(value: SliderValue) => void>\n    | PropFunction<(value: SliderValue) => void>"
              },
              {
                "comment": "Event handler called when the slider value changes are committed (on drag end or keyboard navigation)",
                "prop": "onChangeEnd$",
                "type": "| QRL<(value: SliderValue) => void>\n    | PropFunction<(value: SliderValue) => void>"
              }
            ]
          },
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
      "name": "Slider.MarkerGroup",
      "description": "A container component for slider markers"
    },
    {
      "name": "Slider.Marker",
      "description": "A marker component that displays a specific value point on the slider"
    },
    {
      "name": "Slider.Tooltip",
      "description": "Component that displays the current value in a tooltip"
    }
  ],
  "keyboardInteractions": {
    "keyboardShortcuts": [
      {
        "key": "ArrowRight",
        "comment": "When focus is on the thumb, increases the value by one step. If Shift is held, increases by ten steps"
      },
      {
        "key": "ArrowLeft",
        "comment": "When focus is on the thumb, decreases the value by one step. If Shift is held, decreases by ten steps"
      },
      {
        "key": "ArrowUp",
        "comment": "When focus is on the thumb, increases the value by one step. If Shift is held, increases by ten steps"
      },
      {
        "key": "ArrowDown",
        "comment": "When focus is on the thumb, decreases the value by one step. If Shift is held, decreases by ten steps"
      },
      {
        "key": "Home",
        "comment": "When focus is on the thumb, sets the value to the minimum allowed value"
      },
      {
        "key": "End",
        "comment": "When focus is on the thumb, sets the value to the maximum allowed value"
      }
    ]
  },
  "features": [
    "WAI ARIA Slider design pattern",
    "Single and range value modes",
    "Customizable step increments",
    "Keyboard navigation with arrow keys",
    "Touch/mouse dragging with pointer events",
    "Shift key for fine-grained control (10x step)",
    "Custom markers/ticks support",
    "Visual range indicator",
    "Tooltips with value display",
    "Home/End key value jumps",
    "Multiple thumb position tracking",
    "Configurable min/max bounds",
    "Custom styling via data attributes",
    "Disabled state handling",
    "Change and change-end event handlers"
  ]
};
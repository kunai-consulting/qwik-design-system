export const api = {
  "radio-group": [
    {
      "Radio Group Description": {
        "types": [],
        "inheritsFrom": "div"
      }
    },
    {
      "Radio Group Error Message": {
        "types": [],
        "inheritsFrom": "div",
        "dataAttributes": [
          {
            "name": "data-visible",
            "type": "string"
          }
        ]
      }
    },
    {
      "Radio Group Hidden Input": {
        "types": [],
        "inheritsFrom": "input"
      }
    },
    {
      "Radio Group Indicator": {
        "types": [],
        "dataAttributes": [
          {
            "name": "data-hidden",
            "type": "string"
          },
          {
            "name": "data-checked",
            "type": "string"
          }
        ]
      }
    },
    {
      "Radio Group Item": {
        "types": [],
        "inheritsFrom": "div"
      }
    },
    {
      "Radio Group Label": {
        "types": [],
        "inheritsFrom": "label"
      }
    },
    {
      "Radio Group Root": {
        "types": [],
        "inheritsFrom": "div",
        "dataAttributes": [
          {
            "name": "data-disabled",
            "type": "string | undefined"
          },
          {
            "name": "data-checked",
            "type": "string | undefined"
          }
        ]
      }
    },
    {
      "Radio Group Trigger": {
        "types": [],
        "inheritsFrom": "button",
        "dataAttributes": [
          {
            "name": "data-disabled",
            "type": "string | undefined"
          },
          {
            "name": "data-checked",
            "type": "string"
          }
        ]
      }
    }
  ],
  "anatomy": [
    {
      "name": "Radio-group.Root"
    },
    {
      "name": "Radio-group.Indicator"
    },
    {
      "name": "Radio-group.Trigger"
    },
    {
      "name": "Radio-group.Label"
    },
    {
      "name": "Radio-group.Description"
    },
    {
      "name": "Radio-group.HiddenNativeInput"
    },
    {
      "name": "Radio-group.ErrorMessage"
    },
    {
      "name": "Radio-group.Item"
    }
  ],
  "keyboardInteractions": [
    {
      "key": "Tab",
      "comment":
        "When focus is outside the radio group, moves focus to the first radio button. When focus is on a radio button, moves focus to the next radio button"
    },
    {
      "key": "Shift+Tab",
      "comment":
        "When focus is on a radio button, moves focus to the previous radio button"
    },
    {
      "key": "Space",
      "comment": "When focus is on a radio button, selects the focused radio button"
    },
    {
      "key": "ArrowDown",
      "comment": "Moves focus to the next radio button and selects it"
    },
    {
      "key": "ArrowRight",
      "comment": "Moves focus to the next radio button and selects it"
    },
    {
      "key": "ArrowUp",
      "comment": "Moves focus to the previous radio button and selects it"
    },
    {
      "key": "ArrowLeft",
      "comment": "Moves focus to the previous radio button and selects it"
    }
  ],
  "features": [
    "WAI ARIA Radio Group design pattern",
    "Single selection with value binding",
    "Error state handling with error messages",
    "Accessible descriptions support",
    "Custom visual indicators",
    "Required field validation",
    "Keyboard navigation and focus management",
    "Disabled state support",
    "Form integration with hidden native inputs",
    "Controlled and uncontrolled value modes"
  ]
};

export const api = {
  "checkbox": [
    {
      "Checkbox Description": {
        "types": [
          {
            "PublicCheckboxDescriptionProps": []
          }
        ],
        "inheritsFrom": "div"
      }
    },
    {
      "Checkbox Error Message": {
        "types": [
          {
            "PublicCheckboxErrorMessageProps": []
          }
        ],
        "inheritsFrom": "div"
      }
    },
    {
      "Checkbox Hidden Input": {
        "types": [
          {
            "PublicCheckboxHiddenNativeInputProps": []
          }
        ],
        "inheritsFrom": "input"
      }
    },
    {
      "Checkbox Indicator": {
        "types": [
          {
            "PublicCheckboxIndicatorProps": []
          }
        ],
        "inheritsFrom": "span",
        "dataAttributes": [
          {
            "name": "data-hidden",
            "type": "string",
            "comment":
              "Indicates whether the indicator should be hidden based on checkbox state"
          },
          {
            "name": "data-checked",
            "type": "string | undefined",
            "comment": "Indicates whether the checkbox is in a checked state"
          },
          {
            "name": "data-mixed",
            "type": "string | undefined",
            "comment": "Indicates whether the checkbox is in an indeterminate state"
          }
        ]
      }
    },
    {
      "Checkbox Label": {
        "types": [
          {
            "PublicCheckboxLabelProps": []
          }
        ],
        "inheritsFrom": "label"
      }
    },
    {
      "Checkbox Root": {
        "types": [
          {
            "PublicCheckboxRootProps": [
              {
                "comment": "",
                "prop": '"bind:checked"',
                "type": 'Signal<boolean | "mixed">'
              },
              {
                "comment": "Initial checked state of the checkbox",
                "prop": "checked",
                "type": "T"
              },
              {
                "comment": "Event handler called when the checkbox state changes",
                "prop": "onChange$",
                "type": "QRL<(checked: T) => void>"
              },
              {
                "comment": "Whether the checkbox is disabled",
                "prop": "disabled",
                "type": "boolean"
              },
              {
                "comment": "Whether the checkbox has a description",
                "prop": "isDescription",
                "type": "boolean"
              },
              {
                "comment": "Name attribute for the hidden input element",
                "prop": "name",
                "type": "string"
              },
              {
                "comment": "Whether the checkbox is required",
                "prop": "required",
                "type": "boolean"
              },
              {
                "comment": "Value attribute for the hidden input element",
                "prop": "value",
                "type": "string"
              }
            ]
          }
        ],
        "inheritsFrom": "div",
        "dataAttributes": [
          {
            "name": "data-disabled",
            "type": "string | undefined",
            "comment": "Indicates whether the checkbox is disabled"
          },
          {
            "name": "data-checked",
            "type": "string | undefined",
            "comment": "Indicates whether the checkbox is checked"
          },
          {
            "name": "data-mixed",
            "type": "string | undefined",
            "comment": "Indicates whether the checkbox is in an indeterminate state"
          }
        ]
      }
    },
    {
      "Checkbox Trigger": {
        "types": [
          {
            "PublicCheckboxControlProps": []
          }
        ],
        "inheritsFrom": "button",
        "dataAttributes": [
          {
            "name": "data-disabled",
            "type": "string | undefined",
            "comment": "Indicates whether the checkbox trigger is disabled"
          }
        ]
      }
    }
  ],
  "anatomy": [
    {
      "name": "Checkbox.Root",
      "description":
        "Root component that provides context and state management for the checkbox"
    },
    {
      "name": "Checkbox.Indicator",
      "description": "Visual indicator component showing the checkbox state"
    },
    {
      "name": "Checkbox.Trigger",
      "description": "Interactive trigger component that handles checkbox toggling"
    },
    {
      "name": "Checkbox.Label",
      "description": "Label component for the checkbox"
    },
    {
      "name": "Checkbox.Description",
      "description": "A component that renders the description text for a checkbox"
    },
    {
      "name": "Checkbox.HiddenInput",
      "description": "A hidden native checkbox input for form submission"
    },
    {
      "name": "Checkbox.ErrorMessage",
      "description": "A component that displays error messages for a checkbox"
    }
  ],
  "keyboardInteractions": [
    {
      "key": "Space",
      "comment":
        "When focus is on the checkbox trigger, toggles the checkbox state between checked/unchecked/mixed"
    },
    {
      "key": "Enter",
      "comment":
        "When focus is on the checkbox trigger, toggles the checkbox state between checked/unchecked/mixed (default behavior prevented)"
    },
    {
      "key": "Tab",
      "comment": "Moves focus to the checkbox trigger and follows the natural tab order"
    }
  ],
  "features": [
    "WAI ARIA Checkbox design pattern",
    "Indeterminate state support (tri-state)",
    "Form integration with hidden native input",
    "Error message handling and validation",
    "Custom descriptions with ARIA support",
    "Keyboard navigation and accessibility",
    "Controllable checked state (controlled/uncontrolled)",
    "Focus management with ref tracking",
    "Disabled state handling",
    "Enter key prevention for form submissions"
  ]
};

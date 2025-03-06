export const api = {
  "radio-group": [
    {
      "Radio Group Description": {
        "inheritsFrom": "div"
      }
    },
    {
      "Radio Group Error Message": {
        "inheritsFrom": "div",
        "dataAttributes": [
          {
            "name": "data-visible",
            "type": "string",
            "comment": "Indicates whether the error message is currently visible"
          }
        ]
      }
    },
    {
      "Radio Group Hidden Input": {
        "inheritsFrom": "input"
      }
    },
    {
      "Radio Group Indicator": {
        "dataAttributes": [
          {
            "name": "data-hidden",
            "type": "string",
            "comment":
              "Indicates whether the indicator is hidden based on selection state"
          },
          {
            "name": "data-checked",
            "type": "string",
            "comment": "Indicates whether this indicator is in a checked state"
          }
        ]
      }
    },
    {
      "Radio Group Item": {
        "types": [
          {
            "PublicRadioGroupItemProps": [
              {
                "comment": "",
                "prop": "value",
                "type": "string"
              }
            ]
          }
        ],
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
      "Radio Group Label": {
        "inheritsFrom": "label"
      }
    },
    {
      "Radio Group Root": {
        "types": [
          {
            "PublicRadioGroupRootProps": [
              {
                "comment": "",
                "prop": '"bind:value"',
                "type": "Signal<string | undefined>"
              },
              {
                "comment": "Event handler for when the radio group selection changes",
                "prop": "onChange$",
                "type": "QRL<(checked: string) => void>"
              },
              {
                "comment": "Initial value of the radio group when first rendered",
                "prop": "defaultValue",
                "type": "string"
              },
              {
                "comment": "Whether the radio group is disabled",
                "prop": "disabled",
                "type": "boolean"
              },
              {
                "comment": "Whether the radio group has a description",
                "prop": "isDescription",
                "type": "boolean"
              },
              {
                "comment": "Name attribute for the hidden radio input",
                "prop": "name",
                "type": "string"
              },
              {
                "comment": "Whether the radio group is required",
                "prop": "required",
                "type": "boolean"
              },
              {
                "comment": "The current value of the radio group",
                "prop": "value",
                "type": "string"
              },
              {
                "comment": "",
                "prop": "orientation",
                "type": "'horizontal' | 'vertical'",
                "defaultValue": "'vertical'"
              }
            ]
          }
        ],
        "inheritsFrom": "div",
        "dataAttributes": [
          {
            "name": "data-disabled",
            "type": "string | undefined",
            "comment": "Indicates whether the radio group is disabled"
          },
          {
            "name": "data-orientation",
            "type": "string"
          }
        ]
      }
    },
    {
      "Radio Group Trigger": {
        "types": [
          {
            "PublicRadioGroupControlProps": [
              {
                "comment": "",
                "prop": "value",
                "type": "string"
              },
              {
                "comment": "",
                "prop": "_index",
                "type": "number"
              }
            ]
          }
        ],
        "inheritsFrom": "button",
        "dataAttributes": [
          {
            "name": "data-disabled",
            "type": "string | undefined"
          },
          {
            "name": "data-checked",
            "type": "string",
            "comment": "Indicates whether this radio trigger is checked"
          }
        ]
      }
    }
  ],
  "anatomy": [
    {
      "name": "RadioGroup.Root",
      "description": "Root component that manages the radio group's state and behavior"
    },
    {
      "name": "RadioGroup.Indicator",
      "description":
        "Visual indicator component that shows the selected state of a radio option"
    },
    {
      "name": "RadioGroup.Trigger",
      "description": "Interactive trigger component that handles radio option selection"
    },
    {
      "name": "RadioGroup.Label",
      "description": "Label component for the radio group or individual radio options"
    },
    {
      "name": "RadioGroup.Description",
      "description":
        "A description component for the radio group that provides additional context"
    },
    {
      "name": "RadioGroup.HiddenNativeInput"
    },
    {
      "name": "RadioGroup.ErrorMessage",
      "description": "Displays error message when radio group validation fails"
    },
    {
      "name": "RadioGroup.Item",
      "description": "Individual radio option container component"
    }
  ],
  "keyboardInteractions": [
    {
      "key": "Space",
      "comment": "When focus is on a radio button trigger, selects that radio option"
    },
    {
      "key": "Enter",
      "comment": "When focus is on a radio button trigger, selects that radio option"
    },
    {
      "key": "ArrowDown",
      "comment": "Moves focus to the next radio button trigger in the group"
    },
    {
      "key": "ArrowRight",
      "comment": "Moves focus to the next radio button trigger in the group"
    },
    {
      "key": "ArrowUp",
      "comment": "Moves focus to the previous radio button trigger in the group"
    },
    {
      "key": "ArrowLeft",
      "comment": "Moves focus to the previous radio button trigger in the group"
    },
    {
      "key": "Tab",
      "comment": "Moves focus to the next focusable element outside the radio group"
    },
    {
      "key": "Shift+Tab",
      "comment": "Moves focus to the previous focusable element outside the radio group"
    }
  ],
  "features": [
    "WAI ARIA RadioGroup design pattern",
    "Single selection from multiple options",
    "Error state handling and validation",
    "Custom error messages with aria-invalid",
    "Optional description text support",
    "Visual and screen reader feedback",
    "Controlled and uncontrolled value management",
    "Custom accessible labels and descriptions",
    "Disabled state support",
    "Focus management with tab navigation",
    "Hidden native radio inputs for form submission",
    "Visual indicators for selected state",
    "Keyboard navigation support",
    "Required field validation"
  ]
};

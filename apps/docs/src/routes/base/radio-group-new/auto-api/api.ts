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
            "type": "boolean",
            "comment": "Indicates whether the error message is currently visible"
          }
        ]
      }
    },
    {
      "Radio Group Hidden Input": {
        "inheritsFrom": "input",
        "types": [
          {
            "PublicHiddenInputProps": [
              {
                "comment": "Index for tracking order in the group",
                "prop": "_index",
                "type": "number | null"
              }
            ]
          }
        ]
      }
    },
    {
      "Radio Group Indicator": {
        "inheritsFrom": "span",
        "types": [
          {
            "PublicIndicatorProps": [
              {
                "comment": "The value associated with this indicator",
                "prop": "value",
                "type": "string"
              }
            ]
          }
        ],
        "dataAttributes": [
          {
            "name": "data-state",
            "type": '"checked" | undefined',
            "comment": "Indicates whether this indicator is in a checked state"
          }
        ]
      }
    },
    {
      "Radio Group Item": {
        "types": [
          {
            "PublicItemProps": [
              {
                "comment": "The value of the radio item",
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
            "type": '"horizontal" | "vertical"',
            "comment": "The orientation of the radio group item"
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
            "PublicRootProps": [
              {
                "comment": "Two-way binding for the selected value",
                "prop": "bind:value",
                "type": "Signal<string | undefined>"
              },
              {
                "comment": "Event handler for when the radio group selection changes",
                "prop": "onChange$",
                "type": "PropFunction<(value: string) => void>"
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
                "comment": "Name attribute for form integration",
                "prop": "name",
                "type": "string"
              },
              {
                "comment": "Whether the radio group is required",
                "prop": "required",
                "type": "boolean"
              },
              {
                "comment": "The form element to attach to",
                "prop": "form",
                "type": "string"
              },
              {
                "comment": "The orientation of the radio group",
                "prop": "orientation",
                "type": '"horizontal" | "vertical"'
              },
              {
                "comment": "The current value of the radio group",
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
            "comment": "Indicates whether the radio group is disabled"
          },
          {
            "name": "data-orientation",
            "type": '"horizontal" | "vertical"',
            "comment": "The orientation of the radio group"
          }
        ]
      }
    },
    {
      "Radio Group Trigger": {
        "types": [
          {
            "PublicTriggerProps": [
              {
                "comment": "The value associated with this trigger",
                "prop": "value",
                "type": "string"
              },
              {
                "comment": "Index for keyboard navigation order",
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
            "type": "string | undefined",
            "comment": "Indicates whether this trigger is disabled"
          },
          {
            "name": "data-state",
            "type": '"checked" | undefined',
            "comment": "Indicates whether this trigger is checked"
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
      "name": "RadioGroup.Item",
      "description": "Container component for individual radio options"
    },
    {
      "name": "RadioGroup.Trigger",
      "description": "Interactive button component that handles radio option selection"
    },
    {
      "name": "RadioGroup.Indicator",
      "description": "Visual indicator component that shows the selected state"
    },
    {
      "name": "RadioGroup.Label",
      "description": "Label component for the radio group or individual options"
    },
    {
      "name": "RadioGroup.Description",
      "description": "Optional description component for additional context"
    },
    {
      "name": "RadioGroup.ErrorMessage",
      "description": "Component for displaying validation error messages"
    },
    {
      "name": "RadioGroup.HiddenInput",
      "description": "Hidden native input for form integration"
    }
  ],
  "keyboardInteractions": [
    {
      "key": "Space",
      "comment": "Selects the focused radio option"
    },
    {
      "key": "Enter",
      "comment": "Selects the focused radio option"
    },
    {
      "key": "ArrowDown",
      "comment": "Moves focus to the next radio option in vertical orientation"
    },
    {
      "key": "ArrowRight",
      "comment": "Moves focus to the next radio option in horizontal orientation"
    },
    {
      "key": "ArrowUp",
      "comment": "Moves focus to the previous radio option in vertical orientation"
    },
    {
      "key": "ArrowLeft",
      "comment": "Moves focus to the previous radio option in horizontal orientation"
    },
    {
      "key": "Home",
      "comment": "Moves focus to the first radio option"
    },
    {
      "key": "End",
      "comment": "Moves focus to the last radio option"
    }
  ],
  "features": [
    "WAI-ARIA RadioGroup pattern implementation",
    "Keyboard navigation with orientation support",
    "Form integration with hidden native inputs",
    "Error state handling and validation",
    "Controlled and uncontrolled modes",
    "Two-way binding support (bind:value)",
    "Disabled state for group and individual items",
    "Custom styling through data attributes",
    "Description and error message support",
    "Proper focus management",
    "Required field validation",
    "Horizontal and vertical orientation"
  ]
};
